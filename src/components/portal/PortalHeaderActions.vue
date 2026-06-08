<script setup lang="ts">
import PortalHeaderUploadAction from './PortalHeaderUploadAction.vue';
import PortalHeaderUserMenu from './PortalHeaderUserMenu.vue';

const props = defineProps<{
  redirectPath: string;
}>();
</script>

<template>
  <div class="header-actions">
    <PortalHeaderUploadAction :redirect-path="props.redirectPath" />
    <PortalHeaderUserMenu :redirect-path="props.redirectPath" />
  </div>
</template>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
  min-width: 160px;
  justify-content: flex-end;
}
</style>
