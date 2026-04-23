import { computed } from 'vue';
import { useUserStore } from '../stores/user';
import { canAccess, type UserRole } from '../utils/access';

export function usePermission() {
  const userStore = useUserStore();

  const hasPermission = (roles: UserRole[]) => {
    return computed(() => canAccess(roles, userStore.role));
  };

  return {
    hasPermission,
  };
}
