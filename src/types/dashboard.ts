import type { FileTypeEnum } from '../utils/fileDisplay';

export interface StatTrend {
  value: number;
  direction: 'up' | 'down';
}

export interface DashboardStats {
  totalImages: number;
  totalUsers: number;
  totalFiles: number;
  totalViews: number;
  totalImagesTrend: StatTrend;
  totalUsersTrend: StatTrend;
  totalFilesTrend: StatTrend;
  totalViewsTrend: StatTrend;
}

export interface ChartData {
  value: number;
  label: string;
}

export interface RecentActivity {
  time: string;
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info' | '';
  content: string;
}

export interface RecentUpload {
  name: string;
  type: FileTypeEnum;
  size: string;
  uploader: string;
  time: string;
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: ChartData[];
  recentActivities: RecentActivity[];
  recentUploads: RecentUpload[];
}
