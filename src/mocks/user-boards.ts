import type {
  Board,
  BoardFormPayload,
  LikedImage,
  UploadImage,
  UploadImageStatus,
  UserBoardsProfile,
  UserBoardsSummary,
} from '../types/user-boards';
import type { PaginatedData } from '../types/http';
import type {
  BoardDetail,
  BoardDetailImage,
  BoardDetailImageSource,
} from '../types/board-detail';
import type { ImageDetail, ImageDetailSource } from '../types/image-detail';
import type { ExploreItem } from '../types/explore';
import type { Image } from '../types/image';
import { mockItems } from './explore';
import { getImagesMock } from './images';
import { sampleImages } from './shared';
const cardColors = [
  'var(--ds-color-card-lavender)',
  'var(--ds-color-card-sky)',
  'var(--ds-color-card-mint)',
  'var(--ds-color-card-rose)',
  'var(--ds-color-card-slate)',
  'var(--ds-color-card-blue)',
  'var(--ds-color-card-peach)',
  'var(--ds-color-card-sand)',
];

const boardDetailTags = ['UI设计', '3D渲染', '插画', '品牌设计', '排版'];
const boardDetailHeights = [300, 452, 252, 380, 250, 400, 280, 320];

function formatMockDate(day: number) {
  return `2026-04-${String(day).padStart(2, '0')}`;
}

function buildExtraUploads(count: number): UploadImage[] {
  return Array.from({ length: count }, (_, index) => {
    const idNumber = index + 9;
    const day = 24 - (index % 24);
    const statuses: UploadImageStatus[] = ['public', 'private', 'pending'];
    return {
      id: `u${idNumber}`,
      title: `扩展上传素材 ${idNumber}`,
      uploadedAt: formatMockDate(Math.max(day, 1)),
      status: statuses[index % statuses.length],
      bgColor: cardColors[index % cardColors.length],
      url: sampleImages[index % sampleImages.length],
    };
  });
}

function buildExtraLikes(count: number): LikedImage[] {
  return Array.from({ length: count }, (_, index) => {
    const idNumber = index + 9;
    const day = 24 - (index % 24);
    return {
      id: `l${idNumber}`,
      title: `扩展点赞作品 ${idNumber}`,
      author: `作者 ${idNumber}`,
      likedAt: formatMockDate(Math.max(day, 1)),
      bgColor: cardColors[index % cardColors.length],
      url: sampleImages[(index + 6) % sampleImages.length],
    };
  });
}

interface BoardRecord {
  id: string;
  title: string;
  description: string;
  visibility: 'public' | 'private';
  ownerId: number;
  ownerUsername: string;
  imageIds: string[];
  coverPalette: string[];
}

interface UserBoardsState {
  profile: UserBoardsProfile;
  boards: BoardRecord[];
  uploads: UploadImage[];
  likes: LikedImage[];
}

interface OwnedUploadRecord {
  state: UserBoardsState;
  image: UploadImage;
}

interface OwnedLikeRecord {
  state: UserBoardsState;
  image: LikedImage;
}

const seedProfile: UserBoardsProfile = {
  id: 101,
  username: 'Username',
  bio: '一句话简介：偏爱 UI / 插画 / 3D 渲染',
};

const mockProfilesByUserId: Record<number, UserBoardsProfile> = {
  1: {
    id: 1,
    username: 'admin',
    bio: '系统管理员，也会整理少量设计灵感',
  },
  101: {
    id: 101,
    username: 'user',
    bio: '一句话简介：偏爱 UI / 插画 / 3D 渲染',
  },
  102: {
    id: 102,
    username: 'viewer',
    bio: '偏好浏览与收藏高质量素材',
  },
  201: {
    id: 201,
    username: 'User 1',
    bio: '热爱设计与创意',
  },
  202: {
    id: 202,
    username: 'User 2',
    bio: '专注 UI 与交互设计',
  },
  203: {
    id: 203,
    username: 'User 3',
    bio: '插画与品牌设计爱好者',
  },
  204: {
    id: 204,
    username: 'User 4',
    bio: '3D 渲染与视觉实验',
  },
  205: {
    id: 205,
    username: 'User 5',
    bio: '摄影与排版灵感收集',
  },
};

const baseSeedUploads: UploadImage[] = [
  {
    id: 'u1',
    title: 'UI 组件库截图',
    uploadedAt: '2026-05-10',
    status: 'private',
    bgColor: cardColors[0],
    url: sampleImages[0],
  },
  {
    id: 'u2',
    title: '3D 渲染测试',
    uploadedAt: '2026-05-08',
    status: 'pending',
    bgColor: cardColors[1],
  },
  {
    id: 'u3',
    title: '品牌配色方案',
    uploadedAt: '2026-05-06',
    status: 'public',
    bgColor: cardColors[2],
    url: sampleImages[2],
  },
  {
    id: 'u4',
    title: '移动端界面',
    uploadedAt: '2026-05-04',
    status: 'public',
    bgColor: cardColors[3],
  },
  {
    id: 'u5',
    title: '插画草稿',
    uploadedAt: '2026-05-02',
    status: 'private',
    bgColor: cardColors[4],
    url: sampleImages[3],
  },
  {
    id: 'u6',
    title: '排版灵感',
    uploadedAt: '2026-04-30',
    status: 'public',
    bgColor: cardColors[5],
  },
  {
    id: 'u7',
    title: '电商首页',
    uploadedAt: '2026-04-28',
    status: 'pending',
    bgColor: cardColors[6],
  },
  {
    id: 'u8',
    title: '极简海报',
    uploadedAt: '2026-04-26',
    status: 'public',
    bgColor: cardColors[7],
    url: sampleImages[5],
  },
];

const baseSeedLikes: LikedImage[] = [
  {
    id: 'l1',
    title: '日落余晖',
    author: '林小设',
    likedAt: '2026-05-10',
    bgColor: cardColors[0],
    url: sampleImages[1],
  },
  {
    id: 'l2',
    title: '城市天际线',
    author: 'PhotoMaster',
    likedAt: '2026-05-08',
    bgColor: cardColors[1],
  },
  {
    id: 'l3',
    title: '水彩花卉',
    author: '插画师A',
    likedAt: '2026-05-06',
    bgColor: cardColors[2],
    url: sampleImages[4],
  },
  {
    id: 'l4',
    title: '几何抽象',
    author: 'DesignLab',
    likedAt: '2026-05-04',
    bgColor: cardColors[3],
  },
  {
    id: 'l5',
    title: '北欧室内',
    author: 'ArchStudio',
    likedAt: '2026-05-02',
    bgColor: cardColors[4],
  },
  {
    id: 'l6',
    title: '字体排版',
    author: 'TypeNerd',
    likedAt: '2026-04-30',
    bgColor: cardColors[5],
  },
  {
    id: 'l7',
    title: '渐变背景',
    author: 'ColorLover',
    likedAt: '2026-04-28',
    bgColor: cardColors[6],
  },
  {
    id: 'l8',
    title: '手绘图标',
    author: 'IconMaker',
    likedAt: '2026-04-26',
    bgColor: cardColors[7],
  },
];

const seedUploads: UploadImage[] = [
  ...baseSeedUploads,
  ...buildExtraUploads(34),
];

const seedLikes: LikedImage[] = [...baseSeedLikes, ...buildExtraLikes(34)];

const seedBoards: BoardRecord[] = [
  {
    id: '1',
    title: '界面设计灵感',
    description: '整理 Web 与 App 端界面设计参考。',
    visibility: 'public',
    ownerId: seedProfile.id,
    ownerUsername: seedProfile.username,
    imageIds: ['u1', 'u4', 'l4', 'l8'],
    coverPalette: [cardColors[0], cardColors[1], cardColors[3]],
  },
  {
    id: '2',
    title: '插画收集',
    description: '偏插画与手绘风格的灵感收集。',
    visibility: 'public',
    ownerId: seedProfile.id,
    ownerUsername: seedProfile.username,
    imageIds: ['u5', 'l3', 'l1'],
    coverPalette: [cardColors[2], cardColors[4], cardColors[0]],
  },
  {
    id: '3',
    title: '3D 渲染',
    description: '材质、打光与渲染风格实验。',
    visibility: 'private',
    ownerId: seedProfile.id,
    ownerUsername: seedProfile.username,
    imageIds: ['u2', 'u7'],
    coverPalette: [cardColors[4], cardColors[5], cardColors[6]],
  },
  {
    id: '4',
    title: '字体与排版',
    description: '排版层级、字体搭配与版式布局。',
    visibility: 'public',
    ownerId: seedProfile.id,
    ownerUsername: seedProfile.username,
    imageIds: ['u6', 'l6', 'u3'],
    coverPalette: [cardColors[7], cardColors[5], cardColors[1]],
  },
];

const userBoardsStateMap = new Map<number, UserBoardsState>();

function scopeMockId(userId: number, value: string) {
  return `${userId}-${value}`;
}

function getScopedUserId(value: string) {
  const match = value.match(/^(\d+)-/);
  return match ? Number(match[1]) : null;
}

function cloneUploadsForUser(userId: number) {
  return seedUploads.map((image) => ({
    ...image,
    id: scopeMockId(userId, image.id),
  }));
}

function cloneLikesForUser(userId: number) {
  return seedLikes.map((image) => ({
    ...image,
    id: scopeMockId(userId, image.id),
  }));
}

function cloneBoardsForUser(userId: number, profile: UserBoardsProfile) {
  return seedBoards.map((board) => ({
    ...board,
    id: scopeMockId(userId, board.id),
    ownerId: profile.id,
    ownerUsername: profile.username,
    imageIds: board.imageIds.map((imageId) => scopeMockId(userId, imageId)),
    coverPalette: [...board.coverPalette],
  }));
}

function resolveProfileByUserId(userId: number): UserBoardsProfile {
  return (
    mockProfilesByUserId[userId] || {
      id: userId,
      username: `user-${userId}`,
      bio: seedProfile.bio,
    }
  );
}

function createUserBoardsState(userId: number): UserBoardsState {
  const profile = resolveProfileByUserId(userId);
  return {
    profile: { ...profile },
    boards: cloneBoardsForUser(userId, profile),
    uploads: cloneUploadsForUser(userId),
    likes: cloneLikesForUser(userId),
  };
}

function syncStateProfile(state: UserBoardsState, profile: UserBoardsProfile) {
  state.profile = { ...profile };
  state.boards = state.boards.map((board) => ({
    ...board,
    ownerId: profile.id,
    ownerUsername: profile.username,
  }));
}

function getUserBoardsState(userId: number) {
  const existing = userBoardsStateMap.get(userId);
  if (existing) {
    syncStateProfile(existing, resolveProfileByUserId(userId));
    return existing;
  }
  const nextState = createUserBoardsState(userId);
  userBoardsStateMap.set(userId, nextState);
  return nextState;
}

function findStateByActorUserId(actorUserId: number) {
  return actorUserId > 0 ? getUserBoardsState(actorUserId) : null;
}

function paginateList<T>(
  list: T[],
  page: number,
  pageSize: number
): PaginatedData<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;
  const pageList = list.slice(start, end);
  return {
    list: pageList,
    page: safePage,
    pageSize: safePageSize,
    total: list.length,
    hasMore: end < list.length,
  };
}

function getVisibleLikes(state: UserBoardsState, viewerUserId?: number) {
  return viewerUserId === state.profile.id ? state.likes : [];
}

function getProfileStats(state: UserBoardsState, viewerUserId?: number) {
  return {
    publicBoards: state.boards.filter((item) => item.visibility === 'public')
      .length,
    publicUploads: state.uploads.filter((item) => item.status === 'public')
      .length,
    likes: getVisibleLikes(state, viewerUserId).length,
  };
}

function getImageColor(state: UserBoardsState, imageId: string) {
  const resolved = resolveImageRecord(imageId);
  if (resolved?.source === 'upload') return resolved.fromUpload.bgColor;
  if (resolved?.source === 'like') return resolved.fromLike.bgColor;
  if (resolved?.source === 'explore') return resolved.fromExplore.bgColor;
  if (resolved?.source === 'gallery') {
    return (
      mockItems.find((item) => item.imageUrl === resolved.fromGallery.url)
        ?.bgColor || cardColors[0]
    );
  }
  const image =
    state.uploads.find((item) => item.id === imageId) ||
    state.likes.find((item) => item.id === imageId);
  return image?.bgColor || cardColors[0];
}

function toBoard(
  state: UserBoardsState,
  record: BoardRecord,
  viewerUserId?: number
): Board {
  const visibleImageIds = getVisibleBoardImageIds(record, viewerUserId);
  const covers = [
    ...visibleImageIds
      .slice(0, 3)
      .map((imageId) => getImageColor(state, imageId)),
    ...record.coverPalette,
  ].slice(0, 3);

  while (covers.length < 3) {
    covers.push(cardColors[covers.length % cardColors.length]);
  }

  return {
    id: record.id,
    title: record.title,
    description: record.description,
    imageCount: visibleImageIds.length,
    visibility: record.visibility,
    covers,
  };
}

function getDuplicateBoard(
  state: UserBoardsState,
  name: string,
  excludeId?: string
) {
  const normalized = name.trim().toLowerCase();
  return state.boards.find((board) => {
    if (excludeId && board.id === excludeId) return false;
    return board.title.trim().toLowerCase() === normalized;
  });
}

function getSeedNumber(seed: string) {
  let sum = 0;
  for (const ch of seed) {
    sum += ch.charCodeAt(0);
  }
  return sum;
}

function findBoardRecord(boardId: string) {
  const scopedUserId = getScopedUserId(boardId);
  if (scopedUserId !== null) {
    const state = getUserBoardsState(scopedUserId);
    return state.boards.find((board) => board.id === boardId) || null;
  }
  for (const state of userBoardsStateMap.values()) {
    const board = state.boards.find((item) => item.id === boardId);
    if (board) return board;
  }
  return null;
}

function resolveEditableBoardState(boardId: string, actorUserId: number) {
  const board = findBoardRecord(boardId);
  if (!board) {
    throw new Error('画板不存在');
  }
  if (board.ownerId !== actorUserId) {
    throw new Error('无权限访问');
  }

  const state = findStateByActorUserId(actorUserId);
  if (!state) {
    throw new Error('无权限访问');
  }

  const targetIndex = state.boards.findIndex((item) => item.id === boardId);
  if (targetIndex < 0) {
    throw new Error('画板不存在');
  }

  return {
    state,
    targetIndex,
    current: state.boards[targetIndex],
  };
}

function canViewerAccessBoardImage(imageId: string, viewerUserId?: number) {
  const resolved = resolveImageRecord(imageId);
  if (!resolved) {
    return false;
  }
  if (resolved.source === 'upload') {
    return (
      resolved.fromUpload.status === 'public' ||
      resolved.uploadOwner.profile.id === viewerUserId
    );
  }
  return true;
}

function getVisibleBoardImageIds(board: BoardRecord, viewerUserId?: number) {
  return board.imageIds.filter((imageId) =>
    canViewerAccessBoardImage(imageId, viewerUserId)
  );
}

function getBoardAccess(board: BoardRecord, actorUserId?: number) {
  if (board.visibility === 'private' && board.ownerId !== actorUserId) {
    throw new Error('无权限访问');
  }
}

function findUploadRecord(imageId: string): OwnedUploadRecord | null {
  for (const state of userBoardsStateMap.values()) {
    const image = state.uploads.find((item) => item.id === imageId);
    if (image) return { state, image };
  }
  return null;
}

function findLikeRecord(imageId: string): OwnedLikeRecord | null {
  for (const state of userBoardsStateMap.values()) {
    const image = state.likes.find((item) => item.id === imageId);
    if (image) return { state, image };
  }
  return null;
}

function resolveExploreItem(imageId: string): ExploreItem | null {
  return mockItems.find((item) => item.id === imageId) || null;
}

function resolveGalleryImage(imageId: string): Image | null {
  return getImagesMock().find((item) => item.id === imageId) || null;
}

function buildGalleryAuthor(imageId: string) {
  const seed = getSeedNumber(imageId);
  return {
    id: 401 + (seed % 20),
    username: `图库作者 ${String((seed % 20) + 1).padStart(2, '0')}`,
  };
}

function resolveImageRecord(imageId: string):
  | {
      source: 'upload';
      fromUpload: UploadImage;
      uploadOwner: UserBoardsState;
    }
  | {
      source: 'like';
      fromLike: LikedImage;
      likeOwner: UserBoardsState;
    }
  | {
      source: 'explore';
      fromExplore: ExploreItem;
    }
  | {
      source: 'gallery';
      fromGallery: Image;
    }
  | null {
  const uploadRecord = findUploadRecord(imageId);
  if (uploadRecord) {
    return {
      source: 'upload',
      fromUpload: uploadRecord.image,
      uploadOwner: uploadRecord.state,
    };
  }

  const exploreItem = resolveExploreItem(imageId);
  if (exploreItem) {
    return {
      source: 'explore',
      fromExplore: exploreItem,
    };
  }

  const galleryImage = resolveGalleryImage(imageId);
  if (galleryImage) {
    return {
      source: 'gallery',
      fromGallery: galleryImage,
    };
  }

  const likeRecord = findLikeRecord(imageId);
  if (likeRecord) {
    return {
      source: 'like',
      fromLike: likeRecord.image,
      likeOwner: likeRecord.state,
    };
  }

  return null;
}

function resolveBoardDetailImage(imageId: string): BoardDetailImage {
  const resolved = resolveImageRecord(imageId);
  if (!resolved) {
    throw new Error('图片不存在');
  }

  const seed = getSeedNumber(imageId);
  const source: BoardDetailImageSource =
    resolved.source === 'upload' || resolved.source === 'like'
      ? resolved.source
      : 'like';

  if (resolved.source === 'upload') {
    return {
      id: imageId,
      title: resolved.fromUpload.title,
      imageHeight: boardDetailHeights[seed % boardDetailHeights.length],
      bgColor: resolved.fromUpload.bgColor,
      url: resolved.fromUpload.url,
      tag: boardDetailTags[seed % boardDetailTags.length],
      author: resolved.uploadOwner.profile.username,
      source,
    };
  }

  if (resolved.source === 'like') {
    return {
      id: imageId,
      title: resolved.fromLike.title,
      imageHeight: boardDetailHeights[seed % boardDetailHeights.length],
      bgColor: resolved.fromLike.bgColor,
      url: resolved.fromLike.url,
      tag: boardDetailTags[seed % boardDetailTags.length],
      author: resolved.fromLike.author,
      source,
    };
  }

  const derivedColor =
    resolved.source === 'explore'
      ? resolved.fromExplore.bgColor
      : mockItems.find((item) => item.imageUrl === resolved.fromGallery.url)
          ?.bgColor || cardColors[seed % cardColors.length];

  return {
    id: imageId,
    title:
      resolved.source === 'explore'
        ? resolved.fromExplore.title
        : resolved.fromGallery.title,
    imageHeight: boardDetailHeights[seed % boardDetailHeights.length],
    bgColor: derivedColor,
    url:
      resolved.source === 'explore'
        ? resolved.fromExplore.imageUrl
        : resolved.fromGallery.url,
    tag: boardDetailTags[seed % boardDetailTags.length],
    author:
      resolved.source === 'explore'
        ? resolved.fromExplore.author.username
        : buildGalleryAuthor(imageId).username,
    source,
  };
}

export function getUserBoardsSummaryMock(
  userId: number,
  viewerUserId?: number
): UserBoardsSummary {
  const state = getUserBoardsState(userId);
  return {
    profile: { ...state.profile },
    stats: getProfileStats(state, viewerUserId),
  };
}

export function getUserBoardsPageMock(
  userId: number,
  query: { page: number; pageSize: number },
  viewerUserId?: number
) {
  const state = getUserBoardsState(userId);
  const visibleBoards =
    viewerUserId === userId
      ? state.boards
      : state.boards.filter((board) => board.visibility === 'public');
  return paginateList(
    visibleBoards.map((board) => toBoard(state, board, viewerUserId)),
    query.page,
    query.pageSize
  );
}

export function getUserUploadsPageMock(
  userId: number,
  query: {
    page: number;
    pageSize: number;
    keyword?: string;
    sort?: 'newest' | 'oldest';
  },
  viewerUserId?: number
) {
  const state = getUserBoardsState(userId);
  const keyword = query.keyword?.trim().toLowerCase() || '';
  const visibleUploads =
    viewerUserId === userId
      ? state.uploads
      : state.uploads.filter((item) => item.status === 'public');
  const filtered = visibleUploads.filter((item) =>
    !keyword ? true : item.title.toLowerCase().includes(keyword)
  );
  const sorted = [...filtered].sort((a, b) =>
    query.sort === 'oldest'
      ? a.uploadedAt.localeCompare(b.uploadedAt)
      : b.uploadedAt.localeCompare(a.uploadedAt)
  );
  return paginateList(sorted, query.page, query.pageSize);
}

export function getUserBoardsLikesPageMock(
  userId: number,
  query: { page: number; pageSize: number; keyword?: string },
  viewerUserId?: number
) {
  const state = getUserBoardsState(userId);
  const keyword = query.keyword?.trim().toLowerCase() || '';
  const filtered = getVisibleLikes(state, viewerUserId).filter((item) => {
    if (!keyword) return true;
    return (
      item.title.toLowerCase().includes(keyword) ||
      item.author.toLowerCase().includes(keyword)
    );
  });
  const sorted = [...filtered].sort((a, b) =>
    b.likedAt.localeCompare(a.likedAt)
  );
  return paginateList(sorted, query.page, query.pageSize);
}

export function createUserBoardMock(
  userId: number,
  username: string,
  data: BoardFormPayload
) {
  const state = getUserBoardsState(userId);
  if (getDuplicateBoard(state, data.name)) {
    throw new Error('画板名称已存在');
  }

  const nextBoard: BoardRecord = {
    id: scopeMockId(userId, `${Date.now()}`),
    title: data.name.trim(),
    description: data.description.trim(),
    visibility: data.visibility,
    ownerId: userId,
    ownerUsername: username,
    imageIds: [],
    coverPalette: cardColors.slice(0, 3),
  };

  state.boards = [nextBoard, ...state.boards];
  return toBoard(state, nextBoard);
}

export function updateUserBoardMock(
  boardId: string,
  data: BoardFormPayload,
  actorUserId: number
) {
  const { state, targetIndex, current } = resolveEditableBoardState(
    boardId,
    actorUserId
  );
  if (getDuplicateBoard(state, data.name, boardId)) {
    throw new Error('画板名称已存在');
  }
  const updated: BoardRecord = {
    ...current,
    title: data.name.trim(),
    description: data.description.trim(),
    visibility: data.visibility,
  };

  state.boards = state.boards.map((board, index) =>
    index === targetIndex ? updated : board
  );

  return toBoard(state, updated);
}

export function deleteUserBoardMock(boardId: string, actorUserId: number) {
  const { state } = resolveEditableBoardState(boardId, actorUserId);
  state.boards = state.boards.filter((board) => board.id !== boardId);
  return true;
}

export function collectImageToBoardMock(
  boardId: string,
  imageId: string,
  source: ImageDetailSource,
  actorUserId: number
) {
  const { state, targetIndex, current } = resolveEditableBoardState(
    boardId,
    actorUserId
  );

  const image =
    source === 'upload'
      ? state.uploads.find((item) => item.id === imageId) || null
      : source === 'like'
        ? state.likes.find((item) => item.id === imageId) || null
        : source === 'explore'
          ? resolveExploreItem(imageId)
          : resolveGalleryImage(imageId);

  if (!image) {
    throw new Error('图片不存在');
  }
  if (current.imageIds.includes(imageId)) {
    throw new Error('该图片已在画板中');
  }

  let coverColor = cardColors[0];
  if (source === 'gallery') {
    const galleryImage = image as Image;
    coverColor =
      mockItems.find((item) => item.imageUrl === galleryImage.url)?.bgColor ||
      cardColors[0];
  } else {
    const coloredImage = image as UploadImage | LikedImage | ExploreItem;
    coverColor = coloredImage.bgColor;
  }

  const updated: BoardRecord = {
    ...current,
    imageIds: [imageId, ...current.imageIds],
    coverPalette: [coverColor, ...current.coverPalette].slice(0, 3),
  };

  state.boards = state.boards.map((board, index) =>
    index === targetIndex ? updated : board
  );

  return toBoard(state, updated);
}

export function updateUploadedImageStatusMock(
  imageId: string,
  status: UploadImageStatus,
  actorUserId?: number
) {
  const state = actorUserId ? findStateByActorUserId(actorUserId) : null;
  if (actorUserId && !state) {
    throw new Error('无权限访问');
  }
  const targetState =
    state || getUserBoardsState(getScopedUserId(imageId) || 101);
  const targetIndex = targetState.uploads.findIndex(
    (item) => item.id === imageId
  );
  if (targetIndex < 0) {
    throw new Error('图片不存在');
  }

  const updated: UploadImage = {
    ...targetState.uploads[targetIndex],
    status,
  };

  targetState.uploads = targetState.uploads.map((item, index) =>
    index === targetIndex ? updated : item
  );

  return updated;
}

export function deleteUploadedImageMock(imageId: string, actorUserId?: number) {
  const state = actorUserId ? findStateByActorUserId(actorUserId) : null;
  if (actorUserId && !state) {
    throw new Error('无权限访问');
  }
  const targetState =
    state || getUserBoardsState(getScopedUserId(imageId) || 101);
  const exists = targetState.uploads.some((item) => item.id === imageId);
  if (!exists) {
    throw new Error('图片不存在');
  }

  targetState.uploads = targetState.uploads.filter(
    (item) => item.id !== imageId
  );
  targetState.boards = targetState.boards.map((board) => ({
    ...board,
    imageIds: board.imageIds.filter((id) => id !== imageId),
  }));
  return true;
}

export function unlikeImageMock(imageId: string, actorUserId?: number) {
  const state = actorUserId ? findStateByActorUserId(actorUserId) : null;
  if (actorUserId && !state) {
    throw new Error('无权限访问');
  }
  const targetState =
    state || getUserBoardsState(getScopedUserId(imageId) || 101);
  const exists = targetState.likes.some((item) => item.id === imageId);
  if (!exists) {
    throw new Error('图片不存在');
  }

  targetState.likes = targetState.likes.filter((item) => item.id !== imageId);
  targetState.boards = targetState.boards.map((board) => ({
    ...board,
    imageIds: board.imageIds.filter((id) => id !== imageId),
  }));
  return true;
}

export function syncUserBoardsProfileMock(
  userId: number,
  profile: Partial<Pick<UserBoardsProfile, 'username' | 'bio'>>
) {
  const current = resolveProfileByUserId(userId);
  const nextProfile: UserBoardsProfile = {
    ...current,
    ...(typeof profile.username === 'string'
      ? { username: profile.username }
      : {}),
    ...(typeof profile.bio === 'string' ? { bio: profile.bio } : {}),
  };
  mockProfilesByUserId[userId] = nextProfile;
  const existing = userBoardsStateMap.get(userId);
  if (existing) {
    syncStateProfile(existing, nextProfile);
  }
}

export function resetUserBoardsMock() {
  userBoardsStateMap.clear();
}

export function getBoardDetailMock(
  boardId: string,
  actorUserId?: number
): BoardDetail {
  const board = findBoardRecord(boardId);
  if (!board) {
    throw new Error('画板不存在');
  }

  getBoardAccess(board, actorUserId);
  const visibleImageIds = getVisibleBoardImageIds(board, actorUserId);

  return {
    id: board.id,
    title: board.title,
    description: board.description,
    imageCount: visibleImageIds.length,
    visibility: board.visibility,
    owner: {
      id: board.ownerId,
      username: board.ownerUsername,
    },
    canEdit: board.ownerId === actorUserId,
    images: visibleImageIds.map((imageId) => resolveBoardDetailImage(imageId)),
  };
}

export async function uploadBoardImagesToBoardMock(
  boardId: string,
  formData: FormData,
  actorUserId: number
): Promise<BoardDetail> {
  const { state, targetIndex, current } = resolveEditableBoardState(
    boardId,
    actorUserId
  );

  const files = formData
    .getAll('files')
    .filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    throw new Error('未选择文件');
  }

  if (files.length > 50) {
    throw new Error('最多上传 50 张图片');
  }

  const date = new Date().toISOString().slice(0, 10);
  const newImages: UploadImage[] = files.map((file, index) => {
    const id = `u${Date.now()}${index}`;
    const title = file.name.replace(/\.[^/.]+$/, '');
    const sampleIndex = (Date.now() + index) % sampleImages.length;
    return {
      id: scopeMockId(current.ownerId, id),
      title: title || '未命名',
      uploadedAt: date,
      status: 'private',
      bgColor: cardColors[(Date.now() + index) % cardColors.length],
      url: sampleImages[sampleIndex],
    };
  });

  state.uploads = [...newImages, ...state.uploads];

  const updated: BoardRecord = {
    ...current,
    imageIds: [...newImages.map((item) => item.id), ...current.imageIds],
    coverPalette: [
      ...newImages.map((item) => item.bgColor),
      ...current.coverPalette,
    ].slice(0, 3),
  };

  state.boards = state.boards.map((board, index) =>
    index === targetIndex ? updated : board
  );

  return getBoardDetailMock(boardId, actorUserId);
}

function resolveImageSource(imageId: string): {
  source: ImageDetailSource;
  fromLike: LikedImage | null;
  fromUpload: UploadImage | null;
  likeOwner: UserBoardsState | null;
  uploadOwner: UserBoardsState | null;
  fromExplore: ExploreItem | null;
  fromGallery: Image | null;
} {
  const resolved = resolveImageRecord(imageId);
  if (!resolved) {
    return {
      source: 'gallery',
      fromLike: null,
      fromUpload: null,
      likeOwner: null,
      uploadOwner: null,
      fromExplore: null,
      fromGallery: null,
    };
  }

  if (resolved.source === 'upload') {
    return {
      source: 'upload',
      fromLike: null,
      fromUpload: resolved.fromUpload,
      likeOwner: null,
      uploadOwner: resolved.uploadOwner,
      fromExplore: null,
      fromGallery: null,
    };
  }

  if (resolved.source === 'like') {
    return {
      source: 'like',
      fromLike: resolved.fromLike,
      fromUpload: null,
      likeOwner: resolved.likeOwner,
      uploadOwner: null,
      fromExplore: null,
      fromGallery: null,
    };
  }

  if (resolved.source === 'explore') {
    return {
      source: 'explore',
      fromLike: null,
      fromUpload: null,
      likeOwner: null,
      uploadOwner: null,
      fromExplore: resolved.fromExplore,
      fromGallery: null,
    };
  }

  return {
    source: 'gallery',
    fromLike: null,
    fromUpload: null,
    likeOwner: null,
    uploadOwner: null,
    fromExplore: null,
    fromGallery: resolved.fromGallery,
  };
}

function getImageDetailTags(source: ImageDetailSource, imageId: string) {
  if (source === 'upload' || source === 'like') {
    return [boardDetailTags[getSeedNumber(imageId) % boardDetailTags.length]];
  }
  if (source === 'explore') {
    return (
      mockItems
        .find((item) => item.id === imageId)
        ?.tags.map((tag) => String(tag)) || []
    );
  }
  const list = getImagesMock();
  return (
    list.find((item) => item.id === imageId)?.tags?.map((tag) => String(tag)) ||
    []
  );
}

function resolveExploreBgColor(imageId: string) {
  return (
    mockItems.find((item) => item.id === imageId)?.bgColor || cardColors[0]
  );
}

export function getImageDetailMock(
  imageId: string,
  viewerUserId?: number
): ImageDetail {
  const state = viewerUserId ? getUserBoardsState(viewerUserId) : undefined;
  const {
    source,
    fromLike,
    fromUpload,
    likeOwner,
    uploadOwner,
    fromExplore,
    fromGallery,
  } = resolveImageSource(imageId);
  const isLiked = state?.likes.some((item) => item.id === imageId) || false;
  const tags = getImageDetailTags(source, imageId);
  const today = new Date().toISOString().slice(0, 10);

  if (source === 'upload' && fromUpload) {
    if (
      fromUpload.status !== 'public' &&
      uploadOwner?.profile.id !== viewerUserId
    ) {
      throw new Error('无权限访问');
    }
    return {
      id: fromUpload.id,
      title: fromUpload.title,
      createdAt: fromUpload.uploadedAt,
      tags,
      author: {
        id: uploadOwner?.profile.id || state?.profile.id || 0,
        username:
          uploadOwner?.profile.username || state?.profile.username || '',
      },
      isLiked,
      source,
      bgColor: fromUpload.bgColor,
      url: fromUpload.url,
      size: 1024 * 1024 * 3,
    };
  }

  if (source === 'like' && fromLike) {
    return {
      id: fromLike.id,
      title: fromLike.title,
      createdAt: fromLike.likedAt,
      tags,
      author: {
        id:
          301 +
          Math.max(
            0,
            likeOwner?.likes.findIndex((item) => item.id === fromLike.id) || 0
          ),
        username: fromLike.author,
      },
      isLiked,
      source,
      bgColor: fromLike.bgColor,
      url: fromLike.url,
      size: 1024 * 1024 * 4,
    };
  }

  if (source === 'explore') {
    if (!fromExplore) {
      throw new Error('图片不存在');
    }
    return {
      id: fromExplore.id,
      title: fromExplore.title,
      createdAt: today,
      tags,
      author: fromExplore.author,
      isLiked,
      source,
      bgColor: fromExplore.bgColor,
      url: fromExplore.imageUrl,
    };
  }

  if (!fromGallery) {
    throw new Error('图片不存在');
  }

  return {
    id: fromGallery.id,
    title: fromGallery.title,
    createdAt: fromGallery.createdAt,
    tags,
    author: buildGalleryAuthor(imageId),
    isLiked,
    source: 'gallery',
    url: fromGallery.url,
    size: fromGallery.size,
    bgColor:
      mockItems.find((item) => item.imageUrl === fromGallery.url)?.bgColor ||
      cardColors[0],
  };
}

export function likeImageMock(imageId: string, actorUserId = 0) {
  const state = getUserBoardsState(actorUserId);
  const exists = state.likes.find((item) => item.id === imageId);
  if (exists) return { ...exists };

  const detail = getImageDetailMock(imageId, actorUserId);
  const date = new Date().toISOString().slice(0, 10);
  const next: LikedImage = {
    id: detail.id,
    title: detail.title,
    author: detail.author.username,
    likedAt: date,
    bgColor:
      detail.bgColor ||
      (detail.source === 'gallery'
        ? cardColors[0]
        : resolveExploreBgColor(detail.id)),
    url: detail.url,
  };

  state.likes = [next, ...state.likes];
  return { ...next };
}
