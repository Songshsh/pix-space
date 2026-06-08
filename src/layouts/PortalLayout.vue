<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import PortalHeaderActions from '../components/portal/PortalHeaderActions.vue';

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
</script>

<template>
  <div class="portal-layout">
    <header class="portal-header">
      <div class="header-container">
        <div class="logo" @click="router.push('/')">
          <div class="logo-icon">PS</div>
          <span class="logo-text">Pix Space</span>
        </div>

        <div class="search-wrapper">
          <el-input
            v-model="searchQuery"
            placeholder="搜索高品质素材、灵感..."
            class="search-input portal-search-input"
            :prefix-icon="Search"
            clearable
            @keyup.enter="submitSearch"
            @clear="clearSearch"
          />
        </div>

        <PortalHeaderActions :redirect-path="route.fullPath" />
      </div>
    </header>

    <main class="portal-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.portal-layout {
  min-height: 100vh;
  background-color: var(--ds-color-bg-tertiary);
  display: flex;
  flex-direction: column;
}

.portal-header {
  position: sticky;
  top: 0;
  z-index: var(--ds-z-sticky);
  background-color: var(--ds-color-bg-primary);
  height: 64px;
  box-shadow: var(--ds-shadow-1);
  display: flex;
  justify-content: center;
}

.header-container {
  width: 100%;
  max-width: 1440px;
  padding: 0 var(--ds-space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
  cursor: pointer;
  min-width: 160px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(
    135deg,
    var(--el-color-primary) 0%,
    var(--el-color-primary-dark-2) 100%
  );
  border-radius: var(--ds-radius-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-text-inverse);
  font-weight: 700;
  font-size: 14px;
}

.logo-text {
  color: var(--ds-color-text-primary);
  font-size: 20px;
  font-weight: 600;
  white-space: nowrap;
}

.search-wrapper {
  flex: 1;
  max-width: 800px;
  margin: 0 var(--ds-space-7);
}

.portal-search-input :deep(.el-input__wrapper) {
  background-color: var(--ds-color-bg-secondary);
  border-radius: var(--ds-radius-pill);
  box-shadow: none;
  height: 40px;
}

.portal-search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
  background-color: var(--ds-color-bg-primary);
}

.portal-search-input :deep(.el-input__inner) {
  color: var(--ds-color-text-primary);
}

.portal-main {
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--ds-space-6);
}
</style>
