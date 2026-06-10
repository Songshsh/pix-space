import request, { requestRaw } from '../utils/request';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ImageListParams, ImageListResponse } from '../types/image';
import type { ImageDetail } from '../types/image-detail';

export function getImageList(
  params: ImageListParams,
  config?: AxiosRequestConfig
): Promise<ImageListResponse> {
  return request.get('/images', {
    params,
    silentError: true,
    ...config,
  }) as Promise<ImageListResponse>;
}

export function getImageDetail(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<ImageDetail> {
  return request.get(`/images/${id}`, {
    silentError: true,
    ...config,
  }) as Promise<ImageDetail>;
}

export function uploadImage(
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.post('/images/upload', formData, config);
}

export function deleteImage(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/images/${id}`, config);
}

export function updateImage(
  id: string | number,
  data: { title?: string; isFavorite?: boolean; tags?: string[] },
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.put(`/images/${id}`, data, config);
}

export function downloadImage(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Blob>> {
  return requestRaw.get(`/images/${id}/download`, {
    responseType: 'blob',
    ...config,
  });
}

export function downloadImageByUrl(
  url: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Blob>> {
  const requestUrl = String(url || '');
  if (!requestUrl.startsWith('/') || requestUrl.startsWith('//')) {
    return Promise.reject(new Error('仅支持同源相对路径下载'));
  }
  return requestRaw.get(requestUrl, {
    responseType: 'blob',
    baseURL: '',
    ...config,
    withCredentials: false,
  });
}
