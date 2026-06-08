<template>
  <div class="notification-panel">
    <h3 class="section-title">通知设置</h3>
    <div class="notification-settings">
      <div class="notification-item">
        <div class="notification-info">
          <p class="notification-title">系统通知</p>
          <p class="notification-desc">接收系统更新和维护通知</p>
        </div>
        <el-switch
          v-model="notificationSettings.system"
          :loading="saving"
          :disabled="saving || !ready"
          @change="emit('update')"
        />
      </div>
      <div class="notification-item">
        <div class="notification-info">
          <p class="notification-title">邮件通知</p>
          <p class="notification-desc">接收重要活动的邮件提醒</p>
        </div>
        <el-switch
          v-model="notificationSettings.email"
          :loading="saving"
          :disabled="saving || !ready"
          @change="emit('update')"
        />
      </div>
      <div class="notification-item">
        <div class="notification-info">
          <p class="notification-title">上传提醒</p>
          <p class="notification-desc">当有新文件上传时通知</p>
        </div>
        <el-switch
          v-model="notificationSettings.upload"
          :loading="saving"
          :disabled="saving || !ready"
          @change="emit('update')"
        />
      </div>
      <div class="notification-item">
        <div class="notification-info">
          <p class="notification-title">评论通知</p>
          <p class="notification-desc">当有人评论时通知</p>
        </div>
        <el-switch
          v-model="notificationSettings.comment"
          :loading="saving"
          :disabled="saving || !ready"
          @change="emit('update')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NotificationSettingsForm } from './types';

defineProps<{
  ready?: boolean;
  saving?: boolean;
}>();

const emit = defineEmits<{
  update: [];
}>();

const notificationSettings = defineModel<NotificationSettingsForm>('settings', {
  required: true,
});
</script>

<style scoped>
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ds-space-4);
  background: var(--el-fill-color-lighter);
  border-radius: var(--ds-radius-2);
}

.notification-title {
  font-weight: 500;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-1) 0;
}

.notification-desc {
  font-size: 13px;
  color: var(--ds-color-text-tertiary);
  margin: 0;
}
</style>
