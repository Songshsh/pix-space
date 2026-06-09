# Mocks 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 核心原则

- MUST：Mock 的接口路径、返回结构与权限语义必须对齐当前 API 契约
- MUST：新增或修改 API 时，同步更新 `handlers.ts` 与 `README.md`
- MUST：Mock 应优先模拟真实后端语义，而不是为了页面方便临时发明接口
- AVOID：在 mock 中引入仅供单个页面使用、且不会进入真实后端契约的特殊字段

## 认证与权限

- MUST：认证态、会话恢复与权限校验规则必须与当前真实接入目标保持同一语义
- MUST：需要区分 `401` / `403` 的接口，mock 中也必须保持一致
- SHOULD：涉及角色、可见性与菜单权限的调整时，优先核对相关 spec 与 README

## 测试与维护

- MUST：mock 数据应支持本地联调、单测与 E2E 的稳定复用
- SHOULD：新增场景时优先扩展现有种子数据，避免散落多个重复数据源
- MUST：当 mock 行为只是开发态增强时，必须在文档中明确写出与真实后端的差异

## 相关文档

- Mock 方案：[README.md](README.md)
- API 契约：[../api/README.md](../api/README.md)
- 请求与错误策略：[../utils/README.md](../utils/README.md)
