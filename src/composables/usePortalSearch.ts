export function usePortalSearch() {
  const route = useRoute();
  const router = useRouter();
  const searchQuery = ref('');

  const syncQueryFromRoute = () => {
    const q = typeof route.query.q === 'string' ? route.query.q : '';
    if (searchQuery.value !== q) searchQuery.value = q;
  };

  watch(() => route.fullPath, syncQueryFromRoute, { immediate: true });

  const submitSearch = () => {
    const q = searchQuery.value.trim();
    if (!q) {
      router.push({ path: '/explore' });
      return;
    }
    router.push({ path: '/explore', query: { q } });
  };

  const clearSearch = () => {
    router.push({ path: '/explore' });
  };

  return { searchQuery, submitSearch, clearSearch };
}
