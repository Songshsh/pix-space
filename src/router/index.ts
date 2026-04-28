import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { useUserStore } from '../stores/user';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { protectedChildrenRoutes } from './routes';
import { canAccess } from '../utils/access';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { requiresAuth: false, title: '登录' },
  },
  {
    path: '/admin',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // Explicitly require auth for protected layout
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
        component: () => import('../views/explore/index.vue'),
        meta: { title: '发现灵感' },
      },
    ],
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/forbidden/index.vue'),
    meta: { requiresAuth: false, title: '403' },
  },
  // 404 Not Found route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/not-found/index.vue'),
    meta: { requiresAuth: false, title: '404' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let progressTimer: ReturnType<typeof setTimeout> | undefined;
let progressStarted = false;

router.beforeEach((to, _from, next) => {
  progressStarted = false;
  if (progressTimer) clearTimeout(progressTimer);
  progressTimer = setTimeout(() => {
    progressStarted = true;
    nprogress.start();
  }, 200);

  // Ensure Pinia store is used correctly inside beforeEach to avoid instantiation before app mount
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  // Explicit check for requiresAuth: true (handles nested routes nicely via meta merging)
  const requiresAuth = to.meta.requiresAuth === true;

  if (requiresAuth && !isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
    return;
  } else if (to.path === '/login' && isLoggedIn) {
    // Fix to.query.redirect typing issue
    const redirectPath =
      typeof to.query.redirect === 'string'
        ? to.query.redirect
        : '/admin/dashboard';

    next(redirectPath);
    return;
  }

  if (!canAccess(to.meta.roles, userStore.role)) {
    next('/403');
    return;
  }
  next();
});

router.afterEach((to, _from, failure) => {
  if (progressTimer) clearTimeout(progressTimer);
  if (progressStarted || failure) nprogress.done();
  if (to.meta.title && !failure) {
    document.title = `${to.meta.title} - PixSpace`;
  }
});

router.onError(() => {
  if (progressTimer) clearTimeout(progressTimer);
  nprogress.done();
});

export default router;
