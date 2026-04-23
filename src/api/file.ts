import request, { requestRaw } from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { FileItem, FileListParams, ListResult } from '../types/file';

export function getFileList(
  params?: FileListParams,
  config?: AxiosRequestConfig
) {
  return request.get('/files', { params, ...config }) as Promise<
    ListResult<FileItem>
  >;
}

export function uploadFile(formData: FormData, config?: AxiosRequestConfig) {
  return request.post('/files/upload', formData, config);
}

export function deleteFile(id: string | number) {
  return request.delete(`/files/${id}`);
}

export function createFolder(
  data:
    | { name: string; parentId?: number }
    | { name: string; parentPath?: string[] },
  config?: AxiosRequestConfig
) {
  return request.post('/files/folder', data, config) as Promise<
    { id: number } & typeof data
  >;
}

export function downloadFile(id: string | number) {
  return requestRaw.get(`/files/${id}/download`, { responseType: 'blob' });
}
