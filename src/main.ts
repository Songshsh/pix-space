import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { ElMessage } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import 'element-plus/theme-chalk/el-overlay.css';
import 'element-plus/theme-chalk/el-image-viewer.css';
import './styles/tokens.css';
import './styles/element-overrides.css';
import App from './App.vue';
import router from './router';
import { useUserStore } from './stores/user';
import { useSettingsStore } from './stores/settings';

async function bootstrapAuth(userStore: ReturnType<typeof useUserStore>) {
  await userStore.bootstrapAuth();
}

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      serviceWorker: {
        url: import.meta.env.BASE_URL + 'mockServiceWorker.js',
      },
      onUnhandledRequest: 'bypass',
      quiet: true, // 不要将所有请求都在控制台输出
    });
  }

  const app = createApp(App);

  app.config.errorHandler = (err, _instance, info) => {
    console.error('Vue Error:', err, info);
    ElMessage.error('系统遇到意外错误，请刷新重试');
  };

  // 全局捕获未处理的 Promise Rejection
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // 可选：在这里调用日志上报服务，如 Sentry.captureException(event.reason)
  });

  // 全局捕获普通 JS 错误
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // 可选：日志上报
  });

  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  app.use(pinia);
  app.use(router);

  const settingsStore = useSettingsStore(pinia);
  settingsStore.applyTheme();
  settingsStore.applyPrimaryColor();

  const userStore = useUserStore(pinia);
  await bootstrapAuth(userStore);

  await router.isReady();
  app.mount('#app');
}

void bootstrap();
