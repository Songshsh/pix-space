<template>
  <div class="account-page">
    <div class="page-header">
      <div class="page-title">个人中心</div>
      <div class="page-subtitle">查看账号信息与修改密码</div>
    </div>

    <AccountProfileCard
      :name="userStore.name"
      :email="userStore.email"
      :role="userStore.role"
    />

    <AccountPasswordForm
      v-model:form="form"
      :rules="rules"
      :submitting="submitting"
      @submit="handleSubmit"
      @update:form-ref="(value) => (formRef = value)"
    />
  </div>
</template>

<script setup lang="ts">
import AccountPasswordForm from './AccountPasswordForm.vue';
import AccountProfileCard from './AccountProfileCard.vue';
import { useAccountPasswordForm } from './useAccountPasswordForm';
import { useUserStore } from '../../../stores/user';

const userStore = useUserStore();
const { formRef, form, rules, submitting, handleSubmit } =
  useAccountPasswordForm();
</script>

<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-6);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  line-height: 1.2;
}

.page-subtitle {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  line-height: 1.2;
}
</style>
