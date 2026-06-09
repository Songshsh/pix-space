import type { FileItem } from '../types/file';
import { useMultiSelect } from './useMultiSelect';

export function useFileSelection() {
  const {
    selectedIds: selectedFiles,
    toggle,
    clear: clearSelection,
  } = useMultiSelect<FileItem>();

  const handleSelectFile = (file: FileItem) => toggle(file);

  const handleSelectionChange = (selection: FileItem[]) => {
    selectedFiles.value = selection.map((item) => item.id);
  };

  return {
    selectedFiles,
    handleSelectFile,
    handleSelectionChange,
    clearSelection,
  };
}
