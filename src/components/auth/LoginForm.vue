<template>
  <div class="auth-card">
    <h2 class="auth-card__title">欢迎登录</h2>

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

      <div class="auth-link-row">
        <el-button
          link
          type="primary"
          class="auth-link-btn"
          @click="emit('forgot-password')"
        >
          忘记密码？
        </el-button>
      </div>

      <el-form-item>
        <el-button
          type="primary"
          data-testid="login-submit-btn"
          class="auth-submit-btn login-btn"
          size="large"
          :loading="isLoggingIn"
          native-type="submit"
        >
          {{ loginBtnText }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="auth-link-meta">
      <p>
        还没有账号？
        <el-button
          link
          type="primary"
          class="auth-link-btn"
          data-testid="register-btn"
          @click="emit('register')"
        >
          立即注册
        </el-button>
      </p>
      <el-button
        link
        type="primary"
        class="auth-link-btn auth-link-btn--guest"
        data-testid="guest-browse-btn"
        @click="emit('browse-as-guest')"
      >
        随便看看
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, Message } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{
  isLoggingIn: boolean;
}>();

const emit = defineEmits<{
  (e: 'login', payload: { email: string; password: string }): void;
  (e: 'forgot-password'): void;
  (e: 'register'): void;
  (e: 'browse-as-guest'): void;
}>();

const formRef = ref<FormInstance>();

const form = reactive({
  email: '',
  password: '',
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
  emit('login', {
    email: form.email,
    password: form.password,
  });
};
</script>

<style scoped>
.login-btn {
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
}

.auth-link-btn--guest {
  margin-top: var(--ds-space-1);
}
</style>
