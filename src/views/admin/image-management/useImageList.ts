import { getImageList } from '../../../api/image';
import { PREVIEW_COLORS } from '../../../constants/image';
import { useRequestSequencer } from '../../../composables/requestSequencer';
import type { Image } from '../../../types/image';
import { useDebounceFn } from '@vueuse/core';

const COLLECTION_TITLES: Record<string, string> = {
  all: '全部图片',
  recent: '最近上传',
  favorites: '我的收藏',
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function useImageList() {
  const images = ref<Image[]>([]);
  const totalImages = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentPage = ref(1);
  const pageSize = ref(12);
  const searchQuery = ref('');
  const sortBy = ref('newest');
  const activeCollection = ref<string>('all');
  const activeTag = ref<string>('');

  const sequencer = useRequestSequencer();

  const collectionTitle = computed(() => {
    return COLLECTION_TITLES[activeCollection.value] || '全部图片';
  });

  const loadImages = async () => {
    const currentSeq = sequencer.next();
    loading.value = true;
    error.value = null;
    try {
      const result = await getImageList(
        {
          page: currentPage.value,
          pageSize: pageSize.value,
          query: searchQuery.value,
          sortBy: sortBy.value,
          collection: activeCollection.value,
          tag: activeTag.value || undefined,
        },
        { silentError: true }
      );
      if (currentSeq !== sequencer.currentSeq) return;
      const list = result?.list || [];
      images.value = list.map((img: Image, index: number) => ({
        ...img,
        id:
          img.id ||
          `img-${hashString(
            String(
              img.url ||
                `${img.title || ''}-${img.createdAt || ''}-${img.size || ''}`
            ) || String(index)
          )}`,
        title: img.title || '未命名',
        createdAt: img.createdAt || '',
        isFavorite: Boolean(img.isFavorite),
        color: img.color || PREVIEW_COLORS[index % PREVIEW_COLORS.length],
      }));
      totalImages.value = result?.total || images.value.length;
    } catch (err) {
      if (currentSeq !== sequencer.currentSeq) return;
      error.value = err instanceof Error ? err.message : '加载图片失败';
    } finally {
      if (currentSeq === sequencer.currentSeq) {
        loading.value = false;
      }
    }
  };

  const debouncedLoadImages = useDebounceFn(loadImages, 500);

  const handleSearch = () => {
    currentPage.value = 1;
    debouncedLoadImages();
  };

  const handleCollectionSelect = (key: string) => {
    activeCollection.value = key;
    activeTag.value = '';
    currentPage.value = 1;
  };

  const handleTagSelect = (tag: string) => {
    activeTag.value = tag;
    activeCollection.value = 'all';
    currentPage.value = 1;
  };

  watch(
    () =>
      [
        currentPage.value,
        pageSize.value,
        activeCollection.value,
        activeTag.value,
        sortBy.value,
      ] as const,
    () => {
      loadImages();
    },
    { immediate: true }
  );

  return {
    images,
    totalImages,
    loading,
    error,
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
