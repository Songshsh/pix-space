<template>
  <div v-loading="loading" class="dashboard">
    <div class="welcome-section">
      <h1>欢迎回来，{{ userName }}</h1>
      <p>今天是个好日子，让我们开始工作吧！</p>
    </div>

    <StatCards :stats="stats" />

    <el-row :gutter="24" class="content-row">
      <el-col :xs="24" :lg="16">
        <TrendChart v-model:period="chartPeriod" :chart-data="chartData" />
      </el-col>

      <el-col :xs="24" :lg="8">
        <RecentActivity :activities="recentActivities" />
      </el-col>
    </el-row>

    <RecentUploads :uploads="recentUploads" @view-all="handleViewAll" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user';
import { getDashboard } from '../../api/dashboard';

import StatCards from '../../components/dashboard/StatCards.vue';
import TrendChart from '../../components/dashboard/TrendChart.vue';

import type {
  DashboardStats,
  ChartData,
  RecentActivity as RecentActivityType,
  RecentUpload,
} from '../../types/dashboard';

const RecentActivity = defineAsyncComponent(
  () => import('../../components/dashboard/RecentActivity.vue')
);
const RecentUploads = defineAsyncComponent(
  () => import('../../components/dashboard/RecentUploads.vue')
);

const router = useRouter();
const userStore = useUserStore();
const chartPeriod = ref('week');
const loading = ref(false);

const userName = computed(() => userStore.name || '用户');

const stats = ref<DashboardStats>({
  totalImages: 0,
  totalUsers: 0,
  totalFiles: 0,
  totalViews: 0,
});

const chartData = ref<ChartData[]>([]);
const recentActivities = ref<RecentActivityType[]>([]);
const recentUploads = ref<RecentUpload[]>([]);

const handleViewAll = () => {
  router.push('/images');
};

const loadDashboard = async () => {
  loading.value = true;
  try {
    const data = await getDashboard();
    if (data?.stats) stats.value = data.stats;
    if (Array.isArray(data?.chartData)) chartData.value = data.chartData;
    if (Array.isArray(data?.recentActivities))
      recentActivities.value = data.recentActivities;
    if (Array.isArray(data?.recentUploads))
      recentUploads.value = data.recentUploads;
  } catch (error) {
    // 全局拦截器已处理错误提示，此处仅做兜底
    console.error('Failed to load dashboard:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard {
  min-height: 100%;
}

.welcome-section {
  margin-bottom: var(--ds-space-5, 24px);
}

.welcome-section h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.welcome-section p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.content-row {
  margin-bottom: var(--ds-space-5, 24px);
}
</style>
