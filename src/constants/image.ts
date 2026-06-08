import type { ImageTag } from '../types/image';

export const PREVIEW_COLORS = [
  'var(--el-color-primary)',
  'var(--el-color-primary-light-3)',
  'var(--ds-color-warning)',
  'var(--ds-color-danger)',
  'var(--ds-color-success)',
  'var(--ds-color-info)',
  'var(--el-color-primary-dark-2)',
];

export const DEFAULT_IMAGE_TAGS: ImageTag[] = [
  { name: '自然', type: 'primary' },
  { name: '城市', type: 'warning' },
  { name: '人物', type: 'danger' },
  { name: '动物', type: 'success' },
  { name: '建筑', type: 'info' },
];
