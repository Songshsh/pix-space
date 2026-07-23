-- ═══════════════════════ 文件表 ═══════════════════════
-- 对应前端类型：src/types/file.ts → FileItem
-- 功能：存储用户上传的所有文件（图片源文件、其他类型文件），支持文件夹层级结构
-- 实际文件内容存在 MinIO 对象存储中，本表只记录元数据
CREATE TABLE IF NOT EXISTS files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,                -- 文件唯一 ID（前端 FileItem.id）
  owner_id BIGINT NOT NULL,                            -- 文件所有者 ID（关联 users.id）
  parent_id BIGINT NULL,                               -- 父文件夹 ID，支持嵌套目录（NULL=根目录，前端 FileItem.parentId）
  name VARCHAR(255) NOT NULL,                          -- 文件/文件夹名称（前端 FileItem.name）
  type VARCHAR(32) NOT NULL,                           -- 类型：image / folder / 等（前端 FileTypeEnum）
  object_key VARCHAR(255) NULL,                        -- MinIO 存储中的对象键（文件夹为 NULL）
  mime_type VARCHAR(128) NULL,                         -- 文件 MIME 类型，如 image/png（文件夹为 NULL）
  size BIGINT NOT NULL DEFAULT 0,                      -- 文件大小（字节），0 表示文件夹（前端 FileItem.size）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- 创建时间
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 最后修改时间（前端 FileItem.updatedAt）
  deleted_at DATETIME NULL DEFAULT NULL,               -- 软删除标记：NULL=未删除（配合 @TableLogic）
  INDEX idx_files_owner (owner_id),                    -- 按所有者查询加速
  INDEX idx_files_parent (parent_id),                  -- 按父文件夹查询加速
  CONSTRAINT fk_files_parent FOREIGN KEY (parent_id) REFERENCES files(id)  -- 自引用：父文件夹必须是本表已存在记录（NULL=根目录，不受约束）
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════ 图片表 ═══════════════════════
-- 对应前端类型：src/types/image.ts → Image
-- 功能：存储用户上传的图片作品信息，是 files 表的"业务层"扩展
-- 设计：一个图片对应一个源文件（files 中的一条记录），图片特有的标题、收藏等属性单独存储
CREATE TABLE IF NOT EXISTS images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,                -- 图片唯一 ID（前端 Image.id）
  owner_id BIGINT NOT NULL,                            -- 图片上传者 ID（关联 users.id）
  title VARCHAR(255) NOT NULL,                         -- 图片标题（前端 Image.title）
  file_id BIGINT NOT NULL,                             -- 关联的源文件 ID（前端通过此字段查找 MinIO 中的实际文件）
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,           -- 收藏标记：0=未收藏 / 1=已收藏（前端 Image.isFavorite）
  color VARCHAR(32) NULL,                              -- 图片主色调（前端 Image.color）
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- 上传时间（前端 Image.createdAt）
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 最后修改时间
  deleted_at DATETIME NULL DEFAULT NULL,               -- 软删除标记：NULL=未删除（配合 @TableLogic）
  CONSTRAINT fk_images_file FOREIGN KEY (file_id) REFERENCES files(id),              -- 外键：images.file_id 的值必须在 files.id 中存在
  INDEX idx_images_owner (owner_id)                   -- 按上传者查询加速
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
