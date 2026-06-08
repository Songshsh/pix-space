<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">PS</span>
          <span v-show="!isCollapsed" class="logo-text">Pix Space</span>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        class="sidebar-menu admin-layout-sidebar-menu"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.index"
          :index="item.index"
        >
          <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
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
            <el-breadcrumb-item v-if="route.path !== '/admin/dashboard'">{{
              currentPageTitle
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click" placement="bottom-end">
            <span class="user-trigger">
              <el-avatar
                :size="32"
                :src="userStore.avatar"
                :icon="UserFilled"
              />
              <span class="user-name">{{ displayName }}</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ userLabel }}</el-dropdown-item>
                <el-dropdown-item divided @click="handleGoPortal">
                  <el-icon><Monitor /></el-icon>
                  前往前台
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
  Monitor,
  Picture,
  Setting,
  SwitchButton,
  User,
  UserFilled,
} from '@element-plus/icons-vue';
import { useUserDisplay } from '../composables/useUserDisplay';
import { useLogout } from '../composables/useLogout';
import { useSettingsStore } from '../stores/settings';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';
import { protectedChildrenRoutes, type MenuIconKey } from '../router';
import { canAccess, ADMIN_ACCESS_ROLES } from '../utils/access';
import { scrollContainerKey } from '../composables/injectionKeys';
import {
  applyAdminPrimaryColorToRoot,
  applyPortalPrimaryColorToRoot,
} from '../utils/theme';

const router = useRouter();
const route = useRoute();
const { displayName, userLabel } = useUserDisplay();
const { logout } = useLogout();
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { collapsedSidebar: isCollapsed } = storeToRefs(settingsStore);

const mainContentRef = useTemplateRef('mainContent');
provide(scrollContainerKey, () => mainContentRef.value?.$el || null);

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
    .filter((i) => Boolean(i.title));
});

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || '首页';
});

const handleGoPortal = () => {
  router.push('/explore');
};

const handleGoSettings = () => {
  const target = canAccess(ADMIN_ACCESS_ROLES, userStore.role)
    ? '/admin/settings'
    : '/account';
  router.push(target);
};

const handleLogout = async () => {
  await logout();
};

onBeforeMount(() => {
  applyAdminPrimaryColorToRoot(settingsStore.primaryColor);
});

watch(
  () => settingsStore.primaryColor,
  (value) => {
    applyAdminPrimaryColorToRoot(value);
  }
);

onUnmounted(() => {
  applyPortalPrimaryColorToRoot();
});
</script>

<style scoped>
@import '../styles/shared-logo.css';

.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background: var(--ds-color-admin-sidebar-bg-start);
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
  border-bottom: 1px solid var(--ds-color-overlay-white-subtle);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
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

.sidebar-menu.el-menu--collapse {
  padding-left: 0;
  padding-right: 0;
}

.sidebar-footer {
  padding: var(--ds-space-3);
  border-top: 1px solid var(--ds-color-overlay-white-subtle);
  display: flex;
  justify-content: center;
}

.sidebar-footer .el-button {
  color: var(--ds-color-overlay-white-dim);
}

.sidebar-footer .el-button:hover {
  color: var(--ds-color-text-inverse);
  background-color: var(--ds-color-overlay-white-subtle);
}

.main-header {
  background: var(--ds-color-bg-primary);
  border-bottom: 1px solid var(--ds-color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--ds-space-6);
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
  padding: var(--ds-space-6);
  overflow-y: auto;
}
</style>
