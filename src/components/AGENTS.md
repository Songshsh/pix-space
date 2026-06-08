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

- MUST：必须使用 design token（见 [../styles/tokens.css](../styles/tokens.css)）
- MUST：禁止硬编码主题/品牌色系列；允许黑白灰与 transparent/currentColor 等基础色硬编码

## 类型

- MUST：props/emits 必须完整定义

## 相关规范

- 前端综合规范：[../../docs/FRONTEND_SPEC.md](../../docs/FRONTEND_SPEC.md)
