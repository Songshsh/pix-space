<template>
  <el-table
    :data="files"
    class="file-table"
    @selection-change="$emit('selection-change', $event)"
    @row-dblclick="$emit('open-file', $event)"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="名称" min-width="300">
      <template #default="{ row }">
        <div class="file-name-cell">
          <el-icon :size="24" :color="getFileColor(row.type)" class="file-icon">
            <component :is="getFileIcon(row.type)" />
          </el-icon>
          <el-button
            link
            class="file-name-link"
            @click="$emit('open-file', row)"
          >
            {{ row.name }}
          </el-button>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="大小" width="120">
      <template #default="{ row }">
        {{ formatFileSize(row.size) }}
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" width="100">
      <template #default="{ row }">
        <el-tag size="small">{{ row.type }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="modifiedAt" label="修改时间" width="180" />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="{ row }">
        <el-button
          type="primary"
          link
          size="small"
          @click="$emit('download', row)"
        >
          下载
        </el-button>
        <el-button
          v-permission="'admin'"
          type="primary"
          link
          size="small"
          @click="$emit('rename', row)"
        >
          重命名
        </el-button>
        <el-button
          v-permission="'admin'"
          type="danger"
          link
          size="small"
          @click="$emit('delete', row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type { FileItem } from '../../../types/file';
import {
  getFileColor,
  getFileIcon,
  formatFileSize,
} from '../../../utils/fileDisplay';

defineProps<{
  files: FileItem[];
}>();

defineEmits<{
  (e: 'selection-change', selection: FileItem[]): void;
  (e: 'open-file', file: FileItem): void;
  (e: 'download', file: FileItem): void;
  (e: 'rename', file: FileItem): void;
  (e: 'delete', file: FileItem): void;
}>();
</script>

<style scoped>
.file-table {
  width: 100%;
}

.file-name-cell {
  display: flex;
  align-items: center;
}

.file-icon {
  margin-right: var(--ds-space-2);
}

.file-name-link {
  padding: 0;
  color: inherit;
}
</style>
