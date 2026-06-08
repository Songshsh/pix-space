import { getBoardDetail } from '../../../api/boards';
import type { BoardDetail } from '../../../types/board-detail';

export type BoardDetailViewState =
  | 'loading'
  | 'forbidden'
  | 'notfound'
  | 'error'
  | 'empty'
  | 'success';

export function useBoardDetailView() {
  const route = useRoute();
  const router = useRouter();

  const boardId = computed(() => String(route.params.id || ''));
  let detailRequestId = 0;

  const loading = ref(true);
  const loadError = ref<string | null>(null);
  const forbidden = ref(false);
  const notFound = ref(false);
  const boardDetail = ref<BoardDetail | null>(null);

  const authorMeta = computed(() => {
    if (!boardDetail.value) return '';
    const visibilityLabel =
      boardDetail.value.visibility === 'public' ? '公开' : '私有';
    return `${boardDetail.value.owner.username} · ${boardDetail.value.imageCount} 张 · ${visibilityLabel}`;
  });

  const images = computed(() => boardDetail.value?.images ?? []);

  const viewState = computed<BoardDetailViewState>(() => {
    if (loading.value) return 'loading';
    if (forbidden.value) return 'forbidden';
    if (notFound.value) return 'notfound';
    if (loadError.value) return 'error';
    if (boardDetail.value && boardDetail.value.images.length === 0)
      return 'empty';
    return 'success';
  });

  const goBack = () => {
    if (boardDetail.value?.owner.id) {
      router.push({ path: `/u/${boardDetail.value.owner.id}/boards` });
      return;
    }
    router.back();
  };

  const goAuthorProfile = () => {
    if (!boardDetail.value?.owner.id) return;
    router.push({ path: `/u/${boardDetail.value.owner.id}/boards` });
  };

  const goImageDetail = (id: string) => {
    router.push({ path: `/image/${id}` });
  };

  const loadDetail = async () => {
    const requestId = ++detailRequestId;
    if (!boardId.value) {
      notFound.value = true;
      loading.value = false;
      return;
    }

    loading.value = true;
    loadError.value = null;
    forbidden.value = false;
    notFound.value = false;
    boardDetail.value = null;

    try {
      const result = await getBoardDetail(boardId.value, { silentError: true });
      if (requestId !== detailRequestId) return;
      boardDetail.value = result;
    } catch (error) {
      if (requestId !== detailRequestId) return;
      const normalized = error as { status?: number; message?: string };
      if (normalized.status === 403) {
        forbidden.value = true;
      } else if (normalized.status === 404) {
        notFound.value = true;
      } else {
        loadError.value = normalized.message || '加载失败';
      }
    } finally {
      if (requestId === detailRequestId) {
        loading.value = false;
      }
    }
  };

  watch(
    boardId,
    () => {
      void loadDetail();
    },
    { immediate: true }
  );

  return {
    boardDetail,
    authorMeta,
    images,
    viewState,
    loadError,
    loadDetail,
    goBack,
    goAuthorProfile,
    goImageDetail,
  };
}
