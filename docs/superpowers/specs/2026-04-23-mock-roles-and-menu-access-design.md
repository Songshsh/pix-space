# 模拟角色测试账号与菜单权限体系设计

## 元信息

- 状态：草稿
- 目标读者：前端、测试、产品
- 范围：仅模拟数据模式（`VITE_USE_MOCK_DATA=true`）下的账号与权限验收；不改变真实后端鉴权方式
- 单一事实来源：模拟登录账号以 [src/mocks/README.md](../../../src/mocks/README.md) 为准
- 相关代码：`src/router/routes.ts`、`src/router/index.ts`、`src/layouts/MainLayout.vue`、`src/mocks/handlers.ts`、`src/utils/access.ts`
- 验收方式：三角色登录 + 菜单可见性 + 403 跳转 + 刷新后权限保持

## 目标

- 仅在模拟数据模式（`VITE_USE_MOCK_DATA=true`）下提供多角色测试账号，方便验收路由与菜单权限。
- 菜单“隐藏无权限入口”不通过分散的 `v-if` 实现，而是基于统一权限规则自动生成与过滤，避免后续扩展成本。
- 路由鉴权与菜单可见性共享同一份规则，保证“看得见的一定进得去、进不去的一定看不见”。

## 非目标

- 不实现“置灰可见/申请权限”等交互（按需求选择 A：完全隐藏）。
- 不改变真实后端接入后的鉴权方式；对接后由后端账号与接口返回的角色驱动。

## 角色模型

- 标准角色集合：`admin` / `user` / `viewer`
- 默认角色：当角色字段缺失或为空时，按 `user` 处理
- 角色归一化规则：
  - `管理员`、`admin` → `admin`
  - `用户`、`user`、空值 → `user`
  - `访客`、`viewer` → `viewer`

## 模拟测试账号（仅模拟数据模式生效）

账号/密码以 [src/mocks/README.md](../../../src/mocks/README.md) 为单一事实来源。

行为：

- `/auth/login`：根据邮箱 + 密码返回对应 `token` 与 `user`（含角色）
- `/user/info`：根据请求头 `Authorization: Bearer <token>` 返回对应 `user`（含角色），保证刷新后 `bootstrapAuth()` 能恢复角色状态

## 权限单一来源

路由元信息作为权限单一来源：

- `meta.title`：菜单与页面标题
- `meta.roles?: string[]`：允许访问的角色集合（缺省表示所有登录用户可访问）
- `meta.showInMenu?: boolean`：是否显示在左侧菜单
- `meta.icon?: string`：菜单图标键（在布局中映射到具体图标组件）

菜单渲染不再手写每一项，而是：

- 从“受保护路由的子路由列表”生成菜单数据
- 过滤 `showInMenu=true`
- 使用统一的 `canAccess(roles, userRole)` 过滤

## 路由守卫

- 继续保留全局 `beforeEach`：
  - 未登录访问 `requiresAuth` 路由：跳转登录并携带 redirect
  - 已登录访问 `/login`：跳转 redirect 或 `/dashboard`
  - 命中 `meta.roles` 且 `!canAccess(...)`：跳转 `/403`
- `canAccess` 使用归一化后的角色判定

## 实现拆分

- `src/router/routes.ts`：导出受保护布局下的子路由数组（包含 meta.showInMenu / meta.roles / meta.icon）
- `src/router/index.ts`：创建 router，并引用 `routes.ts` 的子路由
- `src/utils/access.ts`（或同等位置）：提供 `normalizeRole` 与 `canAccess`
- `src/layouts/MainLayout.vue`：
  - 用 routes.ts 生成菜单
  - 统一过滤并渲染
  - 删除零散的权限 `v-if`
- `src/mocks/handlers.ts`：
  - 增加账号表与 token → user 映射
  - `/auth/login`、`/user/info` 返回角色字段

## 验收标准

- 在模拟数据模式下，使用三组账号登录后：
  - `admin` 可见并可进入：用户管理、系统设置
  - `user/viewer` 不可见：用户管理、系统设置；直接访问 `/users`、`/settings` 会被路由守卫跳回 `/403`
- 菜单项仅通过 routes meta 配置即可完成新增/限制，无需在布局里新增 `v-if`
- 刷新页面后权限状态保持一致（基于 `/user/info` 恢复角色）
