# Pix Space Agent Entry

本项目采用：

- Root Rules
- Local AGENTS
- Workflow Prompt

混合规则体系。

## 全局规则入口

优先阅读：

- `.trae/rules/user_rules.md` - 用户长期协作偏好
- `.trae/rules/project_rules.md` - 项目级硬规则

## Workflow Prompt

按任务类型读取：

- 新功能开发：`prompts/feature.md`
- Bug 修复：`prompts/bugfix.md`
- Code Review：`prompts/code-review.md`

## 模块级规则

处理具体模块时，应优先读取附近 AGENTS.md。

### API 层

- `src/api/AGENTS.md`

### 组件层

- `src/components/AGENTS.md`

### 组合逻辑层

- `src/composables/AGENTS.md`

### 样式层

- `src/styles/AGENTS.md`

### 视图层

- `src/views/AGENTS.md`
- `src/views/admin/AGENTS.md` - 后台管理页面规范
- `src/views/explore/AGENTS.md` - 探索发现页面规范

### 文档

- `docs/AGENTS.md`
