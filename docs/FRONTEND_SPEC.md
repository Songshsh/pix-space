# 前端开发综合规范（Vue 3 + Element Plus）

本文件是项目中前端代码（视图、组件、样式与目录结构）的主要规范来源；接口契约与错误策略以 `src/api/README.md`、`src/utils/README.md` 为准。

## 1. 架构与目录职责

- **入口**：`src/main.ts` → `src/App.vue` → `src/layouts/MainLayout.vue` → `src/router/index.ts`
- `src/views/`：路由级页面，负责组合组件与调用逻辑，不写基础界面。
- `src/components/`：跨页面复用组件，接收 props 并 emit 事件。
- `src/composables/`：复用的业务逻辑与状态流。
- `src/api/` 与 `src/utils/request.ts`：纯接口请求，严禁包含界面逻辑。
- `src/stores/`：Pinia 全局状态。

**新增页面触点**：

1. `src/views/<domain>/index.vue`
2. `src/router/routes.ts`（注册业务路由）
3. `src/api/<domain>.ts`（新增接口）
4. `src/mocks/handlers.ts`（如有需要）

## 2. Vue 3 编码约束

- **强制要求**：必须使用 `<script setup>` 和 TypeScript。严禁将复杂业务逻辑、网络请求直接堆砌在视图层模板中。
- **自动导入规则**：
  - 项目已配置 `unplugin-auto-import` 和 `unplugin-vue-components`。
  - **严禁**手动导入 Vue 核心 API（如 `ref`, `computed`, `watch`, `onMounted` 等）。
  - **严禁**手动导入 Element Plus 组件库（如 `ElMessage`, `ElButton`, `ElTable` 等）。
- **命名规范**：
  - 页面：`src/views/<domain>/index.vue`（例：`user-management/index.vue`）
  - 组件：`<Domain><Widget>.vue`（例：`UserTable.vue`）
  - 逻辑：`use<Domain><Verb>.ts`（例：`useUserDisplay.ts`）
- **数据流**：列表/看板类 GET 请求优先使用 `silentError: true`（错误策略定义见 [src/utils/README.md](../src/utils/README.md)），由页面自己渲染空状态；用户提交类请求交由底层统一 toast。

## 3. 路由与权限（入口与约定）

路由与菜单的权威来源：

- 路由定义：`src/router/index.ts`
- 受保护（后台）路由子路由：`src/router/routes.ts`
- 权限判断：`src/utils/access.ts`（`canAccess` / 角色归一化）

页面入口（按访问者视角）：

- 前台（无需登录）
  - `/explore`：发现页
- 后台（需要登录）
  - `/admin/dashboard`：数据统计
  - `/admin/images`：图片管理
  - `/admin/files`：文件管理
  - `/admin/users`：用户管理（仅 `admin` 可见）
  - `/admin/settings`：系统设置（仅 `admin` 可见）

约定：

- 后台路由统一挂在 `/admin` 下，由 `MainLayout.vue` 承载
- 前台路由统一挂在 `/` 下，由 `PortalLayout.vue` 承载（当前仅 `explore`）
- 菜单项由 `routes.ts` 的 meta 生成与过滤，避免在布局里散落 `v-if`
- `meta.roles` 存在时，必须通过 `canAccess(to.meta.roles, userRole)` 才允许访问；无权限统一跳转 `/403`

## 4. 状态管理与 Pinia 边界

- **局部状态优先**：仅在当前页面或组件使用的数据（如表单 `loading`、弹窗开关、局部列表数据、当前选中项），**必须**使用 `ref/reactive` 放在组件内部或 `src/composables/` 中。
- **全局状态慎用**：只有跨页面高频共享的数据（如用户信息、全局主题配置、权限路由、系统级配置）才允许存入 `src/stores/`（Pinia）。
- **严禁滥用状态仓库**：不要将某个业务模块（如“用户管理”的列表数据）的增删改查逻辑写在 Pinia 状态仓库中，这会导致内存泄漏和状态污染。请使用组合式函数（例如 `useUserList.ts`）来管理业务模块状态。

## 5. 界面与样式约束

- **绝不重复造轮子**：必须优先使用 Element Plus (`el-card`, `el-table`, `el-dialog` 等)。能用内置 props / slots 解决的，严禁手捏原生 HTML/CSS。
- **作用域隔离**：组件样式必须写在 `<style scoped>` 中。
- **设计系统**：禁止魔法数字。间距、圆角、颜色等应优先使用 `src/styles/tokens.css` 中的变量（例如 `var(--ds-space-4)`）。
- **典型布局**：页面顶层用 `el-card` + `padding`；筛选区用 `el-form inline`；详情编辑优先用 `el-drawer` / `el-dialog` 避免跳转。

## 6. 安全性约束

- **防范 XSS 攻击**：Vue 的双大括号 `{{ }}` 默认是安全的。但如果必须渲染富文本或 Markdown 内容，**严禁直接使用 `v-html` 渲染不可信数据**。任何传入 `v-html` 的数据必须经过 `DOMPurify` 等库进行彻底消毒。
- **敏感数据输出**：生产环境下构建会自动剥离 `console.log`，但在开发中仍需注意，不要在控制台或前端组件中打印包含真实密码、Token 或核心密钥的对象。
