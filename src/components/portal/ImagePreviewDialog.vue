<script setup lang="ts">
import type { ExploreItem } from '../../types/explore';
import {
  ArrowLeftBold,
  ArrowRightBold,
  Close,
  Download,
  RefreshLeft,
  RefreshRight,
  ZoomIn,
  ZoomOut,
} from '@element-plus/icons-vue';
import { downloadImageFile } from '../../utils/download';

const props = defineProps<{
  modelValue: boolean;
  item: ExploreItem | null;
  canPrev?: boolean;
  canNext?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'view-detail', id: string): void;
  (e: 'prev'): void;
  (e: 'next'): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const captionMeta = computed(() => {
  const item = props.item;
  if (!item) return '';
  const author = item.author?.username?.trim() || '';
  const tags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  return [author, ...tags].filter(Boolean).join(' · ');
});

const scale = ref(1);
const rotation = ref(0);

const canTransform = computed(() => !!props.item?.imageUrl);
const canDownload = computed(() => !!props.item?.imageUrl);
const canViewDetail = computed(() => !!props.item?.id);

const bgColorRegex =
  /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\))$/;

const safeBgColor = computed(() => {
  const color = props.item?.bgColor;
  if (!color) return undefined;
  return bgColorRegex.test(color) ? color : undefined;
});

const resetPreviewTransform = () => {
  scale.value = 1;
  rotation.value = 0;
};

watch(
  () => props.modelValue,
  (next) => {
    if (!next) return;
    resetPreviewTransform();
  }
);

watch(
  () => props.item?.id,
  (next, prev) => {
    if (!next || next === prev || !visible.value) return;
    resetPreviewTransform();
  }
);

const zoomIn = () => {
  if (!canTransform.value) return;
  scale.value = Math.min(3, Number((scale.value + 0.2).toFixed(2)));
};

const zoomOut = () => {
  if (!canTransform.value) return;
  scale.value = Math.max(0.4, Number((scale.value - 0.2).toFixed(2)));
};

const resetTransform = () => {
  resetPreviewTransform();
};

const rotateClockwise = () => {
  if (!canTransform.value) return;
  rotation.value = (rotation.value + 90) % 360;
};

const downloadImage = async () => {
  if (!props.item?.id) return;
  try {
    await downloadImageFile({
      id: props.item.id,
      title: props.item.title,
      url: props.item.imageUrl,
    });
    ElMessage.success(`已开始下载《${props.item.title}》`);
  } catch {
    ElMessage.error('下载失败，请稍后重试');
  }
};

const viewDetail = () => {
  if (!props.item) return;
  visible.value = false;
  emit('view-detail', props.item.id);
};

const goPrev = () => {
  if (!props.canPrev) return;
  emit('prev');
};

const goNext = () => {
  if (!props.canNext) return;
  emit('next');
};
</script>

<template>
  <el-dialog
    v-model="visible"
    class="image-preview-dialog"
    width="0"
    top="0"
    modal-class="image-preview-modal"
    :show-close="false"
    :close-on-click-modal="false"
    destroy-on-close
    append-to-body
  >
    <div v-if="item" class="dialog-root">
      <button
        type="button"
        class="overlay"
        aria-label="close preview"
        @click="visible = false"
      ></button>

      <div class="frame">
        <div class="image-shell">
          <div class="image-stage">
            <button
              type="button"
              class="nav-action nav-action--prev"
              :disabled="!canPrev"
              aria-label="previous image"
              @click="goPrev"
            >
              <el-icon><ArrowLeftBold /></el-icon>
            </button>

            <div
              class="image-canvas"
              :class="{ 'image-canvas--empty': !item.imageUrl }"
            >
              <img
                v-if="item.imageUrl"
                class="image-stage-img"
                :src="item.imageUrl"
                :alt="item.title"
                :style="{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                }"
              />
              <div
                v-else
                class="image-placeholder"
                :style="{ backgroundColor: safeBgColor }"
              >
                <div class="image-placeholder-badge">暂无预览图</div>
              </div>

              <div class="caption-card">
                <div class="caption-title">{{ item.title }}</div>
                <div v-if="captionMeta" class="caption-meta">
                  {{ captionMeta }}
                </div>
              </div>
            </div>

            <button
              type="button"
              class="nav-action nav-action--next"
              :disabled="!canNext"
              aria-label="next image"
              @click="goNext"
            >
              <el-icon><ArrowRightBold /></el-icon>
            </button>
          </div>

          <div class="toolbar">
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canTransform"
              aria-label="zoom in"
              @click="zoomIn"
            >
              <el-icon><ZoomIn /></el-icon>
            </button>
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canTransform"
              aria-label="zoom out"
              @click="zoomOut"
            >
              <el-icon><ZoomOut /></el-icon>
            </button>
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canTransform"
              aria-label="reset"
              @click="resetTransform"
            >
              <el-icon><RefreshLeft /></el-icon>
            </button>
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canTransform"
              aria-label="rotate"
              @click="rotateClockwise"
            >
              <el-icon><RefreshRight /></el-icon>
            </button>
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canDownload"
              aria-label="download"
              @click="downloadImage"
            >
              <el-icon><Download /></el-icon>
            </button>
            <button
              type="button"
              class="toolbar-action"
              :disabled="!canViewDetail"
              aria-label="view detail"
              @click="viewDetail"
            >
              <span class="toolbar-action-text">详</span>
            </button>
            <button
              type="button"
              class="toolbar-action"
              aria-label="close"
              @click="visible = false"
            >
              <el-icon><Close /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.dialog-root {
  position: fixed;
  inset: 0;
  z-index: var(--ds-z-dialog);
}

.overlay {
  position: fixed;
  inset: 0;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: var(--ds-color-overlay-light);
}

.frame {
  position: fixed;
  inset: var(--ds-space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  pointer-events: none;
}

.image-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ds-space-6);
  width: min(1280px, calc(100vw - 48px));
  max-height: calc(100vh - 48px);
  pointer-events: auto;
}

.image-stage {
  position: relative;
  flex: 1;
  min-width: 0;
  width: min(1092px, calc(100vw - 176px));
  height: min(816px, calc(100vh - 64px));
  padding: var(--ds-space-8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-action {
  position: absolute;
  top: 50%;
  z-index: var(--ds-z-local);
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: var(--ds-radius-circle);
  background: var(--ds-color-overlay-medium);
  color: var(--ds-color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%);
  backdrop-filter: blur(12px);
  transition:
    background-color 160ms ease,
    opacity 160ms ease;
}

.nav-action:hover:not(:disabled) {
  background: var(--ds-color-overlay-medium);
}

.nav-action:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.nav-action--prev {
  left: var(--ds-space-5);
}

.nav-action--next {
  right: var(--ds-space-5);
}

.image-canvas {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: calc(100vw - 280px);
  max-height: calc(100vh - 40px);
  overflow: visible;
}

.image-canvas--empty {
  width: min(720px, calc(100vw - 280px));
  height: min(520px, calc(100vh - 40px));
}

.image-stage-img {
  display: block;
  width: auto;
  height: auto;
  max-width: calc(100vw - 280px);
  max-height: calc(100vh - 40px);
  border-radius: var(--ds-radius-6);
  box-shadow: var(--ds-shadow-gallery-panel);
  transform-origin: center;
  transition: transform 160ms ease;
  user-select: none;
  -webkit-user-drag: none;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ds-radius-6);
  box-shadow: var(--ds-shadow-gallery-panel);
}

.image-placeholder-badge {
  padding: 10px 16px;
  border-radius: var(--ds-radius-pill);
  background: var(--ds-color-overlay-white-bright);
  color: var(--ds-color-text-secondary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.caption-card {
  position: absolute;
  left: 50%;
  bottom: var(--ds-space-4);
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  width: fit-content;
  max-width: min(360px, calc(100% - 32px));
  padding: 10px 12px;
  border-radius: var(--ds-radius-4);
  background: var(--ds-color-overlay-medium);
  color: var(--ds-color-text-inverse);
  box-shadow: var(--ds-shadow-gallery-caption);
  backdrop-filter: blur(12px);
}

.caption-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--ds-color-text-inverse);
  overflow-wrap: anywhere;
}

.caption-meta {
  font-size: 11px;
  line-height: 1.2;
  color: var(--ds-color-overlay-white-dim);
  overflow-wrap: anywhere;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 12px;
  border-radius: 28px;
  background: var(--ds-color-overlay-medium);
  box-shadow: var(--ds-shadow-gallery-panel);
  backdrop-filter: blur(16px);
}

.toolbar-action {
  width: 48px;
  height: 48px;
  border-radius: var(--ds-radius-4);
  border: 0;
  background: var(--ds-color-overlay-white-light);
  color: var(--ds-color-overlay-white-bright);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 160ms ease,
    opacity 160ms ease;
}

.toolbar-action:hover:not(:disabled) {
  background: var(--ds-color-overlay-white-medium);
}

.toolbar-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.toolbar-action-text {
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 900px), (max-height: 760px) {
  .frame {
    inset: var(--ds-space-4);
  }

  .image-shell {
    width: 100%;
    gap: var(--ds-space-4);
  }

  .image-stage {
    width: min(100%, calc(100vw - 120px));
    height: min(720px, calc(100vh - 48px));
    padding: var(--ds-space-6);
  }

  .nav-action--prev {
    left: var(--ds-space-4);
  }

  .nav-action--next {
    right: var(--ds-space-4);
  }

  .image-canvas {
    max-width: calc(100vw - 160px);
    max-height: calc(100vh - 64px);
  }

  .image-canvas--empty {
    width: min(640px, calc(100vw - 160px));
    height: min(460px, calc(100vh - 64px));
  }

  .caption-card {
    max-width: calc(100% - 96px);
  }

  .toolbar {
    gap: 8px;
    padding: 10px;
  }

  .toolbar-action {
    width: 42px;
    height: 42px;
  }
}

@media (max-width: 720px) {
  .image-shell {
    flex-direction: column;
  }

  .image-stage {
    width: 100%;
    height: min(70vh, 640px);
    padding: var(--ds-space-4);
  }

  .nav-action {
    width: 40px;
    height: 40px;
  }

  .image-canvas {
    max-width: calc(100vw - 64px);
    max-height: calc(100vh - 64px);
  }

  .image-canvas--empty {
    width: min(100%, calc(100vw - 64px));
    height: min(52vh, 360px);
  }

  .toolbar {
    flex-flow: row wrap;
    justify-content: center;
    width: fit-content;
  }
}
</style>
