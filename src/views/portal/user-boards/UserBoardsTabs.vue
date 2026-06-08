<script setup lang="ts">
import type { TabKey } from '../../../types/user-boards';

defineProps<{
  activeTab: TabKey;
  isOwnerView: boolean;
  showCreateButton: boolean;
  showLikesTab: boolean;
}>();

const emit = defineEmits<{
  'update:activeTab': [value: TabKey];
  'create-board': [];
}>();
</script>

<template>
  <div class="tabs-bar">
    <div class="tabs-left">
      <button
        type="button"
        class="tab-item"
        :class="{ active: activeTab === 'boards' }"
        @click="emit('update:activeTab', 'boards')"
      >
        画板
      </button>
      <button
        type="button"
        class="tab-item"
        :class="{ active: activeTab === 'uploads' }"
        @click="emit('update:activeTab', 'uploads')"
      >
        {{ isOwnerView ? '我的上传' : '上传' }}
      </button>
      <button
        v-if="showLikesTab"
        type="button"
        class="tab-item"
        :class="{ active: activeTab === 'likes' }"
        @click="emit('update:activeTab', 'likes')"
      >
        赞过
      </button>
    </div>
    <div v-if="showCreateButton" class="tabs-right">
      <el-button round plain size="small" @click="emit('create-board')">
        新建画板
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.tabs-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
}

.tabs-left {
  display: flex;
  align-items: center;
  gap: var(--ds-space-6);
  position: relative;
}

.tab-item {
  appearance: none;
  font-size: 14px;
  color: var(--ds-color-text-tertiary);
  cursor: pointer;
  padding: var(--ds-space-2) 0;
  position: relative;
  user-select: none;
  border: none;
  background: transparent;
}

.tab-item.active {
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--el-color-primary);
  border-radius: var(--ds-radius-0);
}

.tabs-right {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}
</style>
