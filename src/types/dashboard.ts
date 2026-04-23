export interface DashboardStats {
  totalImages: number;
  totalUsers: number;
  totalFiles: number;
  totalViews: number;
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
  type: string;
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
