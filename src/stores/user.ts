import { defineStore } from 'pinia';
import { getSession } from '../api/user';
import { normalizeRole, type UserRole } from '../utils/access';
import type { AuthUser } from '../types/auth';
import type { NormalizedRequestError } from '../types/http';

type UserData = Partial<AuthUser>;

/** 非持久化的用户补充字段，可收敛为一个 reactive 对象 */
const userExtra = reactive({
  phone: '',
  bio: '',
});

export const useUserStore = defineStore(
  'user',
  () => {
    // 以下 5 个字段通过 pinia-plugin-persistedstate 的 pick 持久化，必须保持为独立顶层 ref
    const id = ref<number | null>(null);
    const username = ref<string>('');
    const email = ref<string>('');
    const role = ref<UserRole | ''>('');
    const avatar = ref<string>('');

    // 认证状态 flag，与用户数据分离管理
    const isAuthReady = ref<boolean>(false);
    const isSessionValidated = ref<boolean>(false);
    const authCheckFailed = ref<boolean>(false);

    /**
     * 本地是否存在用户数据（id 或 email）。
     * 仅表示 localStorage / sessionStorage 或内存中存在用户信息，
     * 不等于已完成服务端会话验证。
     */
    const isLoggedIn = computed(() => Boolean(id.value || email.value));
    const isAuthenticated = computed(() => {
      return isLoggedIn.value && isSessionValidated.value;
    });

    const userInfo = computed(() => ({
      id: id.value,
      username: username.value,
      email: email.value,
      avatar: avatar.value,
      phone: userExtra.phone,
      bio: userExtra.bio,
      isLoggedIn: isLoggedIn.value,
    }));

    function login(userData: UserData) {
      setUser(userData);
      isSessionValidated.value = true;
      isAuthReady.value = true;
      authCheckFailed.value = false;
    }

    function logout() {
      id.value = null;
      username.value = '';
      email.value = '';
      role.value = '';
      avatar.value = '';
      userExtra.phone = '';
      userExtra.bio = '';
      isSessionValidated.value = false;
      authCheckFailed.value = false;
    }

    function setUser(userData: UserData) {
      const normalizedRole = normalizeRole(userData.role);
      const hasExplicitRole =
        typeof userData.role === 'string' && userData.role.trim() !== '';
      if (!userData.username) {
        throw new Error('用户信息不完整：缺少用户名');
      }
      if (!userData.email) {
        throw new Error('用户信息不完整：缺少邮箱');
      }
      if (hasExplicitRole && !normalizedRole) {
        throw new Error(`用户信息不完整：无效的角色值 "${userData.role}"`);
      }
      id.value = userData.id ?? null;
      username.value = userData.username;
      email.value = userData.email;
      role.value = normalizedRole || 'user';
      avatar.value = userData.avatar || '';
      userExtra.phone = userData.phone || '';
      userExtra.bio = userData.bio || '';
    }

    function updateProfile(profile: UserData) {
      if (profile.id !== undefined) {
        id.value = profile.id;
      }
      if (profile.username !== undefined) {
        username.value = profile.username;
      }
      if (profile.email !== undefined) {
        email.value = profile.email;
      }
      if (profile.role !== undefined) {
        const normalized = normalizeRole(profile.role);
        if (normalized) {
          role.value = normalized;
        } else {
          console.warn(
            `[useUserStore.updateProfile] 忽略无效角色值: "${profile.role}"`
          );
        }
      }
      if (profile.avatar !== undefined) {
        avatar.value = profile.avatar || '';
      }
      if (profile.phone !== undefined) {
        userExtra.phone = profile.phone || '';
      }
      if (profile.bio !== undefined) {
        userExtra.bio = profile.bio || '';
      }
    }

    function setAuthReady(value: boolean) {
      isAuthReady.value = value;
    }

    function setSessionValidated(value: boolean) {
      isSessionValidated.value = value;
    }

    function setAuthCheckFailed(value: boolean) {
      authCheckFailed.value = value;
    }

    async function fetchSession() {
      const result = await getSession({ silentError: true });
      const user = result.user;
      if (!user) {
        throw new Error('未获取到有效用户信息');
      }
      setUser(user);
      return user;
    }

    async function bootstrapAuth() {
      setAuthReady(false);
      authCheckFailed.value = false;
      try {
        const user = await fetchSession();
        if (!user?.email) {
          throw new Error('未获取到有效用户信息');
        }
        setSessionValidated(true);
      } catch (error) {
        const normalized = error as NormalizedRequestError;
        setSessionValidated(false);
        if (normalized.status === 401) {
          logout();
        } else {
          authCheckFailed.value = true;
        }
      } finally {
        setAuthReady(true);
      }
    }

    return {
      id,
      username,
      email,
      role,
      avatar,
      phone: readonly(userExtra).phone,
      bio: readonly(userExtra).bio,
      isLoggedIn,
      isAuthenticated,
      isAuthReady,
      isSessionValidated,
      authCheckFailed,
      userInfo,
      login,
      logout,
      setUser,
      setAuthReady,
      setSessionValidated,
      setAuthCheckFailed,
      updateProfile,
      fetchSession,
      bootstrapAuth,
    };
  },
  {
    persist: {
      key: 'pix-space-user-store',
      storage: sessionStorage,
      pick: ['id', 'username', 'email', 'role', 'avatar'],
    },
  }
);
