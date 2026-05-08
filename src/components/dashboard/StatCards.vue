<template>
  <el-row :gutter="24" class="stats-row">
    <el-col :xs="24" :sm="12" :lg="6">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon stat-icon--images">
            <el-icon :size="28"><Picture /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalImages }}</p>
            <p class="stat-label">图片总数</p>
          </div>
        </div>
        <div class="stat-footer">
          <span class="trend up">
            <el-icon><Top /></el-icon>
            +12%
          </span>
          <span>较上周</span>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="12" :lg="6">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon stat-icon--users">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalUsers }}</p>
            <p class="stat-label">用户总数</p>
          </div>
        </div>
        <div class="stat-footer">
          <span class="trend up">
            <el-icon><Top /></el-icon>
            +8%
          </span>
          <span>较上周</span>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="12" :lg="6">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon stat-icon--files">
            <el-icon :size="28"><Folder /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalFiles }}</p>
            <p class="stat-label">文件总数</p>
          </div>
        </div>
        <div class="stat-footer">
          <span class="trend up">
            <el-icon><Top /></el-icon>
            +5%
          </span>
          <span>较上周</span>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :sm="12" :lg="6">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon stat-icon--views">
            <el-icon :size="28"><View /></el-icon>
          </div>
          <div class="stat-info">
            <p class="stat-value">{{ stats.totalViews }}</p>
            <p class="stat-label">总访问量</p>
          </div>
        </div>
        <div class="stat-footer">
          <span class="trend down">
            <el-icon><Bottom /></el-icon>
            -3%
          </span>
          <span>较上周</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import {
  Picture,
  User,
  Folder,
  View,
  Top,
  Bottom,
} from '@element-plus/icons-vue';
import type { DashboardStats } from '../../types/dashboard';

defineProps<{
  stats: DashboardStats;
}>();
</script>

<style scoped>
.stats-row {
  margin-bottom: var(--ds-space-5);
}

.stat-card {
  margin-bottom: var(--ds-space-4);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--ds-radius-3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-text-inverse);
}

.stat-icon--images {
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
}

.stat-icon--users {
  background: linear-gradient(
    135deg,
    var(--ds-color-danger) 0%,
    color-mix(in srgb, var(--ds-color-danger) 60%, var(--ds-color-bg-primary))
      100%
  );
}

.stat-icon--files {
  background: linear-gradient(
    135deg,
    var(--ds-color-success) 0%,
    color-mix(in srgb, var(--ds-color-success) 60%, var(--ds-color-bg-primary))
      100%
  );
}

.stat-icon--views {
  background: linear-gradient(
    135deg,
    var(--ds-color-warning) 0%,
    color-mix(in srgb, var(--ds-color-warning) 60%, var(--ds-color-bg-primary))
      100%
  );
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-1) 0;
}

.stat-label {
  font-size: 14px;
  color: var(--ds-color-text-secondary);
  margin: 0;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  margin-top: var(--ds-space-4);
  padding-top: var(--ds-space-4);
  border-top: 1px solid var(--ds-color-border);
  font-size: 13px;
  color: var(--ds-color-text-tertiary);
}

.trend {
  display: flex;
  align-items: center;
  gap: var(--ds-space-1);
  font-weight: 500;
}

.trend.up {
  color: var(--ds-color-success);
}

.trend.down {
  color: var(--ds-color-danger);
}
</style>
