package com.pixspace.backend.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pixspace.backend.common.api.ApiResponse;

// 安全配置类：定义认证、授权、CSRF、CORS 等安全规则
// @Configuration 告诉 Spring 这个类包含 @Bean 方法，启动时执行并注册到容器
// @EnableMethodSecurity 开启方法级鉴权（@PreAuthorize/@PostAuthorize）：当前无注解即零影响，
// 预置后续 Service/Controller 可直接用 @PreAuthorize("hasRole('ADMIN')") 做细粒度授权；
// 方法级抛出的 AccessDeniedException/AuthenticationException 由 GlobalExceptionHandler 统一转 403/401 JSON
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  // 给allowedOrigins赋值，值是 application-dev.yml / application-prod.yml 中读取的
  // app.cors.allowed-origins，:http://localhost:5173 是兜底默认值，仅当配置文件未定义时生效
  @Value("${app.cors.allowed-origins:http://localhost:5173}")
  private String allowedOrigins;

  // Cookie 是否仅通过 HTTPS 传输：复用 server.servlet.session.cookie.secure 属性作为单一开关
  // 生产（application-prod.yml）设为 true，CSRF Cookie 与 Session Cookie 同步开启
  // Secure；开发未设时默认 false
  @Value("${server.servlet.session.cookie.secure:false}")
  private boolean cookieSecure;

  private final ObjectMapper objectMapper;

  public SecurityConfig(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  // 安全过滤链：定义所有请求的认证和授权规则，每个请求都会经过这条链
  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // CSRF 防护：Token 同时存在于 Cookie（浏览器自动发送）和请求头（JS 手动写入）
        // 每个请求进来时：
        // → repo 生成随机 Token
        // → 写入 XSRF-TOKEN Cookie（HttpOnly=false, SameSite=Lax）
        // → 前端读取 Cookie，写入 X-XSRF-TOKEN 请求头
        // → repo 校验：Cookie 中的值 == 请求头中的值 → 通过 / 拒绝
        .csrf(csrf -> { // Lambda 参数 csrf 是 CSRF 配置器
          CookieCsrfTokenRepository repo = // 创建 Token 存储库：CookieCsrfTokenRepository 内部用 UUID.randomUUID() 随机生成，存入
                                           // Session 并写入Cookie
              CookieCsrfTokenRepository.withHttpOnlyFalse();
          // 未显式设置名称：Cookie 名默认 XSRF-TOKEN、请求头名默认 X-XSRF-TOKEN，
          // 均来自 CookieCsrfTokenRepository 内置常量（DEFAULT_CSRF_COOKIE_NAME /
          // DEFAULT_CSRF_HEADER_NAME）。
          // 这也是 axios / Angular 等前端库的默认约定，故无需改名（如需改名调用 setCookieName / setHeaderName）
          repo.setCookieCustomizer(cookie -> cookie
              .sameSite("Lax")
              .secure(cookieSecure)); // 生产 HTTPS 下仅加密连接发送，与 Session Cookie 保持一致
          // 前端（axios）从 XSRF-TOKEN Cookie 读取"原始 token"原样放入 X-XSRF-TOKEN 头。
          // Spring Security 6 默认的 XorCsrfTokenRequestAttributeHandler 期望头里是 XOR 编码值，
          // 与该前端约定不匹配会导致 403，故显式改用比对"原始 token"的 CsrfTokenRequestAttributeHandler。
          CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
          // 置空 csrfRequestAttributeName：关闭"惰性加载"，让每个请求都即时解析 token，
          // 从而保证 XSRF-TOKEN Cookie 在首个 GET（如会话恢复）时即被写出，供后续写请求携带
          requestHandler.setCsrfRequestAttributeName(null);
          csrf.csrfTokenRepository(repo) // 将配置好的存储库注册生效
              .csrfTokenRequestHandler(requestHandler);
        })
        // 开启 CORS 支持，具体规则由下方 corsConfigurationSource() 方法定义
        .cors(Customizer.withDefaults())
        // Session 创建策略：只在需要时创建（用户登录后），匿名请求不浪费 Session
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        // 权限规则：匹配顺序从上到下，第一个匹配的规则生效
        .authorizeHttpRequests(authorize -> authorize
            // 公开路径：无需登录即可访问
            .requestMatchers(
                "/health", // 健康检查
                "/actuator/health", // Actuator 综合健康检查（探针容器无法带认证，需放行）
                "/actuator/health/**", // liveness / readiness 子探针
                "/swagger-ui.html", // API 文档页面
                "/swagger-ui/**", // API 文档静态资源
                "/v3/api-docs/**", // API 文档 JSON 数据
                "/auth/login", // 登录接口（待实现）
                "/auth/register", // 注册接口（待实现）
                "/auth/forgot-password", // 忘记密码接口（待实现）
                "/auth/session") // 会话恢复接口（待实现）
            .permitAll()
            // 管理员专属：只有 ROLE_ADMIN 角色可访问
            .requestMatchers("/dashboard", "/users/**")
            .hasRole("ADMIN")
            // 预检请求放行：浏览器跨域前先发 OPTIONS 探路，必须放行否则后续请求被拦
            .requestMatchers(HttpMethod.OPTIONS, "/**")
            .permitAll()
            // 其余所有请求：必须已登录
            .anyRequest()
            .authenticated())
        // 异常处理：未登录返回 401 JSON，权限不足返回 403 JSON
        // 前端统一拦截层期望 JSON 格式，而非 Spring Security 默认的 HTML/重定向
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint((request, response, authException) -> {
              response.setContentType(MediaType.APPLICATION_JSON_VALUE);
              response.setCharacterEncoding("UTF-8");
              response.setStatus(401);
              objectMapper.writeValue(response.getWriter(), ApiResponse.fail(40100, "未登录"));
            })
            .accessDeniedHandler((request, response, accessDeniedException) -> {
              response.setContentType(MediaType.APPLICATION_JSON_VALUE);
              response.setCharacterEncoding("UTF-8");
              response.setStatus(403);
              objectMapper.writeValue(response.getWriter(), ApiResponse.fail(40300, "权限不足"));
            }))
        // 关闭以下 Spring Security 默认功能，本项目均自定义实现：
        .httpBasic(AbstractHttpConfigurer::disable) // HTTP Basic 认证弹窗
        .formLogin(AbstractHttpConfigurer::disable) // 默认登录页 /login
        .logout(AbstractHttpConfigurer::disable); // 默认登出处理

    return http.build(); // 将以上配置构建为 SecurityFilterChain 返回给 Spring 容器
  }

  // CORS 跨域配置：定义哪些域名可以通过浏览器跨域访问后端 API
  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // 允许的域名：从 @Value 注入的 allowedOrigins 字符串按逗号拆分
    configuration.setAllowedOrigins(Arrays.stream(allowedOrigins.split(","))
        .map(String::trim) // 去掉每项首尾空格
        .filter(origin -> !origin.isEmpty()) // 过滤空字符串
        .toList());
    // 允许的 HTTP 方法
    configuration.setAllowedMethods(Arrays.asList("GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    // 允许的请求头：* 表示全部
    configuration.setAllowedHeaders(List.of("*"));
    // 允许携带 Cookie（Session Cookie + XSRF-TOKEN Cookie）
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // 规则应用到所有路径
    return source;
  }
}
