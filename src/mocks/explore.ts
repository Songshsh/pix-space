import type { ExploreData, ExploreItem } from '../types/explore';
import { sampleImages } from './shared';

export const categories = [
  '全部',
  'UI设计',
  '自然摄影',
  '3D渲染',
  '插画',
  '品牌设计',
  '排版',
  '极简主义',
  '电商',
  '壁纸',
  '其它',
];

export const searchTags = [
  '全部',
  '极简主义',
  '排版',
  '品牌设计',
  '电商',
  '其它',
];

export const relatedSearches = [
  '设计系统',
  'UI组件库',
  'Dashboard',
  '移动端界面',
];

const masonryHeights = [
  300, 450, 200, 380, 250, 400, 250, 320, 280, 400, 350, 200, 450, 300, 250,
];

const bgColors = [
  'var(--el-color-primary-light-9)',
  'var(--el-color-primary-light-8)',
  'var(--el-color-primary-light-7)',
  'var(--el-color-primary-light-6)',
  'var(--el-color-primary-light-5)',
];

const sampleTags = [
  ['UI设计', '极简主义'],
  ['3D渲染'],
  ['插画', '品牌设计'],
  ['自然摄影'],
  ['排版', 'UI设计'],
];

export const mockItems: ExploreItem[] = masonryHeights.map((h, i) => ({
  id: `img-${i}`,
  title: `灵感素材 ${i + 1}`,
  imageHeight: h,
  bgColor: bgColors[i % bgColors.length],
  imageUrl: i % 4 === 0 ? sampleImages[i % sampleImages.length] : undefined,
  tags: sampleTags[i % sampleTags.length],
  author: {
    id: 201 + (i % 5),
    username: `User ${(i % 5) + 1}`,
  },
}));

export function getExploreMock(): ExploreData {
  return {
    categories,
    searchTags,
    relatedSearches,
    items: mockItems,
  };
}
