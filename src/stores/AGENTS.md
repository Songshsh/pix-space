# Stores（Pinia）模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 使用边界

- MUST：仅将跨页面高频共享的数据放入 store（如用户信息、全局配置、权限相关状态）。
- MUST：页面/组件私有状态放在组件内部或 `src/composables/`。
- AVOID：把业务模块的列表/CRUD 请求与临时筛选状态长期堆进 store（易造成污染与难测）。

## 目录约定

- MUST：store 文件放在 `src/stores/`，命名与职责对应（例如 `user.ts`、`settings.ts`）。
- SHOULD：对关键 store 补充单测（同目录 `*.test.ts`）。

## 相关规范

- 前端综合规范：[../../docs/FRONTEND_SPEC.md](../../docs/FRONTEND_SPEC.md)
