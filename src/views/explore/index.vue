<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreviewDialog from '@/components/portal/ImagePreviewDialog.vue';

const route = useRoute();
const router = useRouter();

type SearchState = 'success' | 'loading' | 'empty' | 'error';

const categories = [
  '全部',
  'UI设计',
  '自然摄影',
  '3D渲染',
  '插画',
  '品牌设计',
  '排版',
  '极简主义',
  '电商',
  '壁纸',
  '其它',
];
const activeCategory = ref('全部');

const searchTags = ['全部', '极简主义', '排版', '品牌设计', '电商', '其它'];
const relatedSearches = ['设计系统', 'UI组件库', 'Dashboard', '移动端界面'];

const searchQuery = computed(() => {
  if (typeof route.query.q !== 'string') return '';
  return route.query.q.trim();
});

const isSearching = computed(() => !!searchQuery.value);

const searchState = computed<SearchState>(() => {
  const state = route.query.state;
  if (state === 'loading' || state === 'empty' || state === 'error')
    return state;
  return 'success';
});

const activeSort = computed<'newest' | 'hot'>(() => {
  return route.query.sort === 'hot' ? 'hot' : 'newest';
});

const activeSearchTag = computed(() => {
  return typeof route.query.tag === 'string' && route.query.tag
    ? route.query.tag
    : '全部';
});

const setSearchQuery = (q: string) => {
  const next = q.trim();
  if (!next) {
    router.push({ path: '/explore' });
    return;
  }
  router.push({ path: '/explore', query: { q: next } });
};

const backToExplore = () => {
  router.push({ path: '/explore' });
};

const retrySearch = () => {
  if (!isSearching.value) return;
  router.push({
    path: '/explore',
    query: {
      q: searchQuery.value,
      sort: activeSort.value,
      tag: activeSearchTag.value === '全部' ? undefined : activeSearchTag.value,
    },
  });
};

const setSort = (sort: 'newest' | 'hot') => {
  if (!isSearching.value) return;
  router.push({
    path: '/explore',
    query: {
      q: searchQuery.value,
      sort,
      tag: activeSearchTag.value === '全部' ? undefined : activeSearchTag.value,
    },
  });
};

const setSearchTag = (tag: string) => {
  if (!isSearching.value) return;
  router.push({
    path: '/explore',
    query: {
      q: searchQuery.value,
      sort: activeSort.value,
      tag: tag === '全部' ? undefined : tag,
    },
  });
};

const masonryHeights = [
  300, 450, 200, 380, 250, 400, 250, 320, 280, 400, 350, 200, 450, 300, 250,
];
const bgColors = [
  'var(--el-color-primary-light-9)',
  'var(--el-color-primary-light-8)',
  'var(--el-color-primary-light-7)',
  'var(--el-color-primary-light-6)',
  'var(--el-color-primary-light-5)',
];
const sampleTags = [
  ['UI设计', '极简主义'],
  ['3D渲染'],
  ['插画', '品牌设计'],
  ['自然摄影'],
  ['排版', 'UI设计'],
];

type ExploreItem = {
  id: string;
  title: string;
  imageHeight: number;
  bgColor: string;
  tags: string[];
  author: string;
};

const mockItems = masonryHeights.map((h, i) => {
  return {
    id: `img-${i}`,
    title: `灵感素材 ${i + 1}`,
    imageHeight: h,
    bgColor: bgColors[i % bgColors.length],
    tags: sampleTags[i % sampleTags.length],
    author: `User ${(i % 5) + 1}`,
  };
}) as ExploreItem[];

const selectCategory = (cat: string) => {
  activeCategory.value = cat;
};

const goToDetail = (id: string) => {
  router.push({ path: `/image/${id}` });
};

const previewVisible = ref(false);
const previewItem = ref<ExploreItem | null>(null);

const openPreview = (item: ExploreItem) => {
  previewItem.value = item;
  previewVisible.value = true;
};

const handleViewDetail = (id: string) => {
  previewVisible.value = false;
  goToDetail(id);
};
</script>

<template>
  <div class="explore-page">
    <template v-if="!isSearching">
      <div class="categories">
        <div
          v-for="cat in categories"
          :key="cat"
          class="category-tag"
          :class="{ active: activeCategory === cat }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="result-bar">
        <div class="result-info">
          <div class="result-title">“{{ searchQuery }}”</div>
          <div class="result-count">共 2,431 个结果</div>
        </div>
        <div class="sort-toggle">
          <div
            class="sort-option"
            :class="{ active: activeSort === 'newest' }"
            @click="setSort('newest')"
          >
            最新
          </div>
          <div
            class="sort-option"
            :class="{ active: activeSort === 'hot' }"
            @click="setSort('hot')"
          >
            最热
          </div>
        </div>
      </div>

      <div class="categories search-categories">
        <div
          v-for="tag in searchTags"
          :key="tag"
          class="category-tag"
          :class="{ active: activeSearchTag === tag }"
          @click="setSearchTag(tag)"
        >
          {{ tag }}
        </div>
      </div>

      <div class="related-bar">
        <div class="related-title">相关搜索</div>
        <div class="related-items">
          <div
            v-for="term in relatedSearches"
            :key="term"
            class="related-pill"
            @click="setSearchQuery(term)"
          >
            {{ term }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="!isSearching || searchState === 'success'">
      <div class="masonry-grid">
        <div v-for="item in mockItems" :key="item.id" class="masonry-item">
          <div class="card" @click="openPreview(item)">
            <div
              class="card-image"
              :style="{
                height: item.imageHeight + 'px',
                backgroundColor: item.bgColor,
              }"
            ></div>

            <div class="card-content">
              <div class="card-title">{{ item.title }}</div>

              <div class="card-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag-badge">
                  {{ tag }}
                </span>
              </div>

              <div class="card-footer">
                <div class="card-footer-left">
                  <div class="author-avatar"></div>
                  <span class="author-name">{{ item.author }}</span>
                </div>
                <el-button
                  link
                  type="primary"
                  class="detail-link"
                  @click.stop="handleViewDetail(item.id)"
                >
                  查看详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="searchState === 'loading'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">…</div>
          <div class="state-desc">加载中</div>
        </div>
      </div>
    </template>

    <template v-else-if="searchState === 'empty'">
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">🔍</div>
          <div class="state-title">暂无结果</div>
          <div class="state-desc">换个关键词试试</div>
          <div class="state-actions state-actions--empty">
            <div class="state-hot">
              <div class="state-hot-title">热门搜索</div>
              <div class="state-hot-items">
                <button
                  v-for="term in relatedSearches"
                  :key="term"
                  class="state-hot-pill"
                  type="button"
                  @click="setSearchQuery(term)"
                >
                  {{ term }}
                </button>
              </div>
            </div>
            <button class="state-back" type="button" @click="backToExplore">
              返回发现
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="state-card">
        <div class="state-content">
          <div class="state-icon">!</div>
          <div class="state-title">加载失败</div>
          <div class="state-desc">请检查网络后重试</div>
          <div class="state-actions">
            <button class="state-retry" type="button" @click="retrySearch">
              重试
            </button>
            <button class="state-back" type="button" @click="backToExplore">
              返回发现
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>

  <ImagePreviewDialog
    v-model="previewVisible"
    :item="previewItem"
    @view-detail="handleViewDetail"
  />
</template>

<style scoped>
.explore-page {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-3);
  margin-bottom: var(--ds-space-2);
}

.search-categories {
  margin-bottom: 0;
}

.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.result-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  line-height: 1;
}

.result-count {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  line-height: 1;
}

.sort-toggle {
  width: 152px;
  height: 32px;
  border-radius: var(--ds-radius-pill);
  background-color: var(--ds-color-bg-primary);
  padding: var(--ds-space-1);
  display: flex;
  align-items: center;
  gap: 0;
}

.sort-option {
  width: 72px;
  height: 24px;
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--ds-color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.sort-option.active {
  background-color: var(--ds-color-text-primary);
  color: var(--ds-color-text-inverse);
}

.related-bar {
  height: 56px;
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  padding: 0 var(--ds-space-4);
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.related-title {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  white-space: nowrap;
}

.related-items {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  overflow: hidden;
}

.related-pill {
  height: 28px;
  padding: 0 var(--ds-space-4);
  background-color: var(--ds-color-bg-secondary);
  border-radius: var(--ds-radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--ds-color-text-secondary);
  cursor: pointer;
  user-select: none;
}

.state-card {
  height: 360px;
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-content {
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.state-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--ds-color-bg-secondary);
  color: var(--ds-color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.state-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  margin-top: var(--ds-space-4);
}

.state-desc {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  margin-top: var(--ds-space-2);
}

.state-actions {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--ds-space-4);
  margin-top: var(--ds-space-5);
}

.state-actions--empty {
  width: 100%;
  gap: var(--ds-space-4-5);
}

.state-hot {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  align-items: center;
}

.state-hot-title {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.state-hot-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--ds-space-2);
}

.state-hot-pill {
  height: 28px;
  padding: 0 var(--ds-space-4);
  background-color: var(--ds-color-bg-secondary);
  border-radius: var(--ds-radius-pill);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--ds-color-text-secondary);
  cursor: pointer;
  user-select: none;
  border: none;
}

.state-retry {
  height: 32px;
  width: 96px;
  border-radius: var(--ds-radius-pill);
  background-color: var(--el-color-primary);
  color: var(--ds-color-text-inverse);
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.state-back {
  background: transparent;
  color: var(--el-color-primary);
  border: none;
  cursor: pointer;
  font-size: 12px;
  padding: 0;
}

.category-tag {
  height: 32px;
  padding: 0 var(--ds-space-4);
  border-radius: var(--ds-radius-pill);
  background-color: var(--ds-color-bg-primary);
  color: var(--ds-color-text-secondary);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid var(--ds-color-border);
  transition: all 0.2s ease;
  user-select: none;
}

.category-tag:hover {
  background-color: var(--el-fill-color-light);
}

.category-tag.active {
  background-color: var(--el-color-primary);
  color: var(--ds-color-text-inverse);
  border-color: var(--el-color-primary);
}

/* CSS Columns for Masonry Layout */
.masonry-grid {
  column-count: 5;
  column-gap: var(--ds-space-5);
  width: 100%;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: var(--ds-space-5);
}

.card {
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-1);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ds-shadow-2);
}

.card-image {
  width: 100%;
  border-radius: var(--ds-radius-3) var(--ds-radius-3) 0 0;
}

.card-content {
  padding: var(--ds-space-4);
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--ds-color-text-primary);
  margin-bottom: var(--ds-space-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
  margin-bottom: var(--ds-space-3);
}

.tag-badge {
  background-color: var(--ds-color-bg-secondary);
  color: var(--ds-color-text-secondary);
  font-size: 10px;
  padding: var(--ds-space-1) var(--ds-space-2);
  border-radius: var(--ds-radius-1);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-footer-left {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  min-width: 0;
}

.author-avatar {
  width: 16px;
  height: 16px;
  background-color: var(--el-fill-color);
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.detail-link {
  padding: 0;
  height: auto;
  font-size: 12px;
  font-weight: 500;
}

/* Responsive Masonry */
@media (max-width: 1400px) {
  .masonry-grid {
    column-count: 4;
  }
}

@media (max-width: 1100px) {
  .masonry-grid {
    column-count: 3;
  }
}

@media (max-width: 800px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 500px) {
  .masonry-grid {
    column-count: 1;
  }
}
</style>
