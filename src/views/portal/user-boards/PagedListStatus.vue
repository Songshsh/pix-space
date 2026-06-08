<script setup lang="ts">
defineProps<{
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  show: boolean;
}>();

const emit = defineEmits<{
  'load-more': [];
  retry: [];
}>();
</script>

<template>
  <div v-if="show" class="paged-list-status">
    <div v-if="loadingMore" class="status-text">加载中...</div>
    <button
      v-else-if="error"
      type="button"
      class="status-btn"
      @click="emit('retry')"
    >
      加载失败，点击重试
    </button>
    <button
      v-else-if="hasMore"
      type="button"
      class="status-btn"
      @click="emit('load-more')"
    >
      加载更多
    </button>
    <div v-else-if="!hasMore" class="status-text">没有更多了</div>
  </div>
</template>

<style scoped>
.paged-list-status {
  display: flex;
  justify-content: center;
  padding: var(--ds-space-6) 0;
}

.status-text,
.status-btn {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.status-btn {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
</style>
