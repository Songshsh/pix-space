# Auth Views 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 页面定位

- MUST：认证前页面统一放在 `src/views/auth/`
- MUST：当前目录仅承载认证入口与认证前流程页面，如登录、注册、找回密码
- AVOID：将 Portal 业务页或 Admin 管理页混入本目录

## 路由与访问

- MUST：认证页的访问策略以 `src/router/index.ts` 为准，禁止在页面内自行绕过路由守卫
- MUST：认证相关页面变更时，同步核对 `src/router/index.ts` 与 `src/router/index.test.ts`
- SHOULD：认证页跳转入口尽量通过路由跳转表达，不在页面内堆叠弹窗式流程

## 体验一致性

- MUST：登录、注册、找回密码等页面保持统一的认证域视觉语言
- SHOULD：优先复用 `src/components/auth/` 与共享背景组件，避免重复实现同类表单壳层
- MUST：表单校验、提交中、成功/失败反馈必须完整

## 分层边界

- MUST：页面只负责认证交互与页面状态，不直接操作底层 request
- MUST：接口封装统一走 `src/api/`
- MUST：跨页面复用逻辑抽到 `src/components/`、`src/composables/` 或 `src/utils/`
- SHOULD：仅当前页使用的逻辑，可就近放在当前页面目录

## 相关规范

- 根视图规范：[../AGENTS.md](../AGENTS.md)
- 认证架构说明：[../../../docs/AUTH_ARCHITECTURE.md](../../../docs/AUTH_ARCHITECTURE.md)
- 路由说明：[../../router/README.md](../../router/README.md)
- 路由约束：[../../router/AGENTS.md](../../router/AGENTS.md)
