import type { Ref } from 'vue';
import type { Image } from '../types/image';

export function useImageSelection(imagesRef: Ref<Image[]>) {
  const selectedImages = ref<string[]>([]);

  const selectedSet = computed(() => new Set(selectedImages.value));

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

  const toggleSelect = (image: Image) => {
    const id = image.id;
    const index = selectedImages.value.indexOf(id);
    if (index > -1) {
      selectedImages.value.splice(index, 1);
    } else {
      selectedImages.value.push(id);
    }
  };

  const toggleSelectAll = (val: boolean) => {
    if (val) {
      selectedImages.value = imagesRef.value.map((img) => img.id);
    } else {
      selectedImages.value = [];
    }
  };

  const clearSelection = () => {
    selectedImages.value = [];
  };

  watch(
    imagesRef,
    (images) => {
      const validIds = new Set(images.map((image) => image.id));
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
