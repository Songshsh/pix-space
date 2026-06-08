<template>
  <div v-loading="loading" class="image-management">
    <ImageManagementToolbar
      :selected-count="selectedImages.length"
      :search-query="searchQuery"
      :view-mode="viewMode"
      :sort-by="sortBy"
      @update:search-query="(value) => (searchQuery = value)"
      @update:view-mode="(value) => (viewMode = value)"
      @update:sort-by="(value) => (sortBy = value)"
      @search="handleSearch"
      @upload="handleUpload"
      @batch-change-tags="handleBatchChangeTags"
      @batch-download="handleBatchDownload"
      @batch-favorite="handleBatchFavorite"
      @batch-delete="handleBatchDelete"
    />

    <el-row :gutter="24">
      <el-col :xs="24" :sm="6" :lg="4">
        <Sidebar
          :active-collection="activeCollection"
          :total-images="totalImages"
          :tags="tags"
          @update:active-collection="handleCollectionSelect"
          @select-tag="(tag: ImageTag) => handleTagSelect(tag.name)"
        />
      </el-col>

      <el-col :xs="24" :sm="18" :lg="20">
        <ImageManagementContent
          :loading="loading"
          :error="error"
          :images="images"
          :total-images="totalImages"
          :selected-images="selectedImages"
          :is-all-selected="isAllSelected"
          :is-indeterminate="isIndeterminate"
          :collection-title="collectionTitle"
          :view-mode="viewMode"
          :preview-visible="previewVisible"
          :preview-url-list="previewUrlList"
          :preview-initial-index="previewInitialIndex"
          :preview-current-index="previewCurrentIndex"
          :preview-current-title="previewCurrentTitle"
          :preview-current-tags="previewCurrentTags"
          :current-page="currentPage"
          :page-size="pageSize"
          @retry="loadImages"
          @toggle-select-all="toggleSelectAll"
          @selection-change="handleSelectionChange"
          @click-image="openPreview"
          @toggle-select="toggleSelect"
          @toggle-favorite="toggleFavorite"
          @preview="openPreview"
          @rename="renameImage"
          @change-tags="changeTags"
          @download="downloadImage"
          @copy-link="copyImageLink"
          @delete="deleteImage"
          @close-preview="closePreview"
          @switch-preview="(idx: number) => (previewCurrentIndex = idx)"
          @update:current-page="(value: number) => (currentPage = value)"
          @update:page-size="(value: number) => (pageSize = value)"
        />
      </el-col>
    </el-row>

    <UploadDialog
      v-model:visible="uploadDialogVisible"
      @uploaded="loadImages"
    />
  </div>
</template>

<script setup lang="ts">
import ImageManagementContent from './ImageManagementContent.vue';
import ImageManagementToolbar from './ImageManagementToolbar.vue';
import Sidebar from './ImageSidebar.vue';
const UploadDialog = defineAsyncComponent(
  () => import('./ImageUploadDialog.vue')
);

import { useImageSelection } from '../../../composables/useImageSelection';
import { useImagePreview } from './useImagePreview';
import { useImageBatchActions } from './useImageBatchActions';
import { useImageActions } from './useImageActions';
import { useImageList } from './useImageList';
import type { ImageTag, Image } from '../../../types/image';
import { DEFAULT_IMAGE_TAGS } from './data';

const viewMode = ref<'grid' | 'list'>('grid');
const uploadDialogVisible = ref(false);

const tags = ref<ImageTag[]>(DEFAULT_IMAGE_TAGS);

const {
  images,
  totalImages,
  loading,
  error,
  currentPage,
  pageSize,
  searchQuery,
  sortBy,
  activeCollection,
  collectionTitle,
  loadImages,
  handleSearch,
  handleCollectionSelect,
  handleTagSelect,
} = useImageList();

const {
  selectedImages,
  isAllSelected,
  isIndeterminate,
  toggleSelect,
  toggleSelectAll,
  clearSelection,
} = useImageSelection(images);

const {
  previewVisible,
  previewCurrentIndex,
  previewUrlList,
  previewInitialIndex,
  previewCurrentTitle,
  previewCurrentTags,
  openPreview,
  closePreview,
} = useImagePreview(images);

const {
  handleBatchDelete,
  handleBatchFavorite,
  handleBatchChangeTags,
  handleBatchDownload,
} = useImageBatchActions({
  images,
  selectedImages,
  clearSelection,
  loadImages,
});

const {
  renameImage,
  deleteImage,
  toggleFavorite,
  changeTags,
  downloadImage,
  copyImageLink,
} = useImageActions({
  images,
  selectedImages,
  toggleSelect,
  loadImages,
});

const handleUpload = () => {
  uploadDialogVisible.value = true;
};

const handleSelectionChange = (selection: Image[]) => {
  clearSelection();
  selection.forEach((img) => toggleSelect(img));
};
</script>

<style scoped>
.image-management {
  min-height: 100%;
}
</style>
