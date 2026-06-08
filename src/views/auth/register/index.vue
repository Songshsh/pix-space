<template>
  <div class="auth-page register-page starry-theme">
    <StarryBackground />

    <div class="auth-page__container">
      <div class="auth-page__header">
        <h1>Pix Space</h1>
        <p>创建 Pix Space 账号，开始探索与管理你的视觉资产。</p>
      </div>

      <div class="auth-card">
        <h2 class="auth-card__title">立即注册</h2>

        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          @submit.prevent="handleSubmit"
        >
          <el-form-item prop="name">
            <el-input
              v-model="form.name"
              data-testid="name-input"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              data-testid="email-input"
              type="email"
              placeholder="请输入邮箱"
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
              data-testid="password-input"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              data-testid="confirm-password-input"
              type="password"
              placeholder="请再次输入密码"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              data-testid="submit-btn"
              class="auth-submit-btn"
              size="large"
              :loading="isSubmitting"
              native-type="submit"
            >
              {{ isSubmitting ? '注册中...' : '立即注册' }}
            </el-button>
          </el-form-item>
        </el-form>

        <div class="auth-link-meta">
          <p>
            已有账号？
            <button
              type="button"
              data-testid="back-login-btn"
              class="auth-link-btn"
              @click="router.push('/login')"
            >
              返回登录
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, Message, User } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import StarryBackground from '../../../components/StarryBackground.vue';
import { register as registerApi } from '../../../api/user';

const router = useRouter();
const formRef = ref<FormInstance>();
const isSubmitting = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const validateConfirmPassword = (
  _rule: unknown,
  value: string,
  callback: (error?: Error) => void
) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
    return;
  }

  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
    return;
  }

  callback();
};

const formRules = reactive<FormRules<typeof form>>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      validator: (_rule, value: string, callback) => {
        const trimmedValue = typeof value === 'string' ? value.trim() : '';
        if (!trimmedValue) {
          callback(new Error('请输入用户名'));
          return;
        }
        if (trimmedValue.length < 2 || trimmedValue.length > 20) {
          callback(new Error('用户名长度需为2-20个字符'));
          return;
        }
        callback();
      },
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
});

const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  isSubmitting.value = true;

  try {
    await registerApi({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
    });

    await router.push({
      path: '/login',
      query: {
        registered: '1',
      },
    });
  } catch (error) {
    const message = (error as { message?: string } | undefined)?.message;
    ElMessage.error(message || '注册失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
