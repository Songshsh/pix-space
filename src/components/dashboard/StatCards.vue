<template>
  <el-row :gutter="24" class="stats-row">
    <el-col :xs="24" :sm="12" :lg="6">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div
            class="stat-icon"
            style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            "
          >
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
          <div
            class="stat-icon"
            style="
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            "
          >
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
          <div
            class="stat-icon"
            style="
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            "
          >
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
          <div
            class="stat-icon"
            style="
              background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            "
          >
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
  margin-bottom: 24px;
}

.stat-card {
  margin-bottom: 16px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 13px;
  color: #999;
}

.trend {
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 500;
}

.trend.up {
  color: #52c41a;
}

.trend.down {
  color: #ff4d4f;
}
</style>
