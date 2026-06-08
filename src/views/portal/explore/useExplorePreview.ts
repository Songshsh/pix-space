import type { ExploreItem } from '../../../types/explore';
import type { ComputedRef } from 'vue';

interface UseExplorePreviewOptions {
  items: ComputedRef<ExploreItem[]>;
  onViewDetail: (id: string) => void;
}

export function useExplorePreview(options: UseExplorePreviewOptions) {
  const { items, onViewDetail } = options;

  const previewVisible = ref(false);
  const previewIndex = ref(-1);

  const previewItem = computed<ExploreItem | null>(() => {
    return items.value[previewIndex.value] ?? null;
  });

  const canPreviewPrev = computed(() => previewIndex.value > 0);
  const canPreviewNext = computed(() => {
    return (
      previewIndex.value >= 0 && previewIndex.value < items.value.length - 1
    );
  });

  const openPreview = (item: ExploreItem) => {
    previewIndex.value = items.value.findIndex(
      (candidate) => candidate.id === item.id
    );
    previewVisible.value = true;
  };

  const handleViewDetail = (id: string) => {
    onViewDetail(id);
  };

  const showPrevPreview = () => {
    if (!canPreviewPrev.value) return;
    previewIndex.value -= 1;
  };

  const showNextPreview = () => {
    if (!canPreviewNext.value) return;
    previewIndex.value += 1;
  };

  watch(previewVisible, (next) => {
    if (next) return;
    previewIndex.value = -1;
  });

  return {
    previewVisible,
    previewItem,
    canPreviewPrev,
    canPreviewNext,
    openPreview,
    handleViewDetail,
    showPrevPreview,
    showNextPreview,
  };
}
