import { getExploreData } from '../../../api/explore';
import type { ExploreData, SearchState } from '../../../types/explore';

const HOT_CATEGORY_SET = new Set([
  'UI设计',
  '3D渲染',
  '插画',
  '品牌设计',
  '排版',
]);

function getItemSeed(itemId: string) {
  const seed = Number(itemId.replace(/\D/g, ''));
  return Number.isFinite(seed) ? seed : 0;
}

function matchesCategory(item: ExploreData['items'][number], category: string) {
  if (category === '全部') return true;
  if (category === '其它') {
    return !item.tags.some((tag) => HOT_CATEGORY_SET.has(tag));
  }
  return item.tags.includes(category);
}

export function useExploreView() {
  const route = useRoute();
  const router = useRouter();
  let requestId = 0;

  const activeCategory = ref('全部');
  const exploreData = ref<ExploreData>({
    categories: [],
    searchTags: [],
    relatedSearches: [],
    items: [],
  });
  const dataLoading = ref(true);
  const dataError = ref<string | null>(null);

  const loadExploreData = async () => {
    const currentRequestId = ++requestId;
    dataLoading.value = true;
    dataError.value = null;
    try {
      const result = await getExploreData({ silentError: true });
      if (currentRequestId !== requestId) return;
      exploreData.value = result;
    } catch (error) {
      if (currentRequestId !== requestId) return;
      dataError.value = error instanceof Error ? error.message : '加载失败';
    } finally {
      if (currentRequestId === requestId) {
        dataLoading.value = false;
      }
    }
  };

  onMounted(() => {
    void loadExploreData();
  });

  const categories = computed(() => exploreData.value.categories);
  const searchTags = computed(() => exploreData.value.searchTags);
  const relatedSearches = computed(() => exploreData.value.relatedSearches);
  const exploreItems = computed(() => exploreData.value.items);

  const searchQuery = computed(() => {
    if (typeof route.query.q !== 'string') return '';
    return route.query.q.trim();
  });

  const isSearching = computed(() => !!searchQuery.value);

  const searchState = computed<SearchState>(() => {
    if (dataLoading.value) return 'loading';
    if (dataError.value) return 'error';
    return 'success';
  });

  const activeSort = computed<'newest' | 'hot'>(() => {
    return route.query.sort === 'hot' ? 'hot' : 'newest';
  });

  const activeSearchTag = computed(() => {
    return typeof route.query.tag === 'string' && route.query.tag
      ? route.query.tag
      : '全部';
  });

  const setSearchQuery = (q: string) => {
    const next = q.trim();
    if (!next) {
      router.push({ path: '/explore' });
      return;
    }
    router.push({ path: '/explore', query: { q: next } });
  };

  const backToExplore = () => {
    router.push({ path: '/explore' });
  };

  const retrySearch = () => {
    if (dataError.value) {
      void loadExploreData();
      return;
    }
    if (!isSearching.value) return;
    router.push({
      path: '/explore',
      query: {
        q: searchQuery.value,
        sort: activeSort.value,
        tag:
          activeSearchTag.value === '全部' ? undefined : activeSearchTag.value,
      },
    });
  };

  const setSort = (sort: 'newest' | 'hot') => {
    if (!isSearching.value) return;
    router.push({
      path: '/explore',
      query: {
        q: searchQuery.value,
        sort,
        tag:
          activeSearchTag.value === '全部' ? undefined : activeSearchTag.value,
      },
    });
  };

  const setSearchTag = (tag: string) => {
    if (!isSearching.value) return;
    router.push({
      path: '/explore',
      query: {
        q: searchQuery.value,
        sort: activeSort.value,
        tag: tag === '全部' ? undefined : tag,
      },
    });
  };

  const selectCategory = (cat: string) => {
    activeCategory.value = cat;
  };

  const filteredItems = computed(() => {
    let items = [...exploreItems.value];

    if (!isSearching.value) {
      items = items.filter((item) =>
        matchesCategory(item, activeCategory.value)
      );
    }

    const q = searchQuery.value.toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          item.author.username.toLowerCase().includes(q)
      );
    }

    if (activeSearchTag.value !== '全部') {
      items = items.filter((item) =>
        matchesCategory(item, activeSearchTag.value)
      );
    }

    items.sort((left, right) => {
      const leftSeed = getItemSeed(left.id);
      const rightSeed = getItemSeed(right.id);

      if (activeSort.value === 'hot') {
        const leftHot = left.tags.length * 100 + left.imageHeight + leftSeed;
        const rightHot =
          right.tags.length * 100 + right.imageHeight + rightSeed;
        return rightHot - leftHot;
      }

      return rightSeed - leftSeed;
    });

    return items;
  });

  const contentState = computed<SearchState>(() => {
    if (searchState.value !== 'success') return searchState.value;
    if (filteredItems.value.length === 0) return 'empty';
    return 'success';
  });

  const goToDetail = (id: string) => {
    router.push({ path: `/image/${id}` });
  };

  const goToAuthorProfile = (userId: number) => {
    router.push({ path: `/u/${userId}/boards` });
  };

  return {
    activeCategory,
    categories,
    searchTags,
    relatedSearches,
    filteredItems,
    searchQuery,
    isSearching,
    searchState,
    contentState,
    activeSort,
    activeSearchTag,
    loadExploreData,
    setSearchQuery,
    backToExplore,
    retrySearch,
    setSort,
    setSearchTag,
    selectCategory,
    goToDetail,
    goToAuthorProfile,
  };
}
