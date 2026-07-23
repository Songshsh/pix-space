import { getFileList } from '../../../api/file';
import type { FileItem, ListResult } from '../../../types/file';
import { useDebounceFn } from '@vueuse/core';
import { useRequestSequencer } from '../../../composables/requestSequencer';

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface UseFileManagementViewOptions {
  clearSelection: () => void;
}

export function useFileManagementView(options: UseFileManagementViewOptions) {
  const { clearSelection } = options;

  const viewMode = ref<'grid' | 'list'>('grid');
  const searchKeyword = ref('');
  const loading = ref(false);
  const loadError = ref<string | null>(null);

  const pagination = reactive({
    page: 1,
    pageSize: 20,
    total: 100,
  });

  const files = ref<FileItem[]>([]);
  const currentFolderId = ref<string | null>(null);
  const breadcrumbItems = ref<BreadcrumbItem[]>([
    { id: null, name: '我的文件' },
  ]);

  const sequencer = useRequestSequencer();

  const loadFiles = async () => {
    const currentSeq = sequencer.next();
    loading.value = true;
    loadError.value = null;
    try {
      const result = (await getFileList(
        {
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchKeyword.value,
          parentId: currentFolderId.value ?? undefined,
        },
        { silentError: true }
      )) as ListResult<FileItem>;
      if (currentSeq !== sequencer.currentSeq) return;
      files.value = result.list || [];
      pagination.total = result.total || 0;
      clearSelection();
    } catch (err) {
      if (currentSeq !== sequencer.currentSeq) return;
      loadError.value = err instanceof Error ? err.message : '加载文件失败';
    } finally {
      if (currentSeq === sequencer.currentSeq) {
        loading.value = false;
      }
    }
  };

  const syncPaginationAfterDelete = async () => {
    if (files.value.length > 0 || pagination.page <= 1) return;
    pagination.page -= 1;
    await loadFiles();
  };

  const handleOpenFolder = (file: FileItem) => {
    currentFolderId.value = file.id;
    breadcrumbItems.value = [
      ...breadcrumbItems.value,
      { id: file.id, name: file.name },
    ];
    pagination.page = 1;
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = breadcrumbItems.value[index];
    if (!target) return;
    breadcrumbItems.value = breadcrumbItems.value.slice(0, index + 1);
    currentFolderId.value = target.id;
    pagination.page = 1;
  };

  watch(
    () => [pagination.page, pagination.pageSize, currentFolderId.value],
    () => {
      void loadFiles();
    },
    { immediate: true }
  );

  const debouncedSearch = useDebounceFn(() => {
    if (pagination.page !== 1) {
      pagination.page = 1;
      return;
    }
    void loadFiles();
  }, 500);

  watch(searchKeyword, () => {
    debouncedSearch();
  });

  return {
    viewMode,
    searchKeyword,
    loading,
    loadError,
    pagination,
    files,
    currentFolderId,
    breadcrumbItems,
    loadFiles,
    handleOpenFolder,
    handleBreadcrumbClick,
    syncPaginationAfterDelete,
  };
}
