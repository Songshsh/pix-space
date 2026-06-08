<script setup lang="ts">
interface StatItem {
  value: string | number;
  label: string;
}

defineProps<{
  username: string;
  profileName: string;
  bio: string;
  stats: StatItem[];
  loading: boolean;
}>();
</script>

<template>
  <div class="profile-card">
    <template v-if="loading">
      <div class="profile-skeleton">
        <div class="skeleton-circle"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line skeleton-line--lg"></div>
          <div class="skeleton-line skeleton-line--md"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="profile-avatar">
        <el-avatar :size="64" class="avatar-inner">
          {{ username.charAt(0).toUpperCase() }}
        </el-avatar>
      </div>
      <div class="profile-info">
        <div class="profile-name">{{ profileName }}</div>
        <div class="profile-bio">{{ bio }}</div>
        <div class="profile-stats">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-card {
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-2);
  padding: var(--ds-space-7);
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-4);
}

.profile-skeleton {
  display: flex;
  align-items: flex-start;
  gap: var(--ds-space-4);
  width: 100%;
}

.skeleton-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--ds-color-bg-secondary);
  flex-shrink: 0;
}

.skeleton-lines {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
  padding-top: var(--ds-space-1);
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar-inner {
  background-color: var(--el-fill-color);
  font-size: 18px;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.profile-bio {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.profile-stats {
  display: flex;
  gap: var(--ds-space-9);
  margin-top: var(--ds-space-4);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-1);
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}
</style>
