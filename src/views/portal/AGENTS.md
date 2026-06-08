# Portal 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## Layout

- MUST：前台页面统一使用 `PortalLayout.vue`
- MUST：保持与后台管理页明确分层，不混入后台菜单与权限展示逻辑

## 页面定位

- MUST：优先服务内容浏览、详情消费、个人主页与轻量交互
- AVOID：在 Portal 页面引入后台式重管理交互

## 复用边界

- SHOULD：页面私有组件与 composable 就近放在对应 view 目录下
- MUST：跨 Portal 页面或跨端复用的逻辑，抽离到 `src/components/`、`src/composables/` 等公共层

## 相关规范

- 根视图规范：[../AGENTS.md](../AGENTS.md)
- 布局规范：[../../layouts/AGENTS.md](../../layouts/AGENTS.md)
