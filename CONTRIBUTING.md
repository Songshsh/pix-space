# 贡献指南

本文件面向“贡献者”，只描述贡献流程、脚本与提交要求；详细规范不在此重复维护。

## 规范入口

- 规范与专题入口统一见：[docs/README.md](docs/README.md)
- AI / Agent 协作规则入口见：[AGENTS.md](AGENTS.md)

## 脚本速查（以 package.json scripts 为准）

完整脚本清单以 [package.json](package.json) 的 `scripts` 为单一事实来源；本文仅做速查。

- 开发：`npm run dev`
- 本地提交前最低口径：`npm run test`
- 按需检查：`npm run lint`、`npm run format:check`、`npm run typecheck`
- 按需专项验证：`npm run test:unit`、`npm run test:e2e`、`npm run test:coverage`
- 打包验证：`npm run build`、`npm run preview`、`npm run test:all`
- 交互式提交：`npm run commit`

## 本地开发

- Node.js 版本：见 [.nvmrc](.nvmrc)
- 安装依赖：`npm ci`
- 启动开发：`npm run dev`
- 环境变量：以 [.env.example](.env.example) 为准

## 测试指南

- 单元测试（Vitest）：工具函数放在 `src/utils/`，复杂的 composables 放在 `src/composables/`，以及非简单的 stores 放在 `src/stores/`
- E2E 测试（Playwright）：关键用户链路（登录/退出、上传、创建用户）与新页面的冒烟测试
- 命名：单测文件与源码同目录，命名为 `*.test.ts`；E2E 测试放在 `e2e/`，命名为 `*.spec.ts`
- 数据：测试应依赖 `src/mocks/` 的 MSW 模拟数据，而不是依赖真实后端

## 提交与合并请求

- 保持变更聚焦，能加测试就补测试
- 提交 PR 前确保 `npm run test` 通过
- 提交信息：使用 `npm run commit` 交互式生成（Conventional Commits 风格），并通过 commitlint 校验
- PR 描述建议包含：变更动机、影响范围、回归自测项、界面截图/录屏（如涉及 UI）、是否需要同步更新 mock / 文档
