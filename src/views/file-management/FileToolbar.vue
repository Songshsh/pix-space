<template>
  <el-card class="toolbar-card">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button v-if="canEdit" type="primary" @click="$emit('upload')">
          <el-icon><Upload /></el-icon>
          上传文件
        </el-button>
        <el-button v-if="canEdit" @click="$emit('create-folder')">
          <el-icon><FolderAdd /></el-icon>
          新建文件夹
        </el-button>
        <el-button
          v-if="canEdit"
          :disabled="selectedCount === 0"
          @click="$emit('batch-delete')"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          :model-value="searchKeyword"
          placeholder="搜索文件..."
          clearable
          style="width: 250px"
          @update:model-value="$emit('update:searchKeyword', $event)"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button-group style="margin-left: 12px">
          <el-button
            :type="viewMode === 'grid' ? 'primary' : ''"
            @click="$emit('update:viewMode', 'grid')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button
            :type="viewMode === 'list' ? 'primary' : ''"
            @click="$emit('update:viewMode', 'list')"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {
  Delete,
  FolderAdd,
  Grid,
  List,
  Search,
  Upload,
} from '@element-plus/icons-vue';

defineProps<{
  searchKeyword: string;
  viewMode: string;
  selectedCount: number;
  canEdit?: boolean;
}>();

defineEmits<{
  (e: 'update:searchKeyword', value: string): void;
  (e: 'update:viewMode', value: string): void;
  (e: 'upload'): void;
  (e: 'create-folder'): void;
  (e: 'batch-delete'): void;
}>();
</script>

<style scoped>
.toolbar-card {
  margin-bottom: 16px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
