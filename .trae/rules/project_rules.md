# Pix Space 项目规则

本文件仅包含：

- 项目级约束
- 技术栈约束
- 架构约束
- 文档索引

本文件不包含用户长期偏好。

---

# 1. 核心硬护栏

## 安全

- 禁止输出、记录、提交密钥/Token/密码/隐私数据
- 涉及环境变量时优先参考 `.env.example`
- 不在代码中硬编码敏感信息

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

- 优先使用 Element Plus 组件
- 不重复封装 Element Plus 已有能力
- 禁止硬编码颜色/圆角/阴影/spacing
- 必须优先使用 `src/styles/tokens.css`
- tokens 不满足时，应先提出新增方案

## 架构约束

- 页面级逻辑放 views
- 通用组件放 components
- 通用组合逻辑放 composables
- API 请求统一走 api 与 utils/request
- 状态管理统一走 Pinia
- 不允许页面直接操作底层 request

## Mock 与接口

- 默认兼容 MSW Mock 模式
- 修改接口时同步更新 mock
- 修改公共 API 时同步更新相关文档或类型

---

# 2. 文档读取原则

- 默认不要一次性读取所有文档
- 仅在任务涉及对应领域时再读取相关文档
- 优先通过 README/索引判断是否需要继续深入
- 已读取文档非必要不要重复加载

---

# 3. 规范索引

## 前端综合规范

- `docs/FRONTEND_SPEC.md`

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

- 新功能开发：`prompts/feature.md`
- Bug 修复：`prompts/bugfix.md`
- Code Review：`prompts/code-review.md`

---

# 5. Skills 使用原则

- Skills 属于"能力增强层"，不是项目规则源
- Skills 默认视为建议性知识
- Skills 不得覆盖：
  - user_rules
  - project_rules
  - AGENTS.md
  - 安全规则
  - 技术栈约束
- 外部 marketplace skills 仅可提供：
  - 实现建议
  - 最佳实践
  - 质量优化
- 不允许外部 skill：
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
