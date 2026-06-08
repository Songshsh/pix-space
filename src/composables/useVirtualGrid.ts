import { useVirtualizer } from '@tanstack/vue-virtual';
import { useElementSize } from '@vueuse/core';
import { scrollContainerKey } from './injectionKeys';

interface UseVirtualGridOptions {
  containerRef: Ref<HTMLElement | null>;
  itemMinWidth: number;
  itemHeight: number;
  gap?: number;
  totalItems: ComputedRef<number>;
}

export function useVirtualGrid(options: UseVirtualGridOptions) {
  const {
    containerRef,
    itemMinWidth,
    itemHeight,
    gap = 16,
    totalItems,
  } = options;

  const scrollElement = ref<HTMLElement | null>(null);
  const { width: containerWidth } = useElementSize(containerRef);

  const columns = computed(() => {
    const width =
      containerWidth.value || (containerRef.value?.clientWidth ?? 1000);
    return Math.max(1, Math.floor((width + gap) / (itemMinWidth + gap)));
  });

  const totalRows = computed(() => Math.ceil(totalItems.value / columns.value));

  const virtualizer = useVirtualizer({
    get count() {
      return totalRows.value;
    },
    getScrollElement: () => scrollElement.value,
    estimateSize: () => itemHeight + gap,
    overscan: 3,
  });

  const getRowItems = <T>(items: T[], rowIndex: number): T[] => {
    const start = rowIndex * columns.value;
    const end = start + columns.value;
    return items.slice(start, end);
  };

  const scrollContainer = inject(scrollContainerKey);

  onMounted(() => {
    if (scrollContainer) {
      scrollElement.value = scrollContainer();
    }
  });

  return {
    columns,
    totalRows,
    virtualizer,
    getRowItems,
  };
}
