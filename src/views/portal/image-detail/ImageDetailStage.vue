<script setup lang="ts">
import type { ImageDetail } from '../../../types/image-detail';

defineProps<{
  imageDetail: ImageDetail | null;
}>();
</script>

<template>
  <div class="left-col">
    <div class="main-image">
      <el-image
        v-if="imageDetail?.url"
        :src="imageDetail.url"
        fit="contain"
        class="detail-image"
      />
      <div
        v-else
        class="image-placeholder"
        :style="{ backgroundColor: imageDetail?.bgColor }"
      >
        <span>{{ imageDetail?.title || '图片预览' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.left-col {
  min-width: 0;
  flex: 1 1 auto;
  background-color: var(--el-fill-color-lighter);
  padding: var(--ds-space-7);
}

.main-image {
  width: min(100%, 900px);
  min-height: 560px;
  aspect-ratio: 15 / 14;
  background-color: var(--el-fill-color);
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.detail-image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  font-size: 14px;
  color: var(--ds-color-text-tertiary);
}

@media (max-width: 1280px) {
  .left-col {
    width: 100%;
    flex: 1 1 auto;
    padding: var(--ds-space-5);
  }

  .main-image {
    width: 100%;
    height: auto;
    min-height: 480px;
  }

  .detail-image {
    min-height: 480px;
  }

  .image-placeholder {
    min-height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
