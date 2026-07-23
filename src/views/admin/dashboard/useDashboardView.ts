import { getDashboard } from '../../../api/dashboard';
import { useUserStore } from '../../../stores/user';
import type {
  ChartData,
  DashboardStats,
  RecentActivity,
  RecentUpload,
} from '../../../types/dashboard';

const createDefaultStats = (): DashboardStats => ({
  totalImages: 0,
  totalUsers: 0,
  totalFiles: 0,
  totalViews: 0,
  totalImagesTrend: { value: 0, direction: 'up' },
  totalUsersTrend: { value: 0, direction: 'up' },
  totalFilesTrend: { value: 0, direction: 'up' },
  totalViewsTrend: { value: 0, direction: 'up' },
});

export function useDashboardView() {
  const router = useRouter();
  const userStore = useUserStore();

  const loading = ref(false);
  const loadError = ref('');

  const userName = computed(() => userStore.username || '用户');

  const stats = ref<DashboardStats>(createDefaultStats());
  const chartData = ref<ChartData[]>([]);
  const recentActivities = ref<RecentActivity[]>([]);
  const recentUploads = ref<RecentUpload[]>([]);

  const handleViewAll = () => {
    router.push('/admin/files');
  };

  const loadDashboard = async () => {
    loading.value = true;
    loadError.value = '';
    try {
      const data = await getDashboard({ silentError: true });
      if (data?.stats) stats.value = data.stats;
      if (Array.isArray(data?.chartData)) chartData.value = data.chartData;
      if (Array.isArray(data?.recentActivities)) {
        recentActivities.value = data.recentActivities;
      }
      if (Array.isArray(data?.recentUploads)) {
        recentUploads.value = data.recentUploads;
      }
    } catch (error) {
      const normalized = error as { message?: string };
      loadError.value = normalized.message || '仪表盘加载失败，请稍后重试';
      stats.value = createDefaultStats();
      chartData.value = [];
      recentActivities.value = [];
      recentUploads.value = [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    void loadDashboard();
  });

  return {
    loading,
    loadError,
    userName,
    stats,
    chartData,
    recentActivities,
    recentUploads,
    loadDashboard,
    handleViewAll,
  };
}
