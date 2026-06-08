import { defineConfig } from 'vitest/config';
import { mergeConfig, type ConfigEnv } from 'vite';
import viteConfig from './vite.config';

const env: ConfigEnv = { mode: 'test', command: 'serve' };

export default mergeConfig(
  viteConfig(env),
  defineConfig({
    test: {
      environment: 'jsdom',
      css: true,
      exclude: ['e2e/**', '**/node_modules/**'],
      server: {
        deps: {
          inline: ['element-plus'],
        },
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  })
);
