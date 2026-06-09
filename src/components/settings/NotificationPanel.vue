<template>
  <div class="notification-panel">
    <h3 class="section-title">通知设置</h3>
    <div class="notification-settings">
      <div
        v-for="item in notifications"
        :key="item.key"
        class="notification-item"
      >
        <div class="notification-info">
          <p class="notification-title">{{ item.title }}</p>
          <p class="notification-desc">{{ item.desc }}</p>
        </div>
        <el-switch
          :model-value="notificationSettings[item.key]"
          :loading="saving"
          :disabled="saving || !ready"
          @update:model-value="
            notificationSettings[item.key] = $event === true;
            emit('update');
          "
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

const notifications = [
  { key: 'system' as const, title: '系统通知', desc: '接收系统更新和维护通知' },
  { key: 'email' as const, title: '邮件通知', desc: '接收重要活动的邮件提醒' },
  { key: 'upload' as const, title: '上传提醒', desc: '当有新文件上传时通知' },
  { key: 'comment' as const, title: '评论通知', desc: '当有人评论时通知' },
];
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
