<template>
  <div class="settings">
    <el-row :gutter="24">
      <el-col :xs="24" :lg="6">
        <el-card class="menu-card">
          <el-menu :default-active="activeMenu" @select="handleMenuSelect">
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </el-menu-item>
            <el-menu-item index="notification">
              <el-icon><Bell /></el-icon>
              <span>通知设置</span>
            </el-menu-item>
            <el-menu-item index="appearance">
              <el-icon><Brush /></el-icon>
              <span>外观设置</span>
            </el-menu-item>
            <el-menu-item index="system">
              <el-icon><Setting /></el-icon>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="18">
        <el-card class="content-card">
          <ProfilePanel v-if="activeMenu === 'profile'" />
          <SecurityPanel v-if="activeMenu === 'security'" />
          <NotificationPanel v-if="activeMenu === 'notification'" />
          <AppearancePanel v-if="activeMenu === 'appearance'" />
          <SystemPanel v-if="activeMenu === 'system'" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { Bell, Brush, Lock, Setting, User } from '@element-plus/icons-vue';

const ProfilePanel = defineAsyncComponent(
  () => import('../../components/settings/ProfilePanel.vue')
);
const SecurityPanel = defineAsyncComponent(
  () => import('../../components/settings/SecurityPanel.vue')
);
const NotificationPanel = defineAsyncComponent(
  () => import('../../components/settings/NotificationPanel.vue')
);
const AppearancePanel = defineAsyncComponent(
  () => import('../../components/settings/AppearancePanel.vue')
);
const SystemPanel = defineAsyncComponent(
  () => import('../../components/settings/SystemPanel.vue')
);

const activeMenu = ref('profile');

const handleMenuSelect = (key: string) => {
  activeMenu.value = key;
};
</script>

<style scoped>
.settings {
  min-height: 100%;
}

.menu-card {
  margin-bottom: 16px;
}

.menu-card :deep(.el-card__body) {
  padding: 0;
}

.menu-card .el-menu {
  border-right: none;
}

.content-card {
  min-height: 500px;
}
</style>
