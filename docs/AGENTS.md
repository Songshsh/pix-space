# Docs 规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 文档原则

- MUST：修改公共行为时同步更新文档
- MUST：文档应保持可执行性（读者可据此定位代码入口、复现与验收）
- MUST：不写失效方案（历史方案需标注 deprecated）
- MUST：根目录入口文档 `README.md`、`CONTRIBUTING.md` 也受本文档治理原则约束
- MUST：根目录入口文档如需扩写，优先补跳转入口；避免在根目录重复维护专题规范正文

## 职责边界

- MUST：根目录 `README.md` 只承载最小上手、运行入口与关键跳转
- MUST：`CONTRIBUTING.md` 只承载贡献流程、脚本速查与提交约定
- MUST：专题规范、职责矩阵与方案索引统一以下列文档为准：
  - `docs/README.md`
  - `docs/DOCS_OWNERSHIP_MATRIX.md`
  - `docs/superpowers/specs/README.md`

## 文档风格

优先：

- SHOULD：规则
- SHOULD：示例
- SHOULD：Checklist

- AVOID：长篇空洞描述。
