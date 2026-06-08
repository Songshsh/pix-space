export interface PagedListState<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  initialized: boolean;
  error: string | null;
}

export function createPagedListState<T>(pageSize = 20): PagedListState<T> {
  return {
    items: [],
    page: 0,
    pageSize,
    total: 0,
    loading: false,
    loadingMore: false,
    hasMore: true,
    initialized: false,
    error: null,
  };
}
