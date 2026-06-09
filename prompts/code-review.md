# 代码评审工作流

表述约定与通用清单见 [shared-checklist.md](shared-checklist.md)。

检查维度（按优先级）：

1. 正确性：边界条件、异常路径、并发/竞态
2. 安全性：敏感信息、鉴权、输入校验
3. 可维护性：分层是否正确、命名、重复逻辑
4. 交互一致性：Element Plus 使用方式、空/加载/错误状态
5. 可测试性：是否容易写测试、是否有回归验证方式

## 输出格式要求

在输出评审结果时，必须结构化展示：

1. **阻断项（高风险）**：代码中存在可能导致崩溃、安全漏洞、严重性能问题的逻辑，必须立即修复。
2. **改进项（建议）**：代码虽然能运行，但存在代码异味、可维护性差、未遵循项目规范（如滥用全局状态）等问题，建议优化。
3. **优化项（最佳实践）**：关于 TypeScript 类型收窄、Element Plus API 进阶用法、Vue 3 性能优化的善意建议，可选择性采纳。
4. **亮点（正向反馈）**：对于设计精巧、考虑周全的代码给予正向反馈。

- MUST：每条反馈附带 **所在文件路径及行号范围**、**问题原因**、以及 **修改建议（或代码片段）**。
- MUST：行号范围必须在正文中显式写出，例如 `user.ts:L10-L24`；不能仅通过 markdown 链接锚点隐含行号范围。
- MUST：若使用 markdown 可点击链接指向代码位置，链接文本本身必须直接写成 `文件名:Lx-Ly` 这类形式，且代码位置只写一次，不要额外再补一份纯文本位置。

## 审查前检查清单

- MUST：先按 [../AGENTS.md](../AGENTS.md) 执行“全局/跨模块审查预检”，包括列出涉及目录、补齐读取最近 `AGENTS.md`、以及在结论中说明已读取的局部 `AGENTS.md`
- MUST：若使用 Task / 子 agent / 并行搜索协助审查，prompt 中必须显式写明需先读取的规则文件、审查维度与输出格式；禁止省略规则注入
- MUST：若尚未完成根入口要求的预检，不得声称“已完成全局审查”“已全面审查”

## 评审时的项目约束校验（补充）

- MUST：若尚未完成，先按 [../AGENTS.md](../AGENTS.md) 读取根规则、专题规范与就近 `AGENTS.md`
- MUST：如变更包含新增/升级依赖，检查是否按 [docs/DEPENDENCY_POLICY.md](../docs/DEPENDENCY_POLICY.md) 给出完整评审信息，并评估体积/安全/维护风险
- MUST：如变更涉及公共行为（API 契约、错误策略、权限规则、目录职责、样式策略等），检查是否同步更新文档与入口索引（参考 [docs/AGENTS.md](../docs/AGENTS.md) 与 [docs/README.md](../docs/README.md)）
- MUST：检查是否违反工程自动导入约束（优先自动导入；例外场景以 [docs/FRONTEND_SPEC.md](../docs/FRONTEND_SPEC.md) 为准）
- MUST：检查样式是否遵守 tokens 与集中覆盖策略（[tokens.css](../src/styles/tokens.css)、[src/styles/AGENTS.md](../src/styles/AGENTS.md)）
- SHOULD：以 [docs/AI_DELIVERY_CHECKLIST.md](../docs/AI_DELIVERY_CHECKLIST.md) 的“同步更新清单/验证最低口径”作为回归与交付检查基线

说明：

- 本文件只补充“Code Review”工作流，不替代 `AGENTS.md` 与根规则
