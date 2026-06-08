<template>
  <div class="auth-page login-page starry-theme">
    <StarryBackground ref="starryBg" />

    <!-- Main content -->
    <div class="auth-page__container">
      <div class="auth-page__header">
        <h1>Pix Space</h1>
        <p>
          进入您的专属像素空间。在这里，管理与探索每一份视觉资产的无限可能。
        </p>
      </div>

      <LoginForm
        :is-logging-in="isLoggingIn"
        @login="handleLogin"
        @forgot-password="handleForgotPassword"
        @register="handleRegister"
        @browse-as-guest="handleBrowseAsGuest"
      />

      <div class="footer">
        <p>
          &copy; {{ new Date().getFullYear() }} Pix Space. 保留所有权利。 |
          服务条款 | 隐私政策
        </p>
        <p>
          由 Pix Space 团队用
          <span class="footer-heart">&hearts;</span>
          制作
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../../../stores/user';
import { login as loginApi } from '../../../api/user';
import StarryBackground from '../../../components/StarryBackground.vue';
import LoginForm from '../../../components/auth/LoginForm.vue';
import type { AuthSessionResult } from '../../../types/auth';
import { sanitizeRedirectPath } from '../../../utils/auth';

// UI state
const isLoggingIn = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const starryBg = ref<InstanceType<typeof StarryBackground> | null>(null);

onMounted(() => {
  if (route.query.registered === '1') {
    ElMessage.success('注册成功，请使用新账号登录');
  }
});

const handleForgotPassword = () => {
  router.push('/forgot-password');
};

const handleRegister = () => {
  router.push('/register');
};

const handleBrowseAsGuest = () => {
  router.push('/explore');
};

const handleLogin = async (payload: { email: string; password: string }) => {
  isLoggingIn.value = true;

  starryBg.value?.triggerBurst?.();

  try {
    const result = (await loginApi({
      email: payload.email,
      password: payload.password,
    })) as AuthSessionResult;

    const user = result?.user;

    if (user) {
      userStore.login(user);
      router.push(sanitizeRedirectPath(route.query.redirect, '/explore'));
      return;
    }

    ElMessage.error('登录失败：接口返回缺少用户信息');
  } catch (error) {
    const message = (error as { message?: string } | undefined)?.message;
    ElMessage.error(message || '登录失败，请检查邮箱和密码');
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped>
.auth-page__header p {
  max-width: 800px;
}

.footer {
  margin-top: var(--ds-space-9);
  text-align: center;
  color: var(--ds-color-text-muted);
  font-size: 0.9rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.footer-heart {
  color: var(--ds-color-brand-accent);
}
</style>
