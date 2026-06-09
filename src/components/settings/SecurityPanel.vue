<template>
  <div class="security-panel">
    <h3 class="section-title">安全设置</h3>
    <el-form
      ref="formRef"
      :model="securityForm"
      :rules="rules"
      label-width="100px"
      class="settings-form"
    >
      <el-form-item prop="oldPassword" label="当前密码">
        <el-input
          v-model="securityForm.oldPassword"
          type="password"
          show-password
          class="field-input"
        />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input
          v-model="securityForm.newPassword"
          type="password"
          show-password
          class="field-input"
        />
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input
          v-model="securityForm.confirmPassword"
          type="password"
          show-password
          class="field-input"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="submitting"
          @click="handleChangePassword"
          >修改密码</el-button
        >
      </el-form-item>
    </el-form>

    <el-divider />

    <h4 class="subsection-title">两步验证</h4>
    <div class="two-factor">
      <div class="two-factor-info">
        <p>启用两步验证可以提高账户安全性</p>
        <el-tag :type="twoFactorEnabled ? 'success' : 'info'">
          {{ twoFactorEnabled ? '已启用' : '未启用' }}
        </el-tag>
      </div>
      <el-switch
        v-model="twoFactorEnabled"
        :loading="twoFactorSaving"
        :disabled="twoFactorSaving || preferencesLoading"
        @change="handleTwoFactorChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';
import type { SecurityPanelForm } from './types';

defineProps<{
  submitting?: boolean;
  preferencesLoading?: boolean;
  twoFactorSaving?: boolean;
  rules: FormRules<SecurityPanelForm>;
}>();

const emit = defineEmits<{
  submit: [];
  toggleTwoFactor: [value: boolean];
}>();

const formRef = ref<FormInstance>();

const securityForm = defineModel<SecurityPanelForm>('form', {
  required: true,
});
const twoFactorEnabled = defineModel<boolean>('twoFactorEnabled', {
  required: true,
});

defineExpose({ formRef });

const handleTwoFactorChange = (value: string | number | boolean) => {
  const normalizedValue = Boolean(value);
  twoFactorEnabled.value = normalizedValue;
  emit('toggleTwoFactor', normalizedValue);
};

const handleChangePassword = () => {
  emit('submit');
};
</script>

<style scoped>
.settings-form {
  max-width: 600px;
}

.two-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ds-space-4);
  background: var(--el-fill-color-lighter);
  border-radius: var(--ds-radius-2);
}

.two-factor-info {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.two-factor-info p {
  margin: 0;
  color: var(--ds-color-text-secondary);
}

.field-input {
  max-width: 400px;
}
</style>
