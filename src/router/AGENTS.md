# Router 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 单一事实来源

- MUST：后台菜单与权限来源于 `src/router/index.ts` 中后台子路由常量的 meta（避免在布局或页面里散落权限判断）。

## 路由结构

- MUST：受保护（后台）路由统一挂在 `/admin` 下，由 `src/router/index.ts` 将其 children 指向 `protectedChildrenRoutes`。
- MUST：Portal 路由统一挂在 `/` 下，使用 `src/layouts/PortalLayout.vue` 承载其 children。

## meta 约定（后台子路由）

- MUST：`meta.title` 用于菜单与面包屑标题
- MUST：`meta.roles?: string[]` 用于权限控制（与 `canAccess` 共享）
- MUST：`meta.showInMenu?: boolean` 控制菜单可见性
- SHOULD：`meta.icon?: string` 作为菜单图标 key（映射逻辑在布局层）

## 鉴权与跳转

- MUST：路由守卫由 `src/router/index.ts` 统一处理登录态与权限态，禁止在页面中自行绕过。
- MUST：无权限统一跳转 `/403`。
- AVOID：通过在布局里写 `v-if` 来隐藏/显示菜单项或入口；应通过 meta + `canAccess` 统一过滤。

## 变更与验证

- SHOULD：修改权限、跳转、meta 约定后，同步更新或新增 `src/router/index.test.ts`。

## 常见操作

- 新增后台菜单项/路由：在 `src/router/index.ts` 的后台子路由常量中新增 children，并补齐 `meta.title`、`meta.roles`、`meta.showInMenu`
- 新增 Portal 路由：在 `src/router/index.ts` 的 Portal children 中新增路由，并确认由 `PortalLayout.vue` 承载
- 调整权限：优先通过 `meta.roles` + `canAccess` 进行统一控制，避免在布局/页面散落 `v-if`

## 关键文件

- 路由定义与守卫：[index.ts](index.ts)
- 路由单测：[index.test.ts](index.test.ts)
- 权限工具：[../utils/access.ts](../utils/access.ts)
