# Pix Space - 素材图库 C 端前台设计方案

## 元信息

- Status：implemented
- 目标读者：产品、前端、后端、设计
- 最后对齐：2026-06-09
- 权威入口：无；当前实现以本文 Entry points、相关原型与代码为准
- 范围：前台最小可行版本；不包含后台重构细节
- 主要改动点：引入 `PortalLayout.vue` 与相关路由结构调整，新增瀑布流浏览与图片详情交互；搜索作为发现页的“结果状态”落在 `/explore` 内
- Entry points：`src/layouts/PortalLayout.vue`、`src/layouts/AdminLayout.vue`、`src/router/index.ts`、`src/views/portal/explore/index.vue`、`src/views/portal/account/index.vue`、`src/views/portal/image-detail/index.vue`、`src/views/portal/user-boards/index.vue`、`src/views/portal/board-detail/index.vue`
- Acceptance checklist：按路由入口手工验收 + 关键页面补充最小端到端测试（如有）

## 1. 当前定位

当前代码已经落地为“双入口”结构：

- **Portal**：面向内容浏览与轻量交互，统一挂在 `/` 下并由 `PortalLayout.vue` 承载
- **Admin**：面向管理操作，统一挂在 `/admin` 下并由 `AdminLayout.vue` 承载

本方案只描述 Portal 侧已经实现的主路径与页面关系，不再保留“将来会如何改造”的叙述。

## 2. 已落地的体验约束

- **视觉优先**：Portal 主界面以图片流、留白、卡片层级为核心，避免后台式密集表格交互
- **渐进式浏览**：发现页先提供连续浏览与预览弹层，再允许进入独立详情页
- **路由清晰**：发现、详情、个人中心与画板详情分别对应独立路由或 query 状态，避免在单页内堆叠过多职责
- **布局分层**：Portal 与 Admin 的布局、菜单与权限逻辑严格分层

## 3. 已落地的信息架构

### 3.1 布局与全局入口

- `src/layouts/PortalLayout.vue`
  - 左侧品牌入口，点击回到 `/`
  - 中间全局搜索框，通过回车与 clear 驱动 `/explore` 的 query 状态
  - 右侧头部操作区，由 `PortalHeaderActions.vue` 承载上传与用户相关入口
- `src/layouts/AdminLayout.vue`
  - 保持后台导航与管理能力，不复用 Portal 的浏览式头部结构

### 3.2 页面与路由

1. **发现页（`/explore`）**
   - 作为 Portal 默认首页；`/` 会重定向到 `/explore`
   - 承载发现态与搜索态两种内容结构
2. **搜索结果（`/explore?q=...`）**
   - 仍由发现页承载，不单独拆出 `/search`
   - 支持 `sort`、`tag` query 形成结果态
3. **图片详情（`/image/:id`）**
   - 用于分享与深度查看
4. **个人中心（`/account`）**
   - 登录后可访问
5. **公开用户画板（`/u/:userId/boards`）**
   - 作为作者主页/画板入口
6. **画板详情（`/board/:id`）**
   - 展示单个画板内容

### 3.3 发现页交互层

发现页当前采用“列表浏览 + 预览弹层 + 独立详情页”的三级结构：

- 列表层：在 `/explore` 浏览卡片流
- 预览层：点击卡片后打开 `ImagePreviewDialog.vue`
- 深入层：在弹层或卡片入口点击“查看详情”后跳转 `/image/:id`

## 4. 当前实现要点

- **搜索承载方式**：全局搜索框通过 `usePortalSearch` 与路由 query 同步，发现态与搜索态共享同一路由
- **发现页拆分**：`src/views/portal/explore/` 已按头部、内容区、预览交互与页面私有 composable 拆分，不再由单一页面文件承载全部逻辑
- **数据来源**：发现数据统一走 `src/api/explore.ts`，Mock 单一来源为 `src/mocks/explore.ts`
- **预览能力**：图片预览弹层已支持上一张/下一张、缩放、旋转、下载与跳详情
- **主题约束**：Portal 侧继续消费现有 token 与 `--el-*` 主题链路，不单独引入一套视觉主题体系

## 5. 不在本文负责范围

以下内容如果后续落地，应另行更新对应 spec，而不是继续在本文以愿景方式并列维护：

- 图片审核后台细节
- 投稿审批流细节
- 高级推荐算法与相似图片
- 在线裁切、复杂编辑能力
- 多规格下载策略
