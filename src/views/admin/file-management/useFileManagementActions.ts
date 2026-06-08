import {
  createFolder,
  deleteFile,
  downloadFile as downloadFileApi,
  updateFile,
} from '../../../api/file';
import type { FileItem } from '../../../types/file';
import { FileType, getFileNameError } from '../../../utils/fileDisplay';
import {
  parseContentDispositionFilename,
  sanitizeFilenamePart,
  triggerDownload,
} from '../../../utils/download';

interface UseFileManagementActionsOptions {
  files: Ref<FileItem[]>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  currentFolderId: Ref<number | null>;
  selectedFiles: Ref<number[]>;
  clearSelection: () => void;
  loadFiles: () => Promise<void>;
  syncPaginationAfterDelete: () => Promise<void>;
  handleOpenFolder: (file: FileItem) => void;
}

export function useFileManagementActions(
  options: UseFileManagementActionsOptions
) {
  const uploadDialogVisible = ref(false);
  const folderDialogVisible = ref(false);
  const newFolderName = ref('');

  const handleUpload = () => {
    uploadDialogVisible.value = true;
  };

  const handleDownload = async (file: FileItem) => {
    if (file.type === FileType.Folder) return;
    try {
      const response = await downloadFileApi(file.id, { notifyError: true });
      const blob = response.data as Blob;
      const filenameFromHeader = parseContentDispositionFilename(
        response.headers?.['content-disposition']
      );
      const fallbackName = sanitizeFilenamePart(file.name);
      triggerDownload(blob, filenameFromHeader || fallbackName);
      ElMessage.success(`已开始下载: ${file.name}`);
    } catch {
      return;
    }
  };

  const handleOpenFile = (file: FileItem) => {
    if (file.type === FileType.Folder) {
      options.handleOpenFolder(file);
      return;
    }
    void handleDownload(file);
  };

  const handleCreateFolder = () => {
    newFolderName.value = '';
    folderDialogVisible.value = true;
  };

  const confirmCreateFolder = async () => {
    const error = getFileNameError(newFolderName.value);
    if (error) {
      ElMessage.warning(error);
      return;
    }

    try {
      await createFolder({
        name: newFolderName.value.trim(),
        ...(options.currentFolderId.value !== null
          ? { parentId: options.currentFolderId.value }
          : { parentPath: [] }),
      });
      folderDialogVisible.value = false;
      newFolderName.value = '';
      options.pagination.page = 1;
      await options.loadFiles();
      ElMessage.success('文件夹创建成功');
    } catch {
      void 0;
    }
  };

  const handleRename = (file: FileItem) => {
    ElMessageBox.prompt('请输入新名称', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: file.name,
    })
      .then(async ({ value }) => {
        const error = getFileNameError(value);
        if (error) {
          ElMessage.warning(error);
          return;
        }
        await updateFile(file.id, { name: value.trim() });
        await options.loadFiles();
        ElMessage.success('重命名成功');
      })
      .catch(() => {});
  };

  const handleDeleteFile = (file: FileItem) => {
    ElMessageBox.confirm(`确定要删除 "${file.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await deleteFile(file.id);
        options.files.value = options.files.value.filter(
          (item) => item.id !== file.id
        );
        options.pagination.total = Math.max(0, options.pagination.total - 1);
        options.clearSelection();
        await options.syncPaginationAfterDelete();
        ElMessage.success('删除成功');
      })
      .catch(() => {});
  };

  const handleBatchDelete = () => {
    if (options.selectedFiles.value.length === 0) {
      ElMessage.warning('请选择要删除的文件');
      return;
    }

    ElMessageBox.confirm(
      `确定要删除选中的 ${options.selectedFiles.value.length} 个文件吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        const idSet = new Set(options.selectedFiles.value);
        const ids = [...idSet];
        const results = await Promise.allSettled(
          ids.map((id) => deleteFile(id))
        );
        const successIds = ids.filter((_, index) => {
          return results[index]?.status === 'fulfilled';
        });
        const failedIds = ids.filter((_, index) => {
          return results[index]?.status === 'rejected';
        });
        const failedCount = results.length - successIds.length;
        const successIdSet = new Set(successIds);
        options.files.value = options.files.value.filter(
          (item) => !successIdSet.has(item.id)
        );
        options.pagination.total = Math.max(
          0,
          options.pagination.total - successIds.length
        );
        options.selectedFiles.value = failedIds;
        await options.syncPaginationAfterDelete();
        if (failedCount === 0) {
          ElMessage.success('批量删除成功');
          options.clearSelection();
          return;
        }
        ElMessage.warning(
          `已删除 ${successIds.length} 项，${failedCount} 项删除失败`
        );
      })
      .catch(() => {});
  };

  return {
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
  };
}
