import type { BoardVisibility } from './user-boards';
import type { UserRef } from './user-ref';

export type BoardDetailImageSource = 'upload' | 'like';

export type BoardOwner = UserRef;

export interface BoardDetailImage {
  id: string;
  title: string;
  imageHeight: number;
  bgColor: string;
  url?: string;
  tag: string;
  author: string;
  source: BoardDetailImageSource;
}

export interface BoardDetail {
  id: string;
  title: string;
  description: string;
  imageCount: number;
  visibility: BoardVisibility;
  owner: BoardOwner;
  canEdit: boolean;
  images: BoardDetailImage[];
}
