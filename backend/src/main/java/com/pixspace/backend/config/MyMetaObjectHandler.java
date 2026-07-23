package com.pixspace.backend.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

/**
 * MyBatis-Plus 自动填充配置。
 *
 * <p>
 * 在实体类字段上标注 {@code @TableField(fill = FieldFill.INSERT)} 或
 * {@code @TableField(fill = FieldFill.INSERT_UPDATE)} 后，
 * 插入/更新时会自动设置 created_at / updated_at 字段，无需手动赋值。
 * </p>
 */
@Slf4j // Lombok 注解，自动生成 log 日志对象
@Configuration
public class MyMetaObjectHandler implements MetaObjectHandler { // 实现 MyBatis-Plus 自动填充处理器接口

  @Override
  public void insertFill(MetaObject metaObject) { // 插入数据时的自动填充逻辑
    LocalDateTime now = LocalDateTime.now(); // 获取当前时间，确保 createdAt 和 updatedAt 使用同一时刻
    this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, now); // 自动填充创建时间字段
    this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, now); // 自动填充更新时间字段
  }

  @Override
  public void updateFill(MetaObject metaObject) { // 更新数据时的自动填充逻辑
    LocalDateTime now = LocalDateTime.now(); // 获取当前时间
    this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, now); // 自动填充更新时间字段
  }
}
