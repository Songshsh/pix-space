import type { User, UserForm, UserListParams } from '../types/user';
import type { UserRole } from '../utils/access';
import { createTimestamp } from './shared';

interface UserRecord extends User {
  password?: string;
}

const seedUsers: UserRecord[] = [
  {
    id: 1,
    avatar: '',
    username: 'admin',
    email: 'admin@pixspace.test',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01 10:00',
  },
  {
    id: 102,
    avatar: '',
    username: 'viewer',
    email: 'viewer@pixspace.test',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-01-02 14:30',
  },
  {
    id: 101,
    avatar: '',
    username: 'user',
    email: 'user@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-03 09:15',
  },
  {
    id: 4,
    avatar: '',
    username: '赵六',
    email: 'zhaoliu@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-04 16:45',
  },
  {
    id: 5,
    avatar: '',
    username: '孙七',
    email: 'sunqi@example.com',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-01-05 11:20',
  },
  {
    id: 201,
    avatar: '',
    username: 'User 1',
    email: 'user1@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-01 09:00',
  },
  {
    id: 202,
    avatar: '',
    username: 'User 2',
    email: 'user2@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-02 10:00',
  },
  {
    id: 203,
    avatar: '',
    username: 'User 3',
    email: 'user3@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-03 11:00',
  },
  {
    id: 204,
    avatar: '',
    username: 'User 4',
    email: 'user4@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-04 12:00',
  },
  {
    id: 205,
    avatar: '',
    username: 'User 5',
    email: 'user5@pixspace.test',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-05 13:00',
  },
];

let usersState: UserRecord[] = seedUsers.map((user) => ({ ...user }));

function toUser(user: UserRecord): User {
  const { password: _password, ...safeUser } = user;
  void _password;
  return safeUser;
}

function normalizeKeyword(value?: string) {
  return value?.trim().toLowerCase() || '';
}

function getDuplicateMessage(
  data: Pick<UserForm, 'username' | 'email'>,
  excludeId?: number
) {
  const normalizedUsername = normalizeKeyword(data.username);
  const normalizedEmail = normalizeKeyword(data.email);
  const duplicatedUser = usersState.find((user) => {
    if (excludeId !== undefined && user.id === excludeId) return false;
    return (
      normalizeKeyword(user.username) === normalizedUsername ||
      normalizeKeyword(user.email) === normalizedEmail
    );
  });

  if (!duplicatedUser) return '';
  if (normalizeKeyword(duplicatedUser.username) === normalizedUsername) {
    return '用户名已存在';
  }
  return '邮箱已存在';
}

function paginateUsers(list: User[], params?: UserListParams) {
  const page = Math.max(1, Number(params?.page) || 1);
  const pageSize = Math.max(1, Number(params?.pageSize) || 10);
  const start = (page - 1) * pageSize;
  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  };
}

export function getUsersMock(params?: UserListParams) {
  const username = normalizeKeyword(params?.username);
  const email = normalizeKeyword(params?.email);
  const status = params?.status?.trim() || '';

  const filtered = usersState
    .filter((user) => {
      if (username && !normalizeKeyword(user.username).includes(username)) {
        return false;
      }
      if (email && !normalizeKeyword(user.email).includes(email)) {
        return false;
      }
      if (status && user.status !== status) {
        return false;
      }
      return true;
    })
    .sort((a, b) => b.id - a.id)
    .map(toUser);

  return paginateUsers(filtered, params);
}

export function findUserByIdMock(id: number) {
  const user = usersState.find((item) => item.id === id);
  return user ? { ...user } : null;
}

export function findUserByEmailMock(email: string) {
  const normalizedEmail = normalizeKeyword(email);
  const user = usersState.find(
    (item) => normalizeKeyword(item.email) === normalizedEmail
  );
  return user ? { ...user } : null;
}

export function createUserMock(data: UserForm) {
  const duplicateMessage = getDuplicateMessage(data);
  if (duplicateMessage) {
    throw new Error(duplicateMessage);
  }

  const nextUser: UserRecord = {
    id: Date.now(),
    avatar: '',
    username: data.username.trim(),
    email: data.email.trim(),
    password: data.password,
    role: data.role as UserRole,
    status: data.status,
    createdAt: createTimestamp(true),
  };

  usersState = [nextUser, ...usersState];
  return toUser(nextUser);
}

export function updateUserMock(id: number, data: UserForm) {
  const duplicateMessage = getDuplicateMessage(data, id);
  if (duplicateMessage) {
    throw new Error(duplicateMessage);
  }

  const targetIndex = usersState.findIndex((user) => user.id === id);
  if (targetIndex < 0) {
    throw new Error('用户不存在');
  }

  const current = usersState[targetIndex];
  const updated: UserRecord = {
    ...current,
    username: data.username.trim(),
    email: data.email.trim(),
    role: data.role,
    status: data.status,
  };

  usersState = usersState.map((user, index) =>
    index === targetIndex ? updated : user
  );

  return toUser(updated);
}

export function deleteUserMock(id: number) {
  const exists = usersState.some((user) => user.id === id);
  if (!exists) {
    throw new Error('用户不存在');
  }
  usersState = usersState.filter((user) => user.id !== id);
  return true;
}

export function updateUserStatusMock(id: number, status: User['status']) {
  const targetIndex = usersState.findIndex((user) => user.id === id);
  if (targetIndex < 0) {
    throw new Error('用户不存在');
  }

  const updated: UserRecord = {
    ...usersState[targetIndex],
    status,
  };

  usersState = usersState.map((user, index) =>
    index === targetIndex ? updated : user
  );

  return toUser(updated);
}

export function upsertUserAccountMock(data: {
  id?: number;
  username: string;
  email: string;
  role: UserRole;
  status: User['status'];
  password?: string;
  avatar?: string;
  createdAt?: string;
}) {
  const normalizedEmail = normalizeKeyword(data.email);
  const targetIndex = usersState.findIndex((user) => {
    if (data.id !== undefined && user.id === data.id) return true;
    return normalizeKeyword(user.email) === normalizedEmail;
  });
  const current = targetIndex >= 0 ? usersState[targetIndex] : null;
  const nextUser: UserRecord = {
    id: data.id ?? current?.id ?? Date.now(),
    avatar: data.avatar ?? current?.avatar ?? '',
    username: data.username.trim(),
    email: data.email.trim(),
    password: data.password ?? current?.password,
    role: data.role,
    status: data.status,
    createdAt: data.createdAt ?? current?.createdAt ?? createTimestamp(true),
  };

  if (targetIndex >= 0) {
    usersState = usersState.map((user, index) =>
      index === targetIndex ? nextUser : user
    );
  } else {
    usersState = [nextUser, ...usersState];
  }

  return toUser(nextUser);
}

export function removeUserAccountMock(target: { id?: number; email?: string }) {
  const normalizedEmail = normalizeKeyword(target.email);
  usersState = usersState.filter((user) => {
    if (target.id !== undefined && user.id === target.id) return false;
    if (target.email && normalizeKeyword(user.email) === normalizedEmail) {
      return false;
    }
    return true;
  });
}
