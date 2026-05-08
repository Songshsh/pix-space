# Pix Space - Explore 发现与搜索（portal-explore.pen 严格转码）设计方案

## 元信息

- 状态：草稿
- 目标读者：产品、前端、设计
- 单一事实来源：`design/portal-explore.pen`
- 范围：仅 C 端前台 `/explore` 发现态与搜索态；不包含详情页、上传流程与真实接口对接
- 相关代码：`src/layouts/PortalLayout.vue`、`src/views/explore/index.vue`、`src/router/index.ts`
- 验收方式：手工验收（对照 pen 的布局与样式）+ 关键交互最小测试

## 1. 目标

- 将 `portal-explore.pen` 中的发现页与搜索结果页，严格映射到当前项目的 Vue + Element Plus 代码实现
- 路由保持单页：`/explore`，通过 query 参数表达搜索态
- 顶部搜索框与页面内容联动，形成可复现、可刷新恢复的 UI 状态

## 2. 信息架构与路由

### 2.1 路由

- 页面路由：`/explore`
- 发现态：无 `q` 参数，或 `q` 为空字符串
- 搜索态：`/explore?q=<关键词>`

### 2.2 搜索框行为（全局 Header）

- 输入框组件：继续使用 `PortalLayout.vue` 内的 `el-input`
- 触发搜索：
  - 用户在输入框回车（Enter）时，将输入值写入 URL：`/explore?q=...`
- 退出搜索态：
  - 用户点击输入框的 clear（Element Plus 的 clearable）时，移除 `q`，回到发现态：`/explore`
- 与 pen 差异：
  - 搜索态顶部区域不提供额外“清除”按钮（仅保留输入框自带 clear）

## 3. 发现态（对应 pen: C端前台 - 发现页）

### 3.1 页面结构

- 类目 tags（位于主内容区顶部）
  - 默认激活：`全部`
  - 视觉：激活态深色 pill，未激活态白底+浅灰描边
- 瀑布流 Masonry
  - 5 列布局（桌面端）
  - 卡片结构
    - 顶部图片占位块（纯色填充模拟）
    - 标题
    - tags badge（浅灰底小字号）
    - 作者 avatar + 名称

### 3.2 交互

- 点击类目 tag：仅改变激活态（mock 版本可不改变数据集，仅用于样式验收）
- 点击卡片：本范围内不实现跳转或弹层，仅保留 hover/可点击态

## 4. 搜索态（对应 pen: Explore/搜索结果）

### 4.1 页面结构

- Result Bar
  - 标题：`“<q>”`
  - 结果数：mock 文案形如 `共 2,431 个结果`
  - 排序切换：最新 / 最热（右侧 pill 组）
- 二级 tags（与发现态 tags 不同）
  - 默认激活：`全部`
  - 选项集合以 pen 为准：`全部`、`极简主义`、`排版`、`品牌设计`、`电商`、`其它`
- Related Search（相关搜索条）
  - 标题：`相关搜索`
  - chips 以 pen 为准：`设计系统`、`UI组件库`、`Dashboard`、`移动端界面`
- 瀑布流 Masonry
  - 复用发现态卡片 UI，但整体布局与间距需对齐 pen 搜索结果页

### 4.2 状态与参数（建议）

- `q`：搜索关键词（进入搜索态的唯一条件）
- `sort`：排序（`newest` | `hot`）
  - 默认：`newest`
  - 选中态：深色 pill
- `tag`：二级 tag（字符串）
  - 默认：`全部`
- Related Search chip 点击：
  - 直接将 chip 文案写入 `q`，刷新搜索态（仍停留 `/explore?q=...`）

## 5. 视觉与样式对齐要求

- 背景色：实现时映射 `src/styles/tokens.css`（如 `--ds-color-bg-tertiary`）
- Header：`64px` 高度，白底 + 轻阴影（如 `--ds-shadow-1`）
- 搜索框：宽 `800px`，高 `40px`，圆角使用 `--ds-radius-pill`，底色使用 `--ds-color-bg-secondary`
- tags pill：高 `32px`，圆角使用 `--ds-radius-pill`
- 卡片：白底、圆角使用 `--ds-radius-3`、阴影使用 `--ds-shadow-1`；hover 上移与阴影增强

## 6. 实现拆分建议

- `src/layouts/PortalLayout.vue`
  - 负责输入框的 URL 同步（Enter 写入 q；clear 清空 q）
- `src/views/explore/index.vue`
  - 通过 `route.query.q` 判断发现态/搜索态
  - 发现态与搜索态采用条件渲染，但复用同一套 masonry 卡片与样式体系

## 7. 验收清单

- `/explore`：与 pen 发现页在布局、间距、圆角、阴影、字体大小上保持一致
- Header 搜索框：
  - 输入关键词并回车：URL 变为 `/explore?q=...`，页面切换到搜索态结构
  - 点击 clear：回到 `/explore` 发现态结构
- 搜索态：
  - Result Bar / 排序 / 二级 tags / 相关搜索 / 瀑布流均可见
  - 不出现额外“清除”按钮
