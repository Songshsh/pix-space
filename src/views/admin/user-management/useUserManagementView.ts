import { getUserList } from '../../../api/users';
import type { Pagination, User, UserSearchForm } from '../../../types/user';

export function useUserManagementView() {
  const loading = ref(false);
  const loadError = ref('');
  let requestSeq = 0;

  const searchForm = reactive<UserSearchForm>({
    username: '',
    email: '',
    status: '',
  });

  const pagination = reactive<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const tableData = ref<User[]>([]);

  const loadUsers = async () => {
    const currentSeq = (requestSeq += 1);
    loading.value = true;
    loadError.value = '';
    try {
      const result = await getUserList(
        {
          page: pagination.page,
          pageSize: pagination.pageSize,
          username: searchForm.username,
          email: searchForm.email,
          status: searchForm.status,
        },
        { silentError: true }
      );
      if (currentSeq !== requestSeq) return;
      tableData.value = result?.list || [];
      pagination.total = result?.total || 0;
    } catch (error) {
      if (currentSeq !== requestSeq) return;
      const normalized = error as { message?: string };
      loadError.value = normalized.message || '用户列表加载失败';
    } finally {
      if (currentSeq === requestSeq) {
        loading.value = false;
      }
    }
  };

  const handleSearch = () => {
    pagination.page = 1;
    void loadUsers();
  };

  const handleReset = () => {
    searchForm.username = '';
    searchForm.email = '';
    searchForm.status = '';
    pagination.page = 1;
    void loadUsers();
  };

  const handleSizeChange = (size: number) => {
    pagination.pageSize = size;
    pagination.page = 1;
    void loadUsers();
  };

  const handleCurrentChange = (page: number) => {
    pagination.page = page;
    void loadUsers();
  };

  const syncPaginationAfterDelete = async () => {
    if (tableData.value.length > 0 || pagination.page <= 1) return;
    pagination.page -= 1;
    await loadUsers();
  };

  onMounted(() => {
    void loadUsers();
  });

  return {
    loading,
    loadError,
    searchForm,
    pagination,
    tableData,
    loadUsers,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    syncPaginationAfterDelete,
  };
}
