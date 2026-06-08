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
          v-for="file in getRowItems(props.files, virtualRow.index)"
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
            <p class="file-meta">
              {{ formatFileSize(file.size) }} · {{ file.modifiedAt }}
            </p>
          </div>
          <div class="file-actions">
            <el-dropdown trigger="click">
              <el-button text circle @click.stop>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$emit('download', file)">
                    <el-icon><Download /></el-icon>下载
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-permission="'admin'"
                    @click="$emit('rename', file)"
                  >
                    <el-icon><Edit /></el-icon>重命名
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-permission="'admin'"
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
import { Delete, Download, Edit, MoreFilled } from '@element-plus/icons-vue';
import type { FileItem } from '../../../types/file';
import { useVirtualGrid } from '../../../composables/useVirtualGrid';
import {
  getFileColor,
  getFileIcon,
  formatFileSize,
} from '../../../utils/fileDisplay';

const props = defineProps<{
  files: FileItem[];
  selectedFiles: number[];
}>();

defineEmits<{
  (e: 'select-file', file: FileItem): void;
  (e: 'open-file', file: FileItem): void;
  (e: 'download', file: FileItem): void;
  (e: 'rename', file: FileItem): void;
  (e: 'delete', file: FileItem): void;
}>();

const containerRef = ref<HTMLElement | null>(null);

const totalItems = computed(() => props.files.length);

const { virtualizer, getRowItems } = useVirtualGrid({
  containerRef,
  itemMinWidth: 180,
  itemHeight: 140,
  totalItems,
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
  gap: var(--ds-space-4);

  /* Adjust height to account for gap, padding is not used here */
  padding-bottom: var(--ds-space-4);
}

.file-item {
  position: relative;
  padding: var(--ds-space-4);
  border: 1px solid var(--ds-color-border);
  border-radius: var(--ds-radius-2);
  cursor: pointer;
  transition: all 0.2s;
  height: 140px;
}
.file-item:hover {
  border-color: var(--el-color-primary);
  box-shadow: var(--ds-shadow-1);
}
.file-item.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.file-icon {
  display: flex;
  justify-content: center;
  margin-bottom: var(--ds-space-3);
}

.file-info {
  text-align: center;
}

.file-name {
  font-size: 14px;
  color: var(--ds-color-text-primary);
  margin: 0 0 var(--ds-space-1) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  margin: 0;
}

.file-actions {
  position: absolute;
  top: var(--ds-space-2);
  right: var(--ds-space-2);
  opacity: 0;
  transition: opacity 0.2s;
}

.file-item:hover .file-actions {
  opacity: 1;
}
</style>
