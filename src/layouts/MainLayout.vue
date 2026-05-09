<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">PS</span>
          <span v-show="!isCollapsed" class="logo-text">PixSpace</span>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        class="sidebar-menu"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        <el-button
          :icon="isCollapsed ? Expand : Fold"
          text
          @click="isCollapsed = !isCollapsed"
        />
      </div>
    </el-aside>

    <el-container>
      <el-header class="main-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click" placement="bottom-end">
            <span class="user-trigger">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="user-name">{{ displayName }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ userLabel }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleGoProfile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="handleGoSettings">
                  <el-icon><Setting /></el-icon>
                  账号设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main ref="mainContent" class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  DataAnalysis,
  Expand,
  Fold,
  Folder,
  Picture,
  Setting,
  SwitchButton,
  User,
  UserFilled,
} from '@element-plus/icons-vue';
import { useUserDisplay } from '../composables/useUserDisplay';
import { logout as logoutApi } from '../api/user';
import { useSettingsStore } from '../stores/settings';
import { storeToRefs } from 'pinia';
import { provide, useTemplateRef } from 'vue';
import { protectedChildrenRoutes, type MenuIconKey } from '../router/routes';
import { canAccess } from '../utils/access';

const router = useRouter();
const route = useRoute();
const { displayName, userLabel, userStore } = useUserDisplay();
const settingsStore = useSettingsStore();
const { collapsedSidebar: isCollapsed } = storeToRefs(settingsStore);

const mainContentRef = useTemplateRef('mainContent');
provide('scrollContainer', () => mainContentRef.value?.$el || null);

const iconMap: Record<MenuIconKey, unknown> = {
  DataAnalysis,
  Picture,
  User,
  Folder,
  Setting,
};

const activeMenu = computed(() => route.path);

const menuItems = computed(() => {
  return protectedChildrenRoutes
    .filter((r) => r.meta?.showInMenu === true)
    .filter((r) => canAccess(r.meta?.roles, userStore.role))
    .map((r) => {
      const iconKey = r.meta?.icon as MenuIconKey | undefined;
      const icon = iconKey ? iconMap[iconKey] : undefined;
      const index = r.path.startsWith('/') ? r.path : `/admin/${r.path}`;
      return {
        index,
        title: String(r.meta?.title || ''),
        icon,
      };
    })
    .filter((i) => Boolean(i.title) && Boolean(i.icon));
});

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || '首页';
});

const handleGoProfile = () => {
  ElMessage.info('个人中心功能开发中');
};

const handleGoSettings = () => {
  router.push('/admin/settings');
};

const handleLogout = async () => {
  try {
    await logoutApi({ silentError: true });
  } catch (error) {
    void error;
  }
  userStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
};
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: linear-gradient(
    180deg,
    var(--ds-color-admin-sidebar-bg-start) 0%,
    var(--ds-color-admin-sidebar-bg-end) 100%
  );
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--ds-color-white-8);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
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
  color: var(--ds-color-text-inverse);
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  background: transparent;
  padding: var(--ds-space-3) var(--ds-space-2);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 100%;
}

:deep(.sidebar-menu .el-menu-item) {
  color: var(--ds-color-white-65);
  height: 48px;
  line-height: 48px;
  margin: var(--ds-space-1) 0;
  border-radius: var(--ds-radius-2);
}

:deep(.sidebar-menu .el-menu-item:hover) {
  background: var(--ds-color-white-8);
  color: var(--ds-color-text-inverse);
}

:deep(.sidebar-menu .el-menu-item.is-active) {
  background: linear-gradient(
    90deg,
    var(--el-color-primary-light-9) 0%,
    var(--el-color-primary-light-8) 100%
  );
  color: var(--el-color-primary);
}

:deep(.sidebar-menu .el-menu-item .el-icon) {
  font-size: 18px;
}

.sidebar-footer {
  padding: var(--ds-space-3);
  border-top: 1px solid var(--ds-color-white-8);
  display: flex;
  justify-content: center;
}

.sidebar-footer .el-button {
  color: var(--ds-color-white-65);
}

.sidebar-footer .el-button:hover {
  color: var(--ds-color-text-inverse);
  background-color: var(--ds-color-white-8);
}

.main-header {
  background: var(--ds-color-bg-primary);
  border-bottom: 1px solid var(--ds-color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ds-space-5);
  height: 56px;
  box-shadow: var(--ds-shadow-1);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  cursor: pointer;
  padding: var(--ds-space-2) var(--ds-space-3);
  border-radius: var(--ds-radius-2);
  transition: background 0.2s;
}

.user-trigger:hover {
  background: var(--el-fill-color-light);
}

.user-name {
  color: var(--ds-color-text-primary);
  font-size: 14px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  color: var(--ds-color-text-tertiary);
  font-size: 12px;
}

.main-content {
  background: var(--ds-color-bg-secondary);
  padding: var(--ds-space-5);
  overflow-y: auto;
}
</style>
