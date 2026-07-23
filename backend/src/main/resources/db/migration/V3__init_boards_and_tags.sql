-- ═══════════════════════ 图片标签表 ═══════════════════════
-- 功能：存储图片的标签，与 images 表多对多关联
-- 注：多对多关联表，物理增删维护，不做软删除（若在唯一约束上叠加软删会阻止「删除后重新添加同一组合」）
CREATE TABLE IF NOT EXISTS image_tags (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  image_id BIGINT NOT NULL,                              -- 关联的图片 ID
  tag_name VARCHAR(64) NOT NULL,                         -- 标签名称
  CONSTRAINT fk_image_tags_image FOREIGN KEY (image_id) REFERENCES images(id),
  UNIQUE KEY uk_image_tag (image_id, tag_name),          -- 同一张图同一标签只能有一条，天然去重
  INDEX idx_image_tags_name (tag_name)                   -- 加速「按标签名反查图片」（探索页/标签聚合）
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════ 画板表 ═══════════════════════
-- 对应前端类型：src/types/user-boards.ts → Board
-- 功能：用户创建的图片收藏画板
CREATE TABLE IF NOT EXISTS boards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,                  -- 画板唯一 ID（前端 Board.id）
  owner_id BIGINT NOT NULL,                              -- 创建者 ID（关联 users.id）
  title VARCHAR(255) NOT NULL,                           -- 画板标题（前端 Board.title）
  description VARCHAR(512) NULL,                         -- 画板描述（前端 Board.description）
  visibility VARCHAR(32) NOT NULL DEFAULT 'public',      -- 可见性：public / private（前端 BoardVisibility）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL DEFAULT NULL,                 -- 软删除标记：NULL=未删除（配合 @TableLogic）
  CONSTRAINT fk_boards_owner FOREIGN KEY (owner_id) REFERENCES users(id)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════ 画板-图片关联表 ═══════════════════════
-- 功能：画板与图片的多对多关联，支持排序
-- 注：多对多关联表，物理增删维护，不做软删除（同上）
CREATE TABLE IF NOT EXISTS board_images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  board_id BIGINT NOT NULL,                              -- 画板 ID
  image_id BIGINT NOT NULL,                              -- 图片 ID
  sort_order INT NOT NULL DEFAULT 0,                     -- 排序序号
  CONSTRAINT fk_board_images_board FOREIGN KEY (board_id) REFERENCES boards(id),
  CONSTRAINT fk_board_images_image FOREIGN KEY (image_id) REFERENCES images(id),
  UNIQUE KEY uk_board_image (board_id, image_id)         -- 同一画板内图片不重复
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
