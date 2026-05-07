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
  top: 20px;
  right: 40px;
  font-size: 24px;
  color: #999;
  background: transparent;
  border: none;
  padding: 0;
  line-height: 1;
  cursor: pointer;
}

.dialog-body {
  display: flex;
  gap: 40px;
  padding: 40px;
  height: 900px;
  box-sizing: border-box;
}

.left {
  width: 760px;
  flex: none;
}

.preview-image {
  width: 100%;
  height: 820px;
  border-radius: 12px;
  background-color: #f5f6f7;
}

.right {
  width: 320px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #d9d9d9;
}

.name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.title {
  font-size: 16px;
  color: #333;
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
  border-radius: 8px;
  background-color: #fff;
  color: var(--portal-color-primary);
  border: 1px solid #e8e8e8;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #f0f2f5;
  color: #666;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

.image-preview-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.image-preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}
</style>
