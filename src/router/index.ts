import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { useUserStore } from '../stores/user';
import { ADMIN_ACCESS_ROLES, canAccess } from '../utils/access';
import { sanitizeRedirectPath } from '../utils/auth';
import { useNprogress } from '../composables/useNprogress';

const siteTitle = import.meta.env.VITE_APP_TITLE || 'Pix Space';

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
    component: () => import('../views/admin/dashboard/index.vue'),
    meta: { title: '数据统计', showInMenu: true, icon: 'DataAnalysis' },
  },
  {
    path: 'images',
    name: 'Images',
    component: () => import('../views/admin/image-management/index.vue'),
    meta: { title: '图片管理', showInMenu: true, icon: 'Picture' },
  },
  {
    path: 'users',
    name: 'Users',
    component: () => import('../views/admin/user-management/index.vue'),
    meta: {
      title: '用户管理',
      showInMenu: true,
      icon: 'User',
    },
  },
  {
    path: 'files',
    name: 'Files',
    component: () => import('../views/admin/file-management/index.vue'),
    meta: { title: '文件管理', showInMenu: true, icon: 'Folder' },
  },
  {
    path: 'settings',
    name: 'Settings',
    component: () => import('../views/admin/settings/index.vue'),
    meta: {
      title: '系统设置',
      showInMenu: true,
      icon: 'Setting',
    },
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/login/index.vue'),
    meta: { requiresAuth: false, title: '登录' },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/auth/forgot-password/index.vue'),
    meta: { requiresAuth: false, title: '找回密码' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/register/index.vue'),
    meta: { requiresAuth: false, title: '注册' },
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ADMIN_ACCESS_ROLES },
    children: protectedChildrenRoutes,
  },
  {
    path: '/',
    component: () => import('../layouts/PortalLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'PortalHome',
        redirect: '/explore',
      },
      {
        path: 'explore',
        name: 'Explore',
        component: () => import('../views/portal/explore/index.vue'),
        meta: { title: '发现灵感' },
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('../views/portal/account/index.vue'),
        meta: { title: '个人中心', requiresAuth: true },
      },
      {
        path: 'image/:id',
        name: 'ImageDetail',
        component: () => import('../views/portal/image-detail/index.vue'),
        meta: { title: '图片详情' },
      },
      {
        path: 'u/:userId/boards',
        name: 'UserBoards',
        component: () => import('../views/portal/user-boards/index.vue'),
        meta: { title: '个人画板' },
      },
      {
        path: 'board/:id',
        name: 'BoardDetail',
        component: () => import('../views/portal/board-detail/index.vue'),
        meta: { title: '画板详情' },
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/system/forbidden/index.vue'),
    meta: { requiresAuth: false, title: '403' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/system/not-found/index.vue'),
    meta: { requiresAuth: false, title: '404' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const {
  cancelProgressStart,
  queueProgressStart,
  done: nprogressDone,
} = useNprogress();

router.beforeEach((to, _from, next) => {
  cancelProgressStart();

  const userStore = useUserStore();
  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth === true
  );
  const isAuthenticated = userStore.isAuthenticated;

  if (requiresAuth && !userStore.isAuthReady) {
    queueProgressStart();
    next({
      path: '/login',
      query: { redirect: to.fullPath, reason: 'auth-pending' },
    });
    return;
  }

  if (requiresAuth && userStore.authCheckFailed) {
    queueProgressStart();
    ElMessage.error('会话校验失败，请重新登录后重试');
    next({
      path: '/login',
      query: { redirect: to.fullPath, reason: 'auth-check-failed' },
    });
    return;
  }

  if (requiresAuth && !userStore.isAuthenticated) {
    queueProgressStart();
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  if (
    (to.path === '/login' ||
      to.path === '/register' ||
      to.path === '/forgot-password') &&
    isAuthenticated
  ) {
    const redirectPath = sanitizeRedirectPath(to.query.redirect, '/explore');
    queueProgressStart();
    next(redirectPath);
    return;
  }

  if (
    to.matched.some((record) => !canAccess(record.meta.roles, userStore.role))
  ) {
    queueProgressStart();
    next({ path: '/403', query: { from: to.fullPath } });
    return;
  }
  queueProgressStart();
  next();
});

router.afterEach((to, _from, failure) => {
  cancelProgressStart();
  nprogressDone();
  if (to.meta.title && !failure) {
    document.title = `${to.meta.title} - ${siteTitle}`;
  } else if (!failure) {
    document.title = siteTitle;
  }
});

router.onError(() => {
  cancelProgressStart();
  nprogressDone();
});

export default router;
