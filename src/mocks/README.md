# 模拟数据方案（MSW）

本项目使用 MSW 在浏览器层拦截请求，实现：

- 页面代码始终调用真实 API（`src/api/*`）
- 开发阶段无后端也能完整联调页面
- 后续接入后端只需关闭开关，无需改页面

## 开关

参考 `.env.example`：

- `VITE_USE_MOCK_DATA=true`：开发环境启动 MSW
- `VITE_USE_MOCK_DATA=false`：不启动 MSW，走真实后端

## 模拟登录账号

仅在 `VITE_USE_MOCK_DATA=true` 时生效：

| 角色   | 邮箱                 |
| ------ | -------------------- |
| admin  | admin@pixspace.test  |
| viewer | viewer@pixspace.test |
| user   | user@pixspace.test   |

- 内置 mock 种子账号登录时仅校验“账号存在且密码非空”，仓库中不再保存预置测试口令
- 通过注册新增的账号、或手动修改过密码的账号，会按最新一次提交的密码校验

- 后台用户管理接口仅 `admin` 可操作；未登录返回 `401`，非管理员返回 `403`

## 位置

- handlers：`src/mocks/handlers.ts`
- worker：`src/mocks/browser.ts`
- 启动：`src/main.ts`

## 约定

- 模拟数据的返回结构遵循 `src/api/README.md` 的约定：`{ code, message, data }`
- mock 不额外提供“权限查询接口”；与真实后端一样，在业务接口内部根据当前会话自动鉴权
- 后台接口（如 dashboard/files/images）会在 handler 内校验管理员身份；未登录返回 `401`，非管理员返回 `403`
- 用户主页相关 mock 会按查看者身份过滤可见资源：访客只能看到公开画板与公开上传

## 认证行为

- 登录成功后，MSW 仅在内存中记录当前会话，不返回 token
- 前端不读取认证凭证，通过 `GET /auth/session` 恢复登录态
- 为了模拟真实会话的跨刷新行为，MSW 会把当前 mock 会话同步保存到浏览器 `localStorage`
- 刷新页面或新开 tab 时，只要当前 mock 会话仍在，页面即可恢复登录
- 重新加载开发服务本身不会主动清空浏览器 `localStorage`；若当前 mock 会话仍在，刷新页面或新开 tab 仍可恢复登录
- 清空浏览器上下文（如清除站点数据）后，mock 会话会重置
- mock 会话持久化只是开发态增强，不等价于真实 Cookie Session；真实后端仍以服务端会话状态为准
