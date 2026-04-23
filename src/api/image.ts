import request, { requestRaw } from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { ImageListParams, ImageListResponse } from '../types/image';

export function getImageList(
  params?: ImageListParams,
  config?: AxiosRequestConfig
): Promise<ImageListResponse> {
  return request.get('/images', { params, ...config });
}

export function uploadImage(formData: FormData, config?: AxiosRequestConfig) {
  return request.post('/images/upload', formData, config);
}

export function deleteImage(id: string | number) {
  return request.delete(`/images/${id}`);
}

export function downloadImage(id: string | number) {
  return requestRaw.get(`/images/${id}/download`, { responseType: 'blob' });
}
