import { logout as logoutApi } from '../api/user';
import { useUserStore } from '../stores/user';
import { sanitizeRedirectPath } from '../utils/auth';

export interface LogoutOptions {
  successMessage?: string;
  redirectPath?: string;
  replace?: boolean;
}

export function useLogout() {
  const router = useRouter();
  const userStore = useUserStore();

  const logout = async (options?: LogoutOptions) => {
    try {
      await logoutApi({ silentError: true, skipAuthRedirect: true });
      userStore.logout();
    } catch (error) {
      const normalized = error as { status?: number };
      if (normalized.status === 401) {
        userStore.logout();
      } else {
        ElMessage.error('退出失败，请重试');
        return;
      }
    }

    const successMessage = options?.successMessage ?? '已退出登录';
    if (successMessage) {
      ElMessage.success(successMessage);
    }

    const target = options?.redirectPath
      ? sanitizeRedirectPath(options.redirectPath)
      : '/login';
    if (options?.replace) {
      await router.replace(target);
      return;
    }
    await router.push(target);
  };

  return {
    logout,
  };
}
