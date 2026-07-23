package com.pixspace.backend.config;

import io.minio.MinioClient;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MinIO 对象存储客户端配置。
 * 从 application-{profile}.yml 中读取 {@code app.storage.*} 配置项，
 * 构建 MinioClient Bean 供文件上传/下载 Service 注入使用。
 */
@Getter // 自动生成 getter
@Setter // 自动生成 setter（@ConfigurationProperties 绑定需要）
@Configuration
@ConfigurationProperties(prefix = "app.storage") // 将 YAML/Properties 中以 app.storage 为前缀的配置项自动绑定到这个类的同名字段上。
public class MinioConfig {
  private String endpoint; // MinIO 服务地址，如 http://localhost:9000
  private String accessKey; // MinIO 访问密钥（Access Key）
  private String secretKey; // MinIO 密钥（Secret Key）
  private String bucket; // MinIO 默认 Bucket 名称

  /**
   * 构建 MinioClient Bean。
   * 使用 {@link MinioClient#builder()} 根据注入的 endpoint 和凭据构建客户端实例，
   * 注册为 Spring 容器管理的单例 Bean，供 Service 层注入使用。
   */
  @Bean
  MinioClient minioClient() {
    return MinioClient.builder()
        .endpoint(endpoint) // 设置 MinIO 服务地址
        .credentials(accessKey, secretKey) // 设置访问密钥（Access Key）和密钥（Secret Key）
        .build(); // 构建并返回 MinioClient 对象
  }
}
