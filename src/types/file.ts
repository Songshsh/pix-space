export interface FileItem {
  id: number;
  name: string;
  type: string;
  size: number;
  modifiedAt: string;
}

export interface FileListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface ListResult<T> {
  list: T[];
  total: number;
}
