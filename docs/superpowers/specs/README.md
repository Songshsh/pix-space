# Specs 索引（superpowers/specs）

本目录用于沉淀方案与设计文档。

## 状态说明

- `draft`：仍在讨论或尚未完整落地，必须写清未完成范围与待确认事项
- `accepted`：方向已确定但未完全实现，必须写清落地计划与入口
- `implemented`：实现已落地，文档应以“当前方案说明”口吻维护；如实现发生变化导致文档不再准确，必须同步更新本文档或将其标记为 `deprecated`
- `deprecated`：历史方案，仅用于追溯，不作为当前实现依据

## 元信息模板（新增文档必须包含）

- Status：draft | accepted | implemented | deprecated
- 目标读者：产品 | 前端 | 后端 | 测试（按需选择）
- 范围：包含什么 / 不包含什么
- Entry points：关键代码入口（文件路径列表）
- Acceptance checklist：最小验收清单（可操作）
- 最后对齐：YYYY-MM-DD（本次文档与代码一致性核对日期）
- 权威入口：如存在单一事实来源文档（例如 `docs/AUTH_ARCHITECTURE.md`），需在此声明并以其为准

存量 `implemented` 文档也应逐步补齐以上字段，并在相关实现发生变化时同步更新“最后对齐”日期。

## 文档清单

### draft

- 当前暂无 `draft` 文档；后续新增时必须补入本索引

### accepted

- 当前暂无 `accepted` 文档；后续新增时必须补入本索引

### implemented

- [2026-04-23-mock-roles-and-menu-access-design.md](2026-04-23-mock-roles-and-menu-access-design.md)
- [2026-04-24-material-gallery-portal-design.md](2026-04-24-material-gallery-portal-design.md)
- [2026-04-30-explore-search-pen-to-code-design.md](2026-04-30-explore-search-pen-to-code-design.md)
- [2026-06-01-auth-forgot-password-design.md](2026-06-01-auth-forgot-password-design.md)
- [2026-06-02-auth-register-design.md](2026-06-02-auth-register-design.md)
- [2026-06-02-auth-session-cookie-design.md](2026-06-02-auth-session-cookie-design.md)

### deprecated

- 当前暂无 `deprecated` 文档；后续新增时必须补入本索引
