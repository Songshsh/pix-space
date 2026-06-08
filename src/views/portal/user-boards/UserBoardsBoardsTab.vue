<script setup lang="ts">
import PagedListStatus from './PagedListStatus.vue';
import type { Board } from '../../../types/user-boards';

const props = defineProps<{
  items: Board[];
  loading: boolean;
  loadingMore: boolean;
  loadMoreError: string | null;
  hasMore: boolean;
  showActions: boolean;
  getBoardVisibilityText: (visibility: Board['visibility']) => string;
}>();

const emit = defineEmits<{
  'open-board': [id: string];
  'board-command': [command: string, board: Board];
  'load-more': [];
  'retry-load-more': [];
}>();

const sentinelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sentinelRef.value) return;
  observer = new IntersectionObserver((entries) => {
    if (
      entries.some((entry) => entry.isIntersecting) &&
      !props.loading &&
      !props.loadingMore &&
      props.hasMore
    ) {
      emit('load-more');
    }
  });
  observer.observe(sentinelRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div class="boards-grid">
    <template v-if="loading">
      <div v-for="i in 3" :key="i" class="board-card board-card--skeleton">
        <div class="skeleton-block skeleton-block--board-cover"></div>
        <div class="skeleton-panel skeleton-stack">
          <div class="skeleton-line skeleton-line--lg"></div>
          <div class="skeleton-line skeleton-line--md"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <div
        v-for="board in items"
        :key="board.id"
        class="board-card"
        @click="emit('open-board', board.id)"
      >
        <div class="board-covers">
          <div
            class="cover-main"
            :style="{ backgroundColor: board.covers[0] }"
          ></div>
          <div class="cover-side">
            <div
              class="cover-top"
              :style="{ backgroundColor: board.covers[1] }"
            ></div>
            <div
              class="cover-bottom"
              :style="{ backgroundColor: board.covers[2] }"
            ></div>
          </div>
        </div>
        <div class="board-info">
          <div class="board-title">{{ board.title }}</div>
          <div class="board-meta">
            <span>
              {{ board.imageCount }} 张 ·
              {{ getBoardVisibilityText(board.visibility) }}
            </span>
            <el-dropdown
              v-if="showActions"
              trigger="click"
              @command="(cmd: string) => emit('board-command', cmd, board)"
            >
              <el-button
                text
                circle
                size="small"
                class="board-more-btn"
                @click.stop
              >
                ···
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>
                    <span class="dropdown-delete">删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div ref="sentinelRef" class="load-more-sentinel"></div>
  <PagedListStatus
    :show="items.length > 0"
    :loading-more="loadingMore"
    :error="loadMoreError"
    :has-more="hasMore"
    @load-more="emit('load-more')"
    @retry="emit('retry-load-more')"
  />
</template>

<style scoped>
.boards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--ds-space-6);
}

.board-card {
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-2);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.board-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ds-shadow-2);
}

.board-covers {
  display: flex;
  height: 200px;
}

.cover-main {
  width: 50%;
}

.cover-side {
  width: 50%;
  display: flex;
  flex-direction: column;
}

.cover-top,
.cover-bottom {
  height: 50%;
}

.board-info {
  height: 64px;
  padding: var(--ds-space-3) var(--ds-space-4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.board-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  line-height: 20px;
}

.board-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
}

.board-more-btn {
  color: var(--ds-color-text-tertiary);
  font-weight: 700;
  letter-spacing: 1px;
  min-width: 28px;
  min-height: 28px;
  padding: 0;
  margin-right: calc(var(--ds-space-1) * -1);
}

.board-more-btn:hover {
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-bg-secondary);
}

.dropdown-delete {
  color: var(--ds-color-danger);
}

.board-card--skeleton {
  cursor: default;
}

.board-card--skeleton:hover {
  transform: none;
}

.load-more-sentinel {
  width: 100%;
  height: 1px;
}

@media (max-width: 1100px) {
  .boards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .boards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
