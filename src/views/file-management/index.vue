<template>
  <div v-loading="loading" class="file-management">
    <Toolbar
      v-model:search-keyword="searchKeyword"
      v-model:view-mode="viewMode"
      :selected-count="selectedFiles.length"
      :can-edit="canEdit"
      @upload="handleUpload"
      @create-folder="handleCreateFolder"
      @batch-delete="handleBatchDelete"
    />

    <el-card>
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <el-icon><HomeFilled /></el-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in currentPath"
            :key="`${item}-${index}`"
          >
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <Grid
        v-if="viewMode === 'grid'"
        :files="files"
        :selected-files="selectedFiles"
        :can-edit="canEdit"
        @select-file="handleSelectFile"
        @open-file="handleOpenFile"
        @download="handleDownload"
        @rename="handleRename"
        @move="handleMove"
        @delete="handleDeleteFile"
      />

      <List
        v-else
        :files="files"
        :can-edit="canEdit"
        @selection-change="handleSelectionChange"
        @download="handleDownload"
        @rename="handleRename"
        @delete="handleDeleteFile"
      />

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>

    <UploadDialog v-model:visible="uploadDialogVisible" @uploaded="loadFiles" />
    <CreateFolderDialog
      v-model:visible="folderDialogVisible"
      v-model:name="newFolderName"
      @confirm="confirmCreateFolder"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeFilled } from '@element-plus/icons-vue';
import { getFileList } from '../../api/file';

import Toolbar from './FileToolbar.vue';
import Grid from './FileGrid.vue';
import List from './FileList.vue';

import { useFileSelection } from '../../composables/useFileSelection';
import { useFileTransfer } from '../../composables/useFileTransfer';
import { useFileCrud } from '../../composables/useFileCrud';
import { usePermission } from '../../composables/usePermission';
import type { FileItem, ListResult } from '../../types/file';
import { useDebounceFn } from '@vueuse/core';

const { hasPermission } = usePermission();
const canEdit = hasPermission(['admin', 'user']);

const UploadDialog = defineAsyncComponent(
  () => import('./FileUploadDialog.vue')
);
const CreateFolderDialog = defineAsyncComponent(
  () => import('./CreateFolderDialog.vue')
);

const viewMode = ref('grid');
const searchKeyword = ref('');
const loading = ref(false);

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 100,
});

const files = ref<FileItem[]>([]);

const {
  selectedFiles,
  handleSelectFile,
  handleSelectionChange,
  clearSelection,
} = useFileSelection();

const loadFiles = async () => {
  loading.value = true;
  try {
    const result = (await getFileList(
      {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchKeyword.value,
      },
      { silentError: true }
    )) as ListResult<FileItem>;
    files.value = result.list || [];
    pagination.total = result.total || 0;
  } catch (error) {
    console.error('Failed to load files:', error);
  } finally {
    loading.value = false;
  }
};

const { uploadDialogVisible, handleUpload, handleDownload } = useFileTransfer();

const {
  folderDialogVisible,
  newFolderName,
  currentPath,
  handleOpenFile,
  handleCreateFolder,
  confirmCreateFolder,
  handleRename,
  handleMove,
  handleDeleteFile,
  handleBatchDelete,
} = useFileCrud(selectedFiles, clearSelection, {
  onRename(file, newName) {
    const target = files.value.find((item) => item.id === file.id);
    if (target) target.name = newName;
  },
  onDelete(file) {
    files.value = files.value.filter((item) => item.id !== file.id);
    pagination.total = Math.max(0, pagination.total - 1);
  },
  onBatchDelete(fileIds) {
    const idSet = new Set(fileIds);
    const before = files.value.length;
    files.value = files.value.filter((item) => !idSet.has(item.id));
    pagination.total = Math.max(
      0,
      pagination.total - (before - files.value.length)
    );
  },
});

onMounted(() => {
  loadFiles();
});

watch(
  () => [pagination.page, pagination.pageSize],
  () => {
    loadFiles();
  }
);

const debouncedSearch = useDebounceFn(() => {
  pagination.page = 1;
  loadFiles();
}, 500);

watch(searchKeyword, () => {
  debouncedSearch();
});
</script>

<style scoped>
.file-management {
  min-height: 100%;
}

.breadcrumb-container {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
