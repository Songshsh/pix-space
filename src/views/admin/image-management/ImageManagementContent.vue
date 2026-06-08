<template>
  <el-card>
    <div class="content-header">
      <div class="header-left">
        <el-checkbox
          v-if="images.length > 0"
          :model-value="isAllSelected"
          :indeterminate="isIndeterminate"
          @change="(val: unknown) => emit('toggle-select-all', Boolean(val))"
        >
          全选
        </el-checkbox>
        <h3 class="content-title">{{ collectionTitle }}</h3>
        <p class="content-subtitle">{{ totalImages }} 张图片</p>
        <span v-if="selectedImages.length > 0" class="selected-count">
          (已选择 {{ selectedImages.length }} 项)
        </span>
      </div>
    </div>

    <Gallery
      v-if="!error"
      :view-mode="viewMode"
      :images="images"
      :selected-images="selectedImages"
      @click-image="(image) => emit('click-image', image)"
      @toggle-select="(image) => emit('toggle-select', image)"
      @selection-change="(selection) => emit('selection-change', selection)"
      @toggle-favorite="(image) => emit('toggle-favorite', image)"
      @preview="(image) => emit('preview', image)"
      @rename="(image) => emit('rename', image)"
      @change-tags="(image) => emit('change-tags', image)"
      @download="(image) => emit('download', image)"
      @copy-link="(image) => emit('copy-link', image)"
      @delete="(image) => emit('delete', image)"
    />

    <div v-if="error" class="error-state">
      <el-empty description="加载图片失败">
        <el-button type="primary" @click="emit('retry')">重试</el-button>
      </el-empty>
    </div>

    <el-empty
      v-else-if="!loading && images.length === 0"
      description="暂无图片"
    />

    <el-image-viewer
      v-if="previewVisible && previewUrlList.length > 0"
      :initial-index="previewInitialIndex"
      :url-list="previewUrlList"
      :infinite="false"
      @close="emit('close-preview')"
      @switch="(idx: number) => emit('switch-preview', idx)"
    />

    <teleport to="body">
      <div
        v-if="previewVisible && previewUrlList.length > 0"
        class="preview-title"
      >
        <span class="preview-title-text">{{ previewCurrentTitle }}</span>
        <span class="preview-title-tags">
          <el-tag
            v-for="tag in previewCurrentTags"
            :key="tag"
            class="preview-tag"
            size="small"
            type="info"
          >
            {{ tag }}
          </el-tag>
        </span>
        <span class="preview-title-count">
          ({{ previewCurrentIndex + 1 }} / {{ previewUrlList.length }})
        </span>
      </div>
    </teleport>

    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[12, 24, 48, 96]"
        :total="totalImages"
        layout="total, sizes, prev, pager, next, jumper"
        @update:current-page="(value) => emit('update:currentPage', value)"
        @update:page-size="(value) => emit('update:pageSize', value)"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Image } from '../../../types/image';
import Gallery from './ImageGallery.vue';

defineProps<{
  loading: boolean;
  error: string | null;
  images: Image[];
  totalImages: number;
  selectedImages: string[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
  collectionTitle: string;
  viewMode: 'grid' | 'list';
  previewVisible: boolean;
  previewUrlList: string[];
  previewInitialIndex: number;
  previewCurrentIndex: number;
  previewCurrentTitle: string;
  previewCurrentTags: string[];
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  retry: [];
  'toggle-select-all': [value: boolean];
  'selection-change': [selection: Image[]];
  'click-image': [image: Image];
  'toggle-select': [image: Image];
  'toggle-favorite': [image: Image];
  preview: [image: Image];
  rename: [image: Image];
  'change-tags': [image: Image];
  download: [image: Image];
  'copy-link': [image: Image];
  delete: [image: Image];
  'close-preview': [];
  'switch-preview': [index: number];
  'update:currentPage': [value: number];
  'update:pageSize': [value: number];
}>();
</script>

<style scoped>
.error-state {
  padding: var(--ds-space-9) 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ds-space-5);
  padding-bottom: var(--ds-space-4);
  border-bottom: 1px solid var(--ds-color-border);
  min-height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.content-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
  margin: 0;
}

.content-subtitle {
  font-size: 14px;
  color: var(--ds-color-text-tertiary);
  margin: 0;
}

.selected-count {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.preview-title {
  position: fixed;
  top: var(--ds-space-8);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  z-index: var(--ds-z-dialog);
  color: var(--ds-color-text-inverse);
  font-size: 16px;
  background-color: var(--ds-color-overlay-light);
  opacity: 0.8;
  padding: var(--ds-space-2) var(--ds-space-4);
  border-radius: var(--ds-radius-pill);
  transition: opacity 0.2s;
}

.preview-title:hover {
  opacity: 1;
}

.preview-title-tags {
  display: flex;
  gap: var(--ds-space-1);
}

.preview-tag {
  padding-left: var(--ds-space-2);
  padding-right: var(--ds-space-2);
}

.preview-title-count {
  color: var(--ds-color-overlay-white-bright);
  font-size: 14px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ds-space-5);
  padding-top: var(--ds-space-4);
  border-top: 1px solid var(--ds-color-border);
}
</style>
