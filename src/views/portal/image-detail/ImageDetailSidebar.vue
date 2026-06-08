<script setup lang="ts">
import type { ImageDetail } from '../../../types/image-detail';
import type { ImageMetaData } from './useImageDetailView';

defineProps<{
  imageDetail: ImageDetail | null;
  imageMetaData: ImageMetaData;
  collecting: boolean;
  downloading: boolean;
  liking: boolean;
}>();

const emit = defineEmits<{
  authorClick: [];
  collect: [];
  download: [];
  like: [];
  share: [];
}>();
</script>

<template>
  <div v-if="imageDetail" class="right-col">
    <button
      type="button"
      class="author-info author-info--interactive"
      :disabled="!imageDetail.author.id"
      @click="emit('authorClick')"
    >
      <div class="author-avatar">
        {{ imageDetail.author.username.slice(0, 1).toUpperCase() }}
      </div>
      <div class="author-content">
        <div class="author-name">{{ imageDetail.author.username }}</div>
        <div class="pub-time">{{ imageDetail.createdAt }} 发布</div>
      </div>
    </button>

    <div class="image-title">{{ imageDetail.title }}</div>

    <div class="actions">
      <el-button
        type="primary"
        class="action-btn"
        :loading="collecting"
        @click="emit('collect')"
      >
        采集到画板
      </el-button>
      <div class="action-group">
        <el-button
          class="action-btn"
          :loading="downloading"
          @click="emit('download')"
        >
          下载
        </el-button>
        <el-button
          class="action-btn"
          :type="imageDetail.isLiked ? 'primary' : undefined"
          :loading="liking"
          @click="emit('like')"
        >
          {{ imageDetail.isLiked ? '已赞' : '赞' }}
        </el-button>
        <el-button class="action-btn" @click="emit('share')">分享</el-button>
      </div>
    </div>

    <div class="meta-info">
      <div class="meta-title">图片信息</div>
      <div v-if="imageMetaData.dimensions" class="meta-item">
        尺寸：{{ imageMetaData.dimensions }}
      </div>
      <div v-if="imageMetaData.format" class="meta-item">
        格式：{{ imageMetaData.format }}
      </div>
      <div v-if="imageMetaData.size" class="meta-item">
        大小：{{ imageMetaData.size }}
      </div>
    </div>

    <div class="tags-section">
      <div class="tags-title">标签</div>
      <div class="tags-list">
        <span v-for="tag in imageDetail.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right-col {
  width: clamp(320px, 30vw, 412px);
  flex: 0 0 clamp(320px, 30vw, 412px);
  padding: var(--ds-space-6) var(--ds-space-5);
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-5);
}

.author-info {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.author-info--interactive {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.author-info--interactive:disabled {
  cursor: default;
}

.author-info--interactive:hover .author-name {
  color: var(--ds-color-text-secondary);
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--el-fill-color);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-text-secondary);
}

.author-content {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
}

.pub-time {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.image-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
}

.action-btn {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.action-group {
  display: flex;
  gap: var(--ds-space-3);
}

.action-group .action-btn {
  flex: 1;
  height: 40px;
  font-size: 14px;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  padding-top: var(--ds-space-2);
}

.meta-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.meta-item {
  font-size: 13px;
  color: var(--ds-color-text-secondary);
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-3);
  padding-top: var(--ds-space-2);
}

.tags-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--ds-color-text-primary);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
}

.tag {
  padding: var(--ds-space-1) var(--ds-space-2);
  background-color: var(--ds-color-bg-secondary);
  border-radius: var(--ds-radius-1);
  font-size: 10px;
  color: var(--ds-color-text-secondary);
}

@media (max-width: 1280px) {
  .right-col {
    width: 100%;
    flex: 1 1 auto;
  }
}
</style>
