import { useUserStore } from '../stores/user';

const NOT_LOGGED_IN = '未登录';

export function useUserDisplay() {
  const userStore = useUserStore();

  const displayName = computed(
    () => userStore.name || userStore.email || NOT_LOGGED_IN
  );

  const userLabel = computed(() => {
    const name = userStore.name || '';
    const email = userStore.email || '';
    if (name && email) return `${name} (${email})`;
    return name || email || NOT_LOGGED_IN;
  });

  return { displayName, userLabel };
}
