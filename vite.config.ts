import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isProduction = mode === 'production';

  return {
    base: env.VITE_GITHUB_PAGES === 'true' ? '/pix-space/' : '/',
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          {
            'element-plus': ['ElMessage', 'ElMessageBox'],
          },
        ],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      ...(isProduction
        ? [
            viteCompression({
              algorithm: 'gzip',
              ext: '.gz',
            }),
            viteCompression({
              algorithm: 'brotliCompress',
              ext: '.br',
            }),
          ]
        : []),
    ],
    server: {
      host: '127.0.0.1',
      port: 5173,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'pinia', 'vue-router', 'axios'],
            'element-plus': ['element-plus'],
            icons: ['@element-plus/icons-vue'],
          },
        },
      },
    },
    esbuild: {
      drop: isProduction ? ['console', 'debugger'] : [],
    },
  };
});
