# AI 开发交付自检清单

本清单用于在 Pix Space 中用 AI 协作开发时，降低“漏改、破坏约定、验证不足”的概率。建议在提交最终变更前逐项勾选。

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

- [ ] MUST：遵循工程自动导入约束：不手动导入 Vue 核心 API 与 Element Plus 组件（见 [FRONTEND_SPEC.md](FRONTEND_SPEC.md)）
- [ ] MUST：页面不直接操作底层 request；请求必须走 `src/api/` 与 `src/utils/request.ts` 体系（见 [project_rules.md](../.trae/rules/project_rules.md)）
- [ ] MUST：样式优先使用 `src/styles/tokens.css`；禁止硬编码主题/品牌色系列，其余允许范围以 `project_rules.md` 与 `styles/AGENTS.md` 为准
- [ ] MUST：默认写 `<style scoped>`；需要全局样式/覆盖时仅允许放在 `src/styles/` 并遵守 styles 规范
- [ ] MUST：不输出、记录、提交密钥/Token/密码/隐私数据；避免不可信 `v-html`（见 [FRONTEND_SPEC.md](FRONTEND_SPEC.md)）
- [ ] MUST：不随意新增 npm 依赖；如必须新增，先按 [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md) 提供评审信息并等待确认

## 3. 同步更新清单（避免“只改了一个点”）

### 3.1 接口与请求

- [ ] 若新增/修改 API：同步更新 `src/api/*` 的类型与封装（见 [src/api/README.md](../src/api/README.md)）
- [ ] 若涉及错误提示/静默策略：遵守 request 统一策略（见 [src/utils/README.md](../src/utils/README.md)）
- [ ] 若新增/修改 API：同步更新 MSW mock（见 [src/mocks/README.md](../src/mocks/README.md)）

### 3.2 路由与权限

- [ ] 若新增页面：确认路由入口与权限 meta，避免在布局里散落 `v-if`（见 [FRONTEND_SPEC.md](FRONTEND_SPEC.md)）

### 3.3 样式与主题

- [ ] 若新增 tokens：命名语义化、层级统一、优先复用（见 [styles/AGENTS.md](../src/styles/AGENTS.md)）
- [ ] 若需覆盖 Element Plus：仅在 `src/styles/element-overrides.css` 等集中位置处理，避免局部覆盖

### 3.4 文档

- [ ] MUST：修改公共行为（API 契约/错误策略/权限/目录职责/样式策略等）时同步更新文档（见 [docs/AGENTS.md](AGENTS.md)）

## 4. 验证最低口径（交付前必须满足）

- [ ] MUST：提供可验证入口（路由/按钮/复现步骤）
- [ ] MUST：运行并通过 `npm run test`（脚本单一事实来源见 [CONTRIBUTING.md](../CONTRIBUTING.md)）
- [ ] SHOULD：新增/改动复杂逻辑时补单元测试（Vitest）
- [ ] SHOULD：新增页面或关键链路改动时补 E2E 冒烟（Playwright）

## 5. 提交协作（仅在用户要求 commit 时）

- [ ] MUST：未明确指令不执行 commit/push（见 [user_rules.md](../.trae/rules/user_rules.md)）
- [ ] MUST：commit 前列出文件清单与 commit message，得到“执行”确认后再提交

## 说明

- 本文件只负责交付前检查，不作为规则总入口
- 规则总入口见 [../AGENTS.md](../AGENTS.md)
