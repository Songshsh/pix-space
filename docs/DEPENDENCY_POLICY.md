# 新增依赖评审确认（单一事实来源）

本文件用于约束与规范 Pix Space 中的 npm 依赖变更（新增/升级/替换），避免技术栈漂移、体积膨胀与安全风险。

## 0. 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 1. 适用范围

- MUST：新增任意 `dependencies` / `devDependencies`（包含运行时与开发期依赖）
- MUST：升级现有依赖的主版本（major）
- SHOULD：替换同类依赖（例如替换请求库、状态库、UI 组件库、测试框架）
- SHOULD：引入运行时 polyfill、DOM 解析/渲染类依赖（安全风险较高）

## 2. 提交评审前必须提供的信息（模板）

- 依赖名称与版本：`<name>@<version>`（是否锁定版本）
- 依赖类型：运行时依赖 / 开发依赖
- 使用场景与触发点：在哪些页面/模块会用到（给出入口文件或路由）
- 替代方案对比：
  - 现有项目能力是否已覆盖（优先复用现有库/Element Plus/内置能力）
  - 不引入依赖的实现方案是否可行（并说明为何不选）
- 风险评估：
  - 体积影响（预估是否引入大型运行时代码、是否树摇友好）
  - 安全影响（是否接触不可信输入、是否涉及 `v-html`、是否涉及解析 HTML/Markdown）
  - 维护影响（社区活跃度、更新频率、是否容易被替代/弃用）
  - License（与项目兼容）
- 验证计划（至少一项）：
  - `npm run test`（CI 等价）
  - 需要时补充：`npm run test:unit` / `npm run test:e2e` / `npm run build`
- 回滚方案：如何在需要时撤销（移除依赖 + 删除使用点 + 验证通过）

## 3. 默认拒绝项（不通过的常见情况）

- MUST：引入会替换或绕开项目技术栈约束的依赖（例如替换 Vue/Pinia/Axios/Vitest/Playwright/Element Plus）
- MUST：引入重复能力依赖（例如已有 Element Plus 能覆盖，但仍引入另一个 UI 组件库）
- MUST：引入会导致样式体系漂移的依赖（破坏 `src/styles/tokens.css` 的约束或引入大量硬编码样式）
- MUST：引入会增加不可信 HTML 渲染面（例如直接渲染外部输入 HTML/Markdown 且无可靠消毒策略）
- MUST：无法说明“为何必须引入”或无法提供最小验证口径

## 4. 通过标准（验收口径）

- MUST：变更聚焦，仅包含本次依赖引入所需的最小代码改动
- MUST：不破坏现有目录职责与分层约束（views/components/composables/api/utils/stores）
- MUST：通过 `npm run test`
- SHOULD：对新增依赖的使用范围保持可控（集中封装、避免在视图模板中散落调用）
- SHOULD：提供至少一个“可验证入口”（路由、按钮、脚本或复现步骤）

## 5. 申请示例（可直接复制）

```md
- 依赖：xxx@1.2.3（运行时/开发）
- 目的：用于……
- 入口：src/xxx/yyy.ts 或 /admin/xxx
- 替代方案：
  - 方案 A（不引入依赖）：……
  - 方案 B（复用现有库）：……
  - 选择原因：……
- 风险：
  - 体积：……
  - 安全：……
  - 维护：……
  - License：……
- 验证：
  - npm run test
  - （可选）npm run test:e2e / npm run build
- 回滚：……
```
