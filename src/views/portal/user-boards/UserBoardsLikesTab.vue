<script setup lang="ts">
import PagedListStatus from './PagedListStatus.vue';
import type { LikedImage } from '../../../types/user-boards';

const props = defineProps<{
  items: LikedImage[];
  search: string;
  countText: string;
  loading: boolean;
  loadingMore: boolean;
  loadMoreError: string | null;
  hasMore: boolean;
  showActions: boolean;
}>();

const emit = defineEmits<{
  'update:search': [value: string];
  'open-image': [id: string];
  'like-command': [command: string, image: LikedImage];
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
  <div class="likes-tab">
    <div class="filter-bar">
      <div class="filter-left">
        <div class="filter-count">{{ countText }}</div>
        <div class="filter-sort-label">最近赞</div>
      </div>
      <div class="filter-right">
        <el-input
          :model-value="search"
          size="small"
          placeholder="搜索"
          class="filter-search"
          @update:model-value="(value) => emit('update:search', String(value))"
        />
      </div>
    </div>

    <div class="content-body">
      <div v-if="loading" class="images-grid">
        <div v-for="i in 4" :key="i" class="image-card image-card--skeleton">
          <div class="skeleton-block skeleton-block--image-cover"></div>
          <div class="skeleton-panel skeleton-panel--compact skeleton-stack">
            <div class="skeleton-line skeleton-line--lg"></div>
            <div class="skeleton-line skeleton-line--md"></div>
          </div>
        </div>
      </div>

      <div v-else class="images-grid">
        <div
          v-for="img in items"
          :key="img.id"
          class="image-card"
          @click="emit('open-image', img.id)"
        >
          <div
            class="image-cover"
            :style="{
              backgroundColor: img.bgColor,
              backgroundImage: img.url ? `url(${img.url})` : undefined,
              backgroundSize: img.url ? 'cover' : undefined,
              backgroundPosition: img.url ? 'center' : undefined,
            }"
          ></div>
          <div class="image-info">
            <div class="image-title">{{ img.title }}</div>
            <div class="image-meta-row">
              <div class="image-meta">
                by {{ img.author }} · {{ img.likedAt }}
              </div>
              <div v-if="showActions" class="image-card-more">
                <el-dropdown
                  trigger="click"
                  @command="(cmd: string) => emit('like-command', cmd, img)"
                >
                  <el-button
                    text
                    circle
                    size="small"
                    class="image-more-btn"
                    @click.stop
                  >
                    ···
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="collect">
                        采集到画板
                      </el-dropdown-item>
                      <el-dropdown-item command="unlike">
                        取消赞
                      </el-dropdown-item>
                      <el-dropdown-item command="download">
                        下载
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: var(--ds-space-4);
}

.filter-right {
  display: flex;
  align-items: center;
  gap: var(--ds-space-2);
}

.filter-count {
  font-size: 14px;
  color: var(--ds-color-text-tertiary);
}

.filter-sort-label {
  height: 32px;
  padding: 0 var(--ds-space-4);
  border-radius: var(--ds-radius-pill);
  border: 1px solid var(--ds-color-border);
  background-color: var(--ds-color-bg-primary);
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--ds-color-text-primary);
}

.filter-search {
  width: 180px;
}

.filter-search :deep(.el-input__wrapper) {
  border-radius: var(--ds-radius-pill);
  background-color: var(--ds-color-bg-secondary);
  box-shadow: none;
}

.content-body {
  margin-top: var(--ds-space-2);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--ds-space-6);
}

.image-card {
  background-color: var(--ds-color-bg-primary);
  border-radius: var(--ds-radius-3);
  box-shadow: var(--ds-shadow-2);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ds-shadow-2);
}

.image-cover {
  height: 200px;
  position: relative;
}

.image-info {
  height: 64px;
  padding: var(--ds-space-3) var(--ds-space-4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.image-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-text-primary);
  line-height: 20px;
}

.image-meta {
  font-size: 12px;
  color: var(--ds-color-text-tertiary);
  line-height: 16px;
}

.image-meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ds-space-2);
}

.image-card-more {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.image-more-btn {
  color: var(--ds-color-text-tertiary);
  font-weight: 700;
  letter-spacing: 1px;
  min-width: 28px;
  min-height: 28px;
  padding: 0;
  margin-right: calc(var(--ds-space-1) * -1);
}

.image-more-btn:hover {
  color: var(--ds-color-text-primary);
  background-color: var(--ds-color-bg-secondary);
}

.image-card--skeleton {
  cursor: default;
}

.image-card--skeleton:hover {
  transform: none;
}

.load-more-sentinel {
  width: 100%;
  height: 1px;
}

@media (max-width: 1400px) {
  .images-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1100px) {
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
}
</style>
