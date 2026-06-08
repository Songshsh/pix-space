import { defineStore } from 'pinia';
import { getSession } from '../api/user';
import { normalizeRole, type UserRole } from '../utils/access';
import type { AuthUser } from '../types/auth';
import type { NormalizedRequestError } from '../types/http';

type UserData = Partial<AuthUser>;

export const useUserStore = defineStore(
  'user',
  () => {
    const id = ref<number | null>(null);
    const name = ref<string>('');
    const email = ref<string>('');
    const role = ref<UserRole | ''>('');
    const avatar = ref<string>('');
    const phone = ref<string>('');
    const bio = ref<string>('');
    const isAuthReady = ref<boolean>(false);
    const isSessionValidated = ref<boolean>(false);
    const authCheckFailed = ref<boolean>(false);

    const isLoggedIn = computed(() => Boolean(id.value || email.value));
    const isAuthenticated = computed(() => {
      return isLoggedIn.value && isSessionValidated.value;
    });

    const userInfo = computed(() => ({
      id: id.value,
      name: name.value,
      email: email.value,
      avatar: avatar.value,
      phone: phone.value,
      bio: bio.value,
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
      name.value = '';
      email.value = '';
      role.value = '';
      avatar.value = '';
      phone.value = '';
      bio.value = '';
      isSessionValidated.value = false;
      authCheckFailed.value = false;
    }

    function setUser(userData: UserData) {
      const normalizedRole = normalizeRole(userData.role);
      const hasExplicitRole =
        typeof userData.role === 'string' && userData.role.trim() !== '';
      if (
        !userData.name ||
        !userData.email ||
        (hasExplicitRole && !normalizedRole)
      ) {
        throw new Error('用户信息不完整');
      }
      id.value = userData.id ?? null;
      name.value = userData.name;
      email.value = userData.email;
      role.value = normalizedRole || 'user';
      avatar.value = userData.avatar || '';
      phone.value = userData.phone || '';
      bio.value = userData.bio || '';
    }

    function updateProfile(profile: UserData) {
      if (profile.id !== undefined) {
        id.value = profile.id;
      }
      if (profile.name !== undefined) {
        name.value = profile.name;
      }
      if (profile.email !== undefined) {
        email.value = profile.email;
      }
      if (profile.role !== undefined) {
        const normalized = normalizeRole(profile.role);
        if (normalized) {
          role.value = normalized;
        }
      }
      if (profile.avatar !== undefined) {
        avatar.value = profile.avatar || '';
      }
      if (profile.phone !== undefined) {
        phone.value = profile.phone || '';
      }
      if (profile.bio !== undefined) {
        bio.value = profile.bio || '';
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
      name,
      email,
      role,
      avatar,
      phone,
      bio,
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
      pick: ['id', 'name', 'email', 'role', 'avatar'],
    },
  }
);
