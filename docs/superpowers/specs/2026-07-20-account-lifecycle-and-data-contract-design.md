# 账号生命周期与数据↔接口契约设计

## 元信息

- Status：accepted
- 目标读者：后端、前端、测试
- 范围：
  - 包含：用户账号生命周期（注册 / 活跃 / 注销 / 同邮箱重注册）在数据库层的表达方式；软删除机制（`deleted_at`）及其适用与排除表；活跃邮箱唯一约束（`email_active` 生成列）；数据库字段 ↔ 前端接口字段的命名与类型契约（命名转换、主键序列化、内部字段边界）
  - 不包含：后端 Java 实体 / Mapper / Service 的具体实现代码；账号注销的业务触发流程与鉴权；真实注册接口的密码策略；数据归档与物理清理策略
- Entry points：
  - `backend/src/main/resources/db/migration/V1__init_core_tables.sql`
  - `backend/src/main/resources/db/migration/V2__init_file_and_image_tables.sql`
  - `backend/src/main/resources/db/migration/V3__init_boards_and_tags.sql`
  - `src/types/user.ts`、`src/types/file.ts`、`src/types/image.ts`
- Acceptance checklist：见文末「验收清单」
- 最后对齐：2026-07-20
- 权威入口：数据库结构以三份 Flyway 基线脚本为唯一事实来源；前端字段以 `src/types/*` 为准

## 1. 背景与目标

本文档定义用户账号在数据层的生命周期表达，以及数据库与前端接口之间的字段契约，目标是：

1. **账号生命周期**：让"注册 → 活跃 → 注销 → 同邮箱重新注册"在数据层有明确、可追溯的表达。
2. **数据↔接口契约**：约定数据库字段（snake_case / BIGINT）与前端接口字段（camelCase / string）之间的映射规则，使后端接口层只做机械转换、不承担语义翻译。

设计原则：

- **契约前置**：字段命名与类型在建表阶段即与前端类型对齐，后端接口层只做机械的 snake→camel 转换，不做语义改名
- **软删除优先**：核心业务实体的注销 / 删除均软删，保留审计与追溯能力；纯关联表物理删除
- **最小暴露**：内部字段（软删标记、生成列、密码哈希）不进入对外接口

## 2. 账号生命周期

### 2.1 状态流转

```
注册 ──► 活跃(deleted_at IS NULL) ──► 注销(deleted_at = 注销时刻)
                                          │
                                          └─► 同邮箱可重新注册为「全新账号」(新 id)
```

- **活跃**：`users.deleted_at IS NULL`
- **注销**：软删除，写入 `deleted_at = 注销时刻`，行数据保留（审计 / 追溯）
- **重注册**：注销后原邮箱被释放，可用同邮箱注册一个全新账号（新的自增主键），历史账号仍以软删记录存在

### 2.2 为什么用软删除而非物理删除

- 保留账号历史，满足审计与内容归属追溯（图片、画板的 `owner_id` 仍可解析）
- 与 MyBatis-Plus `@TableLogic` 天然契合，业务查询默认自动过滤已删除行
- 避免物理删除引发的级联外键处理复杂度

## 3. 软删除机制（`deleted_at`）

### 3.1 规则

- 字段统一为 `deleted_at DATETIME NULL DEFAULT NULL`
- 语义：`NULL` = 未删除；非 `NULL` = 删除时刻
- 后端配合 MyBatis-Plus `@TableLogic`（`NULL` 为未删值），业务查询默认过滤软删行

### 3.2 适用表 vs 排除表

| 表                 | 是否软删 | 说明                                                                 |
| ------------------ | -------- | -------------------------------------------------------------------- |
| `users`            | ✅       | 账号注销保留审计                                                     |
| `files`            | ✅       | 文件 / 文件夹删除保留追溯                                            |
| `images`           | ✅       | 图片作品删除保留追溯                                                 |
| `boards`           | ✅       | 画板删除保留追溯                                                     |
| `user_preferences` | ❌       | 与 `users` 一对一扩展，随用户软删自然失效，不单独加                  |
| `image_tags`       | ❌       | 多对多关联表，物理增删；软删叠加唯一约束会阻止「删除后重加同一组合」 |
| `board_images`     | ❌       | 多对多关联表，同上                                                   |

排除关联表的核心原因：唯一约束（如 `uk_image_tag`、`uk_board_image`）若与软删并存，删除后的行仍占用唯一键，导致无法重新添加相同组合。

## 4. 活跃邮箱唯一（`email_active` 生成列）

### 4.1 需求

- 活跃账号之间邮箱必须唯一
- 注销后邮箱应被释放，允许同邮箱重新注册

单纯对 `email` 加唯一约束无法满足第二点（注销行仍占用邮箱）。

### 4.2 方案（见 `V1__init_core_tables.sql`）

```sql
email VARCHAR(128) NOT NULL,                 -- 原始邮箱恒定保留（审计/追溯）
email_active VARCHAR(128)
  GENERATED ALWAYS AS (IF(deleted_at IS NULL, email, NULL)) VIRTUAL,
...
deleted_at DATETIME NULL DEFAULT NULL,
UNIQUE KEY uk_users_email_active (email_active)
```

要点：

- `email`：原始值恒定保留，用于审计与追溯，对应前端 `User.email`
- `email_active`：虚拟生成列，账号活跃时等于 `email`，注销后变 `NULL`
- 唯一索引建在 `email_active` 上：MySQL 唯一索引允许多个 `NULL` 并存，故多个已注销账号可共享同邮箱，而活跃账号间保持唯一
- 生成列合法引用了在其之后定义的基础列 `deleted_at`

## 5. 数据↔接口字段契约

后端接口层对前端只做机械的 snake_case → camelCase 转换，不承担语义翻译。

### 5.1 命名一致性

- DB 与前端对**同一语义使用同一词根**，仅大小写风格不同：DB `snake_case` ↔ 前端 `camelCase`（例：`created_at` ↔ `createdAt`、`updated_at` ↔ `updatedAt`、`color` ↔ `color`）
- 特例约定：`avatar_url` 去 `_url` 后缀映射为前端 `avatar`
- 该转换应由后端序列化统一处理，接口层与前端均不手写逐字段映射表

### 5.2 主键序列化：BIGINT → string

- DB 主键为 `BIGINT`（上限 2^63−1），JS `Number` 安全整数上限为 `2^53−1`（`Number.MAX_SAFE_INTEGER`）。主键增长超过 `2^53−1` 后，前端以 `number` 接收会丢精度。
- **契约**：所有主键 / 外键 ID 在接口层序列化为 `string`，前端类型对应字段声明为 `string`（如 `Image.id`、`FileItem.id`、`FileItem.parentId`）
- **后端要求**：保证 Jackson 将 `Long` 主键序列化为字符串（如全局 `Long` / `BigInteger` → String 序列化配置）

### 5.3 内部字段边界

- `deleted_at`、`email_active`、`password_hash` 等内部字段不进入对外接口
- 前端类型中不存在这些字段；后端接口 DTO 需显式排除

## 6. 迁移与演进策略

- 起步阶段（本地单一环境、无需保留数据）：数据库结构直接以三份基线脚本 V1/V2/V3 为准，结构调整通过修改基线脚本 + 重建数据库（`docker compose down -v` 清空数据卷）完成，全新空库从零执行 V1→V3
- 一旦脚本进入他人环境或生产库：基线脚本视为不可变，后续结构调整一律通过新增增量迁移（`Vn__xxx.sql`）完成

## 7. 落地范围与计划

已在数据层落地（以 V1/V2/V3 为准）：

- 四表软删除、关联表排除软删
- `email_active` 生成列 + `uk_users_email_active` 活跃邮箱唯一
- 图片主色调字段 `color`、文件时间字段 `updated_at`

前端类型对齐：

- `FileItem`（`updatedAt`、`id` / `parentId` 为 `string`）与 `Image`（`id` 为 `string`、`color`）已符合契约
- 用户域 `User.id` 计划按 §5.2 统一为 `string`，与其它域一致

后端接入时需完成（属本文档范围外的实现工作）：

- Java 实体启用 `@TableLogic`、`email_active` 作只读映射
- 全局 `Long` 主键 → String 序列化
- 接口 DTO 显式排除内部字段

上述后端实现落地后，本文档 Status 应更新为 `implemented` 并刷新「最后对齐」。

## 8. 验收清单

- `users` / `files` / `images` / `boards` 四表均含 `deleted_at DATETIME NULL DEFAULT NULL`
- `user_preferences` / `image_tags` / `board_images` 三表不含 `deleted_at`，且注释说明原因
- `users` 无 `email` 直接唯一约束，改由 `email_active` 生成列 + `uk_users_email_active` 保证活跃邮箱唯一
- 图片主色调字段为 `color`，文件时间字段为 `updated_at`
- 前端主键 / 外键 ID（`Image.id`、`FileItem.id` / `parentId`）为 `string`
- 删库重建后 Flyway 从零执行 V1→V3 成功建表
- 后端接入后：`@TableLogic` 生效、`Long` 主键序列化为 string、DTO 排除内部字段
