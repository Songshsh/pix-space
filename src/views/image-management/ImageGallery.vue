<template>
  <div
    v-if="viewMode === 'grid'"
    ref="containerRef"
    class="images-grid-viewport"
  >
    <div
      class="images-grid-inner"
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
        class="images-grid-row"
      >
        <div
          v-for="image in getRowItems(virtualRow.index)"
          :key="image.id"
          class="image-card"
          :class="{ selected: selectedImages.includes(image.id.toString()) }"
          tabindex="0"
          role="button"
          aria-label="查看图片"
          @click="$emit('click-image', image)"
          @keydown.enter.prevent="$emit('click-image', image)"
          @keydown.space.prevent="$emit('toggle-select', image)"
        >
          <div class="image-preview" :style="{ background: image.color }">
            <div
              class="image-checkbox"
              :class="{
                'is-checked': selectedImages.includes(image.id.toString()),
              }"
              @click.stop="$emit('toggle-select', image)"
            >
              <el-checkbox
                :model-value="selectedImages.includes(image.id.toString())"
              />
            </div>
            <el-icon :size="48" color="rgba(255,255,255,0.3)">
              <Picture />
            </el-icon>
          </div>
          <div class="image-overlay">
            <span class="image-title">{{ image.title }}</span>
            <div class="image-actions">
              <el-button
                text
                circle
                size="small"
                @click.stop="$emit('toggle-favorite', image)"
              >
                <el-icon :color="image.favorite ? '#f56c6c' : '#666'">
                  <Star />
                </el-icon>
              </el-button>
              <el-dropdown
                trigger="click"
                @command="(cmd: string) => handleCommand(cmd, image)"
              >
                <el-button text circle size="small" @click.stop>
                  <el-icon color="#666"><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="preview">
                      <el-icon><View /></el-icon>预览
                    </el-dropdown-item>
                    <el-dropdown-item v-if="canEdit" command="rename">
                      <el-icon><Edit /></el-icon>重命名
                    </el-dropdown-item>
                    <el-dropdown-item v-if="canEdit" command="change-tags">
                      <el-icon><Discount /></el-icon>更换标签
                    </el-dropdown-item>
                    <el-dropdown-item command="copy-link">
                      <el-icon><Link /></el-icon>复制链接
                    </el-dropdown-item>
                    <el-dropdown-item command="download">
                      <el-icon><Download /></el-icon>下载
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="canEdit"
                      command="delete"
                      divided
                      class="text-danger"
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
  </div>

  <el-table
    v-else
    :data="images"
    style="width: 100%"
    @selection-change="
      (selection: Image[]) => $emit('selection-change', selection)
    "
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="预览" width="80">
      <template #default="{ row }">
        <div
          class="table-preview"
          :style="{ background: row.color }"
          @click="$emit('click-image', row)"
        >
          <el-icon :size="24" color="rgba(255,255,255,0.3)">
            <Picture />
          </el-icon>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="名称" min-width="200">
      <template #default="{ row }">
        <span class="table-title" @click="$emit('click-image', row)">
          {{ row.title }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="size" label="大小" width="100" />
    <el-table-column prop="createdAt" label="上传时间" width="180" />
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }">
        <el-dropdown
          trigger="click"
          @command="(cmd: string) => handleCommand(cmd, row)"
        >
          <el-button type="primary" link size="small">
            更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="preview">预览</el-dropdown-item>
              <el-dropdown-item v-if="canEdit" command="rename"
                >重命名</el-dropdown-item
              >
              <el-dropdown-item v-if="canEdit" command="change-tags"
                >更换标签</el-dropdown-item
              >
              <el-dropdown-item command="copy-link">复制链接</el-dropdown-item>
              <el-dropdown-item command="download">下载</el-dropdown-item>
              <el-dropdown-item
                v-if="canEdit"
                command="delete"
                divided
                class="text-danger"
                >删除</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import {
  Delete,
  Edit,
  Picture,
  Star,
  MoreFilled,
  Discount,
  Download,
  ArrowDown,
  Link,
  View,
} from '@element-plus/icons-vue';
import type { Image } from '../../types/image';
import { useVirtualizer } from '@tanstack/vue-virtual';
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
  viewMode: string;
  images: Image[];
  selectedImages: string[];
  canEdit?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click-image', image: Image): void;
  (e: 'toggle-select', image: Image): void;
  (e: 'selection-change', selection: Image[]): void;
  (e: 'toggle-favorite', image: Image): void;
  (e: 'edit', image: Image): void;
  (e: 'delete', image: Image): void;
  (e: 'change-tags', image: Image): void;
  (e: 'rename', image: Image): void;
  (e: 'download', image: Image): void;
  (e: 'copy-link', image: Image): void;
  (e: 'preview', image: Image): void;
}>();

const handleCommand = (command: string, image: Image) => {
  switch (command) {
    case 'preview':
      emit('preview', image);
      break;
    case 'rename':
      emit('rename', image);
      break;
    case 'change-tags':
      emit('change-tags', image);
      break;
    case 'download':
      emit('download', image);
      break;
    case 'copy-link':
      emit('copy-link', image);
      break;
    case 'delete':
      emit('delete', image);
      break;
  }
};

const containerRef = ref<HTMLElement | null>(null);
const scrollElement = ref<HTMLElement | null>(null);

const { width: containerWidth } = useElementSize(containerRef);

const itemMinWidth = 200;
const itemHeight = 220;
const gap = 16;

const columns = computed(() => {
  const width =
    containerWidth.value || (containerRef.value?.clientWidth ?? 1000);
  return Math.max(1, Math.floor((width + gap) / (itemMinWidth + gap)));
});

const totalRows = computed(() =>
  Math.ceil(props.images.length / columns.value)
);

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
  return props.images.slice(start, end);
};

const scrollContainer = inject<() => HTMLElement | null>('scrollContainer');

onMounted(() => {
  scrollElement.value = scrollContainer
    ? scrollContainer()
    : (document.querySelector('.main-content') as HTMLElement);
});
</script>

<style scoped>
.images-grid-viewport {
  width: 100%;
}

.images-grid-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding-bottom: 16px;
}

.image-card {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  height: 220px; /* Force fixed height for virtual scrolling */
  box-sizing: border-box;
}

.image-card:hover,
.image-card:focus {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  outline: none;
  border-color: var(--ds-color-primary-light, #f093fb);
}

.image-card.selected {
  border-color: var(--el-color-primary);
}

.image-preview {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
}

.image-overlay {
  padding: 12px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-title {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
}

.image-actions {
  display: flex;
  gap: 4px;
}

.table-preview {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.table-title {
  cursor: pointer;
}

.table-title:hover {
  color: var(--el-color-primary);
}
</style>
