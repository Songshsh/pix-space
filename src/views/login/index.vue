<template>
  <div class="login-page">
    <StarryBackground ref="starryBg" />

    <!-- Main content -->
    <div class="container">
      <div class="header">
        <h1>PixSpace</h1>
        <p>
          进入您的专属像素空间。在这里，管理与探索每一份视觉资产的无限可能。
        </p>
      </div>

      <LoginForm :is-logging-in="isLoggingIn" @login="handleLogin" />

      <div class="footer">
        <p>
          &copy; {{ new Date().getFullYear() }} PixSpace. 保留所有权利。 |
          服务条款 | 隐私政策
        </p>
        <p>
          由 PixSpace 团队用
          <span :style="{ color: 'var(--ds-color-brand-accent)' }"
            >&hearts;</span
          >
          制作
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { login as loginApi } from '../../api/user';
import StarryBackground from '../../components/StarryBackground.vue';
import LoginForm from '../../components/auth/LoginForm.vue';
import { ElMessage } from 'element-plus';
import type { LoginResult } from '../../types/auth';

// UI state
const isLoggingIn = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const starryBg = ref<InstanceType<typeof StarryBackground> | null>(null);
const allowMockAuth = import.meta.env.VITE_ALLOW_MOCK_AUTH === 'true';

const handleLogin = async (payload: { email: string; password: string }) => {
  isLoggingIn.value = true;

  if (starryBg.value) {
    starryBg.value.triggerBurst();
  }

  try {
    const result = (await loginApi({
      email: payload.email,
      password: payload.password,
    })) as LoginResult;

    const token = result?.token;
    const user = result?.user || {
      name: payload.email.split('@')[0] || 'Space Explorer',
      email: payload.email,
    };

    if (token) {
      userStore.login(user, token);
      router.push((route.query.redirect || '/admin/dashboard').toString());
      return;
    }

    ElMessage.error('登录失败：接口返回缺少 token');
  } catch (error: unknown) {
    if (allowMockAuth) {
      ElMessage.info('登录接口不可用，已使用模拟登录');
      const user = {
        name: payload.email.split('@')[0] || 'Space Explorer',
        email: payload.email,
        role: 'user',
      };
      const token = `mock.${btoa(JSON.stringify(user))}`;
      userStore.login(user, token);
      router.push((route.query.redirect || '/admin/dashboard').toString());
      return;
    }
    console.error('Login failed', error);
  } finally {
    isLoggingIn.value = false;
  }
};
</script>

<style scoped>
.login-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    var(--ds-color-space-deep),
    var(--ds-color-space-mid),
    var(--ds-color-space-darker)
  );
  color: var(--ds-color-text-inverse);
  overflow-x: hidden;
  position: relative;

  --ds-color-starry-accent: var(--ds-color-brand-accent);
  --el-color-primary: var(--ds-color-brand-primary);
  --el-color-primary-dark-2: var(--ds-color-brand-primary-dark);
  --el-color-primary-light-1: color-mix(
    in srgb,
    var(--el-color-primary) 90%,
    white
  );
  --el-color-primary-light-2: color-mix(
    in srgb,
    var(--el-color-primary) 80%,
    white
  );
  --el-color-primary-light-3: color-mix(
    in srgb,
    var(--el-color-primary) 70%,
    white
  );
  --el-color-primary-light-4: color-mix(
    in srgb,
    var(--el-color-primary) 60%,
    white
  );
  --el-color-primary-light-5: color-mix(
    in srgb,
    var(--el-color-primary) 50%,
    white
  );
  --el-color-primary-light-6: color-mix(
    in srgb,
    var(--el-color-primary) 40%,
    white
  );
  --el-color-primary-light-7: color-mix(
    in srgb,
    var(--el-color-primary) 30%,
    white
  );
  --el-color-primary-light-8: color-mix(
    in srgb,
    var(--el-color-primary) 20%,
    white
  );
  --el-color-primary-light-9: color-mix(
    in srgb,
    var(--el-color-primary) 10%,
    white
  );
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

/* Layout */
.container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--ds-space-6);
}

.header {
  text-align: center;
  margin-bottom: var(--ds-space-8);
  animation: fadeInUp 1s ease-out;
}

.header h1 {
  font-size: 3.5rem;
  background: linear-gradient(
    to right,
    var(--ds-color-brand-primary),
    var(--ds-color-brand-primary-dark),
    var(--ds-color-brand-accent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px
    color-mix(in srgb, var(--ds-color-brand-primary) 50%, transparent);
}

.header p {
  font-size: 1.2rem;
  color: var(--ds-color-text-muted);
  max-width: 800px;
  margin: 0 auto;
}

/* Footer */
.footer {
  margin-top: var(--ds-space-8);
  text-align: center;
  color: var(--ds-color-text-muted);
  font-size: 0.9rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

/* Responsive */
@media (max-width: 768px) {
  .header h1 {
    font-size: 2.5rem;
  }
}
</style>
