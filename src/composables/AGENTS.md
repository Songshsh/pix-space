# Composables 规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 使用场景

仅抽离：

- MUST：可复用状态逻辑
- MUST：通用交互逻辑
- SHOULD：跨页面共享逻辑

不要：

- AVOID：为了抽象而抽象
- AVOID：将单页面逻辑提前抽离

## 命名

- MUST：useXxx
- MUST：返回值保持稳定

## 副作用

- MUST：明确 cleanup
- MUST：避免隐式全局状态

## 相关规范

- 前端综合规范：[../../docs/FRONTEND_SPEC.md](../../docs/FRONTEND_SPEC.md)
