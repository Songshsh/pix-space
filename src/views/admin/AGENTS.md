# Admin 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 权限

- MUST：必须兼容权限控制
- MUST：不允许绕过路由权限
- MUST：菜单与权限保持一致；单一来源与细则以 [../../router/AGENTS.md](../../router/AGENTS.md) 为准

## Layout

- MUST：后台页面统一使用 AdminLayout

## 表格

- MUST：优先使用 Element Plus Table
- SHOULD：分页/筛选行为保持一致
- SHOULD：操作列保持统一风格

## 相关规范

- 根视图规范：[../AGENTS.md](../AGENTS.md)
- 布局规范：[../../layouts/AGENTS.md](../../layouts/AGENTS.md)
- 路由规范：[../../router/AGENTS.md](../../router/AGENTS.md)
- 权限工具：[../../utils/access.ts](../../utils/access.ts)
