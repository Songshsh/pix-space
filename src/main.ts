import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-overlay.css';
import 'element-plus/theme-chalk/el-image-viewer.css';
import './styles/tokens.css';
import './styles/element-overrides.css';
import './styles/auth-page.css';
import './styles/animations.css';
import './styles/masonry-card.css';
import './styles/section-title.css';
import './styles/skeleton.css';
import App from './App.vue';
import { createPermissionDirective } from './directives/permission';
import router from './router';
import { useUserStore } from './stores/user';
import { useSettingsStore } from './stores/settings';
import { applyPortalPrimaryColorToRoot } from './utils/theme';
import {
  AUTH_EXPIRED_EVENT,
  DEFAULT_AUTH_REDIRECT,
  sanitizeRedirectPath,
} from './utils/auth';

function normalizePathnameByBase(pathname: string) {
  const baseURL = import.meta.env.BASE_URL || '/';
  if (baseURL === '/') return pathname;
  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
  if (!normalizedBase) return pathname;
  return pathname.startsWith(normalizedBase)
    ? pathname.slice(normalizedBase.length) || '/'
    : pathname;
}

function mountBootstrapError(message: string) {
  const root = document.getElementById('app');
  if (!root) return;
  const container = document.createElement('div');
  container.className = 'app-bootstrap-error';

  const title = document.createElement('strong');
  title.textContent = '应用初始化失败';

  const detail = document.createElement('span');
  detail.textContent = message;

  container.append(title, detail);
  root.replaceChildren(container);
}

function summarizeClientError(error: unknown) {
  if (error instanceof Error) {
    return error.message || error.name || '未知错误';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return String((error as { message?: unknown }).message || '未知错误');
  }
  return '未知错误';
}

async function bootstrap() {
  try {
    // 开发时可通过环境变量开启 MSW：页面仍然走真实 API 调用，但请求会在浏览器层被 mock 拦截并返回模拟数据
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      const { worker } = await import('./mocks/browser');
      await worker.start({
        serviceWorker: {
          // 这里指向 public/mockServiceWorker.js 在构建后的静态资源地址（通常是 /mockServiceWorker.js）
          url: import.meta.env.BASE_URL + 'mockServiceWorker.js',
        },
        // `/api/*` 未命中 handler 时输出 warning，帮助尽早发现 mock 漏配；其他请求继续静默放行
        onUnhandledRequest(request, print) {
          const pathname = new URL(request.url).pathname;
          const normalizedPath = normalizePathnameByBase(pathname);
          if (normalizedPath.startsWith('/api/')) {
            print.warning();
          }
        },
        quiet: true,
      });
    }

    const app = createApp(App);

    let errorToastTimer: ReturnType<typeof setTimeout> | undefined;
    app.config.errorHandler = (err, _instance, info) => {
      console.error(`[Vue Error] ${info}: ${summarizeClientError(err)}`);
      if (!errorToastTimer) {
        ElMessage.error('系统遇到意外错误，请刷新重试');
        errorToastTimer = setTimeout(() => {
          errorToastTimer = undefined;
        }, 3000);
      }
    };

    window.addEventListener('unhandledrejection', (event) => {
      console.error(
        `[Unhandled Promise Rejection] ${summarizeClientError(event.reason)}`
      );
    });

    window.addEventListener('error', (event) => {
      console.error(`[Global Error] ${summarizeClientError(event.error)}`);
    });

    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate);
    app.use(pinia);
    app.directive('permission', createPermissionDirective(pinia));
    const settingsStore = useSettingsStore(pinia);
    settingsStore.applyTheme(); // 确保挂载前主题已同步到 <html> 上（减少首屏闪烁）

    window.addEventListener(AUTH_EXPIRED_EVENT, (event: Event) => {
      const currentRoute = router.currentRoute.value;
      if (currentRoute.path === '/login') return;
      const redirectCandidate =
        event instanceof CustomEvent &&
        typeof event.detail?.redirect === 'string' &&
        event.detail.redirect !== '/login'
          ? event.detail.redirect
          : currentRoute.fullPath || DEFAULT_AUTH_REDIRECT;
      const redirect = sanitizeRedirectPath(
        redirectCandidate,
        DEFAULT_AUTH_REDIRECT
      );
      void router.replace({
        path: '/login',
        query: { redirect },
      });
    });

    applyPortalPrimaryColorToRoot();

    const userStore = useUserStore(pinia);
    await userStore.bootstrapAuth();

    app.use(router);
    await router.isReady();
    app.mount('#app');
  } catch (error) {
    console.error('Bootstrap failed:', error);
    mountBootstrapError('请刷新页面后重试');
  }
}

void bootstrap();
