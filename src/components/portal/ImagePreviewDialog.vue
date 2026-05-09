<script setup lang="ts">
import { computed } from 'vue';

type PreviewItem = {
  id: string;
  title: string;
  imageHeight: number;
  bgColor: string;
  tags: string[];
  author: string;
};

const props = defineProps<{
  modelValue: boolean;
  item: PreviewItem | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'view-detail', id: string): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const handleViewDetail = () => {
  if (!props.item) return;
  emit('view-detail', props.item.id);
};
</script>

<template>
  <el-dialog
    v-model="visible"
    class="image-preview-dialog"
    width="1200px"
    top="60px"
    :show-close="false"
    destroy-on-close
    append-to-body
  >
    <div v-if="item" class="dialog-root">
      <button
        class="close"
        type="button"
        aria-label="close"
        @click="visible = false"
      >
        ✕
      </button>
      <div class="dialog-body">
        <div class="left">
          <div
            class="preview-image"
            :style="{ backgroundColor: item.bgColor }"
          ></div>
        </div>
        <div class="right">
          <div class="author">
            <div class="avatar"></div>
            <div class="name">{{ item.author }}</div>
          </div>
          <div class="title">{{ item.title }}</div>
          <el-button type="primary" class="collect-btn">采集到画板</el-button>
          <el-button class="detail-btn" @click="handleViewDetail">
            查看详情
          </el-button>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog-root {
  height: 900px;
  position: relative;
}

.close {
  position: absolute;
  top: var(--ds-space-5-0);
  right: var(--ds-space-7);
  font-size: 24px;
  color: var(--ds-color-text-tertiary);
  background: transparent;
  border: none;
  padding: 0;
  line-height: 1;
  cursor: pointer;
}

.dialog-body {
  display: flex;
  gap: var(--ds-space-7);
  padding: var(--ds-space-7);
  height: 900px;
}

.left {
  width: 760px;
  flex: none;
}

.preview-image {
  width: 100%;
  height: 820px;
  border-radius: var(--ds-radius-3);
  background-color: var(--ds-color-bg-tertiary);
}

.right {
  width: 320px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-4);
}

.author {
  display: flex;
  align-items: center;
  gap: var(--ds-space-3);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--el-fill-color);
}

.name {
  font-size: 16px;
  color: var(--ds-color-text-primary);
  font-weight: 500;
}

.title {
  font-size: 16px;
  color: var(--ds-color-text-primary);
  font-weight: 600;
}

.collect-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

.detail-btn {
  width: 100%;
  height: 40px;
  font-size: 14px;
  border-radius: var(--ds-radius-2);
  background-color: var(--ds-color-bg-primary);
  color: var(--portal-color-primary);
  border: 1px solid var(--ds-color-border);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ds-space-2);
}

.tag {
  background-color: var(--ds-color-bg-secondary);
  color: var(--ds-color-text-secondary);
  font-size: 12px;
  padding: var(--ds-space-1) var(--ds-space-2);
  border-radius: var(--ds-radius-1);
}

.image-preview-dialog :deep(.el-dialog) {
  border-radius: var(--ds-radius-3);
  overflow: hidden;
}

.image-preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}
</style>
