import type { Ref } from 'vue';
import type { Image } from '../types/image';
import { useMultiSelect } from './useMultiSelect';

export function useImageSelection(imagesRef: Ref<Image[]>) {
  const {
    selectedIds: selectedImages,
    selectedSet,
    toggle: toggleSelect,
    clear: clearSelection,
  } = useMultiSelect<Image>();

  const isAllSelected = computed(() => {
    const images = imagesRef.value;
    const set = selectedSet.value;
    return images.length > 0 && images.every((img) => set.has(img.id));
  });

  const isIndeterminate = computed(() => {
    const images = imagesRef.value;
    return (
      selectedImages.value.length > 0 &&
      selectedImages.value.length < images.length
    );
  });

  const toggleSelectAll = (val: boolean) => {
    if (val) {
      selectedImages.value = imagesRef.value.map((img) => img.id);
    } else {
      selectedImages.value = [];
    }
  };

  // 仅关心数组引用替换（如数据源整体刷新），不关心数组内部元素变化
  watch(
    imagesRef,
    (images) => {
      const validIds = new Set<string | number>(
        images.map((image) => image.id)
      );
      selectedImages.value = selectedImages.value.filter((id) =>
        validIds.has(id)
      );
    },
    { deep: false }
  );

  return {
    selectedImages,
    isAllSelected,
    isIndeterminate,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}
