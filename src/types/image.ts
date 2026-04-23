export interface Image {
  id: string;
  title: string;
  url: string;
  size: string;
  createdAt: string;
  color?: string;
  favorite?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface ImageTag {
  name: string;
  type: '' | 'success' | 'warning' | 'info' | 'danger' | 'primary';
}

export interface ImageListParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sortBy?: string;
  collection?: string;
  tag?: string;
}

export interface ImageListResponse {
  list: Image[];
  total: number;
}
