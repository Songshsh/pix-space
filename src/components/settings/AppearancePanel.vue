<template>
  <div class="appearance-panel">
    <h3 class="section-title">外观设置</h3>
    <el-form label-width="100px" class="settings-form">
      <el-form-item label="主题模式">
        <el-radio-group v-model="appearanceSettings.theme">
          <el-radio label="light">浅色模式</el-radio>
          <el-radio label="dark">深色模式</el-radio>
          <el-radio label="auto">跟随系统</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主题色">
        <div class="color-picker">
          <div
            v-for="color in themeColors"
            :key="color"
            class="color-item"
            :class="{
              active: appearanceSettings.primaryColor === color,
            }"
            :style="{ background: color }"
            @click="appearanceSettings.primaryColor = color"
          />
        </div>
      </el-form-item>
      <el-form-item label="侧边栏">
        <el-switch v-model="appearanceSettings.collapsedSidebar" />
        <span class="sidebar-hint">默认折叠侧边栏</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const appearanceSettings = useSettingsStore();

const themeColors = computed(() => {
  if (typeof window === 'undefined') return [];
  const styles = getComputedStyle(document.documentElement);
  const vars = [
    '--el-color-primary',
    '--ds-color-warning',
    '--ds-color-success',
    '--ds-color-danger',
    '--el-color-primary-dark-2',
    '--el-color-primary-light-3',
  ];
  return vars
    .map((name) => styles.getPropertyValue(name).trim())
    .filter((value) => value);
});
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-5) 0;
}

.settings-form {
  max-width: 600px;
}

.color-picker {
  display: flex;
  gap: var(--ds-space-3);
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border-color: var(--ds-color-text-primary);
}

.sidebar-hint {
  margin-left: var(--ds-space-2);
  color: var(--ds-color-text-secondary);
}
</style>
