package com.pixspace.backend.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置：注册分页插件。
 *
 * <p>前端分页请求到达 Controller 后，Controller 构造 MyBatis-Plus 的 Page 对象传给 Mapper，
 * 分页插件会自动拦截 SQL 并追加 LIMIT 子句，同时执行 COUNT 查询获取总记录数。
 * 没有此插件，{@code selectPage()} 不会生效。</p>
 */
@Configuration
public class MybatisPlusConfig {

  @Bean
  MybatisPlusInterceptor mybatisPlusInterceptor() {
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
    return interceptor;
  }
}
