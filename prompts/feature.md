# 新功能开发工作流

当你收到开发新页面、新功能的任务时，请严格按以下步骤工作：

表述约定与通用清单见 [shared-checklist.md](shared-checklist.md)。

## 1. 确认语境（必须执行）

先按根入口读取规则（如果尚未读取）：

- [../AGENTS.md](../AGENTS.md)

然后再补充读取：

- 对应领域的 README / 规范（例如新增接口时阅读 [src/api/README.md](../src/api/README.md)）
- 当前目录最近的 `AGENTS.md`
- 若任务属于新增页面、信息架构调整或关键交互重做，先进入 [../design/README.md](../design/README.md) 与 [../design/AGENTS.md](../design/AGENTS.md) 完成原型评审，再开始编码；design 门禁与交接清单以 `design/README.md` 为准

## 2. 澄清问题（先问再做）

如果用户需求不清晰，向用户澄清：

1. 功能边界与“不做什么”？
2. 关键状态：空数据、加载中、失败、成功分别怎么表现？
3. 权限可见性是否有限制？

## 3. 制定方案

在输出代码前，先输出一个简短的方案：

- **目标**：一句话概括
- **拆解**：涉及修改/新增的组件、API、路由、状态（列表展示）
- **复用评估**：说明哪些可以复用已有的 Element Plus 组件或 composables，绝不重复造轮子。
- 若任务经过 design 评审，再开始编码前，按 [../design/README.md](../design/README.md) 的交接清单记录信息

## 4. 执行与验证

- MUST：在改代码前先列出“同步更新项”，并按通用清单逐项过一遍（见 [shared-checklist.md](shared-checklist.md)）
- 修改代码，严格遵守 Vue 3 `<script setup>` 和 Element Plus 规范。
- 完成后，提供可验证的入口或命令行，并给出测试建议。
- MUST：遵循“验证最低口径”与 CI 等价验证方式（见 [shared-checklist.md](shared-checklist.md)，脚本单一事实来源见 [CONTRIBUTING.md](../CONTRIBUTING.md)）

说明：

- 本文件只补充“新功能开发”工作流，不替代 `AGENTS.md` 与根规则
