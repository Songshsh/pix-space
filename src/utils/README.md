# 错误处理约定

## 统一错误对象

请求失败时，前端会抛出标准错误对象（来自 request 层）：

- `status`：HTTP 状态码（可能为 `undefined`，例如断网）
- `code`：Axios error code 或业务 code
- `message`：面向用户的文案
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
