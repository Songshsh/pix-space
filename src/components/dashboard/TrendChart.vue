<template>
  <el-card class="chart-card">
    <template #header>
      <div class="card-header">
        <span>访问趋势</span>
        <el-radio-group v-model="chartPeriod" size="small">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <div class="chart-placeholder">
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

const props = defineProps<{
  chartData: ChartData[];
  period: string;
}>();

const emit = defineEmits<{
  (e: 'update:period', value: string): void;
}>();

const chartPeriod = ref(props.period);

watch(chartPeriod, (newVal) => {
  emit('update:period', newVal);
});

watch(
  () => props.period,
  (newVal) => {
    if (chartPeriod.value !== newVal) {
      chartPeriod.value = newVal;
    }
  }
);
</script>

<style scoped>
.chart-card {
  margin-bottom: 16px;
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
  padding: 0 20px;
}

.chart-bar {
  width: 40px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
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
  color: #666;
  font-weight: 500;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  padding: 12px 20px 0;
  font-size: 12px;
  color: #999;
}
</style>
