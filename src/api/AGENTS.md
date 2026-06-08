# API 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 核心原则

- MUST：所有接口统一通过 api 目录管理
- MUST：不在页面中直接写 axios 请求
- MUST：接口类型必须完整
- SHOULD：接口命名保持统一

## Mock

- MUST：新增接口时同步补充 mock
- MUST：mock 数据结构必须与真实接口一致

## 错误处理

- MUST：统一走 request 层错误处理
- MUST：不在每个页面重复 toast（策略见 [../utils/README.md](../utils/README.md)）

## 修改原则

- SHOULD：优先复用已有接口封装
- MUST：不重复创建 request 实例

## 相关文档

- 契约约定：[README.md](README.md)
- 请求与错误策略：[../utils/README.md](../utils/README.md)
- Mock 方案：[../mocks/README.md](../mocks/README.md)
