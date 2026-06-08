# 新功能开发工作流

当你收到开发新页面、新功能的任务时，请严格按以下步骤工作：

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 1. 确认语境（必须执行）

先按根入口读取规则（如果尚未读取）：

- `AGENTS.md`

然后再补充读取：

- 对应领域的 README / 规范（例如新增接口时阅读 `src/api/README.md`）
- 当前目录最近的 `AGENTS.md`

## 2. 澄清问题（先问再做）

如果用户需求不清晰，向用户澄清：

1. 功能边界与“不做什么”？
2. 关键状态：空数据、加载中、失败、成功分别怎么表现？
3. 权限可见性是否有限制？

## 3. 制定方案

在输出代码前，先输出一个简短的方案：

- **目标**：一句话概括
- **拆解**：涉及修改/新增的组件、API、路由、状态（列表展示）
- **复用评估**：说明哪些可以复用已有的 Element Plus 组件或 composables，绝不重复造轮子。

## 4. 执行与验证

- MUST：在改代码前先列出“同步更新项”（避免漏改）：
  - 涉及 API：同步更新 `src/api/*` 类型与封装、`src/mocks/*`、以及相关 README（`src/api/README.md`、`src/utils/README.md`、`src/mocks/README.md`）
  - 涉及样式/主题：优先更新 `src/styles/tokens.css`；全局覆盖仅允许集中放在 `src/styles/`，并遵守 `src/styles/AGENTS.md`
  - 涉及路由/权限：同步检查 `meta.roles` 与 `canAccess` 约定，避免在布局散落条件渲染
- MUST：遵循工程自动导入规则：新增代码不得手动导入 Vue 核心 API 与 Element Plus 组件（以现有工程配置为准）。
- MUST：如必须新增 npm 依赖，先按 `docs/DEPENDENCY_POLICY.md` 提供评审信息并等待确认。
- 修改代码，严格遵守 Vue 3 `<script setup>` 和 Element Plus 规范。
- 完成后，提供可验证的入口或命令行，并给出测试建议。
- MUST：优先给出与 CI 等价的验证方式（脚本单一事实来源见 `CONTRIBUTING.md`，如 `npm run test` 或 `npm run test:all`）。

说明：

- 本文件只补充“新功能开发”工作流，不替代 `AGENTS.md` 与根规则
