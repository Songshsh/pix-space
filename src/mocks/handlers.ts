import { http, HttpResponse } from 'msw';
import { getDashboardMock } from './dashboard';
import { getFilesMock } from './files';
import { getImagesMock } from './images';
import { getUsersMock } from './users';

function json(data: unknown, init?: ResponseInit) {
  return new HttpResponse(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

type Role = 'admin' | 'user' | 'viewer';

function pickRoleByCredentials(email: string, password: string): Role {
  if (email === 'admin@pixspace.test' && password === 'Admin123!')
    return 'admin';
  if (email === 'viewer@pixspace.test' && password === 'Viewer123!')
    return 'viewer';
  if (email === 'user@pixspace.test' && password === 'User123!') return 'user';
  return 'user';
}

function createToken(payload: { name: string; email: string; role: Role }) {
  return `mock.${btoa(JSON.stringify(payload))}`;
}

function parseToken(token: string | null) {
  if (!token?.startsWith('mock.')) return null;
  try {
    const raw = token.slice('mock.'.length);
    const parsed = JSON.parse(atob(raw)) as {
      name?: string;
      email?: string;
      role?: Role;
    };
    if (!parsed?.email) return null;
    return {
      name: parsed.name || parsed.email.split('@')[0] || 'Demo',
      email: parsed.email,
      role: parsed.role || 'user',
    };
  } catch {
    return null;
  }
}

export const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const email = (body?.email as string) || 'demo@example.com';
    const password = (body?.password as string) || '';
    const role = pickRoleByCredentials(email, password);
    const user = {
      name: email.split('@')[0] || 'Demo',
      email,
      role,
    };
    return json({
      code: 0,
      message: 'ok',
      data: {
        token: createToken(user),
        user,
      },
    });
  }),

  http.post('*/api/auth/logout', () => {
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.get('*/api/user/info', ({ request }) => {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ')
      ? auth.slice('Bearer '.length)
      : null;
    const user = parseToken(token) || {
      name: 'Demo',
      email: 'demo@example.com',
      role: 'user' as Role,
    };
    return json({
      code: 0,
      message: 'ok',
      data: {
        user,
      },
    });
  }),

  http.get('*/api/dashboard', () => {
    return json({ code: 0, message: 'ok', data: getDashboardMock() });
  }),

  http.get('*/api/files', () => {
    const list = getFilesMock();
    return json({ code: 0, message: 'ok', data: { list, total: list.length } });
  }),

  http.post('*/api/files/upload', () => {
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.post('*/api/files/folder', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return json({
      code: 0,
      message: 'ok',
      data: { id: Date.now(), ...(body as object) },
    });
  }),

  http.delete(/\/api\/files\/\d+$/, () => {
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.get('*/api/images', () => {
    const list = getImagesMock();
    return json({ code: 0, message: 'ok', data: { list, total: list.length } });
  }),

  http.post('*/api/images/upload', () => {
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.delete(/\/api\/images\/\d+$/, () => {
    return json({ code: 0, message: 'ok', data: true });
  }),

  http.get('*/api/users', () => {
    const list = getUsersMock();
    return json({ code: 0, message: 'ok', data: { list, total: list.length } });
  }),

  http.post('*/api/users', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return json({
      code: 0,
      message: 'ok',
      data: { id: Date.now(), ...(body as object) },
    });
  }),

  http.put(/\/api\/users\/\d+$/, async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    return json({ code: 0, message: 'ok', data: body });
  }),

  http.delete(/\/api\/users\/\d+$/, () => {
    return json({ code: 0, message: 'ok', data: true });
  }),
];
