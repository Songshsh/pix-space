<script setup lang="ts">
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import UserSearchForm from '../../../components/users/UserSearchForm.vue';
import UserTable from '../../../components/users/UserTable.vue';
import UserEditDialog from '../../../components/users/UserEditDialog.vue';
import { useUserStore } from '../../../stores/user';
import { useUserManagementDialog } from './useUserManagementDialog';
import { useUserManagementRowActions } from './useUserManagementRowActions';
import { useUserManagementView } from './useUserManagementView';

const userStore = useUserStore();

const {
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
} = useUserManagementView();

const {
  dialogVisible,
  dialogSubmitting,
  isEdit,
  isEditingCurrentUser,
  userForm,
  handleAdd,
  handleEdit,
  handleSubmit,
  handleDialogClose,
} = useUserManagementDialog({
  pagination,
  loadUsers,
});

const { handleDelete, handleStatusChange, handleViewPermissions } =
  useUserManagementRowActions({
    tableData,
    pagination,
    syncPaginationAfterDelete,
  });
</script>

<template>
  <div class="user-management">
    <UserSearchForm
      v-model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    />

    <PageStateBlock
      v-if="loadError && !loading"
      variant="error"
      size="compact"
      title="用户列表加载失败"
      :description="loadError"
      primary-text="重试"
      @primary="loadUsers"
    />

    <UserTable
      v-else
      v-model:pagination="pagination"
      :table-data="tableData"
      :loading="loading"
      :current-user-id="userStore.id"
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
      :disable-role-status="isEditingCurrentUser"
      :submitting="dialogSubmitting"
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
