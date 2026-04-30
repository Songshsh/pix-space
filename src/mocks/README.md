# 模拟数据方案（MSW）

本项目使用 MSW 在浏览器层拦截请求，实现：

- 页面代码始终调用真实 API（`src/api/*`）
- 开发阶段无后端也能完整联调页面
- 后续接入后端只需关闭开关，无需改页面

## 开关

`.env`：

- `VITE_USE_MOCK_DATA=true`：开发环境启动 MSW
- `VITE_USE_MOCK_DATA=false`：不启动 MSW，走真实后端

## 模拟登录账号（单一事实来源）

仅在 `VITE_USE_MOCK_DATA=true` 时生效：

| 角色   | 邮箱                 | 密码       |
| ------ | -------------------- | ---------- |
| admin  | admin@pixspace.test  | Admin123!  |
| viewer | viewer@pixspace.test | Viewer123! |
| user   | user@pixspace.test   | User123!   |

## 位置

- handlers：`src/mocks/handlers.ts`
- worker：`src/mocks/browser.ts`
- 启动：`src/main.ts`

## 约定

- 模拟数据的返回结构遵循 `src/api/README.md` 的约定：`{ code, message, data }`
