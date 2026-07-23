# 文档地图

本目录用于沉淀项目规范与方案文档。
本文件面向“规范读者”，是专题规范与方案文档的权威索引入口；不替代根规则与就近模块规则。

## 读取顺序

- 规则总入口：[../AGENTS.md](../AGENTS.md)
- 在遵循根规则与就近模块规则前提下，按当前任务阅读本页链接文档即可

## 常见任务入口

- 我要开始开发（从零开始）：先读 [FRONTEND_SPEC.md](FRONTEND_SPEC.md)，再根据变更目录补齐最近的 `AGENTS.md`
- 我要改认证/登录：先读 [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md)，再补齐 [src/views/auth/AGENTS.md](../src/views/auth/AGENTS.md) 与 [superpowers/specs/README.md](superpowers/specs/README.md) 中认证相关 spec
- 我要改接口契约：先读 [src/api/README.md](../src/api/README.md)，并同步检查 [src/mocks/README.md](../src/mocks/README.md)
- 我要改请求/错误策略：先读 [src/utils/README.md](../src/utils/README.md)，并同步检查 [prompts/shared-checklist.md](../prompts/shared-checklist.md) 的同步更新项
- 我要改路由/权限：先读 [src/router/README.md](../src/router/README.md)，再补齐 [FRONTEND_SPEC.md](FRONTEND_SPEC.md) 的“路由与权限”与 [src/router/AGENTS.md](../src/router/AGENTS.md)
- 我要改样式/主题：先读 [FRONTEND_SPEC.md](FRONTEND_SPEC.md) 的“界面与样式约束”与 [src/styles/AGENTS.md](../src/styles/AGENTS.md)
- 我要新增/升级依赖：先读 [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)
- 我要启动 Java 后端：先读 [superpowers/plans/2026-06-10-java-backend-bootstrap-plan.md](superpowers/plans/2026-06-10-java-backend-bootstrap-plan.md)，按其中的 `backend/`、`docker-compose.dev.yml` 与前端 `.env` 联调说明执行
- 我要查后端运行命令：先读 [backend/RUNBOOK.md](../backend/RUNBOOK.md)

## 命名约定

- 项目对外写法统一为：Pix Space

## README 与 AGENTS 的分层

- README：面向人类读者，承载公共契约、联调约定、调用方心智模型与任务入口
- AGENTS：面向修改者与 AI/Agent，承载目录内的额外约束、操作边界与最近规则入口
- 新增目录文档时：若该目录需要给跨角色读者解释“怎么用/怎么联调/公共约定”，优先新增 README；若主要是约束修改方式与目录边界，优先新增 AGENTS

## 规范与约定

- [FRONTEND_SPEC.md](FRONTEND_SPEC.md)：前端开发综合规范（架构、Vue 约束、样式、Element Plus 约束）
- [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md)：认证架构说明（Cookie Session）
- [AI_DELIVERY_CHECKLIST.md](AI_DELIVERY_CHECKLIST.md)：AI 开发交付自检清单（同步更新项与最低验证口径）
- [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)：新增依赖评审确认（单一事实来源）
- [DOCS_OWNERSHIP_MATRIX.md](DOCS_OWNERSHIP_MATRIX.md)：文档职责矩阵（避免重复维护与口径漂移）
- [backend/RUNBOOK.md](../backend/RUNBOOK.md)：Java 后端运行、容器、端口与排障手册
- [src/api/README.md](../src/api/README.md)：API 契约约定
- [src/router/README.md](../src/router/README.md)：路由拓扑、公开/受保护入口与查询参数约定
- [src/utils/README.md](../src/utils/README.md)：请求与错误处理约定
- [src/utils/AGENTS.md](../src/utils/AGENTS.md)：请求层局部规则
- [src/mocks/README.md](../src/mocks/README.md)：模拟数据方案（含模拟登录账号与权限约定）
- [src/mocks/AGENTS.md](../src/mocks/AGENTS.md)：Mock 层局部规则
- [design/README.md](../design/README.md)：Pencil 原型协作与设计目录
- [design/AGENTS.md](../design/AGENTS.md)：设计规则与原型评审清单

## 方案与设计

存放路径：`docs/superpowers/specs/`（以索引为准）

索引入口：[superpowers/specs/README.md](superpowers/specs/README.md)

字段、状态与清单规则以 `superpowers/specs/README.md` 为单一事实来源。

## 工作剧本

存放路径：`prompts/`

- [prompts/README.md](../prompts/README.md)：工作剧本入口与适用场景
- [feature.md](../prompts/feature.md)：新功能开发工作流
- [bugfix.md](../prompts/bugfix.md)：缺陷修复工作流
- [code-review.md](../prompts/code-review.md)：代码评审工作流
- [shared-checklist.md](../prompts/shared-checklist.md)：feature/bugfix 共通清单（同步更新项/验证最低口径）
