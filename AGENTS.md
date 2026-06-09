# Pix Space Agent Entry

本文件是项目规则的唯一总入口。
本文件面向 AI/Agent 与需要执行项目规则的人：只定义“规则读取顺序”和“就近规则入口”，不承载业务开发细则。
专题规范与方案文档统一从 [docs/README.md](docs/README.md) 进入。

本项目采用 Root Rules、Local AGENTS、Workflow Prompt 的混合规则体系，但读取顺序必须统一，禁止跳过本文件直接自行拼接规则。

## 全局规则入口

必须按以下顺序读取：

1. [.trae/rules/user_rules.md](.trae/rules/user_rules.md) - 用户长期协作偏好
2. [.trae/rules/project_rules.md](.trae/rules/project_rules.md) - 项目级硬规则
3. [docs/README.md](docs/README.md) - 文档地图与专题规范入口
4. 相关模块 `AGENTS.md` - 就近模块规则
5. 对应任务的 workflow prompt - 任务剧本补充

说明：

- [docs/AI_DELIVERY_CHECKLIST.md](docs/AI_DELIVERY_CHECKLIST.md) 仅用于交付前检查，不作为规则总入口
- `prompts/*.md` 仅补充任务流程，不替代根规则与模块规则
- 当规则冲突时，以优先级更高的文件为准（详见 [.trae/rules/project_rules.md](.trae/rules/project_rules.md)）

## Workflow Prompt

在完成“全局规则入口”后，再按任务类型读取：

- 新功能开发：[prompts/feature.md](prompts/feature.md)
- Bug 修复：[prompts/bugfix.md](prompts/bugfix.md)
- Code Review：[prompts/code-review.md](prompts/code-review.md)

说明：

- Workflow Prompt 负责任务步骤、输出结构、同步更新提醒
- Workflow Prompt 不应重复维护完整必读规则列表
- feature/bugfix 的通用同步更新项与验证最低口径见：[prompts/shared-checklist.md](prompts/shared-checklist.md)

## 全局/跨模块审查预检

当任务属于“全局审查”“跨模块审查”或一次性覆盖多个目录时，除“全局规则入口”外，还必须先完成以下预检：

1. 先列出本次实际涉及的模块目录
2. 按目录补齐读取对应的最近 `AGENTS.md`
3. 未完成上述读取前，不得输出审查结论

补充要求：

- MUST：若审查覆盖 `src/components/`、`src/composables/`、`src/router/`、`src/layouts/`、`src/stores/`、`src/views/`、`src/api/`、`src/utils/`、`src/mocks/`、`src/styles/`、`docs/`、`design/` 等目录，必须补齐读取对应目录的最近 `AGENTS.md`
- MUST：若使用 Task / 子 agent / 并行搜索协助审查，prompt 中必须显式写明需先读取的规则文件与输出格式要求；禁止假定子任务天然继承当前会话中的规则上下文
- MUST：输出全局审查结论时，应说明本次已补齐读取了哪些局部 `AGENTS.md`

## 模块级规则

处理具体模块时，必须优先读取附近 `AGENTS.md`。

### API 层

- [src/api/AGENTS.md](src/api/AGENTS.md)

### 请求与工具层

- [src/utils/AGENTS.md](src/utils/AGENTS.md)

### Mock 层

- [src/mocks/AGENTS.md](src/mocks/AGENTS.md)

### 组件层

- [src/components/AGENTS.md](src/components/AGENTS.md)

### 组合逻辑层

- [src/composables/AGENTS.md](src/composables/AGENTS.md)

### 路由层

- [src/router/AGENTS.md](src/router/AGENTS.md)

### 布局层

- [src/layouts/AGENTS.md](src/layouts/AGENTS.md)

### 状态层

- [src/stores/AGENTS.md](src/stores/AGENTS.md)

### 样式层

- [src/styles/AGENTS.md](src/styles/AGENTS.md)

### 视图层

- [src/views/AGENTS.md](src/views/AGENTS.md)
- [src/views/auth/AGENTS.md](src/views/auth/AGENTS.md) - 认证前页面规范
- [src/views/admin/AGENTS.md](src/views/admin/AGENTS.md) - 后台管理页面规范
- [src/views/portal/AGENTS.md](src/views/portal/AGENTS.md) - 前台门户页面规范
- [src/views/system/AGENTS.md](src/views/system/AGENTS.md) - 系统状态页规范

### 文档

- [docs/AGENTS.md](docs/AGENTS.md)

### 原型与设计

- [design/AGENTS.md](design/AGENTS.md)

## 使用方式

- 先读本文件，再进入根规则
- 确认任务类型后，再读取对应 `prompts/*.md`
- 开始修改具体目录前，再补充读取最近的模块 `AGENTS.md`
- 不要一次性加载所有文档；仅按当前任务需要下钻
