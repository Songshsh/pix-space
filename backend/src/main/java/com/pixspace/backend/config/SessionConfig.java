package com.pixspace.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

@Configuration
@EnableRedisHttpSession // 启用Redis会话管理，拦截所有对 Session 的读写操作，自动转为对 Redis 的 GET/SET/DEL。
public class SessionConfig {
}
