# Pix Space - 认证注册页面设计方案

## 元信息

- Status：implemented
- 目标读者：产品、前端、测试
- 最后对齐：2026-06-09
- 权威入口：无；当前实现以本文 Entry points 与代码为准
- 范围：新增认证域“注册”独立页面，支持基础表单提交与结果反馈；不包含邮箱验证码、协议勾选、第三方登录、真实邮件链路与注册后自动登录
- 主要改动点：在 `views/auth` 下新增注册页面；在路由层新增匿名访问入口；登录页“立即注册”入口改为跳转；补充对应 API、MSW mock 与最小测试覆盖
- Entry points：`src/components/auth/LoginForm.vue`、`src/views/auth/login/index.vue`、`src/views/auth/register/index.vue`、`src/router/index.ts`、`src/api/user.ts`、`src/types/auth.ts`、`src/mocks/handlers.ts`
- Acceptance checklist：按认证入口手工验收 + 关键路由与页面交互补充最小单测

## 1. 背景与目标

当前项目已经提供最小可用的注册闭环。认证前页面继续统一放在独立的 `auth` 域内，注册能力与登录、找回密码保持同一页面边界与路由组织方式，而不是塞回登录页弹层或混入业务布局。

当前实现提供以下流程：

- 用户从登录页点击“立即注册”进入独立注册页
- 用户填写用户名、邮箱、密码、确认密码并提交
- 页面通过统一 API 封装发起注册请求
- Mock 模式下可校验邮箱重复并返回成功/失败语义
- 注册成功后返回登录页，并携带注册成功标记

当前范围仍不追求真实账号体系闭环，重点放在前端页面、接口封装、Mock 行为、路由接入与基础验证路径。

## 2. 设计原则

- **认证域独立**：注册属于登录前流程，统一放在 `views/auth` 体系，避免耦合到 `portal` 或 `admin`
- **体验一致**：视觉风格、背景氛围、卡片层级与登录页/找回密码页保持一致
- **最小闭环**：先做基础注册表单，不提前引入验证码、协议勾选、邀请码等额外流程
- **分层清晰**：页面负责交互，API 负责请求，MSW 负责 mock，禁止页面直接操作底层 request
- **低侵入接入**：优先在现有登录页和路由结构上做增量扩展，不做无关认证组件重构

## 3. 页面结构与交互

### 3.1 页面位置与路由

- 当前页面：`src/views/auth/register/index.vue`
- 当前路由：`/register`
- 路由属性：匿名可访问，`meta.requiresAuth = false`
- 登录页入口：当前登录表单中的“立即注册”会显式跳转 `/register`

选择独立页面而不是登录页弹层的原因：

- 现有找回密码已经采用独立页面，注册继续沿用同类模式可保持一致性
- 注册表单字段比登录更多，独立页面更利于呈现校验、成功态与返回入口
- 后续若补充 `verify-email`、`reset-password` 等认证前能力，`views/auth` 仍可作为统一归档位置

### 3.2 视觉与布局

- 延续登录页的星空背景、品牌标题与居中卡片布局
- 页面顶部文案聚焦“创建 Pix Space 账号，开始探索与管理你的视觉资产”
- 注册卡片内容包含：
  - 标题：`立即注册`
  - 说明文案：引导用户填写基础信息完成账号创建
  - 表单区域：用户名、邮箱、密码、确认密码、提交按钮
  - 辅助入口：已有账号则返回登录

当前实现复用或参考了以下认证页元素：

- `StarryBackground`
- 登录页与找回密码页的容器结构和动画节奏
- 认证主按钮尺寸、输入框尺寸、卡片宽度与留白体系

### 3.3 表单字段与校验

页面表单字段固定为：

- `name`：用户名
- `email`：邮箱
- `password`：密码
- `confirmPassword`：确认密码

当前实现采用以下前端校验规则：

- 用户名：必填，去除首尾空格后不能为空，长度限制为 2 到 20 个字符
- 邮箱：必填，需符合邮箱格式
- 密码：必填，长度不少于 6 位
- 确认密码：必填，且必须与密码一致

本次不新增更复杂的密码强度规则，避免前后端契约尚未明确前过度约束用户输入。

### 3.4 状态设计

页面需要覆盖以下状态：

- **初始态**：展示说明文案、完整表单和返回登录入口
- **校验失败态**：字段缺失、邮箱格式错误、两次密码不一致时在表单内提示错误
- **提交中**：提交按钮 loading，阻止重复提交
- **提交成功态**：提示注册成功，并准备跳回登录页
- **提交失败态**：展示接口返回的业务错误或兜底提示，保留继续编辑和重试能力

### 3.5 成功后的行为

注册成功后不直接写入登录态，而是统一返回登录页：

- 跳转到 `/login?registered=1`
- 只要 URL 仍保留 `registered=1`，登录页就会展示成功提示；邮箱输入框保持空白，由用户自行输入

这样设计的原因：

- 不改动现有 `userStore.login()`、鉴权守卫和 `bootstrapAuth()` 语义
- 避免“注册即登录”与后续真实后端策略不一致
- 用户成功后自然回到登录入口，路径更符合当前项目的认证分层
- 避免在登录页自动暴露刚注册邮箱，减少共享设备下的信息暴露与“系统已记住账号”的误解

## 4. 接口与数据约定

### 4.1 前端接口

在 `src/types/auth.ts` 中补充注册请求类型：

```ts
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
```

在 `src/api/user.ts` 中新增注册方法，继续与登录、找回密码放在同一认证域：

```ts
export function register(data: RegisterPayload): Promise<boolean>;
```

请求语义：

- 前端提交用户名、邮箱、密码
- 确认密码仅用于前端校验，不进入接口 payload
- 请求继续走统一 `request` 层，并保持 `silentError` / `skipAuthRedirect` 策略与登录、找回密码一致

### 4.2 API 文档约定

`src/api/README.md` 中已新增 `POST /auth/register` 说明，当前契约如下：

- 请求：

```json
{
  "name": "pixelUser",
  "email": "user@example.com",
  "password": "<user-password>"
}
```

- 成功响应 data：`true`
- 失败语义：
  - 邮箱重复：返回 `400`
  - message：`该邮箱已被注册`

页面当前只依赖成功/失败语义，因此前端注册接口返回值保持 `Promise<boolean>`。

### 4.3 Mock 行为

在 `src/mocks/handlers.ts` 中新增 `POST */api/auth/register`：

- 校验 `name`、`email`、`password` 是否存在
- 若邮箱已在现有 `profileState` 或 `passwordState` 中存在，则返回 `400` 和明确业务 message
- 若邮箱未注册，则向现有 mock 状态中写入新用户资料与密码

当前实现中的新增用户 mock 行为：

- `role` 默认写为 `user`
- `id` 采用现有 mock 体系内可递增或基于现有最大值生成的方式
- `profileState` 中保存 `name`、`email`、`role`、默认空 `avatar/phone/bio`
- `passwordState` 中保存该邮箱对应密码
- `preferencesState` 中初始化默认账户偏好

这样可以保证：

- 注册完成后，用户能立刻使用新账号在 Mock 模式下登录
- `GET /user/info`、偏好读取等现有依赖状态仍保持可用
- Mock 行为与真实注册语义更接近，而不是只返回成功但不落状态

## 5. 实现拆解

### 5.1 登录入口改造

登录表单组件保持单一职责，仅暴露事件而不直接持有路由：

- `src/components/auth/LoginForm.vue` 为“立即注册”新增 `register` emit
- `src/views/auth/login/index.vue` 监听该事件，并执行 `router.push('/register')`

这样可以保持组件仍然是纯表单交互组件，页面继续负责导航。

### 5.2 注册页页面层

当前页面位于 `src/views/auth/register/index.vue`，页面负责：

- 注册表单状态
- 表单校验
- 提交 loading
- 成功后的跳转逻辑
- 返回登录入口

当前实现保持单文件页面；若后续注册逻辑显著膨胀，再拆出页面私有 composable，例如：

- `src/views/auth/register/useRegisterSubmit.ts`

当前实现未提前抽离，遵循最小改动原则。

### 5.3 登录页增强

为了闭环成功后的回流体验，当前登录页做了两项小幅增强：

- 读取 query 中的 `registered=1` 并展示成功提示，如“注册成功，请使用新账号登录”
- 登录页邮箱输入框保持空白，不做自动回填，由用户手动输入

增强范围应保持克制：

- 不保存到全局 store
- 当前未在提示后自动清理 `registered=1`，因此页面刷新时仍会继续显示提示
- 不新增复杂的 query 解析工具，直接在登录页按当前路由参数做最小处理

### 5.4 路由层

当前在 `src/router/index.ts` 中使用顶层匿名路由：

- `path: '/register'`
- `name: 'Register'`
- `meta.title: '注册'`
- `meta.requiresAuth: false`

守卫策略与 `/login` 保持一致：

- 匿名用户可正常访问
- 已登录用户访问 `/register` 时重定向到 `sanitizeRedirectPath(to.query.redirect, '/explore')`

原因如下：

- 已登录用户继续访问注册页通常没有业务价值
- 项目当前已对 `/login` 做登录态重定向，注册页延续同一策略更统一
- 可减少“已登录但仍打开匿名认证页”的分支复杂度

## 6. 验收标准

- 登录页“立即注册”可跳转至 `/register`
- 注册页延续认证视觉风格，具备独立标题、说明、完整注册表单与返回登录入口
- 用户名为空、邮箱非法、密码过短、两次密码不一致时，表单可阻止提交并展示校验提示
- 提交中按钮显示 loading，防止重复提交
- 注册成功后跳回 `/login`，并携带注册成功标记
- 登录页在 URL 保留 `registered=1` 时展示注册成功提示，但邮箱输入框不自动回填
- 重复邮箱时展示明确业务错误提示
- API、mock、路由、页面测试与文档保持同步更新

## 7. 测试与验证

当前实现的最小测试覆盖如下：

- `src/router/index.test.ts`
  - 匿名访问 `/register` 不被守卫拦截
  - 已登录用户访问 `/register` 时跳转 `/explore`
- `src/views/auth/register/index.test.ts`
  - 必填字段缺失时不提交
  - 邮箱格式非法时不提交
  - 两次密码不一致时不提交
  - 提交成功后跳回登录页并带上 `registered=1`
  - 接口失败时展示错误提示
- `src/views/auth/login/index.test.ts` 或 `src/components/auth/LoginForm.test.ts`
  - 点击“立即注册”触发跳转或 emit
  - 登录页在 `registered=1` 时展示成功提示，且邮箱输入框保持空白

手工验收路径：

- 访问 `/login`
- 点击“立即注册”
- 进入 `/register`
- 输入合法信息并提交
- 观察跳回登录页、邮箱输入框为空、成功提示已展示
- 使用新注册邮箱与密码登录
- 使用已存在邮箱再次注册，观察重复邮箱提示
- 输入不合法邮箱或不一致密码，验证前端校验

## 8. 不做范围

以下内容明确不在本次实现范围内：

- 邮箱验证码 / 邮箱激活
- 用户协议与隐私政策勾选
- 第三方登录注册
- 图形验证码 / 滑块验证
- 注册后自动登录
- 多角色注册选择
- 邀请码、组织码等扩展注册流程
- 注册完成后的欢迎引导页

## 9. 风险与后续

当前方案以 Mock 可闭环登录为目标，后续接真实后端时需要重点确认：

- 实际注册接口路径、字段命名与响应结构
- 用户名长度和密码强度规则是否需要与后端进一步对齐
- 是否需要邮箱唯一以外的额外约束，例如用户名唯一
- 注册成功后是否要求自动登录或返回 token
- 登录页成功提示与邮箱回填是否需要沉淀为更通用的认证页行为

如果认证域后续继续扩展，应在 `views/auth` 下统一维护：

- `register`
- `forgot-password`
- `reset-password`
- `verify-email`（若后续需要）
