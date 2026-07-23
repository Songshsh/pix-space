package com.pixspace.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 应用基础配置：声明项目所需的通用 Bean。
 */
@Configuration
public class AppConfig {

  /**
   * 密码编码器：BCrypt 是 Spring Security 推荐的密码哈希算法。
   * 注册时对明文密码编码存储，登录时对用户输入的密码与数据库中的哈希值进行比对。
   */
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
