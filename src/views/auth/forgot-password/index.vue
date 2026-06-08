<template>
  <div class="auth-page forgot-password-page starry-theme">
    <StarryBackground />

    <div class="auth-page__container">
      <div class="auth-page__header">
        <h1>Pix Space</h1>
        <p>输入注册邮箱，我们会向您发送密码重置链接。</p>
      </div>

      <div class="auth-card">
        <template v-if="!isSuccess">
          <h2 class="auth-card__title auth-card__title--compact">找回密码</h2>

          <el-form
            ref="formRef"
            :model="form"
            :rules="formRules"
            @submit.prevent="handleSubmit"
          >
            <el-form-item prop="email">
              <el-input
                v-model="form.email"
                data-testid="email-input"
                type="email"
                placeholder="请输入您的邮箱"
                size="large"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
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
                {{ isSubmitting ? '发送中...' : '发送重置链接' }}
              </el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-else>
          <h2 class="auth-card__title auth-card__title--compact">邮件已发送</h2>
          <p class="card-copy success-copy">
            如果该邮箱已注册，我们已发送重置链接，请注意查收邮箱。
          </p>
        </template>

        <div class="auth-link-meta">
          <p>
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
import { Message } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import StarryBackground from '../../../components/StarryBackground.vue';
import { forgotPassword } from '../../../api/user';

const router = useRouter();
const formRef = ref<FormInstance>();
const isSubmitting = ref(false);
const isSuccess = ref(false);

const form = reactive({
  email: '',
});

const formRules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
});

const handleSubmit = async () => {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  isSubmitting.value = true;
  try {
    await forgotPassword({ email: form.email });
    isSuccess.value = true;
  } catch (error) {
    const message = (error as { message?: string } | undefined)?.message;
    ElMessage.error(message || '发送失败，请稍后重试');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.card-copy {
  margin: 0 0 var(--ds-space-7);
  color: var(--ds-color-text-muted);
  text-align: center;
  line-height: 1.6;
}

.success-copy {
  margin-bottom: var(--ds-space-8);
}
</style>
