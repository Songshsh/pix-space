# 贡献指南

## 脚本清单（单一事实来源）

- 开发：`npm run dev`
- 构建：`npm run build`
- 预览构建产物：`npm run preview`
- 代码检查（ESLint）：`npm run lint`
- 样式检查（Stylelint）：`npm run lint:style`
- 格式化（写入）：`npm run format`
- 格式化检查：`npm run format:check`
- 类型检查：`npm run typecheck`
- 单元测试（Vitest）：`npm run test:unit`
- E2E 测试（Playwright）：`npm run test:e2e`
- CI 等价检查集：`npm run test`
- 全量验证（CI + E2E + 构建）：`npm run test:all`

## 本地开发

- Node.js 版本：见 [.nvmrc](.nvmrc)
- 安装依赖：`npm ci`
- 启动开发：`npm run dev`

## 测试指南

- 单元测试（Vitest）：工具函数放在 `src/utils/`，复杂的 composables 放在 `src/composables/`，以及非简单的 stores 放在 `src/stores/`
- E2E 测试（Playwright）：关键用户链路（登录/退出、上传、创建用户）与新页面的冒烟测试
- 命名：单测文件与源码同目录，命名为 `*.test.ts`；E2E 测试放在 `e2e/`，命名为 `*.spec.ts`
- 数据：测试应依赖 `src/mocks/` 的 MSW 模拟数据，而不是依赖真实后端

## 提交与合并请求

- 保持变更聚焦，能加测试就补测试
- 提交 PR 前确保 `npm run test` 通过
