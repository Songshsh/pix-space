import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type {
  Board,
  BoardFormPayload,
  LikedImage,
  PagedListResult,
  UploadImage,
  UploadImageStatus,
  UserBoardsPageQuery,
  UserBoardsSummary,
  UserLikesPageQuery,
  UserUploadsPageQuery,
} from '../types/user-boards';
import type { ImageDetailSource } from '../types/image-detail';

export function getUserBoardsSummary(
  userId: number | string,
  config?: AxiosRequestConfig
): Promise<UserBoardsSummary> {
  return request.get(`/users/${userId}/summary`, config);
}

export function getUserBoardsPage(
  userId: number | string,
  params: UserBoardsPageQuery,
  config?: AxiosRequestConfig
): Promise<PagedListResult<Board>> {
  return request.get(`/users/${userId}/boards`, {
    ...config,
    params,
  });
}

export function getUserUploadsPage(
  userId: number | string,
  params: UserUploadsPageQuery,
  config?: AxiosRequestConfig
): Promise<PagedListResult<UploadImage>> {
  return request.get(`/users/${userId}/uploads`, {
    ...config,
    params,
  });
}

export function getUserLikesPage(
  userId: number | string,
  params: UserLikesPageQuery,
  config?: AxiosRequestConfig
): Promise<PagedListResult<LikedImage>> {
  return request.get(`/users/${userId}/likes`, {
    ...config,
    params,
  });
}

export function createUserBoard(
  userId: number | string,
  data: BoardFormPayload,
  config?: AxiosRequestConfig
): Promise<Board> {
  return request.post(`/users/${userId}/boards`, data, config);
}

export function collectImageToBoard(
  userId: number | string,
  boardId: string,
  data: { imageId: string; source: ImageDetailSource },
  config?: AxiosRequestConfig
): Promise<Board> {
  return request.post(
    `/users/${userId}/boards/${boardId}/collect`,
    data,
    config
  );
}

export function updateUploadedImageStatus(
  userId: number | string,
  imageId: string,
  data: { status: UploadImageStatus },
  config?: AxiosRequestConfig
): Promise<UploadImage> {
  return request.patch(
    `/users/${userId}/uploads/${imageId}/status`,
    data,
    config
  );
}

export function deleteUploadedImage(
  userId: number | string,
  imageId: string,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/users/${userId}/uploads/${imageId}`, config);
}

export function unlikeImage(
  userId: number | string,
  imageId: string,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/users/${userId}/likes/${imageId}`, config);
}

export function likeImage(
  userId: number | string,
  imageId: string,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.post(`/users/${userId}/likes/${imageId}`, {}, config);
}
