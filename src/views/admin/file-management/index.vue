<template>
  <div v-loading="loading" class="file-management">
    <Toolbar
      v-model:search-keyword="searchKeyword"
      v-model:view-mode="viewMode"
      :selected-count="selectedFiles.length"
      @upload="handleUpload"
      @create-folder="handleCreateFolder"
      @batch-delete="handleBatchDelete"
    />

    <el-card>
      <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <button
              type="button"
              class="breadcrumb-link"
              @click="handleBreadcrumbClick(0)"
            >
              <el-icon><HomeFilled /></el-icon>
            </button>
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbItems.slice(1)"
            :key="`${item.id}-${item.name}`"
          >
            <button
              type="button"
              class="breadcrumb-link"
              @click="handleBreadcrumbClick(index + 1)"
            >
              {{ item.name }}
            </button>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <Grid
        v-if="!loadError && viewMode === 'grid'"
        :files="files"
        :selected-files="selectedFiles"
        @select-file="handleSelectFile"
        @open-file="handleOpenFile"
        @download="handleDownload"
        @rename="handleRename"
        @delete="handleDeleteFile"
      />

      <List
        v-else-if="!loadError"
        :files="files"
        @selection-change="handleSelectionChange"
        @open-file="handleOpenFile"
        @download="handleDownload"
        @rename="handleRename"
        @delete="handleDeleteFile"
      />

      <div v-if="loadError" class="error-state">
        <el-empty description="加载文件失败">
          <el-button type="primary" @click="loadFiles">重试</el-button>
        </el-empty>
      </div>

      <el-empty
        v-else-if="!loading && files.length === 0"
        description="暂无文件"
      />

      <div v-if="!loadError" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>

    <UploadDialog
      v-model:visible="uploadDialogVisible"
      :parent-id="currentFolderId"
      @uploaded="loadFiles"
    />
    <CreateFolderDialog
      v-model:visible="folderDialogVisible"
      v-model:name="newFolderName"
      @confirm="confirmCreateFolder"
    />
  </div>
</template>

<script setup lang="ts">
import { HomeFilled } from '@element-plus/icons-vue';
import Toolbar from './FileToolbar.vue';
import Grid from './FileGrid.vue';
import List from './FileList.vue';

import { useFileSelection } from '../../../composables/useFileSelection';
import { useFileManagementActions } from './useFileManagementActions';
import { useFileManagementView } from './useFileManagementView';

const UploadDialog = defineAsyncComponent(
  () => import('./FileUploadDialog.vue')
);
const CreateFolderDialog = defineAsyncComponent(
  () => import('./CreateFolderDialog.vue')
);

const {
  selectedFiles,
  handleSelectFile,
  handleSelectionChange,
  clearSelection,
} = useFileSelection();

const {
  viewMode,
  searchKeyword,
  loading,
  loadError,
  pagination,
  files,
  currentFolderId,
  breadcrumbItems,
  loadFiles,
  handleOpenFolder,
  handleBreadcrumbClick,
  syncPaginationAfterDelete,
} = useFileManagementView({ clearSelection });

const {
  uploadDialogVisible,
  folderDialogVisible,
  newFolderName,
  handleUpload,
  handleDownload,
  handleOpenFile,
  handleCreateFolder,
  confirmCreateFolder,
  handleRename,
  handleDeleteFile,
  handleBatchDelete,
} = useFileManagementActions({
  files,
  pagination,
  currentFolderId,
  selectedFiles,
  clearSelection,
  loadFiles,
  syncPaginationAfterDelete,
  handleOpenFolder,
});
</script>

<style scoped>
.file-management {
  min-height: 100%;
}

.error-state {
  padding: var(--ds-space-9) 0;
}

.breadcrumb-container {
  margin-bottom: var(--ds-space-4);
  padding-bottom: var(--ds-space-4);
  border-bottom: 1px solid var(--ds-color-border);
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: var(--ds-space-1);
  border: none;
  background: transparent;
  color: var(--ds-color-text-secondary);
  cursor: pointer;
  padding: 0;
}

.breadcrumb-link:hover {
  color: var(--el-color-primary);
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--ds-space-4);
}
</style>
