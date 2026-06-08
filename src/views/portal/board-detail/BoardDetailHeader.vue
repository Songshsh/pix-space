<script setup lang="ts">
import type { BoardDetail } from '../../../types/board-detail';
import type { BoardDetailViewState } from './useBoardDetailView';

defineProps<{
  viewState: BoardDetailViewState;
  boardDetail: BoardDetail | null;
  authorMeta: string;
}>();

const emit = defineEmits<{
  back: [];
  edit: [];
  upload: [];
  authorClick: [];
}>();
</script>

<template>
  <div class="board-header-card">
    <template v-if="viewState === 'loading'">
      <div class="board-header-skeleton">
        <div class="skeleton-line skeleton-line--lg"></div>
        <div class="skeleton-line skeleton-line--md"></div>
      </div>
    </template>

    <template v-else-if="viewState === 'forbidden'">
      <el-button text class="board-back" @click="emit('back')">
        返回个人主页
      </el-button>
      <div class="board-title">私有画板</div>
      <div class="board-desc">仅创建者可见</div>
    </template>

    <template v-else-if="viewState === 'notfound'">
      <el-button text class="board-back" @click="emit('back')">
        返回个人主页
      </el-button>
      <div class="board-title">画板不存在</div>
      <div class="board-desc">该画板可能已被删除或移动</div>
    </template>

    <template v-else-if="boardDetail">
      <el-button text class="board-back" @click="emit('back')">
        返回个人主页
      </el-button>
      <div class="board-title">{{ boardDetail.title }}</div>
      <div class="board-desc">{{ boardDetail.description }}</div>
      <button type="button" class="board-author" @click="emit('authorClick')">
        <div class="author-avatar"></div>
        <span class="author-meta">{{ authorMeta }}</span>
      </button>
      <div class="board-actions">
        <el-button
          v-if="boardDetail.canEdit"
          round
          plain
          size="small"
          @click="emit('edit')"
        >
          编辑画板
        </el-button>
        <el-button
          v-if="boardDetail.canEdit"
          type="primary"
          round
          size="small"
          @click="emit('upload')"
        >
          上传到画板
        </el-button>
      </div>
    </template>

    <template v-else>
      <el-button text class="board-back" @click="emit('back')">
        返回个人主页
      </el-button>
      <div class="board-title">画板详情</div>
      <div class="board-desc">加载失败</div>
    </template>
  </div>
</template>

<style scoped>
.board-header-card {
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-2);
  padding: var(--ds-space-7);
  position: relative;
}

.board-header-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--ds-space-2);
}

.board-back {
  font-size: 12px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-bottom: var(--ds-space-2);
  padding-left: 0;
}

.board-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
}

.board-desc {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  margin-top: var(--ds-space-2);
}

.board-author {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
  margin-top: var(--ds-space-4);
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.author-avatar {
  width: 24px;
  height: 24px;
  background-color: var(--el-fill-color);
  border-radius: 50%;
  flex-shrink: 0;
}

.author-meta {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.board-author:hover .author-meta {
  color: var(--ds-color-text-primary);
}

.board-actions {
  position: absolute;
  top: var(--ds-space-7);
  right: var(--ds-space-7);
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}
</style>
