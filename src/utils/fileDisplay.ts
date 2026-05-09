import { Document, Folder, Picture, VideoPlay } from '@element-plus/icons-vue';
import type { Component } from 'vue';

const FILE_ICONS: Record<string, Component> = {
  文件夹: Folder,
  图片: Picture,
  视频: VideoPlay,
  文档: Document,
};

export function getFileIcon(type: string): Component {
  return FILE_ICONS[type] || Document;
}

const FILE_COLORS: Record<string, string> = {
  文件夹: 'var(--ds-color-warning)',
  图片: 'var(--ds-color-success)',
  视频: 'var(--el-color-primary-dark-2)',
  文档: 'var(--el-color-primary)',
};

export function getFileColor(type: string): string {
  return FILE_COLORS[type] || 'var(--ds-color-text-tertiary)';
}

export function getFileNameError(name: string): string | null {
  const value = name.trim();
  if (!value) return '请输入名称';
  if (value === '.' || value === '..') return '名称不合法';
  if (value.length > 50) return '名称过长';
  if (/[<>:"/\\|?*]/.test(value)) return '名称包含非法字符';
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`;
}
