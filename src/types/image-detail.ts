import type { UserRef } from './user-ref';

export type ImageDetailSource = 'upload' | 'like' | 'explore' | 'gallery';

export interface ImageDetail {
  id: string;
  title: string;
  url?: string;
  size?: number;
  createdAt: string;
  tags: string[];
  author: UserRef;
  isLiked: boolean;
  source: ImageDetailSource;
  bgColor?: string;
}
