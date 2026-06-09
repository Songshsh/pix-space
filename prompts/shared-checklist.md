# 通用同步更新与验证清单

本清单用于减少 workflow 重复维护与口径漂移，主要服务于 feature / bugfix，也可作为 code review 的回归与交付检查基线。

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 1. 同步更新项（避免漏改）

- MUST：涉及 API：同步更新 `src/api/*` 类型与封装、`src/mocks/*`，以及相关 README（[src/api/README.md](../src/api/README.md)、[src/utils/README.md](../src/utils/README.md)、[src/mocks/README.md](../src/mocks/README.md)）
- MUST：涉及样式/主题：优先更新 [tokens.css](../src/styles/tokens.css)；全局覆盖仅允许集中放在 `src/styles/`，并遵守 [src/styles/AGENTS.md](../src/styles/AGENTS.md)
- MUST：涉及路由/权限：同步检查 `meta.roles` 与 `canAccess` 约定（权威入口见 [src/router/AGENTS.md](../src/router/AGENTS.md)），避免在布局散落条件渲染
- MUST：涉及请求/错误策略：同步更新 [request.ts](../src/utils/request.ts) 与 [src/utils/README.md](../src/utils/README.md)

## 2. 工程约束（高频踩坑）

- MUST：遵循工程自动导入规则：新增代码默认应复用自动导入能力，避免手动导入 Vue 核心 API 与 Element Plus 组件；允许手动导入的例外场景以 [docs/FRONTEND_SPEC.md](../docs/FRONTEND_SPEC.md) 为准
- MUST：页面不直接操作底层 request；请求必须走 `src/api/` 与 `src/utils/request.ts` 体系
- MUST：如必须新增 npm 依赖，先按 [docs/DEPENDENCY_POLICY.md](../docs/DEPENDENCY_POLICY.md) 提供评审信息并等待确认

## 3. 验证最低口径

- MUST：提供可验证入口（路由/按钮/复现步骤）
- MUST：至少通过 `npm run test`（脚本单一事实来源见 [CONTRIBUTING.md](../CONTRIBUTING.md)）
- SHOULD：新增/改动复杂逻辑时补单元测试（Vitest）
- SHOULD：新增页面或关键链路改动时补 E2E 冒烟（Playwright）
