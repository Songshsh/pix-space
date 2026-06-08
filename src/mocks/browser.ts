import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// MSW 的浏览器端入口：把所有 handlers 注册到 worker（底层会通过 public/mockServiceWorker.js 拦截请求）
export const worker = setupWorker(...handlers);
