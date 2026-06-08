import type { Ref } from 'vue';
import type { Image } from '../../../types/image';

export function useImagePreview(images: Ref<Image[]>) {
  const previewVisible = ref(false);
  const previewCurrentIndex = ref(0);
  const currentImage = ref<Image | null>(null);

  const previewUrlList = computed(() => {
    return images.value.map((img: Image) => {
      if (img.url.includes('picsum.photos')) {
        const urlObj = new URL(img.url);
        urlObj.pathname = '/800/600';
        return urlObj.toString();
      }
      return img.url;
    });
  });

  const previewInitialIndex = computed(() => {
    if (!currentImage.value) return 0;
    const idx = images.value.findIndex(
      (img: Image) => img.id === currentImage.value?.id
    );
    return idx >= 0 ? idx : 0;
  });

  const previewCurrentTitle = computed(() => {
    const img = images.value[previewCurrentIndex.value];
    return img ? img.title : '';
  });

  const previewCurrentTags = computed(() => {
    const img = images.value[previewCurrentIndex.value];
    return img?.tags || [];
  });

  const openPreview = (image: Image) => {
    currentImage.value = image;
    const idx = images.value.findIndex((img: Image) => img.id === image.id);
    previewCurrentIndex.value = idx >= 0 ? idx : 0;
    previewVisible.value = true;
  };

  const closePreview = () => {
    previewVisible.value = false;
  };

  return {
    previewVisible,
    previewCurrentIndex,
    previewUrlList,
    previewInitialIndex,
    previewCurrentTitle,
    previewCurrentTags,
    openPreview,
    closePreview,
  };
}
