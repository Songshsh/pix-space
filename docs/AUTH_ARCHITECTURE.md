# 认证架构（Cookie Session）

本文件描述 Pix Space 当前的认证基线与工程入口，作为“已落地事实”的说明文档。

认证方案沉淀与实现细节见 [2026-06-02-auth-session-cookie-design.md](superpowers/specs/2026-06-02-auth-session-cookie-design.md)；若两者出现不一致，以本文件为准并同步修正 spec。该 spec 主要保留设计背景、关键取舍与验收记录，不再作为当前实现事实的并行入口。

## 1. 认证模型

- 浏览器通过 `HttpOnly Cookie` 持有会话
- 前端不保存 token
- 前端启动时通过“当前会话查询”恢复登录态
- 非 mock 模式下必须配置 `VITE_APP_API_BASE_URL`

## 2. 关键入口

- 启动入口：`src/main.ts`
- 请求层：`src/utils/request.ts`
- 用户与认证状态：`src/stores/user.ts`
- 认证 API：`src/api/user.ts`
- Mock：`src/mocks/handlers.ts`

## 3. 接口契约（前端视角）

### 3.1 登录

`POST /auth/login`

- 目的：建立服务端会话
- 前端行为：只消费 `user`，不处理 token
- 说明：该接口应用于登录页提交；需显式配置 `skipAuthRedirect: true` 避免 401 递归跳转

### 3.2 当前会话

`GET /auth/session`

- 目的：恢复登录态，作为“是否已登录”的单一事实来源
- 典型场景：应用首次启动、刷新、新开 tab、深链接访问受保护页面
- 建议配置：`silentError: true` + `skipAuthRedirect: true`

### 3.3 登出

`POST /auth/logout`

- 目的：销毁服务端会话
- 约定：只有服务端确认成功或明确返回 `401`（本就无会话）时，前端才清空本地登录态

## 4. 前端状态模型

`src/stores/user.ts` 的核心概念：

- `isAuthReady`：是否完成启动期会话校验
- `isSessionValidated`：当前会话是否通过服务端验证
- `isLoggedIn`：是否存在有效用户身份字段（用于 UI 展示）
- `isAuthenticated`：是否允许访问受保护页面（基于 `isSessionValidated`）

## 5. 请求层与错误策略

### 5.1 全局策略

- `withCredentials: true`（携带 Cookie）
- GET 请求默认不 toast，由页面决定展示空/错误/重试
- 非 GET 请求失败默认 toast（通常是用户主动提交）

### 5.2 401 处理与跳转

- 启动期会话探测请求必须显式设置 `skipAuthRedirect: true`
- 业务请求收到 401 时触发统一认证失效处理，并由路由守卫引导跳转登录

错误与提示策略细节以 `src/utils/README.md` 为准。

## 6. Mock 与真实后端差异

Mock 模式下：

- MSW 以 session 语义运行：登录不返回 token，会话恢复依赖 `GET /auth/session`
- 为了模拟“跨刷新”行为，mock 会话会持久化到浏览器 `localStorage`

真实后端模式下：

- 会话状态以服务端为准，前端不假设跨刷新可恢复（除非服务端仍保持会话）
- 不应把 mock 的 `localStorage` 持久化机制视为真实行为的一部分

Mock 细节以 `src/mocks/README.md` 为准。

## 7. 常见坑

- 非 mock 模式未配置 `VITE_APP_API_BASE_URL` 会在启动阶段直接失败（避免静默指向错误地址）
- 把启动期 `GET /auth/session` 当作业务请求处理，会导致 401 被误触发跳转/递归
- 认证相关页面与业务页面混用布局时，容易把匿名页面错误地纳入受保护路由守卫
