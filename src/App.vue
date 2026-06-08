<template>
  <el-config-provider :locale="zhCn">
    <div v-if="hasError" class="error-boundary">
      <p>页面出现异常</p>
      <el-button type="primary" @click="handleRetry">重试</el-button>
    </div>
    <router-view v-else :key="retryKey" />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const hasError = ref(false);
const retryKey = ref(0);

const handleRetry = () => {
  retryKey.value += 1;
  hasError.value = false;
};

onErrorCaptured(() => {
  hasError.value = true;
  return false;
});
</script>

<style scoped>
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--ds-space-4);
  color: var(--ds-color-text-secondary);
  font-size: 16px;
}
</style>
