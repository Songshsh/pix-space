-- ═══════════════════════ 用户表 ═══════════════════════
-- 对应前端类型：src/types/user.ts → User
-- 功能：存储所有注册用户的账号信息与个人资料
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,               -- 用户唯一 ID（自增主键）
  username VARCHAR(64) NOT NULL,                     -- 用户名（前端 User.username）
  email VARCHAR(128) NOT NULL,                         -- 登录邮箱（原始值恒定保留用于审计/追溯，前端 User.email）
  -- 活跃邮箱唯一：仅在未注销账号(deleted_at IS NULL)间唯一；注销(软删)后 email_active 变 NULL 释放邮箱，
  -- 从而支持同邮箱重新注册为全新账号。生成列可引用后定义的基础列 deleted_at。
  email_active VARCHAR(128)
    GENERATED ALWAYS AS (IF(deleted_at IS NULL, email, NULL)) VIRTUAL,
  password_hash VARCHAR(255) NOT NULL,                 -- 密码哈希（明文密码从不入库）
  role VARCHAR(32) NOT NULL,                           -- 角色：admin / user / viewer（前端 UserRole）
  status VARCHAR(32) NOT NULL DEFAULT 'active',        -- 账号状态：active（正常）/ inactive（停用）
  avatar_url VARCHAR(255) NULL,                        -- 头像图片 URL（前端 User.avatar）
  phone VARCHAR(32) NULL,                              -- 手机号（前端 ProfilePanelForm.phone）
  bio VARCHAR(255) NULL,                               -- 个人简介（前端 ProfilePanelForm.bio）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 注册时间
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 最后修改时间
  deleted_at DATETIME NULL DEFAULT NULL,               -- 软删除标记：NULL=未删除 / 非 NULL=注销时刻（配合 @TableLogic）
  UNIQUE KEY uk_users_email_active (email_active)      -- 仅活跃账号邮箱唯一（见上方 email_active）
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════ 用户偏好设置表 ═══════════════════════
-- 对应前端类型：src/components/settings/types.ts → NotificationSettingsForm
-- 功能：存储每个用户的通知开关等个性化设置，与 users 表一对一
-- 注：一对一扩展表，随用户软删自然失效，不单独加 deleted_at
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT PRIMARY KEY,                          -- 用户 ID（与 users.id 一一对应）
  two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,    -- 两步验证开关：0=关 / 1=开
  notify_system TINYINT(1) NOT NULL DEFAULT 1,         -- 系统通知开关：0=关 / 1=开（前端 system）
  notify_email TINYINT(1) NOT NULL DEFAULT 1,          -- 邮件通知开关：0=关 / 1=开（前端 email）
  notify_upload TINYINT(1) NOT NULL DEFAULT 0,         -- 上传通知开关：0=关 / 1=开（前端 upload）
  notify_comment TINYINT(1) NOT NULL DEFAULT 1,        -- 评论通知开关：0=关 / 1=开（前端 comment）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
