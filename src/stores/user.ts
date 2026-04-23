import { defineStore } from 'pinia';
import { getUserInfo } from '../api/user';
import { normalizeRole } from '../utils/access';

interface UserData {
  name?: string;
  email?: string;
  role?: string;
}

export const useUserStore = defineStore(
  'user',
  () => {
    const name = ref<string>('');
    const email = ref<string>('');
    const role = ref<string>('');
    const token = ref<string>('');
    const isAuthReady = ref<boolean>(false);

    const isLoggedIn = computed(() => Boolean(token.value));

    const userInfo = computed(() => ({
      name: name.value,
      email: email.value,
      isLoggedIn: isLoggedIn.value,
    }));

    function login(userData: UserData, newToken?: string) {
      name.value = userData.name || '';
      email.value = userData.email || '';
      role.value = normalizeRole(userData.role || role.value || '');
      token.value = newToken || token.value || '';
    }

    function logout() {
      name.value = '';
      email.value = '';
      role.value = '';
      token.value = '';
    }

    function setUser(userData: UserData) {
      name.value = userData.name || '';
      email.value = userData.email || '';
      role.value = normalizeRole(userData.role);
    }

    function updateProfile(profile: UserData) {
      if (profile.name !== undefined) {
        name.value = profile.name;
      }
      if (profile.email !== undefined) {
        email.value = profile.email;
      }
      if (profile.role !== undefined) {
        role.value = normalizeRole(profile.role);
      }
    }

    function setAuthReady(value: boolean) {
      isAuthReady.value = value;
    }

    async function fetchUserInfo() {
      const result = await getUserInfo({ silentError: true });
      const user = result.user;
      if (user) setUser(user);
      return user;
    }

    async function bootstrapAuth() {
      if (!token.value) {
        setAuthReady(true);
        return true;
      }

      try {
        await fetchUserInfo();
        return true;
      } catch {
        logout();
        return false;
      } finally {
        setAuthReady(true);
      }
    }

    return {
      name,
      email,
      role,
      token,
      isLoggedIn,
      isAuthReady,
      userInfo,
      login,
      logout,
      setUser,
      setAuthReady,
      updateProfile,
      fetchUserInfo,
      bootstrapAuth,
    };
  },
  {
    persist: {
      key: 'pix-space-user-store',
      storage: sessionStorage,
      pick: ['name', 'email', 'role', 'token'],
    },
  }
);
