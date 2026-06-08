import { getImageDetail } from '../../../api/image';
import type { ImageDetail } from '../../../types/image-detail';
import { formatFileSize } from '../../../utils/fileDisplay';

export type ImageDetailViewState =
  | 'loading'
  | 'forbidden'
  | 'notfound'
  | 'error'
  | 'success';

export interface ImageMetaData {
  dimensions?: string;
  format?: string;
  size?: string;
}

export function useImageDetailView() {
  const route = useRoute();
  const router = useRouter();

  const imageId = computed(() => {
    return typeof route.params.id === 'string' ? route.params.id.trim() : '';
  });
  let detailRequestId = 0;

  const loading = ref(true);
  const loadError = ref<string | null>(null);
  const notFound = ref(false);
  const forbidden = ref(false);
  const imageDetail = ref<ImageDetail | null>(null);

  const viewState = computed<ImageDetailViewState>(() => {
    if (loading.value) return 'loading';
    if (forbidden.value) return 'forbidden';
    if (notFound.value) return 'notfound';
    if (loadError.value) return 'error';
    return 'success';
  });

  const imageMetaData = computed<ImageMetaData>(() => {
    const size = imageDetail.value?.size
      ? formatFileSize(imageDetail.value.size)
      : undefined;
    const url = imageDetail.value?.url || '';
    const match = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
    const format = match?.[1] ? match[1].toUpperCase() : undefined;
    return {
      dimensions: undefined,
      format,
      size,
    };
  });

  const loadDetail = async () => {
    const requestId = ++detailRequestId;
    if (!imageId.value) {
      loadError.value = null;
      notFound.value = true;
      forbidden.value = false;
      imageDetail.value = null;
      loading.value = false;
      return;
    }

    loading.value = true;
    loadError.value = null;
    notFound.value = false;
    forbidden.value = false;
    imageDetail.value = null;

    try {
      const result = await getImageDetail(imageId.value, { silentError: true });
      if (requestId !== detailRequestId) return;
      imageDetail.value = result;
    } catch (error) {
      if (requestId !== detailRequestId) return;
      const normalized = error as { status?: number; message?: string };
      if (normalized.status === 404) {
        notFound.value = true;
      } else if (normalized.status === 403) {
        forbidden.value = true;
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
    imageId,
    () => {
      void loadDetail();
    },
    { immediate: true }
  );

  const handleRetry = () => {
    void loadDetail();
  };

  const handleBack = () => {
    router.push('/explore');
  };

  return {
    route,
    router,
    imageDetail,
    viewState,
    loadError,
    imageMetaData,
    loadDetail,
    handleRetry,
    handleBack,
  };
}
