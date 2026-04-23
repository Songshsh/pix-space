import { useUserStore } from '../stores/user';

export function useUserDisplay() {
  const userStore = useUserStore();

  const displayName = computed(
    () => userStore.name || userStore.email || '未登录'
  );

  const userLabel = computed(() => {
    const name = userStore.name || '';
    const email = userStore.email || '';
    if (name && email) return `${name} (${email})`;
    return name || email || '未登录';
  });

  return { displayName, userLabel, userStore };
}
