import type { Ref } from 'vue';
import type { FileItem } from '../types/file';
import { getFileNameError } from '../utils/fileDisplay';

export function useFileCrud(
  selectedFiles: Ref<number[]>,
  clearSelection: () => void,
  options?: {
    onRename?: (file: FileItem, newName: string) => void;
    onDelete?: (file: FileItem) => void;
    onBatchDelete?: (fileIds: number[]) => void;
  }
) {
  const folderDialogVisible = ref(false);
  const newFolderName = ref('');
  const currentPath = ref(['我的文件']);

  const handleOpenFile = (file: FileItem) => {
    if (file.type === '文件夹') {
      currentPath.value.push(file.name);
      ElMessage.info(`进入文件夹: ${file.name}`);
    } else {
      ElMessage.info(`打开文件: ${file.name}`);
    }
  };

  const handleCreateFolder = () => {
    newFolderName.value = '';
    folderDialogVisible.value = true;
  };

  const confirmCreateFolder = () => {
    const error = getFileNameError(newFolderName.value);
    if (error) {
      ElMessage.warning(error);
      return;
    }
    ElMessage.success('文件夹创建成功');
    folderDialogVisible.value = false;
  };

  const handleRename = (file: FileItem) => {
    ElMessageBox.prompt('请输入新名称', '重命名', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValue: file.name,
    })
      .then(({ value }) => {
        const error = getFileNameError(value);
        if (error) {
          ElMessage.warning(error);
          return;
        }
        options?.onRename?.(file, value);
        ElMessage.success('重命名成功');
      })
      .catch(() => {});
  };

  const handleMove = (file: FileItem) => {
    ElMessage.info(`移动文件: ${file.name}`);
  };

  const handleDeleteFile = (file: FileItem) => {
    ElMessageBox.confirm(`确定要删除 "${file.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        options?.onDelete?.(file);
        ElMessage.success('删除成功');
      })
      .catch(() => {});
  };

  const handleBatchDelete = () => {
    if (selectedFiles.value.length === 0) {
      ElMessage.warning('请选择要删除的文件');
      return;
    }
    ElMessageBox.confirm(
      `确定要删除选中的 ${selectedFiles.value.length} 个文件吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        options?.onBatchDelete?.([...selectedFiles.value]);
        ElMessage.success('批量删除成功');
        clearSelection();
      })
      .catch(() => {});
  };

  return {
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
  };
}
