<template>
  <div class="login-card">
    <h2>欢迎登录</h2>

    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          type="email"
          data-testid="email-input"
          placeholder="请输入您的邮箱"
          size="large"
        >
          <template #prefix>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          data-testid="password-input"
          placeholder="请输入您的密码"
          size="large"
          show-password
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <div class="remember-forgot">
        <el-checkbox v-model="form.remember">保持登录状态</el-checkbox>
        <a href="#" class="forgot-password">忘记密码？</a>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          data-testid="login-submit-btn"
          class="login-btn"
          size="large"
          :loading="isLoggingIn"
          native-type="submit"
        >
          {{ loginBtnText }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="signup-link">
      <p>还没有账号？ <a href="#">立即注册</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { Lock, Message } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{
  isLoggingIn: boolean;
}>();

const emit = defineEmits<{
  (e: 'login', payload: { email: string; password: string }): void;
}>();

const formRef = ref<FormInstance>();

const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const formRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
});

const loginBtnText = computed(() => {
  return props.isLoggingIn ? '正在登录...' : '立即登录';
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;
  emit('login', { email: form.email, password: form.password });
};
</script>

<style scoped>
.login-card {
  background: var(--ds-color-white-5);
  backdrop-filter: blur(10px);
  border: 1px solid var(--ds-color-white-10);
  border-radius: var(--ds-radius-4);
  padding: var(--ds-space-8);
  width: 100%;
  max-width: 450px;
  box-shadow:
    0 20px 60px var(--ds-color-black-30),
    0 0 0 1px var(--ds-color-white-5),
    inset 0 0 20px var(--ds-color-white-2);
  animation: fadeInUp 1s ease-out 0.3s both;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-primary-dark-2),
    var(--el-color-primary-light-3)
  );
  border-radius: var(--ds-radius-4) var(--ds-radius-4) 0 0;
}

.login-card h2 {
  font-size: 2rem;
  margin-bottom: var(--ds-space-6);
  color: var(--ds-color-text-inverse);
  text-align: center;
}

.login-card :deep(.el-form-item) {
  margin-bottom: var(--ds-space-5);
}

.login-card :deep(.el-input__wrapper) {
  background: var(--ds-color-white-7);
  border: 1px solid var(--ds-color-white-10);
  box-shadow: none;
  border-radius: var(--ds-radius-2);
  height: 48px;
}

.login-card :deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--el-color-primary) 20%, transparent);
  background: var(--ds-color-white-10);
}

.login-card :deep(.el-input__inner) {
  color: var(--ds-color-text-inverse);
}

.login-card :deep(.el-input__inner::placeholder) {
  color: var(--ds-color-white-40);
}

.login-card :deep(.el-input__prefix .el-icon) {
  color: var(--ds-color-white-40);
}

.login-card :deep(.el-form-item__error) {
  color: var(--ds-color-danger);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ds-space-6);
}

.login-card :deep(.el-checkbox__label) {
  color: var(--ds-color-text-muted);
}

.forgot-password {
  color: var(--el-color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
}

.forgot-password:hover {
  color: var(--el-color-primary-dark-2);
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: var(--ds-radius-2);
  background: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-primary-dark-2)
  );
  border: none;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px
    color-mix(in srgb, var(--el-color-primary) 30%, transparent);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.signup-link {
  text-align: center;
  color: var(--ds-color-text-muted);
  margin-top: var(--ds-space-6);
}

.signup-link a {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
