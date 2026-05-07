<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';

const route = useRoute();
const router = useRouter();
const settingsStore = useSettingsStore();
const searchQuery = ref('');

const applyPortalPrimaryColor = () => {
  const root = document.documentElement;
  const primary = '#8b5cf6';
  root.style.setProperty('--el-color-primary', primary);

  const hex = primary.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  for (let i = 1; i <= 9; i++) {
    const mixRatio = i * 0.1;
    const mixR = Math.round(255 * mixRatio + r * (1 - mixRatio));
    const mixG = Math.round(255 * mixRatio + g * (1 - mixRatio));
    const mixB = Math.round(255 * mixRatio + b * (1 - mixRatio));
    root.style.setProperty(
      `--el-color-primary-light-${i}`,
      `rgb(${mixR}, ${mixG}, ${mixB})`
    );
  }

  const darkRatio = 0.2;
  const darkR = Math.round(r * (1 - darkRatio));
  const darkG = Math.round(g * (1 - darkRatio));
  const darkB = Math.round(b * (1 - darkRatio));
  root.style.setProperty(
    '--el-color-primary-dark-2',
    `rgb(${darkR}, ${darkG}, ${darkB})`
  );
};

onMounted(() => {
  applyPortalPrimaryColor();
});

onUnmounted(() => {
  settingsStore.applyPrimaryColor();
});

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

const goAdmin = () => {
  router.push('/admin/dashboard');
};
</script>

<template>
  <div class="portal-layout portal-theme">
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
            class="search-input"
            :prefix-icon="Search"
            clearable
            @keyup.enter="submitSearch"
            @clear="clearSearch"
          />
        </div>

        <div class="header-actions">
          <el-button type="primary" round class="upload-btn">上传</el-button>
          <el-dropdown trigger="click" placement="bottom-end">
            <div class="avatar-wrapper">
              <el-avatar :size="32" class="user-avatar">U</el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goAdmin"
                  >进入后台管理</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
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
  background-color: #f5f6f7;
  display: flex;
  flex-direction: column;
}

.portal-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: center;
}

.header-container {
  width: 100%;
  max-width: 1440px;
  padding: 0 var(--ds-space-5);
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
    var(--portal-color-primary) 0%,
    var(--portal-color-primary-dark) 100%
  );
  border-radius: var(--ds-radius-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}

.logo-text {
  color: #333;
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
}

.search-wrapper {
  flex: 1;
  max-width: 800px;
  margin: 0 var(--ds-space-6);
}

.search-input :deep(.el-input__wrapper) {
  background-color: #f0f2f5;
  border-radius: 20px;
  box-shadow: none;
  height: 40px;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--ds-color-primary) inset;
  background-color: #fff;
}

.search-input :deep(.el-input__inner) {
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
  min-width: 160px;
  justify-content: flex-end;
}

.upload-btn {
  padding: var(--ds-space-2) var(--ds-space-5);
  font-weight: 500;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  background-color: #d9d9d9;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.portal-main {
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--ds-space-5);
  box-sizing: border-box;
}
</style>
