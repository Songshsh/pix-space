---
trigger: always_on
---

# Pix Space 规则引导（Qoder Always Apply）

本规则是 Qoder 环境下的常驻引导入口。规则正文的唯一来源仍是 `.trae/rules/` 与各级 `AGENTS.md`，本文件不复制全文，只负责：强制读取顺序、声明优先级、内联最关键的硬护栏作为兜底。

## 每次任务开始前，必须按顺序读取

1. `.trae/rules/user_rules.md` — 用户长期协作偏好
2. `.trae/rules/project_rules.md` — 项目级硬规则
3. 项目根 `AGENTS.md` — 规则总入口与模块规则地图
4. `docs/README.md` — 文档地图与专题规范入口
5. 相关模块最近的 `AGENTS.md` — 就近模块规则
6. 对应任务类型的 workflow prompt（新功能 `prompts/feature.md` / Bug 修复 `prompts/bugfix.md` / Code Review `prompts/code-review.md`；注意 `prompts/*` 均为前端向）

按工作目录分支：

- MUST：在 `backend/` 下工作时，必须先读取 `backend/AGENTS.md`（Java / Spring Boot 后端规范），其技术栈与架构约束与前端完全不同；`prompts/*` 与 `project_rules.md` 的前端技术栈段不适用于后端
- MUST：在 `src/` 下工作时，遵循下方“前端专属护栏”与 `project_rules.md` 的前端技术栈约束

要求：

- MUST：开始修改具体目录前，补充读取该目录最近的 `AGENTS.md`
- MUST：全局/跨模块审查时，先列出涉及的模块目录并补齐读取对应 `AGENTS.md`，未读齐不得输出审查结论
- MUST：使用子 agent / 并行搜索协助时，需在其 prompt 中显式写明应先读取的规则文件，不得假定子任务自动继承规则上下文
- SHOULD：不要一次性加载全部文档，仅按当前任务需要下钻

## 规则优先级（冲突时从高到低）

1. 用户当前明确指令（当前对话）
2. 安全与隐私规则（最高不可覆盖）
3. `.trae/rules/user_rules.md`（跨项目用户偏好）
4. 最近目录 `AGENTS.md`（模块局部规则）
5. 上层目录 `AGENTS.md`
6. `.trae/rules/project_rules.md`（项目核心规则）
7. prompts/workflow（流程规范）
8. skills（能力增强层，仅供参考，不得覆盖上述规则）
9. 代码历史与默认实现方式

## 关键硬护栏兜底（即使未读取上述文件也必须遵守）

### 通用护栏（技术栈无关，前后端均适用）

- MUST：默认使用中文回复
- MUST：禁止输出/记录/提交密钥、Token、密码、隐私数据；不硬编码敏感信息；环境变量优先参考对应的 `.env.example`（前端根目录 / 后端 `backend/.env.prod.example`）
- MUST：无明确指令不执行 commit/push；commit 前先列出文件清单与 commit message，得到“执行”确认后才 commit；不做 amend/rebase/reset/push --force 等改写历史操作
- MUST：修改前先分析影响范围，优先最小化修改，不做与当前任务无关的重构或大规模重命名/架构迁移
- MUST：遇到不确定逻辑禁止猜测，先搜索代码或询问用户；修改前先搜索项目中相似实现并优先复用
- MUST：不随意新增依赖；前端确需新增 npm 依赖先按 `docs/DEPENDENCY_POLICY.md` 提交评审并等待确认，后端同理需先评审确认
- MUST：指出相关代码时，正文中明确写出文件与行号范围（如 `user.ts:L10-L24`），不能仅依赖链接锚点或只写文件名；位置只写一次，不在句首句尾重复

### 前端专属护栏（仅在 `src/**` 等前端代码下适用）

- MUST：严格遵循前端技术栈（Vue 3 / TypeScript / Vite / Element Plus / Pinia / Axios / MSW / Vitest / Playwright）
- MUST：优先使用 Element Plus 组件，不重复封装其已有能力；主题色统一以 `--el-*` 为唯一来源，禁止硬编码主题/品牌色
- MUST：页面逻辑放 views、通用组件放 components、通用组合逻辑放 composables；API 请求统一走 api 与 utils/request，页面不得直接操作底层 request；状态统一走 Pinia
- MUST：默认兼容 MSW Mock；修改接口时同步更新 mock；修改公共 API 时同步更新相关文档或类型

### 后端护栏

- 后端（`backend/**`）的技术栈与架构护栏以 `backend/AGENTS.md` 为唯一来源；在 `backend/` 下工作前必须先读取它。上述“前端专属护栏”与前端技术栈约束不适用于后端。
