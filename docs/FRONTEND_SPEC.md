# 前端开发综合规范（Vue 3 + Element Plus）

本文件是项目中前端代码（视图、组件、样式与目录结构）的主要规范来源；接口契约与错误策略以 `src/api/README.md`、`src/utils/README.md` 为准。

## 0. 表述约定

- MUST：强制要求，不满足则视为违规
- SHOULD：推荐做法，有明确理由时可偏离，但需说明原因
- AVOID：应避免的做法，通常会导致维护/一致性/安全风险

## 1. 架构与目录职责

- **入口**：`src/main.ts` → `src/App.vue` → `src/router/index.ts` → 对应 layout / view
- `src/views/`：路由级页面，负责组合组件与调用逻辑，不写基础界面。
- `src/components/`：跨页面复用组件，接收 props 并 emit 事件。
- `src/composables/`：复用的业务逻辑与状态流。
- `src/api/` 与 `src/utils/request.ts`：纯接口请求，严禁包含界面逻辑。
- `src/stores/`：Pinia 全局状态。

**新增页面触点**：

1. `src/views/<domain>/index.vue`
2. `src/router/index.ts`（注册业务路由）
3. `src/api/<domain>.ts`（新增接口）
4. `src/mocks/handlers.ts`（如有需要）

## 2. Vue 3 编码约束

- MUST：使用 `<script setup>` 和 TypeScript。严禁将复杂业务逻辑、网络请求直接堆砌在视图层模板中。
- MUST：遵循自动导入规则（以现有工程配置为准；新增代码不要为了“统一风格”去重构历史文件）。
  - 项目已配置 `unplugin-auto-import` 和 `unplugin-vue-components`。
- SHOULD：新增代码优先复用自动导入能力，避免随意手动导入 Vue 核心 API（如 `ref`, `computed`, `watch`, `onMounted` 等）。
- SHOULD：新增代码优先复用自动导入能力，避免随意手动导入 Element Plus 组件与方法（如 `ElMessage`, `ElButton`, `ElTable` 等）。
- 允许手动导入的例外场景：
  - 类型导入
  - 入口文件与初始化代码
  - 自动导入未覆盖，或手动导入能显著提升可读性的少数场景
- **命名规范**：
  - 页面：`src/views/<domain>/index.vue`（例：`user-management/index.vue`）
  - 组件：`<Domain><Widget>.vue`（例：`UserTable.vue`）
  - 逻辑：`use<Domain><Verb>.ts`（例：`useUserDisplay.ts`）
- **数据流**：列表/看板类 GET 请求优先使用 `silentError: true`（错误策略定义见 [src/utils/README.md](../src/utils/README.md)），由页面自己渲染空状态；用户提交类请求交由底层统一 toast。

## 3. 路由与权限（入口与约定）

路由与菜单的权威来源：

- 路由定义：`src/router/index.ts`
- 受保护（后台）路由子路由：`src/router/index.ts` 中的后台 children 常量
- 权限判断：`src/utils/access.ts`（`canAccess` / 角色归一化）

页面入口（按访问者视角）：

- 前台（无需登录）
  - `/explore`：发现页
  - `/image/:id`：图片详情
  - `/u/:userId/boards`：个人画板
  - `/board/:id`：画板详情
- 后台（当前仅 `admin` 可访问）
  - `/admin/dashboard`：数据统计
  - `/admin/images`：图片管理
  - `/admin/files`：文件管理
  - `/admin/users`：用户管理
  - `/admin/settings`：系统设置

约定：

- 后台路由统一挂在 `/admin` 下，由 `AdminLayout.vue` 承载
- 前台路由统一挂在 `/` 下，由 `PortalLayout.vue` 承载
- 菜单项由 `src/router/index.ts` 中后台 children 的 meta 生成与过滤，避免在布局里散落 `v-if`
- `meta.roles` 存在时，必须通过 `canAccess(to.meta.roles, userRole)` 才允许访问；无权限统一跳转 `/403`

## 4. 状态管理与 Pinia 边界

- MUST：局部状态优先。仅在当前页面或组件使用的数据（如表单 `loading`、弹窗开关、局部列表数据、当前选中项），必须使用 `ref/reactive` 放在组件内部或 `src/composables/` 中。
- SHOULD：全局状态慎用。只有跨页面高频共享的数据（如用户信息、全局主题配置、权限路由、系统级配置）才允许存入 `src/stores/`（Pinia）。
- MUST：不要将某个业务模块的 CRUD 逻辑写在 Pinia store 中（易导致状态污染与难以测试）；优先用 composables（如 `useUserList.ts`）承接业务状态流。

## 5. 界面与样式约束

- MUST：优先使用 Element Plus (`el-card`, `el-table`, `el-dialog` 等)。能用内置 props / slots 解决的，避免手写原生 HTML/CSS。
- MUST：默认将组件样式写在 `<style scoped>` 中。
- SHOULD：需要全局样式/主题覆盖时，集中放在 `src/styles/` 下（例如 `src/styles/element-overrides.css`、`src/styles/auth-page.css`）；组件个例所需的局部覆盖可保留在组件内，但必须控制作用域，并遵守 [styles/AGENTS.md](../src/styles/AGENTS.md) 的约束。
- MUST：禁止魔法数字。间距、圆角、阴影，以及非主题主链路的颜色优先使用 `src/styles/tokens.css` 中的变量（例如 `var(--ds-space-4)`）。
- MUST：B 端与 C 端主业务界面的主题色统一以 `--el-*` 为唯一来源。
- MUST：B 端主业务界面的主题色跟随后台“外观设置”变化；不得把 `--el-*` 主题消费点替换成固定品牌色。
- MUST：C 端主业务界面即使当前主题固定，也应直接使用 `--el-*`；禁止在业务样式层引入 `ds -> el`、`el -> ds` 一类变量来回映射。
- MUST：若 C 端固定主题预设需要写入 `--el-*`，只允许在统一主题初始化入口处理（如 `src/utils/theme.ts`、`src/main.ts`）；业务样式层仍必须直接消费 `--el-*`。
- MUST：`ds-color-brand*` 不得用于 B/C 端主业务交互态（如 hover、active、selected、focus、主按钮、链接高亮等）；仅限登录/注册与 403/404 状态页等少量非业务品牌装饰场景使用，或由统一主题切换入口管理固定的 C 端主题预设。
- SHOULD：若 `ds-color-brand*` 只服务于登录/注册等页面，优先收敛到对应页面样式文件；如暂时仍保留在全局 token，必须在定义处注明适用范围。
- SHOULD：页面顶层用 `el-card` + `padding`；筛选区用 `el-form inline`；详情编辑优先用 `el-drawer` / `el-dialog` 避免跳转。

## 6. 安全性约束

- MUST：严禁直接使用 `v-html` 渲染不可信数据；任何传入 `v-html` 的数据必须经过可靠的消毒方案。如需引入 `DOMPurify` 等新依赖，需按“新增依赖评审确认”流程执行。
- MUST：不要在控制台或前端组件中打印包含真实密码、Token 或核心密钥的对象。
- SHOULD：新增依赖评审确认流程以 [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md) 为单一事实来源。
