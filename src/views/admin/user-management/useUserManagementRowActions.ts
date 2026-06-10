import { deleteUser, updateUserStatus } from '../../../api/users';
import { useUserStore } from '../../../stores/user';
import type { Pagination, User } from '../../../types/user';

interface UseUserManagementRowActionsOptions {
  tableData: Ref<User[]>;
  pagination: Pagination;
  syncPaginationAfterDelete: () => Promise<void>;
}

const permissionSummary: Record<User['role'], string> = {
  admin: '可访问后台全部模块，包括用户管理、系统设置、图片管理与文件管理。',
  user: '不可访问后台管理模块，仅可使用前台内容浏览与个人相关功能。',
  viewer: '仅允许查看受限内容，不可执行后台管理操作。',
};

export function useUserManagementRowActions(
  options: UseUserManagementRowActionsOptions
) {
  const userStore = useUserStore();

  const isCurrentUser = (row: User) => row.id === userStore.id;

  const handleDelete = (row: User) => {
    if (isCurrentUser(row)) {
      ElMessage.warning('不支持删除当前登录账号');
      return;
    }
    ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await deleteUser(row.id);
        options.tableData.value = options.tableData.value.filter(
          (item) => item.id !== row.id
        );
        options.pagination.total = Math.max(0, options.pagination.total - 1);
        await options.syncPaginationAfterDelete();
        ElMessage.success('删除用户成功');
      })
      .catch(() => {});
  };

  const handleStatusChange = async (row: User, newStatus: User['status']) => {
    if (isCurrentUser(row)) {
      ElMessage.warning('不支持修改当前登录账号状态');
      return;
    }
    const previousStatus = row.status;
    try {
      const updated = await updateUserStatus(row.id, { status: newStatus });
      const target = options.tableData.value.find((item) => item.id === row.id);
      if (target) {
        target.status = updated.status;
      }
      ElMessage.success(
        updated.status === 'active' ? '用户已启用' : '用户已禁用'
      );
    } catch {
      // API 层已弹 toast，此处恢复开关状态防止 UI 与实际状态不一致
      const target = options.tableData.value.find((item) => item.id === row.id);
      if (target) {
        target.status = previousStatus;
      }
    }
  };

  const handleViewPermissions = (row: User) => {
    void ElMessageBox.alert(
      permissionSummary[row.role],
      `${row.username} 的权限`,
      {
        confirmButtonText: '知道了',
      }
    );
  };

  return {
    handleDelete,
    handleStatusChange,
    handleViewPermissions,
  };
}
