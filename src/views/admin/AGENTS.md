# Admin 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 权限

- MUST：必须兼容权限控制
- MUST：不允许绕过路由权限
- MUST：菜单与权限保持一致（单一来源以 `src/router/index.ts` 中后台子路由常量的 meta 为准）

## Layout

- MUST：后台页面统一使用 AdminLayout

## 表格

- MUST：优先使用 Element Plus Table
- SHOULD：分页/筛选行为保持一致
- SHOULD：操作列保持统一风格

## 相关规范

- 路由与权限入口：[../../router/index.ts](../../router/index.ts)
- 受保护路由定义：[../../router/index.ts](../../router/index.ts)
