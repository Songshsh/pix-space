# Layouts 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 职责边界

- MUST：`AdminLayout.vue` 仅承载后台布局（侧边栏 + 顶栏 + 内容区），不承载具体业务页面逻辑。
- MUST：`PortalLayout.vue` 仅承载前台布局（顶部导航 + 搜索 + 内容区），不承载后台菜单逻辑。

## 菜单与权限

- MUST：后台菜单基于 `src/router/index.ts` 中后台子路由常量的 meta 生成与过滤（`showInMenu` + `roles`）。
- MUST：权限判断统一使用 `src/utils/access.ts` 的 `canAccess`。
- AVOID：在布局中手写菜单数据源或分散写权限 `v-if`。

## 样式与 tokens

- MUST：不硬编码颜色/圆角/间距/阴影，优先使用 `src/styles/tokens.css`。
- SHOULD：保持布局容器的 padding、header 高度等与设计规则一致（设计规范入口见 `design/AGENTS.md`）。
