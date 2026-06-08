import { createUser, updateUser } from '../../../api/users';
import { useUserStore } from '../../../stores/user';
import type { Pagination, User, UserForm } from '../../../types/user';

interface UseUserManagementDialogOptions {
  pagination: Pagination;
  loadUsers: () => Promise<void>;
}

export function useUserManagementDialog(
  options: UseUserManagementDialogOptions
) {
  const userStore = useUserStore();
  const dialogVisible = ref(false);
  const dialogSubmitting = ref(false);
  const isEdit = ref(false);
  const editingUserId = ref<number | null>(null);
  const editingUserRole = ref<UserForm['role']>('user');
  const editingUserStatus = ref<UserForm['status']>('active');

  const userForm = reactive<UserForm>({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });

  const resetForm = () => {
    editingUserId.value = null;
    editingUserRole.value = 'user';
    editingUserStatus.value = 'active';
    userForm.username = '';
    userForm.email = '';
    userForm.password = '';
    userForm.role = 'user';
    userForm.status = 'active';
  };

  const handleAdd = () => {
    isEdit.value = false;
    editingUserId.value = null;
    resetForm();
    dialogVisible.value = true;
  };

  const handleEdit = (row: User) => {
    isEdit.value = true;
    editingUserId.value = row.id;
    editingUserRole.value = row.role;
    editingUserStatus.value = row.status;
    userForm.username = row.username;
    userForm.email = row.email;
    userForm.password = '';
    userForm.role = row.role;
    userForm.status = row.status;
    dialogVisible.value = true;
  };

  const isEditingCurrentUser = computed(() => {
    return editingUserId.value !== null && editingUserId.value === userStore.id;
  });

  const buildSubmitPayload = (): UserForm => {
    const payload: UserForm = {
      username: userForm.username,
      email: userForm.email,
      role: isEditingCurrentUser.value ? editingUserRole.value : userForm.role,
      status: isEditingCurrentUser.value
        ? editingUserStatus.value
        : userForm.status,
    };

    const password = userForm.password?.trim();
    if (password) {
      payload.password = password;
    }

    return payload;
  };

  const handleSubmit = async () => {
    dialogSubmitting.value = true;
    try {
      const payload = buildSubmitPayload();
      if (isEdit.value && editingUserId.value !== null) {
        await updateUser(editingUserId.value, payload);
        ElMessage.success('用户更新成功');
      } else {
        await createUser(payload);
        ElMessage.success('用户创建成功');
      }
      dialogVisible.value = false;
      options.pagination.page = 1;
      await options.loadUsers();
      resetForm();
    } catch {
      // request layer handles error notification
    } finally {
      dialogSubmitting.value = false;
    }
  };

  const handleDialogClose = () => {
    resetForm();
  };

  return {
    dialogVisible,
    dialogSubmitting,
    isEdit,
    isEditingCurrentUser,
    userForm,
    handleAdd,
    handleEdit,
    handleSubmit,
    handleDialogClose,
  };
}
