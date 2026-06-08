<template>
  <el-card class="card account-page-card">
    <template #header>
      <div class="card-header">账号信息</div>
    </template>

    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">用户名</div>
        <div class="info-value">{{ name || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">邮箱</div>
        <div class="info-value">{{ email || '-' }}</div>
      </div>
      <div class="info-item">
        <div class="info-label">角色</div>
        <div class="info-value">
          <el-tag type="info" effect="plain">
            {{ role || '-' }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  email: string;
  role: string;
}>();
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ds-space-6);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.info-label {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.info-value {
  font-size: 14px;
  color: var(--ds-color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}
</style>
