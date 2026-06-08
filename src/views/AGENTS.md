# Views 层规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 页面职责

views 负责：

- MUST：页面组织
- MUST：页面状态
- MUST：页面级交互

不负责：

- MUST：不在 views 中实现通用组件
- MUST：不在 views 中实现底层请求逻辑

## 页面结构

优先：

- SHOULD：页面容器
- SHOULD：模块拆分
- SHOULD：composables 抽离

- AVOID：超大单文件页面。

## 页面专属 composable

- SHOULD：仅限当前页面使用的业务逻辑 composable 可放在对应 view 目录下（如 `useImageActions.ts`），无需提升到 `src/composables/`。
- MUST：跨页面复用的 composable 必须放在 `src/composables/`。
- MUST：页面目录下的 composable 文件命名同样遵循 `use<Domain><Verb>.ts` 规范。

## 相关规范

- 前端综合规范：[../../docs/FRONTEND_SPEC.md](../../docs/FRONTEND_SPEC.md)
