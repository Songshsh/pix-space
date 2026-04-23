<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { UserForm } from '../../types/user';

const props = defineProps<{
  isEdit: boolean;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const userForm = defineModel<UserForm>('userForm', { required: true });

const emit = defineEmits<{
  (e: 'submit'): void;
  (e: 'close'): void;
}>();

const formRef = ref<FormInstance | null>(null);

const formRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
};

const dialogTitle = computed(() => (props.isEdit ? '编辑用户' : '添加用户'));

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    emit('submit');
  } catch {
    // 校验失败，无需额外处理，Element Plus 会自动显示错误信息
  }
};

const handleClose = () => {
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  emit('close');
};
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="userForm"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input
          v-model="userForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="userForm.role" placeholder="请选择角色">
          <el-option label="管理员" value="管理员" />
          <el-option label="编辑" value="编辑" />
          <el-option label="用户" value="用户" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="userForm.status">
          <el-radio label="active">启用</el-radio>
          <el-radio label="inactive">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>
