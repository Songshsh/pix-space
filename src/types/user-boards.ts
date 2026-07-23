export type TabKey = 'boards' | 'uploads' | 'likes';
export type BoardVisibility = 'public' | 'private';

export interface Board {
  id: string;
  title: string;
  description: string;
  imageCount: number;
  visibility: BoardVisibility;
  covers: string[];
}

export type UploadImageStatus = 'private' | 'pending' | 'public';

export interface UploadImage {
  id: string;
  title: string;
  uploadedAt: string;
  status: UploadImageStatus;
  bgColor: string;
  url?: string;
}

export interface LikedImage {
  id: string;
  title: string;
  author: string;
  likedAt: string;
  bgColor: string;
  url?: string;
}

export interface UserBoardsProfile {
  id: number;
  username: string;
  bio: string;
}

export interface UserBoardsOverview {
  profile: UserBoardsProfile;
  boards: Board[];
  uploads: UploadImage[];
  likes: LikedImage[];
}

export interface UserBoardsStats {
  publicBoards: number;
  publicUploads: number;
  likes: number;
}

export interface UserBoardsSummary {
  profile: UserBoardsProfile;
  stats: UserBoardsStats;
}

export interface UserBoardsPageQuery {
  page: number;
  pageSize: number;
}

export interface UserUploadsPageQuery extends UserBoardsPageQuery {
  keyword?: string;
  sort?: 'newest' | 'oldest';
}

export interface UserLikesPageQuery extends UserBoardsPageQuery {
  keyword?: string;
}

export interface BoardFormPayload {
  name: string;
  description: string;
  visibility: BoardVisibility;
}
