import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { ExploreData } from '../types/explore';

export function getExploreData(
  config?: AxiosRequestConfig
): Promise<ExploreData> {
  return request.get('/explore', config);
}
