package com.pixspace.backend.modules.system.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import com.pixspace.backend.config.SecurityConfig;

/**
 * 健康检查接口 Web 层测试。
 *
 * <p>
 * 使用 {@code @WebMvcTest} 只加载 Web 层（Controller + 安全过滤链），
 * 不启动 MySQL / Redis / MinIO，也不执行 Flyway 迁移，
 * 因此无基础设施的 CI 环境也能稳定运行。
 * </p>
 *
 * <p>
 * 通过 {@code @Import(SecurityConfig.class)} 显式引入安全配置，
 * 验证 /health 作为 permitAll 公开路径可被匿名访问。
 * </p>
 */
@WebMvcTest(HealthController.class)
@Import(SecurityConfig.class)
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthReturnsOk() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.status").value("ok"));
    }
}
