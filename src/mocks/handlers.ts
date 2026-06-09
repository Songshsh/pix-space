import { http, HttpResponse } from 'msw';
import { getDashboardMock } from './dashboard';
import {
  createFolderMock,
  deleteFileMock,
  findFileByIdMock,
  getFilesMock,
  updateFileMock,
  uploadFileMock,
} from './files';
import {
  deleteImageMock,
  getImageListMock,
  updateImageMock,
  uploadImagesMock,
} from './images';
import {
  createUserMock,
  deleteUserMock,
  findUserByEmailMock,
  findUserByIdMock,
  getUsersMock,
  removeUserAccountMock,
  upsertUserAccountMock,
  updateUserMock,
  updateUserStatusMock,
} from './users';
import {
  collectImageToBoardMock,
  createUserBoardMock,
  deleteUploadedImageMock,
  deleteUserBoardMock,
  getBoardDetailMock,
  getImageDetailMock,
  getUserBoardsLikesPageMock,
  getUserBoardsPageMock,
  getUserBoardsSummaryMock,
  getUserUploadsPageMock,
  likeImageMock,
  syncUserBoardsProfileMock,
  unlikeImageMock,
  updateUploadedImageStatusMock,
  updateUserBoardMock,
  uploadBoardImagesToBoardMock,
} from './user-boards';
import { getExploreMock } from './explore';
import type { AuthUser, UserPreferences } from '../types/auth';

function json(data: unknown, init?: ResponseInit) {
  return new HttpResponse(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function decodeBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function sanitizeFilenamePart(input: string) {
  const cleaned = input
    .trim()
    .replace(/[\\/:*?"<>|\n\r\t]/g, '-')
    .replace(/\s+/g, ' ')
    .slice(0, 60);
  return cleaned || 'untitled';
}

function getFileExtensionFromUrl(url?: string) {
  const cleanUrl = String(url || '')
    .split('?')[0]
    ?.split('#')[0];
  const match = cleanUrl?.match(/\.([a-zA-Z0-9]+)$/);
  return match?.[1]?.toLowerCase() || 'png';
}

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

type Role = 'admin' | 'user' | 'viewer';

type MockProfile = AuthUser & {
  phone?: string;
  bio?: string;
  avatar?: string;
};

const mockAccounts: Array<{
  id: number;
  email: string;
  role: Role;
  username: string;
}> = [
  { id: 1, email: 'admin@pixspace.test', role: 'admin', username: 'admin' },
  { id: 101, email: 'user@pixspace.test', role: 'user', username: 'user' },
  {
    id: 102,
    email: 'viewer@pixspace.test',
    role: 'viewer',
    username: 'viewer',
  },
  { id: 201, email: 'user1@pixspace.test', role: 'user', username: 'User 1' },
  { id: 202, email: 'user2@pixspace.test', role: 'user', username: 'User 2' },
  { id: 203, email: 'user3@pixspace.test', role: 'user', username: 'User 3' },
  { id: 204, email: 'user4@pixspace.test', role: 'user', username: 'User 4' },
  { id: 205, email: 'user5@pixspace.test', role: 'user', username: 'User 5' },
];

const passwordState = new Map<string, string>();

const profileState = new Map<string, MockProfile>(
  mockAccounts.map((account) => [
    account.email,
    {
      id: account.id,
      name: account.username,
      email: account.email,
      role: account.role,
      avatar: '',
      phone: '',
      bio: '',
    },
  ])
);

const createDefaultPreferences = (): UserPreferences => ({
  twoFactorEnabled: false,
  notifications: {
    system: true,
    email: true,
    upload: false,
    comment: true,
  },
});

const preferencesState = new Map<string, UserPreferences>(
  mockAccounts.map((account) => [account.email, createDefaultPreferences()])
);

const MOCK_SESSION_STORAGE_KEY = 'pix-space-mock-session';

interface MockSessionSnapshot {
  email: string;
}

function readMockSessionEmail() {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(MOCK_SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const snapshot = JSON.parse(raw) as Partial<MockSessionSnapshot>;
    const email =
      typeof snapshot.email === 'string' ? snapshot.email.trim() : '';
    if (!email || !profileState.has(email)) {
      window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
      return null;
    }
    return email;
  } catch {
    window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return null;
  }
}

function writeMockSessionEmail(email: string | null) {
  if (typeof window === 'undefined') return;
  if (!email) {
    window.localStorage.removeItem(MOCK_SESSION_STORAGE_KEY);
    return;
  }
  const snapshot: MockSessionSnapshot = {
    email,
  };
  window.localStorage.setItem(
    MOCK_SESSION_STORAGE_KEY,
    JSON.stringify(snapshot)
  );
}

let currentSessionEmail: string | null = readMockSessionEmail();

function getSessionUser() {
  if (!currentSessionEmail) return null;
  const profile = profileState.get(currentSessionEmail);
  return profile ? { ...profile } : null;
}

function ensureAuthenticatedSession() {
  const user = getSessionUser();
  if (!user) {
    return {
      user: null,
      denied: json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      ),
    };
  }
  return { user, denied: null };
}

function ensureAdminSession() {
  const { user, denied } = ensureAuthenticatedSession();
  if (denied || !user) return { user: null, denied };
  if (user.role !== 'admin') {
    return {
      user: null,
      denied: json(
        { code: 403, message: '没有访问该资源的权限', data: null },
        { status: 403 }
      ),
    };
  }
  return { user, denied: null };
}

function ensureOwnUserSession(userIdParam: string | undefined) {
  const user = getSessionUser();
  if (!user) {
    return {
      user: null,
      denied: json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      ),
    };
  }
  if (user.id !== Number(userIdParam || 0)) {
    return {
      user: null,
      denied: json(
        { code: 403, message: '无权限访问', data: null },
        { status: 403 }
      ),
    };
  }
  return { user, denied: null };
}

function syncManagedUserAccount(
  user: {
    id: number;
    username: string;
    email: string;
    role: Role;
  },
  options?: {
    previousEmail?: string;
    password?: string;
    remove?: boolean;
  }
) {
  const previousEmail = options?.previousEmail?.trim() || user.email;
  const currentProfile =
    profileState.get(previousEmail) || profileState.get(user.email) || null;
  const currentPassword =
    passwordState.get(previousEmail) || passwordState.get(user.email) || '';
  const currentPreferences =
    preferencesState.get(previousEmail) ||
    preferencesState.get(user.email) ||
    null;

  if (previousEmail !== user.email) {
    profileState.delete(previousEmail);
    passwordState.delete(previousEmail);
    preferencesState.delete(previousEmail);
    if (currentSessionEmail === previousEmail) {
      currentSessionEmail = options?.remove ? null : user.email;
      writeMockSessionEmail(currentSessionEmail);
    }
  }

  if (options?.remove) {
    if (
      currentSessionEmail === previousEmail ||
      currentSessionEmail === user.email
    ) {
      currentSessionEmail = null;
      writeMockSessionEmail(null);
    }
    profileState.delete(user.email);
    passwordState.delete(user.email);
    preferencesState.delete(user.email);
    return;
  }

  profileState.set(user.email, {
    id: user.id,
    name: user.username,
    email: user.email,
    role: user.role,
    avatar: currentProfile?.avatar || '',
    phone: currentProfile?.phone || '',
    bio: currentProfile?.bio || '',
  });
  syncUserBoardsProfileMock(user.id, {
    username: user.username,
    bio: currentProfile?.bio || '',
  });

  const nextPassword = options?.password || currentPassword;
  if (nextPassword) {
    passwordState.set(user.email, nextPassword);
  }

  preferencesState.set(
    user.email,
    currentPreferences || createDefaultPreferences()
  );
}

function getAuthenticatedUserId() {
  return getSessionUser()?.id || 0;
}

function resolveExistingUserId(rawUserId: string | undefined) {
  const userId = Number(rawUserId || 0);
  if (!Number.isInteger(userId) || userId <= 0 || !findUserByIdMock(userId)) {
    return null;
  }
  return userId;
}

function parseTrailingNumericId(url: string) {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/\/(\d+)(?:\/status)?$/);
  return match ? Number(match[1]) : NaN;
}

export const handlers = [
  http.get('*/api/explore', () => {
    return json({
      code: 0,
      message: 'ok',
      data: getExploreMock(),
    });
  }),

  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const email = (body?.email as string) || '';
    const password = (body?.password as string) || '';
    const user = profileState.get(email);
    const managedUser = findUserByEmailMock(email);
    if (managedUser && managedUser.status !== 'active') {
      return json(
        {
          code: 403,
          message: '账号已被停用',
          data: null,
        },
        { status: 403 }
      );
    }
    if (!user || !password.trim()) {
      return json(
        {
          code: 401,
          message: '邮箱或密码错误',
          data: null,
        },
        { status: 401 }
      );
    }
    const expectedPassword = passwordState.get(email);
    if (passwordState.has(email) && expectedPassword !== password) {
      return json(
        {
          code: 401,
          message: '邮箱或密码错误',
          data: null,
        },
        { status: 401 }
      );
    }
    currentSessionEmail = email;
    writeMockSessionEmail(email);
    return json({
      code: 0,
      message: 'ok',
      data: {
        user,
      },
    });
  }),

  http.post('*/api/auth/register', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return json(
        {
          code: 400,
          message: '参数错误',
          data: null,
        },
        { status: 400 }
      );
    }

    if (profileState.has(email)) {
      return json(
        {
          code: 400,
          message: '该邮箱已被注册',
          data: null,
        },
        { status: 400 }
      );
    }

    const nextUser = createUserMock({
      username: name,
      email,
      password,
      role: 'user',
      status: 'active',
    });

    profileState.set(email, {
      id: nextUser.id,
      name,
      email,
      role: 'user',
      avatar: '',
      phone: '',
      bio: '',
    });
    syncUserBoardsProfileMock(nextUser.id, { username: name, bio: '' });
    passwordState.set(email, password);
    preferencesState.set(email, createDefaultPreferences());

    return json({
      code: 0,
      message: 'ok',
      data: true,
    });
  }),

  http.post('*/api/auth/forgot-password', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const email = (body.email as string) || '';

    if (!email || !email.includes('@')) {
      return json(
        {
          code: 400,
          message: '邮箱格式不正确',
          data: null,
        },
        { status: 400 }
      );
    }

    return json({
      code: 0,
      message: 'ok',
      data: true,
    });
  }),

  http.post('*/api/auth/logout', () => {
    currentSessionEmail = null;
    writeMockSessionEmail(null);
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.get('*/api/auth/session', () => {
    const user = getSessionUser();
    if (!user) {
      return json(
        {
          code: 401,
          message: '未登录或登录已过期',
          data: null,
        },
        { status: 401 }
      );
    }
    return json({
      code: 0,
      message: 'ok',
      data: {
        user,
      },
    });
  }),

  http.put('*/api/user/profile', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const user = getSessionUser();
    if (!user) {
      return json(
        { code: 401, message: '未登录', data: null },
        { status: 401 }
      );
    }
    const nextUser: MockProfile = { ...user };
    if (typeof body.name === 'string') {
      nextUser.name = body.name;
    }
    if (typeof body.email === 'string') {
      const trimmedEmail = body.email.trim();
      if (!trimmedEmail) {
        return json(
          {
            code: 400,
            message: '邮箱不能为空',
            data: null,
          },
          { status: 400 }
        );
      }
      nextUser.email = trimmedEmail;
    }
    if (typeof body.phone === 'string') {
      nextUser.phone = body.phone;
    }
    if (typeof body.bio === 'string') {
      nextUser.bio = body.bio;
    }
    if (typeof body.avatar === 'string') {
      nextUser.avatar = body.avatar;
    }
    if (nextUser.email !== user.email) {
      const managedUser = findUserByEmailMock(nextUser.email);
      const emailOccupied =
        (managedUser && managedUser.id !== nextUser.id) ||
        profileState.has(nextUser.email);
      if (emailOccupied) {
        return json(
          {
            code: 400,
            message: '邮箱已存在',
            data: null,
          },
          { status: 400 }
        );
      }
      profileState.delete(user.email);
      if (passwordState.has(user.email)) {
        passwordState.set(nextUser.email, passwordState.get(user.email) || '');
        passwordState.delete(user.email);
      }
      if (preferencesState.has(user.email)) {
        preferencesState.set(
          nextUser.email,
          preferencesState.get(user.email) || createDefaultPreferences()
        );
        preferencesState.delete(user.email);
      }
      currentSessionEmail = nextUser.email;
      writeMockSessionEmail(nextUser.email);
    }
    profileState.set(nextUser.email, nextUser);
    const nextUserStatus =
      typeof nextUser.id === 'number'
        ? findUserByIdMock(nextUser.id)?.status
        : undefined;
    upsertUserAccountMock({
      id: nextUser.id,
      username: nextUser.name,
      email: nextUser.email,
      role: nextUser.role,
      status: nextUserStatus || 'active',
      avatar: nextUser.avatar,
    });
    if (typeof nextUser.id === 'number') {
      syncUserBoardsProfileMock(nextUser.id, {
        username: nextUser.name,
        bio: nextUser.bio || '',
      });
    }
    return json({
      code: 0,
      message: 'ok',
      data: nextUser,
    });
  }),

  http.get('*/api/user/preferences', () => {
    const user = getSessionUser();
    if (!user) {
      return json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      );
    }
    const preferences =
      preferencesState.get(user.email) || createDefaultPreferences();
    return json({
      code: 0,
      message: 'ok',
      data: preferences,
    });
  }),

  http.put('*/api/user/preferences', async ({ request }) => {
    const body = (await request
      .json()
      .catch(() => ({}))) as Partial<UserPreferences>;
    const user = getSessionUser();
    if (!user) {
      return json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      );
    }
    const current =
      preferencesState.get(user.email) || createDefaultPreferences();
    const nextPreferences: UserPreferences = {
      twoFactorEnabled: body.twoFactorEnabled ?? current.twoFactorEnabled,
      notifications: {
        ...current.notifications,
        ...(body.notifications || {}),
      },
    };
    preferencesState.set(user.email, nextPreferences);
    return json({
      code: 0,
      message: 'ok',
      data: nextPreferences,
    });
  }),

  http.delete('*/api/user/account', () => {
    const user = getSessionUser();
    if (!user) {
      return json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      );
    }
    profileState.delete(user.email);
    passwordState.delete(user.email);
    preferencesState.delete(user.email);
    removeUserAccountMock({ id: user.id, email: user.email });
    currentSessionEmail = null;
    writeMockSessionEmail(null);
    return json({
      code: 0,
      message: 'ok',
      data: true,
    });
  }),

  http.put('*/api/user/password', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const oldPassword =
      typeof body.oldPassword === 'string' ? body.oldPassword : '';
    const newPassword =
      typeof body.newPassword === 'string' ? body.newPassword : '';

    const user = getSessionUser();
    if (!user) {
      return json(
        { code: 401, message: '未登录或登录已过期', data: null },
        { status: 401 }
      );
    }

    if (!oldPassword || !newPassword) {
      return json(
        { code: 400, message: '参数错误', data: null },
        { status: 400 }
      );
    }

    const expectedPassword = passwordState.get(user.email);
    if (passwordState.has(user.email) && expectedPassword !== oldPassword) {
      return json(
        { code: 400, message: '旧密码错误', data: null },
        { status: 400 }
      );
    }

    passwordState.set(user.email, newPassword);
    const currentUserStatus =
      typeof user.id === 'number'
        ? findUserByIdMock(user.id)?.status
        : undefined;
    upsertUserAccountMock({
      id: user.id,
      username: user.name,
      email: user.email,
      role: user.role,
      status: currentUserStatus || 'active',
      password: newPassword,
      avatar: user.avatar,
    });
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.get(/\/api\/files\/[^/]+\/download$/, ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const pathname = new URL(request.url).pathname;
    const match = pathname.match(/\/api\/files\/([^/]+)\/download$/);
    const fileId = Number(match?.[1] || 0);
    const file = findFileByIdMock(fileId);
    if (!file) {
      return json(
        { code: 404, message: '文件不存在', data: null },
        { status: 404 }
      );
    }
    const filenameEncoded = encodeURIComponent(file.name);
    const filenameFallback = file.name.replace(/[^\x20-\x7E]/g, '_');
    return new HttpResponse(`mock-file-content:${file.name}`, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filenameFallback}"; filename*=UTF-8''${filenameEncoded}`,
      },
    });
  }),

  http.get(/\/api\/images\/[^/]+\/download$/, async ({ request }) => {
    const pathname = new URL(request.url).pathname;
    const match = pathname.match(/\/api\/images\/([^/]+)\/download$/);
    const imageId = match?.[1] || '';
    const fallbackFilename = imageId
      ? `image-${imageId}.png`
      : 'mock-image.png';

    let detail;
    try {
      detail = getImageDetailMock(imageId, getAuthenticatedUserId());
    } catch (error) {
      const message = error instanceof Error ? error.message : '下载失败';
      if (message === '无权限访问') {
        return json({ code: 403, message, data: null }, { status: 403 });
      }
      if (message === '图片不存在') {
        return json({ code: 404, message, data: null }, { status: 404 });
      }
      return json(
        { code: 500, message: '下载失败', data: null },
        { status: 500 }
      );
    }
    const titlePart = sanitizeFilenamePart(detail.title);
    const extension = getFileExtensionFromUrl(detail.url);
    const filenameUtf8 = `image-${titlePart}.${extension}`;
    const filenameEncoded = encodeURIComponent(filenameUtf8);
    const filenameFallback = filenameUtf8.replace(/[^\x20-\x7E]/g, '_');
    const sampleIndex = (hashString(imageId) % 20) + 1;
    const sampleIndexText = String(sampleIndex).padStart(2, '0');
    const sampleUrl = `/mock-images/sample-${sampleIndexText}.png`;

    try {
      const response = await fetch(sampleUrl);
      if (!response.ok) {
        throw new Error('mock image sample not found');
      }
      const buffer = await response.arrayBuffer();
      return new HttpResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${filenameFallback}"; filename*=UTF-8''${filenameEncoded}`,
        },
      });
    } catch {
      const png = decodeBase64(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+XKq8AAAAASUVORK5CYII='
      );
      return new HttpResponse(png, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="${fallbackFilename}"`,
        },
      });
    }
  }),

  http.get('*/api/dashboard', () => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    return json({ code: 0, message: 'ok', data: getDashboardMock() });
  }),

  http.get('*/api/files', ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    const result = getFilesMock({
      page: Number(url.searchParams.get('page') || 1),
      pageSize: Number(url.searchParams.get('pageSize') || 20),
      keyword: url.searchParams.get('keyword') || '',
      parentId: parentId ? Number(parentId) : undefined,
    });
    return json({ code: 0, message: 'ok', data: result });
  }),

  http.post('*/api/files/upload', async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    const formData = await request.formData();
    try {
      const result = await uploadFileMock(
        formData,
        parentId ? Number(parentId) : null
      );
      return json({
        code: 0,
        message: 'ok',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '上传文件失败';
      const status = message === '目标目录不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.post('*/api/files/folder', async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      parentId?: number;
      parentPath?: string[];
    };
    try {
      const result = createFolderMock({
        name: body.name || '新文件夹',
        ...(body.parentId !== undefined
          ? { parentId: body.parentId }
          : { parentPath: body.parentPath || [] }),
      });
      return json({
        code: 0,
        message: 'ok',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建文件夹失败';
      const status = message === '目标目录不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.put(/\/api\/files\/[^/]+$/, async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const body = (await request.json().catch(() => ({}))) as { name?: string };
    const fileId = parseTrailingNumericId(request.url);
    try {
      const result = updateFileMock(fileId, body.name || '');
      return json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新文件失败';
      const status = message === '文件不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.delete(/\/api\/files\/[^/]+$/, ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    try {
      deleteFileMock(parseTrailingNumericId(request.url));
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      return json(
        {
          code: 404,
          message: error instanceof Error ? error.message : '删除文件失败',
          data: null,
        },
        { status: 404 }
      );
    }
  }),

  http.get('*/api/images', ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const url = new URL(request.url);
    const result = getImageListMock({
      page: Number(url.searchParams.get('page') || 1),
      pageSize: Number(url.searchParams.get('pageSize') || 12),
      query: url.searchParams.get('query') || '',
      sortBy: url.searchParams.get('sortBy') || 'newest',
      collection: url.searchParams.get('collection') || 'all',
      tag: url.searchParams.get('tag') || '',
    });
    return json({ code: 0, message: 'ok', data: result });
  }),

  http.post('*/api/images/upload', async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const formData = await request.formData();
    try {
      await uploadImagesMock(formData);
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      return json(
        {
          code: 400,
          message: error instanceof Error ? error.message : '上传图片失败',
          data: null,
        },
        { status: 400 }
      );
    }
  }),

  http.delete(/\/api\/images\/[^/]+$/, ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const pathname = new URL(request.url).pathname;
    const match = pathname.match(/\/api\/images\/([^/]+)$/);
    const id = match?.[1] || '';
    try {
      deleteImageMock(id);
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除图片失败';
      const status = message === '图片不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.put(/\/api\/images\/[^/]+$/, async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const pathname = new URL(request.url).pathname;
    const match = pathname.match(/\/api\/images\/([^/]+)$/);
    const id = match?.[1] || '';
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      isFavorite?: boolean;
      tags?: string[];
    };
    try {
      updateImageMock(id, {
        title: body.title,
        isFavorite: body.isFavorite,
        tags: body.tags,
      });
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新图片失败';
      const status = message === '图片不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.get('*/api/images/:id', ({ params }) => {
    try {
      const result = getImageDetailMock(
        String(params.id || ''),
        getAuthenticatedUserId()
      );
      return json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '获取图片详情失败';
      const status =
        message === '无权限访问' ? 403 : message === '图片不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.get('*/api/users', ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const url = new URL(request.url);
    const result = getUsersMock({
      page: Number(url.searchParams.get('page') || 1),
      pageSize: Number(url.searchParams.get('pageSize') || 10),
      username: url.searchParams.get('username') || '',
      email: url.searchParams.get('email') || '',
      status: url.searchParams.get('status') || '',
    });
    return json({ code: 0, message: 'ok', data: result });
  }),

  http.post('*/api/users', async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const body = (await request.json().catch(() => ({}))) as {
      username?: string;
      email?: string;
      password?: string;
      role?: 'admin' | 'viewer' | 'user';
      status?: 'active' | 'inactive';
    };
    try {
      const created = createUserMock({
        username: body.username || '',
        email: body.email || '',
        password: body.password || '',
        role: body.role || 'user',
        status: body.status || 'active',
      });
      syncManagedUserAccount(
        {
          id: created.id,
          username: created.username,
          email: created.email,
          role: created.role as Role,
        },
        {
          password: body.password || '',
        }
      );
      return json({ code: 0, message: 'ok', data: created });
    } catch (error) {
      return json(
        {
          code: 400,
          message: error instanceof Error ? error.message : '创建用户失败',
          data: null,
        },
        { status: 400 }
      );
    }
  }),

  http.put(/\/api\/users\/\d+$/, async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const body = (await request.json().catch(() => ({}))) as {
      username?: string;
      email?: string;
      password?: string;
      role?: 'admin' | 'viewer' | 'user';
      status?: 'active' | 'inactive';
    };
    const userId = parseTrailingNumericId(request.url);
    try {
      const previousUser = findUserByIdMock(userId);
      const updated = updateUserMock(userId, {
        username: body.username || '',
        email: body.email || '',
        password: body.password,
        role: body.role || 'user',
        status: body.status || 'active',
      });
      syncManagedUserAccount(
        {
          id: updated.id,
          username: updated.username,
          email: updated.email,
          role: updated.role as Role,
        },
        {
          previousEmail: previousUser?.email,
          password: body.password,
        }
      );
      return json({ code: 0, message: 'ok', data: updated });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新用户失败';
      const status = message === '用户不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.patch(/\/api\/users\/\d+\/status$/, async ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    const body = (await request.json().catch(() => ({}))) as {
      status?: 'active' | 'inactive';
    };
    const userId = parseTrailingNumericId(request.url);

    try {
      const updated = updateUserStatusMock(userId, body.status || 'inactive');
      if (
        updated.status !== 'active' &&
        currentSessionEmail === updated.email
      ) {
        currentSessionEmail = null;
        writeMockSessionEmail(null);
      }
      return json({ code: 0, message: 'ok', data: updated });
    } catch (error) {
      return json(
        {
          code: 404,
          message: error instanceof Error ? error.message : '更新状态失败',
          data: null,
        },
        { status: 404 }
      );
    }
  }),

  http.delete(/\/api\/users\/[^/]+$/, ({ request }) => {
    const { denied } = ensureAdminSession();
    if (denied) return denied;
    try {
      const userId = parseTrailingNumericId(request.url);
      const targetUser = findUserByIdMock(userId);
      deleteUserMock(userId);
      if (targetUser) {
        syncManagedUserAccount(
          {
            id: targetUser.id,
            username: targetUser.username,
            email: targetUser.email,
            role: targetUser.role as Role,
          },
          { previousEmail: targetUser.email, remove: true }
        );
      }
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      return json(
        {
          code: 404,
          message: error instanceof Error ? error.message : '删除用户失败',
          data: null,
        },
        { status: 404 }
      );
    }
  }),

  http.get('*/api/users/:userId/summary', ({ params }) => {
    const userId = resolveExistingUserId(String(params.userId || ''));
    if (!userId) {
      return json(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      );
    }
    return json({
      code: 0,
      message: 'ok',
      data: getUserBoardsSummaryMock(
        userId,
        getAuthenticatedUserId() || undefined
      ),
    });
  }),

  http.get('*/api/users/:userId/boards', ({ params, request }) => {
    const userId = resolveExistingUserId(String(params.userId || ''));
    if (!userId) {
      return json(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      );
    }
    const url = new URL(request.url);
    return json({
      code: 0,
      message: 'ok',
      data: getUserBoardsPageMock(
        userId,
        {
          page: Number(url.searchParams.get('page') || 1),
          pageSize: Number(url.searchParams.get('pageSize') || 20),
        },
        getAuthenticatedUserId() || undefined
      ),
    });
  }),

  http.get('*/api/users/:userId/uploads', ({ params, request }) => {
    const userId = resolveExistingUserId(String(params.userId || ''));
    if (!userId) {
      return json(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      );
    }
    const url = new URL(request.url);
    return json({
      code: 0,
      message: 'ok',
      data: getUserUploadsPageMock(
        userId,
        {
          page: Number(url.searchParams.get('page') || 1),
          pageSize: Number(url.searchParams.get('pageSize') || 20),
          keyword: url.searchParams.get('keyword') || '',
          sort:
            (url.searchParams.get('sort') as 'newest' | 'oldest' | null) ||
            'newest',
        },
        getAuthenticatedUserId() || undefined
      ),
    });
  }),

  http.get('*/api/users/:userId/likes', ({ params, request }) => {
    const userId = resolveExistingUserId(String(params.userId || ''));
    if (!userId) {
      return json(
        { code: 404, message: '用户不存在', data: null },
        { status: 404 }
      );
    }
    const url = new URL(request.url);
    return json({
      code: 0,
      message: 'ok',
      data: getUserBoardsLikesPageMock(
        userId,
        {
          page: Number(url.searchParams.get('page') || 1),
          pageSize: Number(url.searchParams.get('pageSize') || 20),
          keyword: url.searchParams.get('keyword') || '',
        },
        getAuthenticatedUserId() || undefined
      ),
    });
  }),

  http.get('*/api/boards/:boardId', ({ params }) => {
    try {
      const boardId = String(params.boardId || '');
      const result = getBoardDetailMock(
        boardId,
        getAuthenticatedUserId() || undefined
      );
      return json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '获取画板详情失败';
      const status =
        message === '无权限访问' ? 403 : message === '画板不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.post(
    '*/api/boards/:boardId/images/upload',
    async ({ params, request }) => {
      const formData = await request.formData();
      try {
        const boardId = String(params.boardId || '');
        const actorUserId = getAuthenticatedUserId();
        if (!actorUserId) {
          return json(
            { code: 401, message: '未登录或登录已过期', data: null },
            { status: 401 }
          );
        }
        const result = await uploadBoardImagesToBoardMock(
          boardId,
          formData,
          actorUserId
        );
        return json({ code: 0, message: 'ok', data: result });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '上传到画板失败';
        const status =
          message === '无权限访问' ? 403 : message === '画板不存在' ? 404 : 400;
        return json(
          {
            code: status,
            message,
            data: null,
          },
          { status }
        );
      }
    }
  ),

  http.post('*/api/users/:userId/boards', async ({ params, request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      description?: string;
      visibility?: 'public' | 'private';
    };
    try {
      const { user, denied } = ensureOwnUserSession(
        String(params.userId || '')
      );
      if (denied || !user) return denied;
      if (typeof user.id !== 'number') {
        return json(
          { code: 401, message: '未登录或登录已过期', data: null },
          { status: 401 }
        );
      }
      const result = createUserBoardMock(user.id, user.name, {
        name: body.name || '',
        description: body.description || '',
        visibility: body.visibility || 'public',
      });
      return json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      return json(
        {
          code: 400,
          message: error instanceof Error ? error.message : '创建画板失败',
          data: null,
        },
        { status: 400 }
      );
    }
  }),

  http.put('*/api/boards/:boardId', async ({ params, request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      description?: string;
      visibility?: 'public' | 'private';
    };
    try {
      const { user, denied } = ensureAuthenticatedSession();
      if (denied || !user) return denied;
      if (typeof user.id !== 'number') {
        return json(
          { code: 401, message: '未登录或登录已过期', data: null },
          { status: 401 }
        );
      }
      const result = updateUserBoardMock(
        String(params.boardId),
        {
          name: body.name || '',
          description: body.description || '',
          visibility: body.visibility || 'public',
        },
        user.id
      );
      return json({ code: 0, message: 'ok', data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新画板失败';
      const status =
        message === '无权限访问' ? 403 : message === '画板不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.delete('*/api/boards/:boardId', ({ params }) => {
    try {
      const { user, denied } = ensureAuthenticatedSession();
      if (denied || !user) return denied;
      if (typeof user.id !== 'number') {
        return json(
          { code: 401, message: '未登录或登录已过期', data: null },
          { status: 401 }
        );
      }
      deleteUserBoardMock(String(params.boardId), user.id);
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除画板失败';
      const status =
        message === '无权限访问' ? 403 : message === '画板不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.post(
    '*/api/users/:userId/boards/:boardId/collect',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => ({}))) as {
        imageId?: string;
        source?: 'upload' | 'like' | 'explore' | 'gallery';
      };
      try {
        const { user, denied } = ensureOwnUserSession(
          String(params.userId || '')
        );
        if (denied || !user) return denied;
        if (typeof user.id !== 'number') {
          return json(
            { code: 401, message: '未登录或登录已过期', data: null },
            { status: 401 }
          );
        }
        const result = collectImageToBoardMock(
          String(params.boardId),
          body.imageId || '',
          body.source || 'upload',
          user.id
        );
        return json({ code: 0, message: 'ok', data: result });
      } catch (error) {
        const message = error instanceof Error ? error.message : '采集失败';
        const status =
          message === '无权限访问'
            ? 403
            : message === '画板不存在' || message === '图片不存在'
              ? 404
              : 400;
        return json(
          {
            code: status,
            message,
            data: null,
          },
          { status }
        );
      }
    }
  ),

  http.patch(
    '*/api/users/:userId/uploads/:imageId/status',
    async ({ params, request }) => {
      const body = (await request.json().catch(() => ({}))) as {
        status?: 'private' | 'pending' | 'public';
      };
      try {
        const { user, denied } = ensureOwnUserSession(
          String(params.userId || '')
        );
        if (denied || !user) return denied;
        const result = updateUploadedImageStatusMock(
          String(params.imageId),
          body.status || 'private',
          user.id
        );
        return json({ code: 0, message: 'ok', data: result });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '更新图片状态失败';
        const status = message === '无权限访问' ? 403 : 404;
        return json(
          {
            code: status,
            message,
            data: null,
          },
          { status }
        );
      }
    }
  ),

  http.delete('*/api/users/:userId/uploads/:imageId', ({ params }) => {
    try {
      const { user, denied } = ensureOwnUserSession(
        String(params.userId || '')
      );
      if (denied || !user) return denied;
      deleteUploadedImageMock(String(params.imageId), user.id);
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除图片失败';
      const status = message === '无权限访问' ? 403 : 404;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.delete('*/api/users/:userId/likes/:imageId', ({ params }) => {
    try {
      const { user, denied } = ensureOwnUserSession(
        String(params.userId || '')
      );
      if (denied || !user) return denied;
      unlikeImageMock(String(params.imageId), user.id);
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '取消赞失败';
      const status = message === '无权限访问' ? 403 : 404;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),

  http.post('*/api/users/:userId/likes/:imageId', ({ params }) => {
    try {
      const { denied } = ensureOwnUserSession(String(params.userId || ''));
      if (denied) return denied;
      likeImageMock(String(params.imageId), Number(params.userId || 101));
      return json({ code: 0, message: 'ok', data: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : '点赞失败';
      const status = message === '图片不存在' ? 404 : 400;
      return json(
        {
          code: status,
          message,
          data: null,
        },
        { status }
      );
    }
  }),
];
