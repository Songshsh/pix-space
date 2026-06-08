<template>
  <el-row :gutter="24" class="table-row">
    <el-col :span="24">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最新上传</span>
            <el-button type="primary" size="small" @click="emit('view-all')">
              查看全部
            </el-button>
          </div>
        </template>
        <el-table :data="uploads" style="width: 100%">
          <el-table-column prop="name" label="文件名" min-width="200" />
          <el-table-column prop="type" label="类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getTypeTag(row.type)" size="small">{{
                row.type
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="100" />
          <el-table-column prop="uploader" label="上传者" width="120" />
          <el-table-column prop="time" label="上传时间" width="180" />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import type { RecentUpload } from '../../types/dashboard';
import { FileType } from '../../utils/fileDisplay';

defineProps<{
  uploads: RecentUpload[];
}>();

const emit = defineEmits<{
  (e: 'view-all'): void;
}>();

const getTypeTag = (type: string) => {
  const typeMap: Record<string, 'primary' | 'success' | 'warning' | 'info'> = {
    [FileType.Image]: 'primary',
    [FileType.Document]: 'success',
    [FileType.Video]: 'warning',
    [FileType.Spreadsheet]: 'info',
  };
  return typeMap[type] || 'info';
};
</script>

<style scoped>
.table-row {
  margin-bottom: var(--ds-space-6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
