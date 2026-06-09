<template>
  <el-card class="chart-card">
    <template #header>
      <div class="card-header">
        <span>访问趋势</span>
      </div>
    </template>
    <div v-if="chartData.length === 0" class="chart-placeholder">
      <el-empty description="暂无数据" :image-size="80" />
    </div>
    <div v-else class="chart-placeholder">
      <div class="chart-bars">
        <div
          v-for="item in chartData"
          :key="item.label"
          class="chart-bar"
          :style="{ height: item.value + '%' }"
        >
          <span class="bar-value">{{ item.value }}</span>
        </div>
      </div>
      <div class="chart-labels">
        <span v-for="item in chartData" :key="item.label">{{
          item.label
        }}</span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { ChartData } from '../../types/dashboard';

defineProps<{
  chartData: ChartData[];
}>();
</script>

<style scoped>
.chart-card {
  margin-bottom: var(--ds-space-4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-placeholder {
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 240px;
  padding: 0 var(--ds-space-5);
}

.chart-bar {
  width: 40px;
  background: linear-gradient(
    180deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  border-radius: var(--ds-radius-1) var(--ds-radius-1) 0 0;
  position: relative;
  transition: all 0.3s ease;
}

.chart-bar:hover {
  opacity: 0.8;
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: var(--ds-color-text-secondary);
  font-weight: 500;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding: var(--ds-space-3) var(--ds-space-5) 0;
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}
</style>
