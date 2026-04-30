# Pix Space

Pix Space 是一个素材空间的前端项目，当前为“双入口”形态：

- **前台**：`/explore` 灵感发现页（目前以原型/模拟数据为主）。
- **后台**：`/admin/...` 管理端（登录后可访问，包含权限控制）。

## 技术栈

- Vue 3 + TypeScript + Vite
- Element Plus（组件库） + Pinia（状态管理）
- MSW（模拟拦截）+ Axios（请求）
- Vitest（单测）+ Playwright（E2E）

## 环境要求

- Node.js >= 20.19.0
- npm >= 10.8.2

如果使用 nvm，可直接在项目根目录执行：

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

常用变量说明：

- `VITE_APP_TITLE`：站点标题
- `VITE_APP_API_BASE_URL`：后端 API 基地址
- `VITE_USE_MOCK_DATA`：是否使用模拟数据（推荐开发期保持 `true`）
- `VITE_ALLOW_MOCK_AUTH`：登录接口不可用时是否允许模拟登录（默认 `false`）

3. 启动开发服务器

```bash
npm run dev
```

## 页面入口

- Portal（无需登录）：`/explore`
- Admin（需要登录）：`/admin/dashboard`

完整路由、权限与菜单约定见 [docs/FRONTEND_SPEC.md](docs/FRONTEND_SPEC.md)。

## 研发联调与模拟数据

项目通过 MSW 在浏览器侧拦截请求，保持“页面调用真实 API 形态”的同时可使用本地模拟数据。

- 使用模拟数据（默认推荐）
  - 设置 `VITE_USE_MOCK_DATA=true`
- 接入真实后端
  - 设置 `VITE_USE_MOCK_DATA=false`
  - 配置 `VITE_APP_API_BASE_URL` 指向后端

模拟登录账号（仅在 `VITE_USE_MOCK_DATA=true` 时生效）：
见 [src/mocks/README.md](src/mocks/README.md)。

如果后端登录接口不可用、且你希望临时绕过登录（非 MSW 模式），可设置 `VITE_ALLOW_MOCK_AUTH=true`，此时任意邮箱/密码都会走模拟登录（默认角色为 `user`）。

相关约定与文档入口：

- [docs/README.md](docs/README.md)（文档地图）
- [docs/FRONTEND_SPEC.md](docs/FRONTEND_SPEC.md)（前端开发综合规范）
- [src/mocks/README.md](src/mocks/README.md)（模拟数据方案）

## 常用脚本

```bash
# 开发
npm run dev

# 构建/预览
npm run build
npm run preview

# 验证（本地尽量跑这个）
npm run test:all
```

更多脚本与贡献要求见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 目录结构（简版）

```
pix-space/
├── docs/                     # 规范与方案沉淀
├── design/                   # 原型与设计产物
├── e2e/                      # Playwright E2E
├── public/                   # 静态资源（含 MSW worker）
└── src/
    ├── api/                  # API 定义
    ├── components/           # 可复用组件
    ├── composables/          # 组合式逻辑
    ├── layouts/              # PortalLayout / MainLayout
    ├── router/               # 路由与权限控制
    ├── stores/               # Pinia stores
    ├── styles/               # tokens 与全局样式
    ├── utils/                # request 与通用工具
    └── views/                # 路由级页面（portal/admin）
```

## 许可证

ISC
