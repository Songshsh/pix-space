import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { DashboardData } from '../types/dashboard';

export function getDashboard(
  config?: AxiosRequestConfig
): Promise<DashboardData> {
  return request.get('/dashboard', config);
}
