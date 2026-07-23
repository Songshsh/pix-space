import type { FileTypeEnum } from '../utils/fileDisplay';

export interface FileItem {
  id: string;
  name: string;
  type: FileTypeEnum;
  size: number;
  updatedAt: string;
  parentId?: string | null;
}

export interface FileListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  parentId?: string;
}

export type { PaginatedData as ListResult } from './http';

export interface CreateFolderResult {
  id: string;
  name: string;
  parentId?: string;
  parentPath?: string[];
}

export type CreateFolderPayload =
  | { name: string; parentId?: string }
  | { name: string; parentPath?: string[] };

export interface UpdateFilePayload {
  name: string;
}
