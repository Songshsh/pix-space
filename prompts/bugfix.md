# 缺陷修复工作流

表述约定与通用清单见 [shared-checklist.md](shared-checklist.md)。

## 必要输入

- 复现步骤
- 预期结果与实际结果对比
- 影响范围（页面/接口/用户角色）

## 工作顺序

1. 先按 [../AGENTS.md](../AGENTS.md) 读取根规则、专题规范与就近 `AGENTS.md`
2. 若修复涉及新增页面、信息架构调整或关键交互重做，先进入 [../design/README.md](../design/README.md) 与 [../design/AGENTS.md](../design/AGENTS.md) 完成原型评审，再继续修复；design 门禁与交接清单以 `design/README.md` 为准
3. 定位根因（引用关键文件与代码路径）
4. 最小修复（避免无关重构）
5. MUST：在改代码前先列出“同步更新项”，并按通用清单逐项过一遍（见 [shared-checklist.md](shared-checklist.md)）
6. MUST：补回归验证（见 [shared-checklist.md](shared-checklist.md)，脚本单一事实来源见 [CONTRIBUTING.md](../CONTRIBUTING.md)）

说明：

- 本文件只补充“缺陷修复”工作流，不替代 `AGENTS.md` 与根规则
