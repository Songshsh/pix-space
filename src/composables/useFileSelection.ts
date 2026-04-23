import { ref } from 'vue';
import type { FileItem } from '../types/file';

export function useFileSelection() {
  const selectedFiles = ref<number[]>([]);

  const handleSelectFile = (file: FileItem) => {
    const index = selectedFiles.value.indexOf(file.id);
    if (index > -1) {
      selectedFiles.value.splice(index, 1);
    } else {
      selectedFiles.value.push(file.id);
    }
  };

  const handleSelectionChange = (selection: FileItem[]) => {
    selectedFiles.value = selection.map((item) => item.id);
  };

  const clearSelection = () => {
    selectedFiles.value = [];
  };

  return {
    selectedFiles,
    handleSelectFile,
    handleSelectionChange,
    clearSelection,
  };
}
