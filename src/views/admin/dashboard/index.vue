<template>
  <div v-loading="loading" class="dashboard">
    <div class="welcome-section">
      <h1>欢迎回来，{{ userName }}</h1>
      <p>今天是个好日子，让我们开始工作吧！</p>
    </div>

    <PageStateBlock
      v-if="loadError && !loading"
      variant="error"
      size="compact"
      title="仪表盘加载失败"
      :description="loadError"
      primary-text="重试"
      @primary="loadDashboard"
    />

    <template v-else>
      <StatCards :stats="stats" />

      <el-row :gutter="24" class="content-row">
        <el-col :xs="24" :lg="16">
          <TrendChart :chart-data="chartData" />
        </el-col>

        <el-col :xs="24" :lg="8">
          <RecentActivity :activities="recentActivities" />
        </el-col>
      </el-row>

      <RecentUploads :uploads="recentUploads" @view-all="handleViewAll" />
    </template>
  </div>
</template>

<script setup lang="ts">
import PageStateBlock from '../../../components/common/PageStateBlock.vue';
import StatCards from '../../../components/dashboard/StatCards.vue';
import TrendChart from '../../../components/dashboard/TrendChart.vue';
import { useDashboardView } from './useDashboardView';

const RecentActivity = defineAsyncComponent(
  () => import('../../../components/dashboard/RecentActivity.vue')
);
const RecentUploads = defineAsyncComponent(
  () => import('../../../components/dashboard/RecentUploads.vue')
);

const {
  loading,
  loadError,
  userName,
  stats,
  chartData,
  recentActivities,
  recentUploads,
  loadDashboard,
  handleViewAll,
} = useDashboardView();
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.welcome-section {
  margin-bottom: var(--ds-space-6);
}

.welcome-section h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-2) 0;
}

.welcome-section p {
  font-size: 14px;
  color: var(--ds-color-text-secondary);
  margin: 0;
}

.content-row {
  margin-bottom: var(--ds-space-6);
}
</style>
