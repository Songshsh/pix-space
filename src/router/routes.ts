import type { RouteRecordRaw } from 'vue-router';

export type MenuIconKey =
  | 'DataAnalysis'
  | 'Picture'
  | 'User'
  | 'Folder'
  | 'Setting';

export const protectedChildrenRoutes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/admin/dashboard',
    meta: { showInMenu: false },
  },
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('../views/dashboard/index.vue'),
    meta: { title: '数据统计', showInMenu: true, icon: 'DataAnalysis' },
  },
  {
    path: 'images',
    name: 'Images',
    component: () => import('../views/image-management/index.vue'),
    meta: { title: '图片管理', showInMenu: true, icon: 'Picture' },
  },
  {
    path: 'users',
    name: 'Users',
    component: () => import('../views/user-management/index.vue'),
    meta: {
      title: '用户管理',
      showInMenu: true,
      icon: 'User',
      roles: ['admin'],
    },
  },
  {
    path: 'files',
    name: 'Files',
    component: () => import('../views/file-management/index.vue'),
    meta: { title: '文件管理', showInMenu: true, icon: 'Folder' },
  },
  {
    path: 'settings',
    name: 'Settings',
    component: () => import('../views/settings/index.vue'),
    meta: {
      title: '系统设置',
      showInMenu: true,
      icon: 'Setting',
      roles: ['admin'],
    },
  },
];
