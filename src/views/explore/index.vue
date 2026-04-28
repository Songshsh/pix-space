<script setup lang="ts">
import { ref } from 'vue';

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

// Mock data based on the Pencil design
const masonryHeights = [
  300, 450, 200, 380, 250, 400, 250, 320, 280, 400, 350, 200, 450, 300, 250,
];
const bgColors = ['#f0ebf8', '#ebf4f8', '#f8ebeb', '#ebf8f0', '#f8f5eb'];
const sampleTags = [
  ['UI设计', '极简主义'],
  ['3D渲染'],
  ['插画', '品牌设计'],
  ['自然摄影'],
  ['排版', 'UI设计'],
];

const mockItems = masonryHeights.map((h, i) => {
  return {
    id: `img-${i}`,
    title: `灵感素材 ${i + 1}`,
    imageHeight: h,
    bgColor: bgColors[i % bgColors.length],
    tags: sampleTags[i % sampleTags.length],
    author: `User ${(i % 5) + 1}`,
  };
});

const selectCategory = (cat: string) => {
  activeCategory.value = cat;
};
</script>

<template>
  <div class="explore-page">
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

    <div class="masonry-grid">
      <div v-for="item in mockItems" :key="item.id" class="masonry-item">
        <div class="card">
          <div
            class="card-image"
            :style="{
              height: item.imageHeight + 'px',
              backgroundColor: item.bgColor,
            }"
          >
            <!-- Image placeholder -->
          </div>

          <div class="card-content">
            <div class="card-title">{{ item.title }}</div>

            <div class="card-tags">
              <span v-for="tag in item.tags" :key="tag" class="tag-badge">
                {{ tag }}
              </span>
            </div>

            <div class="card-footer">
              <div class="author-avatar"></div>
              <span class="author-name">{{ item.author }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

.category-tag {
  height: 32px;
  padding: 0 var(--ds-space-4);
  border-radius: 16px;
  background-color: #fff;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
  user-select: none;
}

.category-tag:hover {
  background-color: #f9f9f9;
}

.category-tag.active {
  background-color: #333;
  color: #fff;
  border-color: #333;
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
  background-color: #fff;
  border-radius: var(--ds-radius-3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
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
  color: #333;
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
  background-color: #f0f2f5;
  color: #666;
  font-size: 10px;
  padding: var(--ds-space-1) var(--ds-space-2);
  border-radius: var(--ds-radius-1);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.author-avatar {
  width: 16px;
  height: 16px;
  background-color: #d9d9d9;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: #999;
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
