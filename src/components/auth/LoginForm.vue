<template>
  <div class="login-card">
    <h2>欢迎登录</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">邮箱账号</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          data-testid="email-input"
          class="form-control"
          placeholder="请输入您的邮箱"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          data-testid="password-input"
          class="form-control"
          placeholder="请输入您的密码"
          required
        />
      </div>

      <div class="remember-forgot">
        <label class="checkbox-label">
          <input v-model="form.remember" type="checkbox" />
          <span>保持登录状态</span>
        </label>
        <a href="#" class="forgot-password">忘记密码？</a>
      </div>

      <button
        type="submit"
        data-testid="login-submit-btn"
        class="login-btn"
        :disabled="isLoggingIn"
      >
        <el-icon v-if="isLoggingIn" class="is-loading"><Loading /></el-icon>
        <el-icon v-else><Promotion /></el-icon>
        {{ loginBtnText }}
      </button>
    </form>

    <div class="signup-link">
      <p>还没有账号？ <a href="#">立即注册</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { Loading, Promotion } from '@element-plus/icons-vue';

const props = defineProps<{
  isLoggingIn: boolean;
}>();

const emit = defineEmits<{
  (e: 'login', payload: { email: string; password: string }): void;
}>();

const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const loginBtnText = computed(() => {
  return props.isLoggingIn ? '正在登录...' : '立即登录';
});

const handleSubmit = () => {
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

.form-group {
  margin-bottom: var(--ds-space-5);
}

.form-group label {
  display: block;
  margin-bottom: var(--ds-space-2);
  color: var(--ds-color-text-muted);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: var(--ds-space-4);
  background: var(--ds-color-white-7);
  border: 1px solid var(--ds-color-white-10);
  border-radius: var(--ds-radius-2);
  color: var(--ds-color-text-inverse);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--el-color-primary) 20%, transparent);
  background: var(--ds-color-white-10);
}

.form-control::placeholder {
  color: var(--ds-color-white-40);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ds-space-6);
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: var(--ds-color-text-muted);
  cursor: pointer;
}

.checkbox-label input {
  margin-right: var(--ds-space-2);
  accent-color: var(--el-color-primary);
}

.forgot-password {
  color: var(--el-color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--el-color-primary-dark-2);
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: var(--ds-space-4);
  background: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-primary-dark-2)
  );
  border: none;
  border-radius: var(--ds-radius-2);
  color: var(--ds-color-text-inverse);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent,
    var(--ds-color-white-20),
    transparent
  );
  transform: rotate(30deg);
  animation: shine 3s infinite;
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

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(30deg);
  }
  100% {
    transform: translateX(100%) rotate(30deg);
  }
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
