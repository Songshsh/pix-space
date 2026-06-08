# Pix Space - 认证会话 Cookie 架构改造方案

## 元信息

- Status：draft
- 目标读者：产品、前端、后端、测试
- 范围：将现有基于前端持有 token 的认证实现，调整为基于 `HttpOnly Cookie + 当前会话查询` 的 Web 认证架构；包含前端 store、request、认证 API、MSW mock、路由恢复与最小测试调整；不包含 OAuth、第三方登录、移动端统一认证、SSO 与 refresh token 体系
- 主要改动点：移除前端对 token 的持久化与请求头注入；新增当前会话查询接口；统一使用 `withCredentials`；将 mock 认证从 token 模式切换为 session 模式；同步更新 API 文档与认证相关测试
- Entry points：`src/stores/user.ts`、`src/utils/request.ts`、`src/api/user.ts`、`src/types/auth.ts`、`src/views/auth/login/index.vue`、`src/router/index.ts`、`src/main.ts`、`src/mocks/handlers.ts`、`src/api/README.md`
- Acceptance checklist：登录、刷新、新开 tab、深链接访问、401 失效、登出与 mock 模式均可按统一会话语义工作

## 1. 背景与目标

当前 `Pix Space` 的登录态由前端保存 token，并持久化在 `sessionStorage` 中。这种实现有两个直接问题：

- 登录态只能在当前 tab 有效，新开 tab 或复制链接打开时无法继续使用
- 认证凭证由前端 JavaScript 可读可写，不适合作为新 Web 项目的长期认证架构

项目当前仍处于前后端契约可调整阶段，因此本次不采用“把 `sessionStorage` 改为 `localStorage`”的权宜修补，而是直接将认证模型切换为更适合长期演进的 Web 方案：

- 浏览器通过 `HttpOnly Cookie` 持有会话
- 前端不保存 token
- 前端启动时通过“当前会话查询”恢复登录态
- 新开 tab、刷新、深链接直开都依赖同一套会话恢复逻辑

本次目标是完成前端架构和 mock 契约的切换，使真实后端接入时无需再次推翻认证骨架。

## 2. 设计原则

- **会话优先**：认证状态以服务端会话为准，前端不再持有长期 token
- **跨 tab 可用**：新开 tab、复制链接、刷新页面均应恢复登录态
- **前端最小知情**：前端只知道“当前是否已登录”和“当前用户是谁”，不知道会话凭证内容
- **保留现有恢复入口**：尽量复用现有 `bootstrapAuth()`、路由守卫和 401 处理链路，避免无关重构
- **mock 先对齐真实语义**：MSW 不追求完全模拟浏览器 cookie 细节，但要对齐“前端不可见 token，只能查当前会话”的使用方式

## 3. 目标架构

### 3.1 认证生命周期

前端认证生命周期统一为：

1. 用户在登录页提交邮箱和密码
2. 后端校验成功后通过 `Set-Cookie` 写入会话 Cookie
3. 登录接口响应体仅返回当前用户信息
4. 前端把用户信息写入 `userStore`，但不保存 token
5. 应用启动或新开 tab 时，前端调用 `GET /auth/session`
6. 若返回当前用户，则设置为已认证状态
7. 若返回 `401`，则清空用户态并由路由守卫或全局 401 处理跳转登录

### 3.2 状态模型

`userStore` 应只维护以下信息：

- 用户字段：`id`、`name`、`email`、`role`、`avatar`、`phone`、`bio`
- `isAuthReady`：当前应用是否已完成首次会话校验
- `isSessionValidated`：本次会话是否已通过服务端验证

不再维护：

- `token`

计算逻辑建议：

- `isLoggedIn`：基于用户身份字段存在性判断，例如 `Boolean(id || email)`
- `isAuthenticated`：基于 `isSessionValidated`

这样可以避免“本地残留 token 但后端会话已失效”的伪登录态。

## 4. 接口契约

### 4.1 登录

`POST /auth/login`

请求：

```json
{
  "email": "admin@pixspace.test",
  "password": "<non-empty-password>"
}
```

成功行为：

- 后端返回 `Set-Cookie`
- Cookie 应设置为 `HttpOnly`

成功响应 data：

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "email": "admin@pixspace.test",
    "role": "admin",
    "avatar": "",
    "phone": "",
    "bio": ""
  }
}
```

失败时返回 `401`，`message` 为登录失败原因。

### 4.2 当前会话

`GET /auth/session`

成功响应 data：

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "email": "admin@pixspace.test",
    "role": "admin",
    "avatar": "",
    "phone": "",
    "bio": ""
  }
}
```

未登录或会话失效时返回 `401`。

该接口是以下场景的单一事实来源：

- 首次加载应用
- 页面刷新
- 新开 tab
- 深链接直开受保护路由

### 4.3 登出

`POST /auth/logout`

成功响应 data：`true`

成功行为：

- 后端销毁会话
- 后端清除 Cookie
- 前端仅在登出成功或服务端明确返回 `401` 时清空本地登录态；网络异常或 `5xx` 失败时保留当前登录态并提示用户重试

### 4.4 注册与找回密码

`POST /auth/register` 与 `POST /auth/forgot-password` 可继续保持现有语义，不需要为了本次改造额外调整。

## 5. 前端实现方案

### 5.1 store 改造

在 `src/stores/user.ts` 中执行以下调整：

- 删除 `token` state 与相关返回字段
- `login(userData, newToken?)` 改为 `login(userData)`，仅写入用户信息并设置 `isSessionValidated = true`
- `logout()` 仍负责清空用户字段并重置认证状态，但应由 `useLogout` 在服务端确认成功后再调用，避免前后端会话状态不一致
- `fetchUserInfo()` 改为调用当前会话接口，建议命名同步收敛为 `fetchSession()` 或复用 `fetchUserInfo()` 但底层改为 `/auth/session`
- `bootstrapAuth()` 不再先判断本地 token 是否存在，而是直接请求当前会话
- `persist` 中不再保存 token；本次建议仅保留用户展示字段，或进一步不持久化用户资料，只依赖启动恢复

选择保留 `bootstrapAuth()` 而不是新增全局认证初始化器的原因：

- 现有启动链路已经依赖该方法
- 路由守卫已经围绕 `isAuthReady` 和 `isAuthenticated` 组织
- 这部分结构接近目标状态，可低成本复用

### 5.2 request 改造

在 `src/utils/request.ts` 中执行以下调整：

- axios 基础配置新增 `withCredentials: true`
- 删除请求拦截器中从 `userStore.token` 注入 `Authorization` 的逻辑
- 保留响应拦截器中的 401 统一处理
- `GET /auth/session` 这类启动期静默会话探测请求需要显式带 `skipAuthRedirect: true`，避免把“启动恢复会话时的 401”误并入业务请求的全局认证失效跳转

401 处理策略保持不变：

- 当前用户已登录时，收到 401 则清空前端用户态
- 派发统一认证失效事件
- 跳转登录页并保留 redirect

这部分逻辑不需要因为认证介质从 token 切换为 cookie 而整体推倒。

### 5.3 登录页改造

在 `src/views/auth/login/index.vue` 中：

- 登录成功后不再读取和存储 token
- `loginApi()` 返回的结果改为仅使用 `result.user`
- 调用 `userStore.login(result.user)`
- 后续跳转逻辑继续保留 `redirect` 语义

### 5.4 路由与启动

`src/router/index.ts` 的守卫逻辑整体保持不变：

- 匿名访问公开页继续允许
- 访问受保护页面仍依赖 `isAuthReady` 和 `isAuthenticated`
- 未认证时跳转 `/login?redirect=...`

`src/main.ts` 继续在挂载应用前执行：

- `await userStore.bootstrapAuth()`

这保证：

- 首次进入应用时，不会因为会话尚未恢复而误判未登录
- 受保护路由的跳转判断始终建立在会话已校验完成之后

## 6. Mock 方案

### 6.1 目标

当前 MSW 通过 mock token + `Authorization` 实现认证，这需要切换为 session 语义。

本次 mock 的目标不是浏览器级完整 cookie 仿真，而是满足前端架构改造后的使用方式：

- 登录接口不返回 token
- 当前会话接口是恢复登录态的唯一入口
- 受保护接口不依赖请求头中的 `Authorization`

### 6.2 推荐实现

在 `src/mocks/handlers.ts` 中新增或调整：

- 模块级会话状态，例如 `let currentSessionEmail: string | null = null`

接口行为建议：

- `POST /api/auth/login`
  - 校验邮箱和密码
  - 成功后设置 `currentSessionEmail = email`
  - 返回 `{ user }`
- `GET /api/auth/session`
  - 若 `currentSessionEmail` 存在，返回对应 `user`
  - 否则返回 `401`
- `POST /api/auth/logout`
  - 清空 `currentSessionEmail`
  - 返回 `true`

其他依赖登录身份的 mock 接口：

- 不再从请求头解析 token
- 统一从 `currentSessionEmail` 解析当前用户

### 6.3 限制说明

MSW 在浏览器内运行，无法完全模拟真实后端设置 `HttpOnly Cookie` 的安全属性。因此 mock 的价值在于：

- 验证前端不再依赖 token
- 验证启动恢复、401 处理和受保护页面访问逻辑
- 验证真实后端接入时所需的前端调用方式

## 7. 类型与 API 封装调整

### 7.1 类型

在 `src/types/auth.ts` 中：

- 现有 `LoginResult` 由 `{ token, user }` 改为仅包含 `user`
- 或新增统一的 `AuthSessionResult`

推荐写法：

```ts
export interface AuthSessionResult {
  user: AuthUser;
}
```

然后：

- `login()` 返回 `AuthSessionResult`
- `getSession()` 返回 `AuthSessionResult`

这样比保留多个近似结果类型更清晰。

### 7.2 API 封装

在 `src/api/user.ts` 中：

- `login()` 改为返回当前用户信息，不再承诺 token
- 新增 `getSession()`，请求 `GET /auth/session`
- `logout()` 保持 `POST /auth/logout`

如果需要兼容已有调用方，也可以先保留 `getUserInfo()` 方法名，但底层不再请求 `/user/info`，而是明确改到 `/auth/session`。本次更推荐直接更名，减少语义混淆。

## 8. 测试与验收

### 8.1 自动化测试

建议同步更新或新增以下测试：

- `src/stores/user.test.ts`
  - 登录后不再断言 token
  - 登出可清空用户信息和认证状态
- `src/utils/request.test.ts`
  - 不再断言 `Authorization`
  - 继续断言 401 会触发登出与认证失效事件
- `src/router/index.test.ts`
  - 启动校验完成后，未认证访问受保护页会跳登录
  - 已认证用户访问登录页会跳回默认页
- `src/views/auth/login/index.test.ts`
  - 登录成功后调用 `userStore.login(user)`，而非写入 token

### 8.2 手工验收路径

- 启动应用并访问 `/login`
- 登录成功后进入受保护页面
- 刷新当前页面，确认仍保持登录
- 新开 tab 直接访问受保护页面，确认能恢复登录态
- 复制受保护页面链接到新 tab，确认可访问
- 触发任一返回 401 的请求，确认跳回登录页
- 点击登出后刷新页面，确认无法恢复登录

## 9. 不做范围

以下内容明确不在本次改造范围内：

- OAuth / OpenID Connect
- 第三方登录
- refresh token 轮换体系
- 多端统一认证
- SSO
- 权限模型重构
- 登录页 UI 重设计

## 10. Notes

后续接真实后端时，需要重点确认以下事项：

- 是否前后端同域部署；若跨域，需要同步配置 `withCredentials + CORS`
- Cookie 的 `SameSite` 与 `Secure` 策略
- CSRF 防护方案，至少确认 `SameSite=Lax` 是否满足业务
- `/auth/session` 是否返回完整用户信息，还是需要拆分“当前会话”与“用户资料”

如果未来项目需要扩展到多端或网关体系，再评估是否从服务端 session 升级为：

- `HttpOnly refresh token + in-memory access token`

在当前项目阶段，先落稳 `HttpOnly Cookie + /auth/session`，是更合适也更可控的基础方案。
