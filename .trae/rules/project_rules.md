# Pix Space 项目规则

本文件仅包含：

- 项目级约束
- 技术栈约束
- 架构约束
- 文档索引

本文件不包含用户长期偏好。

---

# 0. 表述约定

- MUST：强制要求，不满足则视为违规
- SHOULD：推荐做法，有明确理由时可偏离，但需说明原因
- AVOID：应避免的做法，通常会导致维护/一致性/安全风险

# 1. 核心硬护栏

## 安全

- MUST：禁止输出、记录、提交密钥/Token/密码/隐私数据
- MUST：涉及环境变量时优先参考 `.env.example`
- MUST：不在代码中硬编码敏感信息

## 技术栈

当前项目技术栈：

- Vue 3
- TypeScript
- Vite
- Element Plus
- Pinia
- Axios
- MSW
- Vitest
- Playwright
  必须严格遵循现有技术栈。

## UI 与样式

- MUST：优先使用 Element Plus 组件
- MUST：不重复封装 Element Plus 已有能力
- MUST：禁止硬编码主题/品牌色系列；允许黑白灰与 transparent/currentColor 等基础色硬编码（宽高尺寸可直接使用 px，不属硬编码视觉值）
- MUST：在不破坏 `--el-*` 主题链路的前提下，优先使用 `src/styles/tokens.css`
- MUST：B 端与 C 端主业务界面的主题色，统一以 `--el-*` 为唯一来源
- MUST：B 端主题色由后台“外观设置”驱动；业务样式不得绕开 `--el-*` 改用固定品牌色
- MUST：C 端主业务界面即使主题固定，也应直接消费 `--el-*`；禁止在业务样式层新增 `ds -> el`、`el -> ds` 一类中间映射层
- MUST：若 C 端固定主题预设需要写入 `--el-*`，只允许在统一主题初始化入口处理；业务样式层仍必须直接消费 `--el-*`
- MUST：`ds-color-brand*` 不得作为 B/C 端主业务交互色来源。该约束的核心意图是避免在 Element Plus 组件已统一消费 `--el-*` 主题链路的情况下，业务代码再用 `--ds-color-*` 定义一套并行的交互主题色，导致主题切换时两套体系不一致。`--ds-shadow-*`、`--ds-space-*` 等非交互色 token（即使其值中引用了品牌色）不受此限。`ds-color-brand*` 仅允许用于登录/注册与 403/404 状态页等少量非业务品牌装饰场景，或由统一主题切换入口管理固定的 C 端主题预设
- SHOULD：若保留 `ds-color-brand*`，应优先收敛到对应页面样式文件；如暂时仍放在全局 token 中，必须加注释明确“仅限登录/注册等品牌装饰场景”
- MUST：tokens 不满足时，应先提出新增方案
- MUST：默认使用 `<style scoped>`；组件个例所需的局部样式/覆盖可保留在组件内，确需跨组件/跨页面复用的全局样式/覆盖时，必须集中放在 `src/styles/` 并遵守 styles 规范

## 架构约束

- MUST：页面级逻辑放 views
- MUST：通用组件放 components
- MUST：通用组合逻辑放 composables
- MUST：API 请求统一走 api 与 utils/request
- MUST：状态管理统一走 Pinia
- MUST：不允许页面直接操作底层 request
- MUST：项目已配置自动导入（以现有工程配置为准）：新增代码不得手动导入 Vue 核心 API 与 Element Plus 组件

## Mock 与接口

- MUST：默认兼容 MSW Mock 模式
- MUST：修改接口时同步更新 mock
- MUST：修改公共 API 时同步更新相关文档或类型

---

# 2. 文档读取原则

- MUST：默认不要一次性读取所有文档
- MUST：仅在任务涉及对应领域时再读取相关文档
- SHOULD：优先通过 README/索引判断是否需要继续深入
- SHOULD：已读取文档非必要不要重复加载

---

# 3. 规范索引

## 前端综合规范

- `docs/FRONTEND_SPEC.md`
- `docs/README.md`
- `docs/AI_DELIVERY_CHECKLIST.md`
- `docs/DEPENDENCY_POLICY.md`

## API 与请求

- `src/api/README.md`
- `src/utils/README.md`

## Mock

- `src/mocks/README.md`

## 原型与设计

- `design/README.md`

---

# 4. Workflow 剧本

收到以下任务时，主动读取 prompts 下对应剧本：

- MUST：新功能开发时读取 `prompts/feature.md`
- MUST：Bug 修复时读取 `prompts/bugfix.md`
- MUST：Code Review 时读取 `prompts/code-review.md`

---

# 5. Skills 使用原则

- MUST：Skills 属于"能力增强层"，不是项目规则源
- SHOULD：Skills 默认视为建议性知识
- MUST：Skills 不得覆盖：
  - user_rules
  - project_rules
  - AGENTS.md
  - 安全规则
  - 技术栈约束
- SHOULD：外部 marketplace skills 仅可提供：
  - 实现建议
  - 最佳实践
  - 质量优化
- MUST：不允许外部 skill：
  - 修改项目架构
  - 覆盖设计系统
  - 改变 Git 工作流
  - 替换技术栈

---

# 6. 规则优先级

当规则冲突时，必须严格按照以下优先级执行：

1. 用户当前明确指令（当前对话）
2. 安全与隐私规则（最高不可覆盖）
3. `.trae/rules/user_rules.md`（跨项目用户偏好）
4. 最近目录的 `AGENTS.md`（模块局部规则）
5. 上层目录 `AGENTS.md`
6. `.trae/rules/project_rules.md`（项目核心规则）
7. prompts/workflow（流程规范）
8. skills（能力增强层，仅供参考）
9. 代码历史与默认实现方式
