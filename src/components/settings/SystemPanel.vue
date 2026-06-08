<template>
  <div class="system-panel">
    <h3 class="section-title">系统设置</h3>
    <el-form label-width="120px" class="settings-form">
      <el-form-item label="语言">
        <el-select v-model="systemSettings.language" class="setting-select">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
        </el-select>
      </el-form-item>
      <el-form-item label="时区">
        <el-select v-model="systemSettings.timezone" class="setting-select">
          <el-option label="北京时间 (GMT+8)" value="Asia/Shanghai" />
          <el-option label="UTC" value="UTC" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期格式">
        <el-select v-model="systemSettings.dateFormat" class="setting-select">
          <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
          <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
          <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
        </el-select>
      </el-form-item>
      <el-form-item label="自动备份">
        <el-switch v-model="systemSettings.autoBackup" />
        <span class="backup-hint">每天自动备份数据</span>
      </el-form-item>
    </el-form>

    <el-divider />

    <h4 class="subsection-title">危险操作</h4>
    <div class="danger-zone">
      <div class="danger-item">
        <div>
          <p class="danger-title">清除缓存</p>
          <p class="danger-desc">清除系统缓存，可能会影响加载速度</p>
        </div>
        <el-button @click="emit('clearCache')">清除缓存</el-button>
      </div>
      <div class="danger-item">
        <div>
          <p class="danger-title">导出数据</p>
          <p class="danger-desc">导出所有个人数据</p>
        </div>
        <el-button @click="emit('exportData')">导出数据</el-button>
      </div>
      <div v-permission="'admin'" class="danger-item danger">
        <div>
          <p class="danger-title">删除账户</p>
          <p class="danger-desc">永久删除您的账户和所有数据，此操作不可逆</p>
        </div>
        <el-button type="danger" @click="emit('deleteAccount')"
          >删除账户</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemSettingsForm } from './types';

const emit = defineEmits<{
  clearCache: [];
  exportData: [];
  deleteAccount: [];
}>();

const systemSettings = defineModel<SystemSettingsForm>('settings', {
  required: true,
});
</script>

<style scoped>
.settings-form {
  max-width: 600px;
}

.setting-select {
  width: 200px;
}

.danger-zone {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--ds-space-4);
  background: var(--el-fill-color-lighter);
  border-radius: var(--ds-radius-2);
}

.danger-item.danger {
  background: color-mix(
    in srgb,
    var(--ds-color-danger) 10%,
    var(--ds-color-bg-primary)
  );
}

.danger-title {
  font-weight: 500;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-1) 0;
}

.danger-desc {
  font-size: 13px;
  color: var(--ds-color-text-tertiary);
  margin: 0;
}

.backup-hint {
  margin-left: var(--ds-space-2);
  color: var(--ds-color-text-secondary);
}
</style>
