import type { UserRef } from './user-ref';

export type SearchState = 'success' | 'loading' | 'empty' | 'error';

export interface ExploreItem {
  id: string;
  title: string;
  imageHeight: number;
  /** CSS 变量引用或颜色值，用于占位块背景（如 `var(--el-color-primary-light-9)`） */
  bgColor: string;
  imageUrl?: string;
  tags: string[];
  author: UserRef;
}

export interface ExploreData {
  categories: string[];
  searchTags: string[];
  relatedSearches: string[];
  items: ExploreItem[];
}
