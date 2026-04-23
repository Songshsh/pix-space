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
        <span style="margin-left: 8px; color: #666">默认折叠侧边栏</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const appearanceSettings = useSettingsStore();

const themeColors = [
  '#667eea',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];
</script>

<style scoped>
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 24px 0;
}

.settings-form {
  max-width: 600px;
}

.color-picker {
  display: flex;
  gap: 12px;
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
  border-color: #333;
}
</style>
