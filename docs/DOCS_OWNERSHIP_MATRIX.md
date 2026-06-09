# 文档职责矩阵

本文件用于定义仓库中高频入口文档的职责边界与单一事实来源，避免重复维护与口径漂移。

## 入口文档

| 文档                                  | 目标读者             | 负责内容                                                       | 不负责内容                        | 权威跳转                                                                  |
| ------------------------------------- | -------------------- | -------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------- |
| [README.md](../README.md)             | 项目使用者           | 最小上手、运行方式、关键入口链接                               | 详细规范、模块规则、workflow 剧本 | [docs/README.md](README.md)、[AGENTS.md](../AGENTS.md)                    |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献者               | 贡献流程、脚本速查（以 `package.json` scripts 为准）、提交约定 | 详细规范复述、模块规则复述        | [docs/README.md](README.md)、[AGENTS.md](../AGENTS.md)                    |
| [AGENTS.md](../AGENTS.md)             | AI/Agent、规则执行者 | 规则读取顺序、模块级规则入口、全局审查预检                     | 业务细则、专题规范全文            | [docs/README.md](README.md)                                               |
| [docs/README.md](README.md)           | 规范读者             | 专题规范与方案文档索引、阅读顺序、状态规则                     | 替代根规则与就近模块规则          | [AGENTS.md](../AGENTS.md)、[specs/README.md](superpowers/specs/README.md) |

## 专题规范（docs）

| 文档                                                 | 负责内容                                            | 权威跳转                                                                                                     |
| ---------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [FRONTEND_SPEC.md](FRONTEND_SPEC.md)                 | 前端综合规范（架构/目录职责/Vue/样式/Element Plus） | 与 [project_rules.md](../.trae/rules/project_rules.md) 一起作为项目硬规则解释                                |
| [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md)         | 当前认证架构事实说明（Cookie Session）              | 认证相关 specs、[src/utils/README.md](../src/utils/README.md)、[src/mocks/README.md](../src/mocks/README.md) |
| [AI_DELIVERY_CHECKLIST.md](AI_DELIVERY_CHECKLIST.md) | 交付前自检（以引用为主）                            | [prompts/shared-checklist.md](../prompts/shared-checklist.md)                                                |
| [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)         | 新增依赖评审流程（单一事实来源）                    | [CONTRIBUTING.md](../CONTRIBUTING.md)                                                                        |
| [src/router/README.md](../src/router/README.md)      | 路由拓扑、公开/受保护入口、query 约定               | [FRONTEND_SPEC.md](FRONTEND_SPEC.md)、[src/router/AGENTS.md](../src/router/AGENTS.md)                        |

## workflow（prompts）

| 文档                                                          | 负责内容                                                    | 不负责内容         | 权威跳转                                                                                                      |
| ------------------------------------------------------------- | ----------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------- |
| [prompts/feature.md](../prompts/feature.md)                   | 新功能开发流程与输出结构                                    | 规范全文复述       | [shared-checklist.md](../prompts/shared-checklist.md)、[AGENTS.md](../AGENTS.md)、[docs/README.md](README.md) |
| [prompts/bugfix.md](../prompts/bugfix.md)                     | Bug 修复流程与输出结构                                      | 规范全文复述       | [shared-checklist.md](../prompts/shared-checklist.md)、[AGENTS.md](../AGENTS.md)、[docs/README.md](README.md) |
| [prompts/code-review.md](../prompts/code-review.md)           | Code Review 流程与输出结构                                  | 根规则入口全文复述 | [AGENTS.md](../AGENTS.md)                                                                                     |
| [prompts/shared-checklist.md](../prompts/shared-checklist.md) | feature/bugfix 共通清单（同步更新项/工程约束/验证最低口径） | 项目规则入口       | [FRONTEND_SPEC.md](FRONTEND_SPEC.md)、[DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)                            |

## 方案与设计（docs/superpowers/specs）

| 目录                      | 负责内容       | 规则                                                                           |
| ------------------------- | -------------- | ------------------------------------------------------------------------------ |
| `docs/superpowers/specs/` | 方案与设计沉淀 | 列表与状态分组以 [specs/README.md](superpowers/specs/README.md) 为单一事实来源 |

## 局部规则（AGENTS）

原则：处理具体模块时，优先读取最近的 `AGENTS.md`；该文件负责“本目录内的额外约束”，避免复制全局规则。

补充判定：

- README 适合承载公共契约、联调约定、调用方心智模型与任务入口
- AGENTS 适合承载目录边界、修改约束、操作步骤与最近规则入口
- 若同一目录同时存在 README 与 AGENTS，两者应分别服务“使用/联调”与“修改/约束”，避免互相复制正文
