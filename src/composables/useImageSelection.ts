import { ref, computed, type Ref } from 'vue';
import type { Image } from '../types/image';

export function useImageSelection(imagesRef: Ref<Image[]>) {
  const selectedImages = ref<string[]>([]);

  const isAllSelected = computed(() => {
    const images = imagesRef.value;
    return (
      images.length > 0 &&
      images.every((img: Image) =>
        selectedImages.value.includes(img.id.toString())
      )
    );
  });

  const isIndeterminate = computed(() => {
    const images = imagesRef.value;
    return (
      selectedImages.value.length > 0 &&
      selectedImages.value.length < images.length
    );
  });

  const toggleSelect = (image: Image) => {
    const index = selectedImages.value.indexOf(image.id.toString());
    if (index > -1) {
      selectedImages.value.splice(index, 1);
    } else {
      selectedImages.value.push(image.id.toString());
    }
  };

  const toggleSelectAll = (val?: boolean | Event) => {
    const target = typeof val === 'boolean' ? val : !isAllSelected.value;
    if (target) {
      selectedImages.value = imagesRef.value.map((img: Image) =>
        img.id.toString()
      );
    } else {
      selectedImages.value = [];
    }
  };

  const clearSelection = () => {
    selectedImages.value = [];
  };

  return {
    selectedImages,
    isAllSelected,
    isIndeterminate,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
  };
}
