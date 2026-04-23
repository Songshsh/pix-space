<template>
  <el-config-provider :locale="zhCn">
    <div v-if="!isAuthReady" class="app-loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <span>初始化中...</span>
    </div>
    <router-view v-else />
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { useUserStore } from './stores/user';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const userStore = useUserStore();
const isAuthReady = computed(() => userStore.isAuthReady);
</script>

<style scoped>
.app-loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #606266;
  font-size: 14px;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
