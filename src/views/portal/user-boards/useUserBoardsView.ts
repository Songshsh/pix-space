import {
  getUserBoardsPage,
  getUserBoardsSummary,
  getUserLikesPage,
  getUserUploadsPage,
} from '../../../api/user-boards';
import { useRequestSequencer } from '../../../composables/requestSequencer';
import { useUserStore } from '../../../stores/user';
import type {
  Board,
  LikedImage,
  TabKey,
  UploadImage,
  UploadImageStatus,
  UserBoardsSummary,
} from '../../../types/user-boards';
import { createPagedListState } from './usePagedListState';

export type UserBoardsViewState =
  | 'loading'
  | 'error'
  | 'empty'
  | 'notfound'
  | 'success';

export function useUserBoardsView() {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const userId = computed(() => Number(route.params.userId || 0));
  const isValidUserId = computed(() => {
    return Number.isInteger(userId.value) && userId.value > 0;
  });
  const isOwnerView = computed(() => {
    return userStore.id !== null && userStore.id === userId.value;
  });
  const tabQueryValue = computed<TabKey>(() => {
    const value = route.query.tab;
    if (value === 'uploads') return 'uploads';
    if (value === 'likes' && isOwnerView.value) return 'likes';
    return 'boards';
  });

  const activeTab = ref<TabKey>(tabQueryValue.value);
  const summaryLoading = ref(true);
  const summaryError = ref<string | null>(null);
  const notFound = ref(false);

  const profile = ref<UserBoardsSummary['profile']>({
    id: 0,
    username: '',
    bio: '',
  });

  const summaryStats = ref<UserBoardsSummary['stats']>({
    publicBoards: 0,
    publicUploads: 0,
    likes: 0,
  });

  const boardsState = reactive(createPagedListState<Board>());
  const uploadsState = reactive(createPagedListState<UploadImage>());
  const likesState = reactive(createPagedListState<LikedImage>());

  const uploadsSearch = ref('');
  const likesSearch = ref('');
  const uploadsSort = ref('最新');
  const summarySequencer = useRequestSequencer();
  const boardsSequencer = useRequestSequencer();
  const uploadsSequencer = useRequestSequencer();
  const likesSequencer = useRequestSequencer();
  let uploadsSearchTimer: ReturnType<typeof setTimeout> | undefined;
  let likesSearchTimer: ReturnType<typeof setTimeout> | undefined;

  const clearSearchTimers = () => {
    if (uploadsSearchTimer) {
      clearTimeout(uploadsSearchTimer);
      uploadsSearchTimer = undefined;
    }
    if (likesSearchTimer) {
      clearTimeout(likesSearchTimer);
      likesSearchTimer = undefined;
    }
  };

  const invalidateListRequests = () => {
    void boardsSequencer.next();
    void uploadsSequencer.next();
    void likesSequencer.next();
  };

  const stats = computed(() => {
    const baseStats = [
      {
        value: summaryStats.value.publicBoards,
        label: '公开画板',
      },
      {
        value: summaryStats.value.publicUploads,
        label: '公开图片',
      },
    ];
    if (!isOwnerView.value) {
      return baseStats;
    }
    return [...baseStats, { value: summaryStats.value.likes, label: '赞过' }];
  });

  const currentTabState = computed(() => {
    if (activeTab.value === 'boards') return boardsState;
    if (activeTab.value === 'uploads') return uploadsState;
    return likesState;
  });

  const isCurrentTabEmpty = computed(() => {
    return (
      currentTabState.value.initialized &&
      !currentTabState.value.loading &&
      currentTabState.value.items.length === 0
    );
  });

  const hasBlockingTabError = computed(() => {
    return (
      !!currentTabState.value.error &&
      !currentTabState.value.loading &&
      !currentTabState.value.initialized &&
      currentTabState.value.items.length === 0
    );
  });

  const viewState = computed<UserBoardsViewState>(() => {
    if (summaryLoading.value || currentTabState.value.loading) return 'loading';
    if (notFound.value) return 'notfound';
    if (summaryError.value || hasBlockingTabError.value) return 'error';
    if (isCurrentTabEmpty.value) return 'empty';
    return 'success';
  });

  const activeCountText = computed(() => {
    if (activeTab.value === 'uploads') {
      return `${uploadsState.total} 张图片`;
    }
    if (activeTab.value === 'likes') {
      return `${likesState.total} 张图片`;
    }
    return '';
  });

  const stateTitle = computed(() => {
    if (viewState.value === 'notfound') return '用户不存在';
    if (activeTab.value === 'uploads') return '暂无上传';
    if (activeTab.value === 'likes') return '暂无赞过';
    return '暂无画板';
  });

  const stateDesc = computed(() => {
    if (viewState.value === 'notfound') {
      return '该用户可能已被删除，或链接无效';
    }
    if (activeTab.value === 'uploads') {
      return isOwnerView.value
        ? '使用右上角"上传"添加图片'
        : '这个用户还没有公开上传内容';
    }
    if (activeTab.value === 'likes') {
      return isOwnerView.value
        ? '去发现页看看灵感'
        : '这个用户还没有公开赞过内容';
    }
    return isOwnerView.value ? '创建你的第一个画板' : '这个用户还没有公开画板';
  });

  const stateIcon = computed(() => {
    if (viewState.value === 'notfound') return '?';
    if (activeTab.value === 'uploads') return '📷';
    if (activeTab.value === 'likes') return '❤️';
    return '🗂️';
  });

  const showStatePrimaryAction = computed(() => {
    if (viewState.value === 'error') return true;
    if (viewState.value === 'notfound') return true;
    if (viewState.value !== 'empty') return false;
    if (activeTab.value === 'likes') return true;
    if (activeTab.value === 'boards') return isOwnerView.value;
    return false;
  });

  const statePrimaryActionText = computed(() => {
    if (viewState.value === 'error') return '重试';
    if (viewState.value === 'notfound') return '去发现页';
    if (activeTab.value === 'likes') return '去发现页';
    return '新建画板';
  });

  const resetSummaryState = () => {
    profile.value = {
      id: 0,
      username: '',
      bio: '',
    };
    summaryStats.value = {
      publicBoards: 0,
      publicUploads: 0,
      likes: 0,
    };
  };

  const resetTabState = () => {
    Object.assign(
      boardsState,
      createPagedListState<Board>(boardsState.pageSize)
    );
    Object.assign(
      uploadsState,
      createPagedListState<UploadImage>(uploadsState.pageSize)
    );
    Object.assign(
      likesState,
      createPagedListState<LikedImage>(likesState.pageSize)
    );
  };

  const resetTabFilters = () => {
    uploadsSearch.value = '';
    likesSearch.value = '';
    uploadsSort.value = '最新';
  };

  const loadSummary = async () => {
    const requestId = summarySequencer.next();
    if (!isValidUserId.value) {
      resetSummaryState();
      summaryLoading.value = false;
      summaryError.value = null;
      notFound.value = true;
      return false;
    }

    summaryLoading.value = true;
    summaryError.value = null;
    notFound.value = false;
    try {
      const result = await getUserBoardsSummary(userId.value, {
        silentError: true,
      });
      if (requestId !== summarySequencer.currentSeq) return;
      profile.value = result.profile;
      summaryStats.value = result.stats;
      return true;
    } catch (error) {
      if (requestId !== summarySequencer.currentSeq) return;
      const normalized = error as { status?: number; message?: string };
      if (normalized.status === 404) {
        resetSummaryState();
        notFound.value = true;
        return false;
      }
      resetSummaryState();
      summaryError.value = normalized.message || '加载失败';
      return false;
    } finally {
      if (requestId === summarySequencer.currentSeq) {
        summaryLoading.value = false;
      }
    }
  };

  const loadBoardsPage = async (nextPage = 1) => {
    const requestId = boardsSequencer.next();
    boardsState.error = null;
    if (nextPage === 1) {
      boardsState.loading = true;
    } else {
      boardsState.loadingMore = true;
    }
    try {
      const result = await getUserBoardsPage(
        userId.value,
        { page: nextPage, pageSize: boardsState.pageSize },
        { silentError: true }
      );
      if (requestId !== boardsSequencer.currentSeq) return;
      boardsState.items =
        nextPage === 1 ? result.list : [...boardsState.items, ...result.list];
      boardsState.page = result.page;
      boardsState.total = result.total;
      boardsState.hasMore = result.hasMore;
      boardsState.initialized = true;
    } catch (error) {
      if (requestId !== boardsSequencer.currentSeq) return;
      boardsState.error = error instanceof Error ? error.message : '加载失败';
    } finally {
      if (requestId === boardsSequencer.currentSeq) {
        boardsState.loading = false;
        boardsState.loadingMore = false;
      }
    }
  };

  const loadUploadsPage = async (nextPage = 1) => {
    const requestId = uploadsSequencer.next();
    uploadsState.error = null;
    if (nextPage === 1) {
      uploadsState.loading = true;
    } else {
      uploadsState.loadingMore = true;
    }
    try {
      const result = await getUserUploadsPage(
        userId.value,
        {
          page: nextPage,
          pageSize: uploadsState.pageSize,
          keyword: uploadsSearch.value.trim(),
          sort: uploadsSort.value === '最早' ? 'oldest' : 'newest',
        },
        { silentError: true }
      );
      if (requestId !== uploadsSequencer.currentSeq) return;
      uploadsState.items =
        nextPage === 1 ? result.list : [...uploadsState.items, ...result.list];
      uploadsState.page = result.page;
      uploadsState.total = result.total;
      uploadsState.hasMore = result.hasMore;
      uploadsState.initialized = true;
    } catch (error) {
      if (requestId !== uploadsSequencer.currentSeq) return;
      uploadsState.error = error instanceof Error ? error.message : '加载失败';
    } finally {
      if (requestId === uploadsSequencer.currentSeq) {
        uploadsState.loading = false;
        uploadsState.loadingMore = false;
      }
    }
  };

  const loadLikesPage = async (nextPage = 1) => {
    const requestId = likesSequencer.next();
    likesState.error = null;
    if (nextPage === 1) {
      likesState.loading = true;
    } else {
      likesState.loadingMore = true;
    }
    try {
      const result = await getUserLikesPage(
        userId.value,
        {
          page: nextPage,
          pageSize: likesState.pageSize,
          keyword: likesSearch.value.trim(),
        },
        { silentError: true }
      );
      if (requestId !== likesSequencer.currentSeq) return;
      likesState.items =
        nextPage === 1 ? result.list : [...likesState.items, ...result.list];
      likesState.page = result.page;
      likesState.total = result.total;
      likesState.hasMore = result.hasMore;
      likesState.initialized = true;
    } catch (error) {
      if (requestId !== likesSequencer.currentSeq) return;
      likesState.error = error instanceof Error ? error.message : '加载失败';
    } finally {
      if (requestId === likesSequencer.currentSeq) {
        likesState.loading = false;
        likesState.loadingMore = false;
      }
    }
  };

  const handleRetry = () => {
    void loadOverview();
  };

  const ensureActiveTabLoaded = async () => {
    if (!isValidUserId.value || notFound.value) return;
    if (activeTab.value === 'boards' && !boardsState.initialized) {
      await loadBoardsPage(1);
      return;
    }
    if (activeTab.value === 'uploads' && !uploadsState.initialized) {
      await loadUploadsPage(1);
      return;
    }
    if (activeTab.value === 'likes' && !likesState.initialized) {
      await loadLikesPage(1);
    }
  };

  const reloadActiveTab = async () => {
    if (activeTab.value === 'boards') {
      Object.assign(
        boardsState,
        createPagedListState<Board>(boardsState.pageSize)
      );
      await loadBoardsPage(1);
      return;
    }
    if (activeTab.value === 'uploads') {
      Object.assign(
        uploadsState,
        createPagedListState<UploadImage>(uploadsState.pageSize)
      );
      await loadUploadsPage(1);
      return;
    }
    Object.assign(
      likesState,
      createPagedListState<LikedImage>(likesState.pageSize)
    );
    await loadLikesPage(1);
  };

  const loadOverview = async () => {
    const summaryLoaded = await loadSummary();
    if (!summaryLoaded) return;
    resetTabState();
    await reloadActiveTab();
  };

  const loadMoreBoards = async () => {
    if (
      !boardsState.hasMore ||
      boardsState.loading ||
      boardsState.loadingMore
    ) {
      return;
    }
    await loadBoardsPage(boardsState.page + 1);
  };

  const loadMoreUploads = async () => {
    if (
      !uploadsState.hasMore ||
      uploadsState.loading ||
      uploadsState.loadingMore
    ) {
      return;
    }
    await loadUploadsPage(uploadsState.page + 1);
  };

  const loadMoreLikes = async () => {
    if (!likesState.hasMore || likesState.loading || likesState.loadingMore) {
      return;
    }
    await loadLikesPage(likesState.page + 1);
  };

  const reloadUploads = async () => {
    Object.assign(
      uploadsState,
      createPagedListState<UploadImage>(uploadsState.pageSize)
    );
    await loadUploadsPage(1);
  };

  const reloadLikes = async () => {
    Object.assign(
      likesState,
      createPagedListState<LikedImage>(likesState.pageSize)
    );
    await loadLikesPage(1);
  };

  const handleUploadsSortCommand = (command: string) => {
    uploadsSort.value = command;
    if (uploadsState.initialized) {
      void reloadUploads();
    }
  };

  const goBoard = (id: string) => {
    router.push({ path: `/board/${id}` });
  };

  const goImageDetail = (id: string) => {
    router.push({ path: `/image/${id}` });
  };

  const goExplore = () => {
    router.push({ path: '/explore' });
  };

  const handleStatePrimaryAction = (onCreateBoard: () => void) => {
    if (viewState.value === 'error') {
      handleRetry();
      return;
    }
    if (viewState.value === 'notfound') {
      goExplore();
      return;
    }
    if (activeTab.value === 'likes') {
      goExplore();
      return;
    }
    onCreateBoard();
  };

  const getUploadStatusText = (status: UploadImageStatus) => {
    if (status === 'private') return '私有';
    if (status === 'pending') return '待审核';
    return '已公开';
  };

  const getBoardVisibilityText = (visibility: Board['visibility']) => {
    return visibility === 'public' ? '公开' : '私有';
  };

  watch(
    userId,
    () => {
      clearSearchTimers();
      invalidateListRequests();
      resetTabFilters();
      activeTab.value = tabQueryValue.value;
      resetSummaryState();
      resetTabState();
      void loadOverview();
    },
    { immediate: true }
  );

  watch(tabQueryValue, (value) => {
    if (value !== activeTab.value) {
      activeTab.value = value;
    }
  });

  watch(activeTab, (value) => {
    clearSearchTimers();
    const nextQuery = { ...route.query };
    if (value === 'boards') {
      delete nextQuery.tab;
    } else {
      nextQuery.tab = value;
    }
    if (nextQuery.tab !== route.query.tab) {
      void router.replace({
        path: route.path,
        query: nextQuery,
      });
    }
    void ensureActiveTabLoaded();
  });

  watch(uploadsSearch, () => {
    if (activeTab.value !== 'uploads' || !uploadsState.initialized) return;
    clearSearchTimers();
    uploadsSearchTimer = setTimeout(() => {
      void reloadUploads();
    }, 300);
  });

  watch(likesSearch, () => {
    if (activeTab.value !== 'likes' || !likesState.initialized) return;
    clearSearchTimers();
    likesSearchTimer = setTimeout(() => {
      void reloadLikes();
    }, 300);
  });

  onBeforeUnmount(() => {
    clearSearchTimers();
  });

  return {
    activeTab,
    userId,
    isOwnerView,
    profile,
    stats,
    uploadsSearch,
    likesSearch,
    uploadsSort,
    summaryLoading,
    summaryError,
    notFound,
    boardsState,
    uploadsState,
    likesState,
    viewState,
    activeCountText,
    stateTitle,
    stateDesc,
    stateIcon,
    showStatePrimaryAction,
    statePrimaryActionText,
    loadOverview,
    handleRetry,
    handleUploadsSortCommand,
    handleStatePrimaryAction,
    goBoard,
    goImageDetail,
    loadMoreBoards,
    loadMoreUploads,
    loadMoreLikes,
    reloadUploads,
    reloadLikes,
    getUploadStatusText,
    getBoardVisibilityText,
  };
}
