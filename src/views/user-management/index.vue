<script setup lang="ts">
import { getUserList } from '../../api/users';
import type {
  User,
  UserSearchForm as SearchFormType,
  Pagination,
  UserForm as UserFormType,
} from '../../types/user';

import UserSearchForm from '../../components/users/UserSearchForm.vue';
import UserTable from '../../components/users/UserTable.vue';
import UserEditDialog from '../../components/users/UserEditDialog.vue';

const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);

const searchForm = reactive<SearchFormType>({
  username: '',
  email: '',
  status: '',
});

const pagination = reactive<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0,
});

const userForm = reactive<UserFormType>({
  id: null,
  username: '',
  email: '',
  password: '',
  role: '用户',
  status: 'active',
});

const tableData = ref<User[]>([]);

const handleSearch = () => {
  pagination.page = 1;
  loadUsers();
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.email = '';
  searchForm.status = '';
  pagination.page = 1;
  loadUsers();
};

const handleAdd = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const handleEdit = (row: User) => {
  isEdit.value = true;
  Object.assign(userForm, row);
  dialogVisible.value = true;
};

const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('删除成功');
    })
    .catch(() => {});
};

const handleStatusChange = (row: User) => {
  ElMessage.success(`用户 "${row.username}" 状态已更新`);
};

const handleViewPermissions = (row: User) => {
  ElMessage.info(`查看用户 "${row.username}" 的权限`);
};

const handleSubmit = () => {
  ElMessage.success(isEdit.value ? '编辑成功' : '添加成功');
  dialogVisible.value = false;
};

const handleDialogClose = () => {
  resetForm();
};

const resetForm = () => {
  userForm.id = null;
  userForm.username = '';
  userForm.email = '';
  userForm.password = '';
  userForm.role = '用户';
  userForm.status = 'active';
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.page = 1;
  loadUsers();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadUsers();
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const result = await getUserList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      username: searchForm.username,
      email: searchForm.email,
      status: searchForm.status,
    });
    tableData.value = result?.list || [];
    pagination.total = result?.total || 0;
  } catch (error) {
    console.error('Failed to load users:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div class="user-management">
    <UserSearchForm
      v-model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <UserTable
      v-model:pagination="pagination"
      :table-data="tableData"
      :loading="loading"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDelete"
      @status-change="handleStatusChange"
      @view-permissions="handleViewPermissions"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <UserEditDialog
      v-model:visible="dialogVisible"
      v-model:user-form="userForm"
      :is-edit="isEdit"
      @submit="handleSubmit"
      @close="handleDialogClose"
    />
  </div>
</template>

<style scoped>
.user-management {
  min-height: 100%;
}
</style>
