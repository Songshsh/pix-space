<script setup lang="ts">
import type { BoardDetailImage } from '../../../types/board-detail';

defineProps<{
  items: BoardDetailImage[];
}>();

const emit = defineEmits<{
  viewDetail: [id: string];
}>();
</script>

<template>
  <div class="masonry-grid">
    <div v-for="item in items" :key="item.id" class="masonry-item">
      <div class="masonry-card" @click="emit('viewDetail', item.id)">
        <div
          class="masonry-card-image"
          :style="{
            height: item.imageHeight + 'px',
            backgroundColor: item.bgColor,
            backgroundImage: item.url ? `url(${item.url})` : undefined,
            backgroundSize: item.url ? 'cover' : undefined,
            backgroundPosition: item.url ? 'center' : undefined,
          }"
        ></div>
        <div class="masonry-card-content">
          <div class="masonry-card-title">{{ item.title }}</div>
          <div class="card-tag">
            <span class="tag-badge">{{ item.tag }}</span>
          </div>
          <div class="masonry-card-footer">
            <div class="masonry-card-footer-left">
              <div class="author-avatar"></div>
              <span class="author-name">{{ item.author }}</span>
            </div>
            <el-button
              link
              type="primary"
              class="detail-link"
              @click.stop="emit('viewDetail', item.id)"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-tag {
  margin-bottom: var(--ds-space-3);
}
</style>
