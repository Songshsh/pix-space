import request, { requestRaw } from '../utils/request';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  FileItem,
  FileListParams,
  ListResult,
  CreateFolderPayload,
  CreateFolderResult,
  UpdateFilePayload,
} from '../types/file';

export function getFileList(
  params?: FileListParams,
  config?: AxiosRequestConfig
): Promise<ListResult<FileItem>> {
  return request.get('/files', {
    params,
    silentError: true,
    ...config,
  }) as Promise<ListResult<FileItem>>;
}

export function uploadFile(
  formData: FormData,
  parentId?: string | null,
  config?: AxiosRequestConfig
): Promise<FileItem> {
  const params =
    parentId !== undefined && parentId !== null ? { parentId } : undefined;
  return request.post('/files/upload', formData, {
    ...config,
    params: {
      ...config?.params,
      ...params,
    },
  });
}

export function deleteFile(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/files/${id}`, config);
}

export function updateFile(
  id: string | number,
  data: UpdateFilePayload,
  config?: AxiosRequestConfig
): Promise<FileItem> {
  return request.put(`/files/${id}`, data, config);
}

export function createFolder(
  data: CreateFolderPayload,
  config?: AxiosRequestConfig
): Promise<CreateFolderResult> {
  return request.post(
    '/files/folder',
    data,
    config
  ) as Promise<CreateFolderResult>;
}

export function downloadFile(
  id: string | number,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Blob>> {
  return requestRaw.get(`/files/${id}/download`, {
    responseType: 'blob',
    ...config,
  });
}
