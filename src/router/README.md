# Router 说明

本目录面向“调用方与修改者”说明当前路由拓扑、公开/受保护入口，以及与 URL 直接相关的公共约定。
局部修改约束与审查规则见 [AGENTS.md](AGENTS.md)。

## 路由拓扑

- 认证页：`/login`、`/register`、`/forgot-password`
- Portal：统一挂在 `/` 下，由 `src/layouts/PortalLayout.vue` 承载
- Admin：统一挂在 `/admin` 下，由 `src/layouts/AdminLayout.vue` 承载
- System：`/403`、`/:pathMatch(.*)*`

当前根入口会将 `/` 重定向到 `/explore`。

## Portal 入口

- `/explore`：前台发现页
- `/image/:id`：图片详情
- `/account`：登录后个人中心
- `/u/:userId/boards`：公开用户画板页
- `/board/:id`：画板详情

### Explore 的 URL 约定

- `q`：搜索关键词；存在且非空时进入搜索态
- `sort`：搜索态排序，当前支持 `newest`、`hot`
- `tag`：搜索态二级标签；不传时视为 `全部`

Portal 全局搜索框位于 `src/layouts/PortalLayout.vue`，回车写入 `q`，clear 清空 `q` 并回到发现态。

## Admin 入口

- `/admin/dashboard`
- `/admin/images`
- `/admin/users`
- `/admin/files`
- `/admin/settings`

Admin 菜单显示、标题与权限过滤统一来源于 `src/router/index.ts` 中后台子路由的 `meta`。

## 鉴权约定

- `meta.requiresAuth = true` 的路由由全局守卫统一拦截
- 已登录用户访问 `/login`、`/register` 时会被重定向到安全的业务入口
- `/forgot-password` 当前允许匿名与已登录用户访问
- 无权限访问统一跳转 `/403`

## 相关入口

- 路由定义与守卫：[index.ts](index.ts)
- 路由测试：[index.test.ts](index.test.ts)
- 权限工具：[../utils/access.ts](../utils/access.ts)
- 模块约束：[AGENTS.md](AGENTS.md)
