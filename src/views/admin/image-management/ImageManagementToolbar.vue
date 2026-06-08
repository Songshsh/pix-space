<template>
  <el-card class="toolbar-card">
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button
          v-permission="'admin'"
          type="primary"
          @click="emit('upload')"
        >
          <el-icon><Upload /></el-icon>
          上传图片
        </el-button>
        <el-button
          v-permission="'admin'"
          :disabled="selectedCount === 0"
          @click="emit('batch-change-tags')"
        >
          <el-icon><Discount /></el-icon>更换标签
        </el-button>
        <el-button
          :disabled="selectedCount === 0"
          @click="emit('batch-download')"
        >
          <el-icon><Download /></el-icon>批量下载
        </el-button>
        <el-button
          v-permission="'admin'"
          :disabled="selectedCount === 0"
          @click="emit('batch-favorite')"
        >
          <el-icon><Star /></el-icon>批量收藏
        </el-button>
        <el-button
          v-permission="'admin'"
          type="danger"
          plain
          :disabled="selectedCount === 0"
          @click="emit('batch-delete')"
        >
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          :model-value="searchQuery"
          placeholder="搜索图片..."
          clearable
          class="toolbar-search"
          @update:model-value="
            (value) => emit('update:searchQuery', String(value))
          "
          @input="emit('search')"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button-group>
          <el-button
            :type="viewMode === 'grid' ? 'primary' : ''"
            @click="emit('update:viewMode', 'grid')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button
            :type="viewMode === 'list' ? 'primary' : ''"
            @click="emit('update:viewMode', 'list')"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
        <el-select
          :model-value="sortBy"
          placeholder="排序"
          class="toolbar-sort"
          @update:model-value="(value) => emit('update:sortBy', String(value))"
        >
          <el-option label="最新" value="newest" />
          <el-option label="最旧" value="oldest" />
          <el-option label="名称" value="name" />
          <el-option label="大小" value="size" />
        </el-select>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import {
  Delete,
  Grid,
  List,
  Search,
  Upload,
  Discount,
  Download,
  Star,
} from '@element-plus/icons-vue';

defineProps<{
  selectedCount: number;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: string;
}>();

const emit = defineEmits<{
  'update:searchQuery': [value: string];
  'update:viewMode': [value: 'grid' | 'list'];
  'update:sortBy': [value: string];
  search: [];
  upload: [];
  'batch-change-tags': [];
  'batch-download': [];
  'batch-favorite': [];
  'batch-delete': [];
}>();
</script>

<style scoped>
.toolbar-card {
  margin-bottom: var(--ds-space-4);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ds-space-3);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.toolbar-search {
  width: 220px;
}

.toolbar-sort {
  width: 100px;
}
</style>
