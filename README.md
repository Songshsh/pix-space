# Pix Space

本文件面向“项目使用者”，提供最小上手与运行入口，不承载详细规范。
规范与专题文档以 `docs/README.md` 为权威入口；AI/Agent 协作规则以 `AGENTS.md` 为权威入口。

Pix Space 是一个素材空间的前端项目，当前为“双入口”形态：

- **前台**：以 `/explore` 为核心入口，已包含发现、图片详情、个人中心、个人画板与画板详情等页面。
- **后台**：`/admin/...` 管理端（当前仅 `admin` 可访问）。

## 技术栈

- Vue 3 + TypeScript + Vite
- Element Plus（组件库） + Pinia（状态管理）
- MSW（模拟拦截）+ Axios（请求）
- Vitest（单测）+ Playwright（E2E）

## 环境要求

- Node.js / npm 版本要求：见 [package.json](package.json) 的 `engines`

如果使用 nvm，可直接在项目根目录执行（版本见 [.nvmrc](.nvmrc)）：

```bash
nvm use
```

## 快速开始

1. 安装依赖

```bash
npm ci
```

2. 配置环境变量

```bash
cp .env.example .env
```

环境变量完整列表以 [.env.example](.env.example) 为准；常用变量示例：

- `VITE_APP_TITLE`：站点标题
- `VITE_APP_API_BASE_URL`：后端 API 基地址
- `VITE_USE_MOCK_DATA`：是否使用模拟数据（推荐开发期保持 `true`）

3. 启动开发服务器

```bash
npm run dev
```

## 主要入口

- Portal：`/explore`
- Portal 详情：`/image/:id`、`/u/:userId/boards`、`/board/:id`
- 认证页：`/login`、`/register`、`/forgot-password`
- 登录后个人入口：`/account`
- Admin（仅 `admin` 可访问）：`/admin/dashboard`
- System：`/403`、`/:pathMatch(.*)*`

路由、权限与菜单约定见 [src/router/README.md](src/router/README.md) 与 [docs/FRONTEND_SPEC.md](docs/FRONTEND_SPEC.md)。

## Mock 与联调

- 默认推荐：`VITE_USE_MOCK_DATA=true`
- 接入真实后端：`VITE_USE_MOCK_DATA=false`，并配置 `VITE_APP_API_BASE_URL`
- Mock 账号、接口拦截方式与联调约定见 [src/mocks/README.md](src/mocks/README.md)

## 常用脚本

```bash
npm run dev
npm run build
npm run test
```

更多脚本、验证口径与贡献约定见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 文档入口

- 使用者与贡献者入口：[CONTRIBUTING.md](CONTRIBUTING.md)
- 规范与专题索引：[docs/README.md](docs/README.md)
- AI / Agent 规则入口：[AGENTS.md](AGENTS.md)
- 认证架构说明：[docs/AUTH_ARCHITECTURE.md](docs/AUTH_ARCHITECTURE.md)

## 许可证

ISC
