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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 0 20px rgba(255, 255, 255, 0.02);
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
    var(--ds-color-primary),
    var(--ds-color-primary-dark),
    var(--ds-color-primary-light)
  );
  border-radius: 20px 20px 0 0;
}

.login-card h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #fff;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a0a0e0;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  color: #a0a0e0;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 0.5rem;
  accent-color: var(--ds-color-primary);
}

.forgot-password {
  color: var(--ds-color-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--ds-color-primary-dark);
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(
    to right,
    var(--ds-color-primary),
    var(--ds-color-primary-dark)
  );
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
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
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: rotate(30deg);
  animation: shine 3s infinite;
}

.signup-link {
  text-align: center;
  color: #a0a0e0;
  margin-top: 2rem;
}

.signup-link a {
  color: var(--ds-color-primary);
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
