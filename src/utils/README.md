# 错误处理约定

## 统一错误对象

请求失败时，前端会抛出标准错误对象（来自 request 层）：

- `status`：HTTP 状态码（可能为 `undefined`，例如断网）
- `code`：Axios error code 或业务 code
- `message`：面向用户的文案（优先使用接口返回的 `message`，仅在缺失时使用前端兜底文案）
- `data`：响应体（若有）
- `isTimeout / isNetworkError / isCanceled`

## 全局提示策略

默认策略：

- 非 GET 请求失败：自动 toast 提示（通常来自用户点击操作）
- GET 请求失败：默认不 toast（通常是页面加载/预取/轮询），由页面决定展示空状态或重试

可通过请求 config 控制：

- `silentError: true`：完全静默（不 toast）
- `notifyError: true`：即便是 GET 也强制 toast

## 页面侧建议

- 列表/看板类请求：用 `silentError: true`，页面内展示空状态 + 重试按钮
- 用户提交类请求：默认即可（让 request 自动 toast），必要时补充更具体提示
- 用户主动触发的下载类 GET：应显式开启 `notifyError: true`，避免失败完全静默

## 认证与启动约定

- `logout` 调用失败时，前端不应直接清空本地登录态；只有服务端确认成功，或明确返回 `401`（本就无会话）时，才视为已退出
- `GET /auth/session` 这类启动期静默会话探测，应显式设置 `skipAuthRedirect: true`，避免把探测请求的 `401` 误判为业务链路里的登录失效跳转
- 非 mock 模式下必须配置 `VITE_APP_API_BASE_URL`；若缺失，`src/utils/request.ts` 会在启动阶段直接抛错，避免静默退化到错误地址
