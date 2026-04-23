<template>
  <div ref="containerRef" class="file-grid-viewport">
    <div
      class="file-grid-inner"
      :style="{
        height: `${virtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }"
    >
      <div
        v-for="virtualRow in virtualizer.getVirtualItems()"
        :key="virtualRow.index"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${virtualRow.size}px`,
          transform: `translateY(${virtualRow.start}px)`,
        }"
        class="file-grid-row"
      >
        <div
          v-for="file in getRowItems(virtualRow.index)"
          :key="file.id"
          class="file-item"
          :class="{ selected: selectedFiles.includes(file.id) }"
          @click="$emit('select-file', file)"
          @dblclick="$emit('open-file', file)"
        >
          <div class="file-icon">
            <el-icon :size="48" :color="getFileColor(file.type)">
              <component :is="getFileIcon(file.type)" />
            </el-icon>
          </div>
          <div class="file-info">
            <p class="file-name">{{ file.name }}</p>
            <p class="file-meta">{{ file.size }} · {{ file.modifiedAt }}</p>
          </div>
          <div class="file-actions">
            <el-dropdown trigger="click">
              <el-button text circle>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$emit('download', file)">
                    <el-icon><Download /></el-icon>下载
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="canEdit"
                    @click="$emit('rename', file)"
                  >
                    <el-icon><Edit /></el-icon>重命名
                  </el-dropdown-item>
                  <el-dropdown-item v-if="canEdit" @click="$emit('move', file)">
                    <el-icon><Rank /></el-icon>移动
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="canEdit"
                    divided
                    @click="$emit('delete', file)"
                  >
                    <el-icon><Delete /></el-icon>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import {
  Delete,
  Download,
  Edit,
  MoreFilled,
  Rank,
} from '@element-plus/icons-vue';
import type { FileItem } from '../../types/file';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { useElementSize } from '@vueuse/core';
import { getFileColor, getFileIcon } from '../../utils/fileDisplay';

const props = defineProps<{
  files: FileItem[];
  selectedFiles: number[];
  canEdit?: boolean;
}>();

defineEmits<{
  (e: 'select-file', file: FileItem): void;
  (e: 'open-file', file: FileItem): void;
  (e: 'download', file: FileItem): void;
  (e: 'rename', file: FileItem): void;
  (e: 'move', file: FileItem): void;
  (e: 'delete', file: FileItem): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const scrollElement = ref<HTMLElement | null>(null);

const { width: containerWidth } = useElementSize(containerRef);

const itemMinWidth = 180;
const itemHeight = 140;
const gap = 16;

const columns = computed(() => {
  const width =
    containerWidth.value || (containerRef.value?.clientWidth ?? 1000);
  return Math.max(1, Math.floor((width + gap) / (itemMinWidth + gap)));
});

const totalRows = computed(() => Math.ceil(props.files.length / columns.value));

const virtualizer = useVirtualizer({
  get count() {
    return totalRows.value;
  },
  getScrollElement: () => scrollElement.value,
  estimateSize: () => itemHeight + gap,
  overscan: 3,
});

const getRowItems = (rowIndex: number) => {
  const start = rowIndex * columns.value;
  const end = start + columns.value;
  return props.files.slice(start, end);
};

const scrollContainer = inject<() => HTMLElement | null>('scrollContainer');

onMounted(() => {
  scrollElement.value = scrollContainer
    ? scrollContainer()
    : (document.querySelector('.main-content') as HTMLElement);
});
</script>

<style scoped>
.file-grid-viewport {
  width: 100%;
}

.file-grid-row {
  display: grid;

  /* Use fixed columns based on calculated value to align perfectly */
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;

  /* Adjust height to account for gap, padding is not used here */
  padding-bottom: 16px;
}

.file-item {
  position: relative;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  height: 140px; /* Force fixed height for consistent virtual scrolling */
  box-sizing: border-box;
}
.file-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}
.file-item.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}
.file-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}
.file-info {
  text-align: center;
}
.file-name {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.file-meta {
  font-size: 12px;
  color: #999;
  margin: 0;
}
.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}
.file-item:hover .file-actions {
  opacity: 1;
}
</style>
