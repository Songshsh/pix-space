import type { FileItem } from '../types/file';

export function useFileTransfer() {
  const uploadDialogVisible = ref(false);

  const handleUpload = () => {
    uploadDialogVisible.value = true;
  };

  const handleDownload = (file: FileItem) => {
    ElMessage.success(`开始下载: ${file.name}`);
  };

  return {
    uploadDialogVisible,
    handleUpload,
    handleDownload,
  };
}
