# Pix Space - Explore 发现与搜索（基于历史原型 `portal-explore.pen` 严格转码）设计方案

## 元信息

- Status：implemented
- 目标读者：产品、前端、设计
- 最后对齐：2026-06-09
- 权威入口：无；当前实现以本文 Entry points、原型文件与代码为准
- 单一事实来源：`design/portal-explore.pen`（历史原型文件名）
- 范围：仅 C 端前台 `/explore` 发现态与搜索态；包含图片预览弹层与详情跳转入口；不包含上传流程
- Entry points：`src/layouts/PortalLayout.vue`、`src/views/portal/explore/index.vue`、`src/views/portal/explore/useExploreView.ts`、`src/views/portal/explore/useExplorePreview.ts`、`src/views/portal/explore/ExploreMasonrySection.vue`、`src/components/portal/ImagePreviewDialog.vue`、`src/api/explore.ts`、`src/mocks/explore.ts`、`src/router/index.ts`
- Acceptance checklist：手工验收（对照 pen 的布局与样式）+ 关键交互最小测试

## 1. 目标

- 将 `portal-explore.pen` 中的发现页与搜索结果页，严格映射到当前项目的 Vue + Element Plus 代码实现
- 路由保持单页：`/explore`，通过 query 参数表达搜索态
- 顶部搜索框与页面内容联动，形成可复现、可刷新恢复的 UI 状态

## 2. 信息架构与路由

### 2.1 路由

- 页面路由：`/explore`
- 首页入口：`/` 重定向到 `/explore`
- 发现态：无 `q` 参数，或 `q` 为空字符串
- 搜索态：`/explore?q=<关键词>`
- 结果筛选：`/explore?q=<关键词>&sort=<newest|hot>&tag=<标签>`

### 2.2 搜索框行为（全局 Header）

- 输入框组件：`PortalLayout.vue` 中的 `el-input`
- 状态同步：由 `usePortalSearch` 负责和当前路由 query 双向同步
- 触发搜索：用户回车后进入 `/explore?q=...`
- 退出搜索态：点击 clear 后移除 `q`，回到 `/explore`
- 与 pen 差异：搜索态顶部不额外提供单独“清除”按钮，统一复用 Header 输入框 clear

## 3. 发现态（对应 pen: C端前台 - 发现页）

### 3.1 页面结构

- 发现态头部：由 `ExploreDiscoverHeader.vue` 渲染
- 类目 tags：
  - 默认激活：`全部`
  - 当前实现用于本地筛选发现流内容
- 瀑布流内容区：由 `ExploreMasonrySection.vue` 承载
- 卡片结构：
  - 图片或占位块
  - 标题
  - tags
  - 作者信息

### 3.2 状态与交互

- 数据加载：由 `useExploreView.ts` 统一拉取 `getExploreData({ silentError: true })`
- 发现态类目：通过本地筛选 `filteredItems` 生效，而非只做样式切换
- 点击卡片：打开图片预览弹层，保持浏览流连续
- 点击作者：跳转 `/u/:userId/boards`
- 点击“查看详情”：跳转 `/image/:id`
- 页面状态：`loading`、`error`、`empty`、`success`

## 4. 搜索态（对应 pen: Explore/搜索结果）

### 4.1 页面结构

- 搜索态头部：由 `ExploreSearchHeader.vue` 渲染
- Result Bar：
  - 当前关键词
  - 基于 `filteredItems.length` 的结果数
  - 排序切换：`newest` / `hot`
- 二级 tags：
  - 选项集合来自接口返回的 `searchTags`
  - 默认激活：`全部`
- Related Search：
  - 数据来自接口返回的 `relatedSearches`
- 瀑布流：
  - 与发现态复用 `ExploreMasonrySection.vue`

### 4.2 状态与参数

- `q`：搜索关键词；是否进入搜索态只取决于 `q`
- `sort`：排序（`newest` | `hot`），默认 `newest`
- `tag`：搜索态二级标签，默认 `全部`
- 相关搜索点击：通过 `setSearchQuery()` 直接覆写 `q`
- 重试：错误态下通过 `retrySearch()` 重新请求数据

## 5. 视觉与样式对齐要求

- 背景色：Portal 布局使用 `--ds-color-bg-tertiary`
- Header：`64px` 高度，白底 + `--ds-shadow-1`
- 搜索框：最大宽度 `800px`，高度 `40px`，圆角使用 `--ds-radius-pill`
- tags pill：圆角使用 `--ds-radius-pill`
- 卡片：白底、圆角和阴影沿用现有 token；hover 保持轻量位移与阴影增强

## 6. 实现拆分

- `src/layouts/PortalLayout.vue`
  - 承载全局搜索框、头部操作区与 Portal 页面布局
- `src/views/portal/explore/index.vue`
  - 只负责组装发现态头部、搜索态头部、内容区与预览弹层
- `src/views/portal/explore/useExploreView.ts`
  - 负责数据请求、query 同步、筛选、排序、空加载错误状态
- `src/views/portal/explore/useExplorePreview.ts`
  - 负责预览弹层的打开、切换与详情跳转协同
- `src/views/portal/explore/ExploreDiscoverHeader.vue`
  - 渲染发现态类目区
- `src/views/portal/explore/ExploreSearchHeader.vue`
  - 渲染搜索态结果栏、排序与 related search
- `src/views/portal/explore/ExploreMasonrySection.vue`
  - 统一承载卡片流与空/错/加载反馈
- `src/components/portal/ImagePreviewDialog.vue`
  - 承接预览、缩放、旋转、下载、上一张/下一张与详情跳转
- `src/api/explore.ts`
  - Explore 统一请求入口
- `src/mocks/explore.ts`
  - Explore mock 数据与标签集合单一来源

## 7. 验收清单

- `/` 会重定向到 `/explore`
- Header 搜索框：
  - 输入关键词并回车：URL 变为 `/explore?q=...`
  - 点击 clear：回到 `/explore`
- 发现态：
  - 可切换类目并更新卡片流
- 搜索态：
  - Result Bar / 排序 / 二级 tags / 相关搜索 / 瀑布流均可见
  - 不出现额外“清除”按钮
- 内容区：
  - 支持 `loading`、`error`、`empty`、`success`
- 点击卡片：
  - 打开图片预览弹层
  - 支持上一张/下一张、缩放、旋转、下载、查看详情
