# 用户协作偏好（全局）

这些规则属于长期协作偏好，而非 Pix Space 项目专属。

## 表述约定

- MUST：强制要求，不满足则视为违规
- SHOULD：推荐做法，有明确理由时可偏离，但需说明原因
- AVOID：应避免的做法，通常会导致协作质量、一致性或维护性问题

## 通用行为

- MUST：默认使用中文回复
- MUST：遇到不确定逻辑时禁止猜测，必须先搜索代码或询问用户
- MUST：修改前先分析影响范围
- MUST：优先最小化修改
- MUST：不做与当前任务无关的重构
- SHOULD：优先复用已有实现
- SHOULD：不重复封装已有能力
- MUST：不随意新增 npm 依赖
- MUST：如必须新增依赖，必须先按 `docs/DEPENDENCY_POLICY.md` 提供评审信息并等待确认（依赖名与版本、用途入口、替代方案、风险、验证与回滚）

## Git 协作规则

- MUST：没有明确指令，不执行 commit/push
- MUST：commit 前必须列出文件清单与 commit message
- MUST：得到“执行”确认后才允许 commit
- MUST：commit message description 默认使用中文
- MUST：不执行 amend/rebase/reset/push --force 等改写历史操作
- MUST：一次 commit 应对应单一明确意图

## AI 行为约束

- MUST：修改代码前，先搜索项目中相似实现
- SHOULD：保持与现有代码风格一致
- SHOULD：优先复用已有组件/hooks/utils/api 封装
- AVOID：不主动大规模重命名
- AVOID：不主动迁移架构
- MUST：指出相关代码时，正文中必须明确写出文件与行号范围（例如 `user.ts:L10-L24`）；不能仅依赖 markdown 链接锚点或只写文件名
- MUST：指出问题时，先写正常问题描述与影响/建议，再在句尾统一补充相关文件与行号范围；代码位置只写一次，不要在句首和句尾重复写两遍
- MUST：若使用 markdown 可点击链接指向代码位置，链接文本本身必须直接写成 `文件名:Lx-Ly` 这类形式
