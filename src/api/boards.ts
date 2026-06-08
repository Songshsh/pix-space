import request from '../utils/request';
import type { AxiosRequestConfig } from 'axios';
import type { BoardDetail } from '../types/board-detail';
import type { Board, BoardFormPayload } from '../types/user-boards';

export function getBoardDetail(
  boardId: string,
  config?: AxiosRequestConfig
): Promise<BoardDetail> {
  return request.get(`/boards/${boardId}`, config);
}

export function uploadBoardImages(
  boardId: string,
  formData: FormData,
  config?: AxiosRequestConfig
): Promise<BoardDetail> {
  return request.post(`/boards/${boardId}/images/upload`, formData, config);
}

export function updateBoard(
  boardId: string,
  data: BoardFormPayload,
  config?: AxiosRequestConfig
): Promise<Board> {
  return request.put(`/boards/${boardId}`, data, config);
}

export function deleteBoard(
  boardId: string,
  config?: AxiosRequestConfig
): Promise<boolean> {
  return request.delete(`/boards/${boardId}`, config);
}
