<template>
  <el-card class="card account-page-card">
    <template #header>
      <div class="card-header">
        <div class="card-title">修改密码</div>
        <div class="card-hint">请妥善保管密码，建议定期更新。</div>
      </div>
    </template>

    <el-form
      :ref="setInternalFormRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="password-form"
    >
      <el-form-item prop="oldPassword" label="当前密码">
        <el-input
          v-model="form.oldPassword"
          type="password"
          show-password
          autocomplete="current-password"
        />
      </el-form-item>

      <el-form-item prop="newPassword" label="新密码">
        <el-input
          v-model="form.newPassword"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>

      <el-form-item prop="confirmPassword" label="确认新密码">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          show-password
          autocomplete="new-password"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          round
          size="large"
          class="submit-btn"
          :loading="submitting"
          @click="emit('submit')"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { PasswordFormModel } from '../../../components/settings/types';

defineProps<{
  rules: FormRules<PasswordFormModel>;
  submitting: boolean;
}>();

const emit = defineEmits<{
  submit: [];
  'update:formRef': [value: FormInstance | undefined];
}>();

const form = defineModel<PasswordFormModel>('form', {
  required: true,
});

const setInternalFormRef = (
  instance: Element | ComponentPublicInstance | null
) => {
  emit('update:formRef', (instance as FormInstance | null) ?? undefined);
};
</script>

<style scoped>
.card-header {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.account-page-card :deep(.el-card__header) {
  padding: var(--ds-space-5) var(--ds-space-6);
}

.account-page-card :deep(.el-card__body) {
  padding: var(--ds-space-6);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.card-hint {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.password-form {
  max-width: 480px;
}

.submit-btn {
  width: 120px;
}
</style>
