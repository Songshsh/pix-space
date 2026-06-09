# Components 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 组件原则

- SHOULD：优先通用化
- MUST：保持单一职责
- AVOID：不过度抽象

## Element Plus

- MUST：优先使用 Element Plus
- MUST：不重复封装已有组件能力
- MUST：Wrapper 必须有明确价值（否则直接使用 Element Plus 原组件）

## 样式

- MUST：组件样式遵循 `src/styles/AGENTS.md` 的统一约束
- MUST：spacing、radius、shadow 与颜色的具体约束，以 [../styles/AGENTS.md](../styles/AGENTS.md) 与 [../styles/tokens.css](../styles/tokens.css) 为准

## 类型

- MUST：props/emits 必须完整定义

## 关键目录

- 认证组件：`src/components/auth/`
- 通用组件：`src/components/common/`
- Portal 业务组件：`src/components/portal/`
- Admin 业务组件：`src/components/dashboard/`、`src/components/users/`、`src/components/settings/`
- 顶层共享组件：`src/components/StarryBackground.vue`、`src/components/StarryStatusPage.vue`

## 相关规范

- 前端综合规范：[../../docs/FRONTEND_SPEC.md](../../docs/FRONTEND_SPEC.md)
