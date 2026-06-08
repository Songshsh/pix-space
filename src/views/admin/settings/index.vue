<template>
  <div class="settings">
    <el-row :gutter="24">
      <el-col :xs="24" :lg="6">
        <el-card class="menu-card settings-menu-card">
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
          <div
            v-if="
              (activeMenu === 'security' || activeMenu === 'notification') &&
              preferencesError
            "
            class="preferences-error"
          >
            <el-alert
              :title="preferencesError"
              type="error"
              show-icon
              :closable="false"
            />
            <el-button
              type="primary"
              link
              :disabled="preferencesLoading"
              @click="loadPreferencesPanels"
            >
              重新加载
            </el-button>
          </div>
          <ProfilePanel
            v-if="activeMenu === 'profile'"
            v-model:profile="profileForm"
            :saving="profileSaving"
            @save="handleProfileSave"
            @avatar-change="handleAvatarChange"
          />
          <SecurityPanel
            v-if="activeMenu === 'security'"
            v-model:form="securityForm"
            v-model:two-factor-enabled="twoFactorEnabled"
            :submitting="securitySaving"
            :preferences-loading="preferencesLoading || !!preferencesError"
            :two-factor-saving="twoFactorSaving"
            :rules="securityRules"
            @update:form-ref="handleSecurityFormRefUpdate"
            @submit="handleSecuritySubmit"
            @toggle-two-factor="handleTwoFactorToggle"
          />
          <NotificationPanel
            v-if="activeMenu === 'notification'"
            v-model:settings="notificationSettings"
            :ready="notificationSettingsReady"
            :saving="notificationSaving"
            @update="handleNotificationUpdate"
          />
          <AppearancePanel
            v-if="activeMenu === 'appearance'"
            v-model:settings="appearanceSettings"
            :theme-colors="themeColors"
          />
          <SystemPanel
            v-if="activeMenu === 'system'"
            v-model:settings="systemSettings"
            @clear-cache="handleClearCache"
            @export-data="handleExportData"
            @delete-account="handleDeleteAccount"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { Bell, Brush, Lock, Setting, User } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { useSettingsPanels } from './useSettingsPanels';

const ProfilePanel = defineAsyncComponent(
  () => import('../../../components/settings/ProfilePanel.vue')
);
const SecurityPanel = defineAsyncComponent(
  () => import('../../../components/settings/SecurityPanel.vue')
);
const NotificationPanel = defineAsyncComponent(
  () => import('../../../components/settings/NotificationPanel.vue')
);
const AppearancePanel = defineAsyncComponent(
  () => import('../../../components/settings/AppearancePanel.vue')
);
const SystemPanel = defineAsyncComponent(
  () => import('../../../components/settings/SystemPanel.vue')
);

const {
  profileForm,
  profileSaving,
  securityForm,
  securityFormRef,
  securityRules,
  securitySaving,
  preferencesLoading,
  preferencesError,
  twoFactorSaving,
  twoFactorEnabled,
  notificationSettings,
  notificationSettingsReady,
  notificationSaving,
  appearanceSettings,
  systemSettings,
  themeColors,
  handleProfileSave,
  handleAvatarChange,
  handleSecuritySubmit,
  handleTwoFactorToggle,
  handleNotificationUpdate,
  handleClearCache,
  handleExportData,
  handleDeleteAccount,
  loadPreferencesPanels,
} = useSettingsPanels();

const activeMenu = ref('profile');

const handleMenuSelect = (key: string) => {
  activeMenu.value = key;
};

const handleSecurityFormRefUpdate = (value: FormInstance | undefined) => {
  securityFormRef.value = value;
};
</script>

<style scoped>
.settings {
  min-height: 100%;
}

.menu-card {
  margin-bottom: var(--ds-space-4);
}

.settings-menu-card :deep(.el-card__body) {
  padding: 0;
}

.settings-menu-card :deep(.el-menu) {
  border-right: none;
}

.content-card {
  min-height: 500px;
}

.preferences-error {
  margin-bottom: var(--ds-space-4);
}
</style>
