package com.pixspace.backend.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer;

/**
 * Jackson 对 java.time 类型的全局序列化 / 反序列化格式配置。
 *
 * <p>
 * 背景：application.yml 中的 {@code spring.jackson.date-format} 只对旧式
 * {@code java.util.Date} 生效，
 * 对项目实体使用的 {@code java.time.LocalDateTime} 无效——后者由 JavaTimeModule 处理，
 * 默认输出带 T 的 ISO-8601（如 {@code 2026-07-21T10:00:00}）。
 * </p>
 *
 * <p>
 * 这里统一把 LocalDateTime / LocalDate / LocalTime 序列化为与 MySQL DATETIME 一致、不带 T 的格式，
 * 便于前端直接展示；反序列化按同一格式解析，保证入参与出参格式对称。
 * </p>
 *
 * <p>
 * 采用 {@link Jackson2ObjectMapperBuilderCustomizer} 做增量定制，只覆盖 java.time 的格式，
 * 不替换整个 ObjectMapper，从而保留 Spring Boot 其它 Jackson 自动配置。
 * </p>
 */
@Configuration
public class JacksonConfig {

    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Bean
    Jackson2ObjectMapperBuilderCustomizer javaTimeFormatCustomizer() {
        return builder -> {
            builder.serializers(
                    new LocalDateTimeSerializer(DATE_TIME),
                    new LocalDateSerializer(DATE),
                    new LocalTimeSerializer(TIME));
            builder.deserializers(
                    new LocalDateTimeDeserializer(DATE_TIME),
                    new LocalDateDeserializer(DATE),
                    new LocalTimeDeserializer(TIME));
        };
    }
}
