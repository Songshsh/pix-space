# 缺陷修复工作流

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 必要输入

- 复现步骤
- 预期结果与实际结果对比
- 影响范围（页面/接口/用户角色）

## 工作顺序

1. 先按 `AGENTS.md` 读取根规则、专题规范与就近 `AGENTS.md`
2. 定位根因（引用关键文件与代码路径）
3. 最小修复（避免无关重构）
4. MUST：在改代码前先列出“同步更新项”（避免漏改）
   - 涉及 API：同步更新 `src/api/*` 类型与封装、`src/mocks/*`、以及相关 README（`src/api/README.md`、`src/utils/README.md`、`src/mocks/README.md`）
   - 涉及样式/主题：优先更新 `src/styles/tokens.css`；全局覆盖仅允许集中放在 `src/styles/`，并遵守 `src/styles/AGENTS.md`
   - 涉及路由/权限：同步检查 `meta.roles` 与 `canAccess` 约定，避免在布局散落条件渲染
5. MUST：遵循工程自动导入规则：新增代码优先复用自动导入，例外场景以 `docs/FRONTEND_SPEC.md` 为准
6. MUST：如必须新增 npm 依赖，先按 `docs/DEPENDENCY_POLICY.md` 提供评审信息并等待确认
7. MUST：补回归验证（优先使用项目已有的测试框架与模式；脚本单一事实来源见 `CONTRIBUTING.md`）
   - MUST：至少通过 `npm run test`

说明：

- 本文件只补充“缺陷修复”工作流，不替代 `AGENTS.md` 与根规则
