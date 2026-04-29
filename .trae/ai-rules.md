# AI 开发规则与约定索引

本文件是 AI 在此项目中的全局指导方针。

## 1. 核心硬护栏（必须遵守）

**通用**

- **安全红线**：绝不输出、记录或提交任何密钥/Token/密码/个人隐私数据。
- **杜绝幻觉**：遇到不确定的代码逻辑、接口协议或命令，必须先使用搜索工具查阅项目代码或现有文档；无法确认时必须询问用户，严禁编造。
- **最小化变更**：不做与当前任务无关的重构，不随意引入新的 npm 依赖（如必须引入，需说明原因并得到确认）。
- **同步更新**：修改公共行为或 API 时，必须同步更新相关使用文档或类型声明。
- **严格遵循技术栈**：本项目为 Vue 3 + Element Plus。严禁重新发明轮子，能用 `el-xxx` 解决的绝对不用原生 HTML/CSS 手捏。
- **Design Token 硬约束**：涉及间距/颜色/圆角/阴影时，必须优先使用 `src/styles/tokens.css` 的变量；如 tokens 不覆盖，必须先提出新增并等待确认后才能使用新值。

**Git 与提交**

- **不要擅自提交**：没有明确的指令，不要自行执行 commit 或 push。
- **提交前确认**：每次执行 commit 前，必须先列出将要提交的文件清单与 commit message，待用户明确回复“执行”后才允许提交。
- **提交信息语言**：如果没有特殊说明，以后生成 git commit message 的 description 时均使用中文。
- **禁止改写历史**：除非用户明确要求，不执行 `commit --amend`、rebase、reset（任何形式）、`push --force` 等会改写历史的操作。
- **提交粒度**：尽量保持一次 commit 对应一个清晰的意图；需要拆分时优先拆分后再提交。

## 2. 约定索引（按需加载）

只有在处理具体相关任务时，再阅读以下对应文档，**不要将所有约定全文带入上下文**：

**架构与视图层规范**

- 前端综合规范（架构地图、Vue3 组件、样式、Element Plus 约束）：[`docs/FRONTEND_SPEC.md`](docs/FRONTEND_SPEC.md)

**业务与流程规范**

- 新增页面与原型工作流：[`design/pencil/README.md`](design/pencil/README.md)
- API 契约与接口开发：[`src/api/README.md`](src/api/README.md)
- 请求错误处理策略：[`src/utils/README.md`](src/utils/README.md)
- Mock 数据规范：[`src/mocks/README.md`](src/mocks/README.md)

## 3. 高频任务剧本

当收到以下类型的任务指令时，请主动读取 `prompts/` 目录下对应的剧本以规范工作流（如先沟通、后出方案、再执行）：

- 开发新页面/新功能：[`prompts/feature.md`](prompts/feature.md)
- Bug 修复：[`prompts/bugfix.md`](prompts/bugfix.md)
- Code Review：[`prompts/code-review.md`](prompts/code-review.md)
