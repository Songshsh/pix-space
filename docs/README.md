# 文档地图

本目录用于沉淀项目规范与方案文档。

## 读取顺序

- 规则总入口：[../AGENTS.md](../AGENTS.md)
- 根规则：`../.trae/rules/user_rules.md`、`../.trae/rules/project_rules.md`
- 专题规范：按当前任务读取下列文档
- 交付检查：[AI_DELIVERY_CHECKLIST.md](AI_DELIVERY_CHECKLIST.md)（仅交付前使用）

## 命名约定

- 项目对外写法统一为：Pix Space

## 规范与约定

- [FRONTEND_SPEC.md](FRONTEND_SPEC.md)：前端开发综合规范（架构、Vue 约束、样式、Element Plus 约束）
- [AI_DELIVERY_CHECKLIST.md](AI_DELIVERY_CHECKLIST.md)：AI 开发交付自检清单（同步更新项与最低验证口径）
- [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)：新增依赖评审确认（单一事实来源）
- [src/api/README.md](../src/api/README.md)：API 契约约定
- [src/utils/README.md](../src/utils/README.md)：请求与错误处理约定
- [src/mocks/README.md](../src/mocks/README.md)：模拟数据方案（含模拟登录账号与权限约定）
- [design/README.md](../design/README.md)：Pencil 原型协作与设计目录

## 方案与设计

存放路径：`docs/superpowers/specs/`

### 字段约定（specs）

- Status：`draft` | `accepted` | `implemented` | `deprecated`
- Entry points：对应路由、模块、关键文件（让读者可以从文档跳到实现）
- Acceptance checklist：可勾选的验收项（与实现保持同步）
- Notes：未落地原因 / 风险 / 后续计划（仅在 `draft` 或 `deprecated` 时需要）

- [2026-04-24-material-gallery-portal-design.md](superpowers/specs/2026-04-24-material-gallery-portal-design.md)：前台设计方案
- [2026-04-23-mock-roles-and-menu-access-design.md](superpowers/specs/2026-04-23-mock-roles-and-menu-access-design.md)：模拟角色测试账号与菜单权限体系设计
- [2026-04-30-explore-search-pen-to-code-design.md](superpowers/specs/2026-04-30-explore-search-pen-to-code-design.md)：Explore 搜索与 pen 转码方案
- [2026-06-01-auth-forgot-password-design.md](superpowers/specs/2026-06-01-auth-forgot-password-design.md)：忘记密码方案
- [2026-06-02-auth-register-design.md](superpowers/specs/2026-06-02-auth-register-design.md)：注册流程方案
- [2026-06-02-auth-session-cookie-design.md](superpowers/specs/2026-06-02-auth-session-cookie-design.md)：Cookie Session 认证方案

## 工作剧本

存放路径：`prompts/`

- [feature.md](../prompts/feature.md)：新功能开发工作流
- [bugfix.md](../prompts/bugfix.md)：缺陷修复工作流
- [code-review.md](../prompts/code-review.md)：代码评审工作流
