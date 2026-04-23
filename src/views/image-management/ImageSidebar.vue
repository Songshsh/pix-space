<template>
  <el-card class="sidebar-card">
    <h4 class="sidebar-title">集合</h4>
    <el-menu
      :default-active="activeCollection"
      @select="$emit('update:activeCollection', $event)"
    >
      <el-menu-item index="all">
        <el-icon><Picture /></el-icon>
        <span>全部图片</span>
        <el-badge :value="totalImages" class="menu-badge" />
      </el-menu-item>
      <el-menu-item index="recent">
        <el-icon><Clock /></el-icon>
        <span>最近</span>
      </el-menu-item>
      <el-menu-item index="favorites">
        <el-icon><Star /></el-icon>
        <span>收藏</span>
      </el-menu-item>
    </el-menu>

    <el-divider />

    <h4 class="sidebar-title">标签</h4>
    <div class="tags-container">
      <el-tag
        v-for="tag in tags"
        :key="tag.name"
        :type="tag.type || 'info'"
        class="tag-item"
        @click="$emit('select-tag', tag)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Clock, Picture, Star } from '@element-plus/icons-vue';
import type { ImageTag } from '../../types/image';

defineProps<{
  activeCollection: string;
  totalImages: number;
  tags: ImageTag[];
}>();

defineEmits<{
  (e: 'update:activeCollection', value: string): void;
  (e: 'select-tag', tag: ImageTag): void;
}>();
</script>

<style scoped>
.sidebar-card {
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.sidebar-card :deep(.el-menu) {
  border-right: none;
}

.sidebar-card :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
}

.menu-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
}
</style>
