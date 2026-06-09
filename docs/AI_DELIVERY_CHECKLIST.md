# AI 开发交付自检清单

本清单用于在 Pix Space 中用 AI 协作开发时，降低“漏改、破坏约定、验证不足”的概率。建议在提交最终变更前逐项勾选。

同步更新项与验证最低口径以 [prompts/shared-checklist.md](../prompts/shared-checklist.md) 为准；本清单只做交付前检查，不重复维护细则。

## 0. 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 1. 任务开始前（定位与约束）

- [ ] MUST：明确用户目标与不做什么（边界）
- [ ] MUST：需求不清时先澄清：空/加载/失败/成功状态与权限可见性（见 [prompts/feature.md](../prompts/feature.md)）
- [ ] MUST：先按 [../AGENTS.md](../AGENTS.md) 完成规则读取，再进入当前任务实现
- [ ] MUST：补充阅读与当前改动直接相关的专题规范与就近 `AGENTS.md`
- [ ] MUST：改代码前先搜索相似实现，优先复用现有组件/composables/api 封装（见 [user_rules.md](../.trae/rules/user_rules.md)）

## 2. 实现过程（常见踩坑防线）

- [ ] MUST：按 [prompts/shared-checklist.md](../prompts/shared-checklist.md) 执行工程约束（自动导入 / 依赖评审 / 请求分层 / 样式主题 / 验证最低口径）
- [ ] MUST：对照 [FRONTEND_SPEC.md](FRONTEND_SPEC.md) 与最近的 `AGENTS.md` 检查样式、安全与目录职责是否越界

## 3. 同步更新清单（避免“只改了一个点”）

- [ ] MUST：按 [prompts/shared-checklist.md](../prompts/shared-checklist.md) 的“同步更新项（避免漏改）”逐项检查（API / 请求策略 / Mock / 路由权限 / 样式主题）

### 3.1 文档

- [ ] MUST：修改公共行为（API 契约/错误策略/权限/目录职责/样式策略等）时同步更新文档（见 [docs/AGENTS.md](AGENTS.md)）

## 4. 验证最低口径（交付前必须满足）

- [ ] MUST：按 [prompts/shared-checklist.md](../prompts/shared-checklist.md) 的“验证最低口径”执行

## 5. 提交协作（仅在用户要求 commit 时）

- [ ] MUST：未明确指令不执行 commit/push（见 [user_rules.md](../.trae/rules/user_rules.md)）
- [ ] MUST：commit 前列出文件清单与 commit message，得到“执行”确认后再提交

## 说明

- 本文件只负责交付前检查，不作为规则总入口
- 规则总入口见 [../AGENTS.md](../AGENTS.md)
