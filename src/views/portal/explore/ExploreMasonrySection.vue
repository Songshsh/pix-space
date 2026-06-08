<script setup lang="ts">
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import type { ExploreItem, SearchState } from '../../../types/explore';

defineProps<{
  items: ExploreItem[];
  state: SearchState;
  relatedSearches: string[];
}>();

const emit = defineEmits<{
  'open-preview': [item: ExploreItem];
  'view-detail': [id: string];
  'author-click': [userId: number];
  'set-query': [query: string];
  retry: [];
  back: [];
}>();
</script>

<template>
  <template v-if="state === 'success'">
    <div class="masonry-grid">
      <div v-for="item in items" :key="item.id" class="masonry-item">
        <div class="masonry-card" @click="emit('open-preview', item)">
          <div
            class="masonry-card-image"
            :style="{
              height: item.imageHeight + 'px',
              backgroundColor: item.bgColor,
              backgroundImage: item.imageUrl
                ? `url(${item.imageUrl})`
                : undefined,
              backgroundSize: item.imageUrl ? 'cover' : undefined,
              backgroundPosition: item.imageUrl ? 'center' : undefined,
            }"
          ></div>

          <div class="masonry-card-content">
            <div class="masonry-card-title">{{ item.title }}</div>

            <div class="masonry-card-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag-badge">
                {{ tag }}
              </span>
            </div>

            <div class="masonry-card-footer">
              <button
                type="button"
                class="masonry-card-footer-left"
                @click.stop="emit('author-click', item.author.id)"
              >
                <div class="author-avatar"></div>
                <span class="author-name">{{ item.author.username }}</span>
              </button>
              <el-button
                link
                type="primary"
                class="detail-link"
                @click.stop="emit('view-detail', item.id)"
              >
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else-if="state === 'loading'">
    <PageStateBlock variant="loading" description="加载中" />
  </template>

  <template v-else-if="state === 'empty'">
    <PageStateBlock
      variant="empty"
      icon="🔍"
      title="暂无结果"
      description="换个关键词试试"
    >
      <template #actions>
        <div class="state-actions state-actions--empty">
          <div class="state-hot">
            <div class="state-hot-title">热门搜索</div>
            <div class="state-hot-items">
              <el-tag
                v-for="term in relatedSearches"
                :key="term"
                round
                type="info"
                effect="plain"
                class="state-hot-pill"
                @click="emit('set-query', term)"
              >
                {{ term }}
              </el-tag>
            </div>
          </div>
          <el-button text class="state-back" @click="emit('back')">
            返回发现
          </el-button>
        </div>
      </template>
    </PageStateBlock>
  </template>

  <template v-else>
    <PageStateBlock
      variant="error"
      icon="!"
      title="加载失败"
      description="请检查网络后重试"
    >
      <template #actions>
        <el-button
          type="primary"
          round
          class="state-retry"
          @click="emit('retry')"
        >
          重试
        </el-button>
        <el-button text class="state-back" @click="emit('back')">
          返回发现
        </el-button>
      </template>
    </PageStateBlock>
  </template>
</template>

<style scoped>
.masonry-card-footer-left {
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.masonry-card-footer-left:hover .author-name {
  color: var(--ds-color-text-primary);
}

.state-actions--empty {
  width: 100%;
  gap: var(--ds-space-5);
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
</style>
