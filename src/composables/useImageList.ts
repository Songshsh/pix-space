import { getImageList } from '../api/image';
import type { Image } from '../types/image';
import { PREVIEW_COLORS } from '../constants/image';
import { useDebounceFn } from '@vueuse/core';

const COLLECTION_TITLES: Record<string, string> = {
  all: '全部图片',
  recent: '最近上传',
  favorites: '我的收藏',
};

export function useImageList() {
  const images = ref<Image[]>([]);
  const totalImages = ref(0);
  const loading = ref(false);

  const currentPage = ref(1);
  const pageSize = ref(12);
  const searchQuery = ref('');
  const sortBy = ref('newest');
  const activeCollection = ref<string>('all');
  const activeTag = ref<string>('');

  const collectionTitle = computed(() => {
    return COLLECTION_TITLES[activeCollection.value] || '全部图片';
  });

  const loadImages = async () => {
    loading.value = true;
    try {
      const result = await getImageList(
        {
          page: currentPage.value,
          pageSize: pageSize.value,
          query: searchQuery.value,
          sortBy: sortBy.value,
          collection: activeCollection.value,
        },
        { silentError: true }
      );
      const list = result?.list || [];
      images.value = list.map((img: Image, index: number) => ({
        ...img,
        id: img.id || String(index + 1),
        title: img.title || '未命名',
        createdAt: img.createdAt || '',
        favorite: Boolean(img.favorite),
        color: PREVIEW_COLORS[index % PREVIEW_COLORS.length],
      }));
      totalImages.value = result?.total || images.value.length;
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      loading.value = false;
    }
  };

  const debouncedSearch = useDebounceFn(() => {
    currentPage.value = 1;
    loadImages();
  }, 500);

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleCollectionSelect = (key: string) => {
    activeCollection.value = key;
    activeTag.value = '';
    currentPage.value = 1;
    loadImages();
  };

  const handleTagSelect = (tag: string) => {
    activeTag.value = tag;
    activeCollection.value = 'all';
    currentPage.value = 1;
    loadImages();
  };

  watch(
    () => [currentPage.value, pageSize.value],
    () => {
      loadImages();
    }
  );

  return {
    images,
    totalImages,
    loading,
    currentPage,
    pageSize,
    searchQuery,
    sortBy,
    activeCollection,
    activeTag,
    collectionTitle,
    loadImages,
    handleSearch,
    handleCollectionSelect,
    handleTagSelect,
  };
}
