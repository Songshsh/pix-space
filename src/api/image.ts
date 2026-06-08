import request, { requestRaw } from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { ImageListParams, ImageListResponse } from '../types/image';
import type { ImageDetail } from '../types/image-detail';

export function getImageList(
  params?: ImageListParams,
  config?: AxiosRequestConfig
): Promise<ImageListResponse> {
  return request.get('/images', { params, ...config });
}

export function getImageDetail(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<ImageDetail> {
  return request.get(`/images/${id}`, config);
}

export function uploadImage(
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.post('/images/upload', formData, config);
}

export function deleteImage(id: string | number): Promise<boolean> {
  return request.delete(`/images/${id}`);
}

export function updateImage(
  id: string | number,
  data: { title?: string; isFavorite?: boolean; tags?: string[] }
): Promise<boolean> {
  return request.put(`/images/${id}`, data);
}

export function downloadImage(
  id: string | number,
  config?: AxiosRequestConfig
) {
  return requestRaw.get(`/images/${id}/download`, {
    responseType: 'blob',
    ...config,
  });
}

export function downloadImageByUrl(url: string, config?: AxiosRequestConfig) {
  const requestUrl = String(url || '');
  if (!requestUrl.startsWith('/') || requestUrl.startsWith('//')) {
    return Promise.reject(new Error('仅支持同源相对路径下载'));
  }
  return requestRaw.get(url, {
    responseType: 'blob',
    baseURL: '',
    ...config,
    withCredentials: false,
  });
}
