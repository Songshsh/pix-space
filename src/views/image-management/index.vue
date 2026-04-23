<template>
  <div v-loading="loading" class="image-management">
    <el-card class="toolbar-card">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button v-if="canEdit" type="primary" @click="handleUpload">
            <el-icon><Upload /></el-icon>
            上传图片
          </el-button>
          <el-button
            v-if="canEdit"
            :disabled="selectedImages.length === 0"
            @click="handleBatchChangeTags"
          >
            <el-icon><Discount /></el-icon>更换标签
          </el-button>
          <el-button
            :disabled="selectedImages.length === 0"
            @click="handleBatchDownload"
          >
            <el-icon><Download /></el-icon>批量下载
          </el-button>
          <el-button
            v-if="canEdit"
            :disabled="selectedImages.length === 0"
            @click="handleBatchFavorite"
          >
            <el-icon><Star /></el-icon>批量收藏
          </el-button>
          <el-button
            v-if="canEdit"
            type="danger"
            plain
            :disabled="selectedImages.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <el-input
            v-model="searchQuery"
            placeholder="搜索图片..."
            clearable
            style="width: 220px"
            @input="handleSearch"
          >
            <template #prefix
              ><el-icon><Search /></el-icon
            ></template>
          </el-input>
          <el-button
            style="margin-left: 12px"
            @click="showFilters = !showFilters"
          >
            <el-icon><Filter /></el-icon>筛选
          </el-button>
          <el-button-group style="margin-left: 12px">
            <el-button
              :type="viewMode === 'grid' ? 'primary' : ''"
              @click="viewMode = 'grid'"
            >
              <el-icon><Grid /></el-icon>
            </el-button>
            <el-button
              :type="viewMode === 'list' ? 'primary' : ''"
              @click="viewMode = 'list'"
            >
              <el-icon><List /></el-icon>
            </el-button>
          </el-button-group>
          <el-select
            v-model="sortBy"
            placeholder="排序"
            style="width: 100px; margin-left: 12px"
          >
            <el-option label="最新" value="newest" />
            <el-option label="最旧" value="oldest" />
            <el-option label="名称" value="name" />
            <el-option label="大小" value="size" />
          </el-select>
        </div>
      </div>
    </el-card>

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
        <el-card>
          <div class="content-header">
            <div class="header-left">
              <el-checkbox
                v-if="images.length > 0"
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
                style="margin-right: 16px"
                @change="(val) => toggleSelectAll(Boolean(val))"
              >
                全选
              </el-checkbox>
              <h3 class="content-title">{{ collectionTitle }}</h3>
              <p class="content-subtitle">{{ totalImages }} 张图片</p>
              <span
                v-if="selectedImages.length > 0"
                class="selected-count"
                style="margin-left: 12px"
              >
                (已选择 {{ selectedImages.length }} 项)
              </span>
            </div>
          </div>

          <Gallery
            :view-mode="viewMode"
            :images="images"
            :selected-images="selectedImages"
            :can-edit="canEdit"
            @click-image="handleImageClick"
            @toggle-select="toggleSelect"
            @selection-change="handleSelectionChange"
            @toggle-favorite="toggleFavorite"
            @preview="handleImageClick"
            @rename="renameImage"
            @change-tags="changeTags"
            @download="downloadImage"
            @copy-link="copyImageLink"
            @delete="deleteImage"
          />

          <el-image-viewer
            v-if="previewVisible && previewUrlList.length > 0"
            :initial-index="previewInitialIndex"
            :url-list="previewUrlList"
            :infinite="false"
            @close="previewVisible = false"
            @switch="(idx) => (previewCurrentIndex = idx)"
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
                  size="small"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </span>
              <span class="preview-title-count"
                >({{ previewCurrentIndex + 1 }} /
                {{ previewUrlList.length }})</span
              >
            </div>
          </teleport>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[12, 24, 48, 96]"
              :total="totalImages"
              layout="total, sizes, prev, pager, next, jumper"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <UploadDialog
      v-model:visible="uploadDialogVisible"
      @uploaded="loadImages"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import {
  Delete,
  Filter,
  Grid,
  List,
  Search,
  Upload,
  Discount,
  Download,
  Star,
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import Sidebar from './ImageSidebar.vue';
import Gallery from './ImageGallery.vue';
const UploadDialog = defineAsyncComponent(
  () => import('./ImageUploadDialog.vue')
);

import { useImageList } from '../../composables/useImageList';
import { useImageSelection } from '../../composables/useImageSelection';
import { usePermission } from '../../composables/usePermission';
import type { Image, ImageTag } from '../../types/image';

const { hasPermission } = usePermission();
const canEdit = hasPermission(['admin', 'user']);

const viewMode = ref('grid');
const showFilters = ref(false);
const currentImage = ref<Image | null>(null);
const previewVisible = ref(false);
const uploadDialogVisible = ref(false);
const previewCurrentIndex = ref(0);

const tags = ref<ImageTag[]>([
  { name: '自然', type: 'primary' },
  { name: '城市', type: 'warning' },
  { name: '人物', type: 'danger' },
  { name: '动物', type: 'success' },
  { name: '建筑', type: 'info' },
]);

const {
  images,
  totalImages,
  loading,
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
} = useImageSelection(images); // Pass images ref

const handleUpload = () => {
  uploadDialogVisible.value = true;
};

onMounted(() => {
  loadImages();
});

const handleImageClick = (image: Image) => {
  currentImage.value = image;
  const idx = images.value.findIndex((img: Image) => img.id === image.id);
  previewCurrentIndex.value = idx >= 0 ? idx : 0;
  previewVisible.value = true;
};

const previewUrlList = computed(() => {
  return images.value.map((img: Image) => {
    if (img.url.includes('picsum.photos')) {
      const urlObj = new URL(img.url);
      urlObj.pathname = '/800/600';
      return urlObj.toString();
    }
    return img.url;
  });
});

const previewInitialIndex = computed(() => {
  if (!currentImage.value) return 0;
  const idx = images.value.findIndex(
    (img: Image) => img.id === currentImage.value?.id
  );
  return idx >= 0 ? idx : 0;
});

const previewCurrentTitle = computed(() => {
  const img = images.value[previewCurrentIndex.value];
  return img ? img.title : '';
});

const previewCurrentTags = computed(() => {
  const img = images.value[previewCurrentIndex.value];
  return img?.tags || [];
});

const handleSelectionChange = (selection: Image[]) => {
  // Clear first, then add all selected items from the table
  clearSelection();
  selection.forEach((img) => toggleSelect(img));
};

const toggleFavorite = (image: Image) => {
  image.isFavorite = !image.isFavorite;
  ElMessage.success(image.isFavorite ? '已添加到收藏' : '已取消收藏');
};

const renameImage = (image: Image) => {
  ElMessageBox.prompt('请输入新的图片名称', '重命名', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: image.title,
    inputValidator: (value) => {
      if (!value || value.trim() === '') {
        return '图片名称不能为空';
      }
      return true;
    },
  })
    .then(({ value }) => {
      image.title = value.trim();
      ElMessage.success('重命名成功');
    })
    .catch(() => {
      // cancelled
    });
};

const changeTags = (image: Image) => {
  ElMessage.info(`更换标签功能开发中: ${image.title}`);
};

const downloadImage = (image: Image) => {
  ElMessage.success(`开始下载图片: ${image.title}`);
};

const copyImageLink = async (image: Image) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(image.url);
      ElMessage.success('链接已复制到剪贴板');
    } else {
      // fallback
      const input = document.createElement('input');
      input.value = image.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      ElMessage.success('链接已复制到剪贴板');
    }
  } catch {
    ElMessage.error('复制失败');
  }
};

const handleBatchDownload = () => {
  if (selectedImages.value.length === 0) return;
  ElMessage.success(`开始批量下载 ${selectedImages.value.length} 张图片`);
};

const handleBatchFavorite = () => {
  if (selectedImages.value.length === 0) return;
  images.value.forEach((img: Image) => {
    if (selectedImages.value.includes(img.id.toString())) {
      img.favorite = true;
      // also set isFavorite if they use both fields in mock data
      img.isFavorite = true;
    }
  });
  ElMessage.success(`已将 ${selectedImages.value.length} 张图片加入收藏`);
  clearSelection();
};

const handleBatchChangeTags = () => {
  if (selectedImages.value.length === 0) return;
  ElMessage.info(
    `批量更换 ${selectedImages.value.length} 张图片的标签功能开发中`
  );
};

const deleteImage = (image: Image) => {
  ElMessageBox.confirm(`确定要删除图片 "${image.title}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      images.value = images.value.filter((img: Image) => img.id !== image.id);
      if (selectedImages.value.includes(image.id.toString())) {
        toggleSelect(image);
      }
      ElMessage.success('图片已删除');
    })
    .catch(() => {
      // cancelled
    });
};

const handleBatchDelete = () => {
  if (selectedImages.value.length === 0) return;

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedImages.value.length} 张图片吗？此操作不可恢复。`,
    '批量删除警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'error',
    }
  )
    .then(() => {
      images.value = images.value.filter(
        (img: Image) => !selectedImages.value.includes(img.id.toString())
      );
      clearSelection();
      ElMessage.success('批量删除成功');
    })
    .catch(() => {
      // cancelled
    });
};
</script>

<style scoped>
.image-management {
  min-height: 100%;
}

.toolbar-card {
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  min-height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
}

.content-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.content-subtitle {
  font-size: 14px;
  color: #999;
  margin: 0 0 0 12px;
}

.selected-count {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.preview-title {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3000;
  color: #fff;
  font-size: 16px;
  background-color: var(--el-text-color-regular);
  opacity: 0.8;
  padding: 8px 16px;
  border-radius: 22px;
  transition: opacity 0.2s;
}

.preview-title:hover {
  opacity: 1;
}

.preview-title-tags {
  display: flex;
  gap: 4px;
}

.preview-title-count {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
