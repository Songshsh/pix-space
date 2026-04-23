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
  文件夹: '#f59e0b',
  图片: '#10b981',
  视频: '#8b5cf6',
  文档: '#3b82f6',
};

export function getFileColor(type: string): string {
  return FILE_COLORS[type] || '#6b7280';
}

export function getFileNameError(name: string): string | null {
  const value = name.trim();
  if (!value) return '请输入名称';
  if (value === '.' || value === '..') return '名称不合法';
  if (value.length > 50) return '名称过长';
  if (/[<>:"/\\|?*]/.test(value)) return '名称包含非法字符';
  return null;
}
