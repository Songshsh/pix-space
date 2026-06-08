import type { FileTypeEnum } from '../utils/fileDisplay';

export interface FileItem {
  id: number;
  name: string;
  type: FileTypeEnum;
  size: number;
  modifiedAt: string;
  parentId?: number | null;
}

export interface FileListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  parentId?: number;
}

export type { PaginatedData as ListResult } from './http';

export interface CreateFolderResult {
  id: number;
  name: string;
  parentId?: number;
  parentPath?: string[];
}

export type CreateFolderPayload =
  | { name: string; parentId?: number }
  | { name: string; parentPath?: string[] };

export interface UpdateFilePayload {
  name: string;
}
