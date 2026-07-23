# Java Backend Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Pix Space 初始化一套可与现有前端联调的 Java 后端开发基线，包括本地环境、基础设施、工程骨架、核心配置与首批接口落地顺序。

**Architecture:** 采用单体后端架构，在项目根目录新增 `backend/`，使用 `Spring Boot 3 + MySQL 8 + Redis + Spring Session + Spring Security + MyBatis-Plus + MinIO + Flyway`。前端继续保持现有 `Cookie Session` 与 `{ code, message, data }` 契约不变，后端按认证、用户、文件、图片、画板、后台管理等业务域拆模块。

**Tech Stack:** Java 17, Spring Boot 3, Maven Wrapper, MySQL 8, Redis 7, MinIO, MyBatis-Plus, Flyway, springdoc-openapi, Docker Compose

---

## File Structure

- Create: `backend/`
- Create: `backend/pom.xml`
- Create: `backend/mvnw`
- Create: `backend/mvnw.cmd`
- Create: `backend/.mvn/wrapper/*`
- Create: `backend/src/main/java/com/pixspace/backend/PixSpaceBackendApplication.java`
- Create: `backend/src/main/java/com/pixspace/backend/common/api/ApiResponse.java`
- Create: `backend/src/main/java/com/pixspace/backend/common/exception/GlobalExceptionHandler.java`
- Create: `backend/src/main/java/com/pixspace/backend/common/config/CorsProperties.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/WebCorsConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/SecurityConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/SessionConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/OpenApiConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/modules/auth/*`
- Create: `backend/src/main/java/com/pixspace/backend/modules/user/*`
- Create: `backend/src/main/java/com/pixspace/backend/modules/adminuser/*`
- Create: `backend/src/main/java/com/pixspace/backend/modules/file/*`
- Create: `backend/src/main/java/com/pixspace/backend/modules/image/*`
- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/resources/application-dev.yml`
- Create: `backend/src/main/resources/application-prod.yml`
- Create: `backend/src/main/resources/db/migration/V1__init_core_tables.sql`
- Create: `backend/src/main/resources/db/migration/V2__init_file_and_image_tables.sql`
- Create: `docker-compose.dev.yml`
- Modify: `.env.example`
- Modify: `docs/README.md`

### Task 1: 安装本地必备工具

**Files:**

- Modify: 无

- [ ] **Step 1: 安装 JDK 17**

```bash
brew install openjdk@17
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
java -version
```

Expected: 输出 `17.x` 版本号。

- [ ] **Step 2: 安装 Docker Desktop**

```bash
brew install --cask docker
open -a Docker
```

Expected: Docker Desktop 正常启动，菜单栏出现 Docker 图标。

- [ ] **Step 3: 安装开发与调试工具**

```bash
brew install --cask intellij-idea-ce
brew install --cask dbeaver-community
```

Expected: `IntelliJ IDEA` 可打开 Java 项目，`DBeaver` 可用于连接 MySQL。

- [ ] **Step 4: 验证 Docker 可用**

```bash
docker --version
docker compose version
```

Expected: 能输出 Docker 与 Compose 版本信息，无权限错误。

### Task 2: 新增后端目录并初始化工程

**Files:**

- Create: `backend/`
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/pixspace/backend/PixSpaceBackendApplication.java`

- [ ] **Step 1: 在项目根目录创建后端目录**

```bash
mkdir -p /Users/sss/Pro/pix-space/backend
```

Expected: 根目录下出现 `backend/`。

- [ ] **Step 2: 使用 Spring Initializr 生成基础工程**

依赖选择：

```text
Spring Web
Spring Security
Spring Data Redis
MySQL Driver
MyBatis Framework
Flyway Migration
Validation
Lombok
```

工程参数：

```text
Project: Maven
Language: Java
Spring Boot: 3.x
Group: com.pixspace
Artifact: backend
Name: backend
Package name: com.pixspace.backend
Java: 17
```

Expected: 生成含 `mvnw`、`pom.xml`、`src/main` 的 Spring Boot 工程。

- [ ] **Step 3: 确认应用入口最小可运行**

```java
package com.pixspace.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PixSpaceBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(PixSpaceBackendApplication.class, args);
  }
}
```

- [ ] **Step 4: 启动空工程验证**

Run:

```bash
cd /Users/sss/Pro/pix-space/backend
./mvnw spring-boot:run
```

Expected: 启动成功，控制台出现 `Started PixSpaceBackendApplication`。

### Task 3: 编写 `pom.xml` 依赖清单

**Files:**

- Modify: `backend/pom.xml`

- [ ] **Step 1: 补齐核心依赖**

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
  </dependency>
  <dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.7</version>
  </dependency>
  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
  </dependency>
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.6.0</version>
  </dependency>
  <dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>8.5.12</version>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

- [ ] **Step 2: 加入 Maven 插件**

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
    </plugin>
  </plugins>
</build>
```

- [ ] **Step 3: 验证依赖解析**

Run:

```bash
cd /Users/sss/Pro/pix-space/backend
./mvnw -q -DskipTests dependency:resolve
```

Expected: 依赖正常解析，无 `Could not resolve` 错误。

### Task 4: 使用 Docker Compose 启动基础设施

**Files:**

- Create: `docker-compose.dev.yml`

- [ ] **Step 1: 编写 Compose 文件**

```yaml
services:
  mysql:
    image: mysql:8.4
    container_name: pix-space-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pix_space
      MYSQL_USER: pix
      MYSQL_PASSWORD: pix123456
    ports:
      - '3306:3306'
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - pix-space-mysql-data:/var/lib/mysql

  redis:
    image: redis:7
    container_name: pix-space-redis
    ports:
      - '6379:6379'
    volumes:
      - pix-space-redis-data:/data

  minio:
    image: minio/minio:latest
    container_name: pix-space-minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - pix-space-minio-data:/data

volumes:
  pix-space-mysql-data:
  pix-space-redis-data:
  pix-space-minio-data:
```

- [ ] **Step 2: 启动容器**

Run:

```bash
cd /Users/sss/Pro/pix-space
docker compose -f docker-compose.dev.yml up -d
```

Expected: `mysql`、`redis`、`minio` 三个容器均为 `running`。

- [ ] **Step 3: 验证基础设施连通性**

Run:

```bash
docker ps
docker exec -it pix-space-mysql mysql -upix -ppix123456 -e "SHOW DATABASES;"
docker exec -it pix-space-redis redis-cli ping
```

Expected:

```text
mysql: 可看到 pix_space
redis: PONG
```

### Task 5: 编写应用配置

**Files:**

- Create: `backend/src/main/resources/application.yml`
- Create: `backend/src/main/resources/application-dev.yml`
- Modify: `.env.example`

- [ ] **Step 1: 编写通用配置**

```yaml
spring:
  application:
    name: pix-space-backend
  profiles:
    active: dev
  jackson:
    time-zone: Asia/Shanghai
    date-format: yyyy-MM-dd HH:mm:ss

server:
  port: 8080
  servlet:
    session:
      cookie:
        http-only: true
        same-site: lax
        name: PIX_SPACE_SESSION
```

- [ ] **Step 2: 编写开发环境配置**

> 注：本步为初始规划快照，最终配置以 `backend/src/main/resources/application-dev.yml` 为准（dev 端口已改为 3307，并补充 `allowPublicKeyRetrieval=true`）。

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/pix_space?useSSL=false&serverTimezone=Asia/Shanghai&connectionCollation=utf8mb4_unicode_ci
    username: pix
    password: pix123456
  data:
    redis:
      host: localhost
      port: 6379
  session:
    store-type: redis
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 30MB

app:
  cors:
    allowed-origins:
      - http://localhost:5173
  storage:
    endpoint: http://localhost:9000
    access-key: minioadmin
    secret-key: minioadmin
    bucket: pix-space-dev
```

- [ ] **Step 3: 为前端 `.env.example` 补充真实后端模式说明**

```bash
VITE_USE_MOCK_DATA=false
VITE_APP_API_BASE_URL=http://localhost:8080
```

- [ ] **Step 4: 启动后端验证配置生效**

Run:

```bash
cd /Users/sss/Pro/pix-space/backend
./mvnw spring-boot:run
```

Expected: 无数据库或 Redis 配置缺失错误。

### Task 6: 建立统一返回体与全局异常处理

**Files:**

- Create: `backend/src/main/java/com/pixspace/backend/common/api/ApiResponse.java`
- Create: `backend/src/main/java/com/pixspace/backend/common/exception/GlobalExceptionHandler.java`

- [ ] **Step 1: 实现统一返回体**

```java
package com.pixspace.backend.common.api;

public record ApiResponse<T>(int code, String message, T data) {
  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(0, "ok", data);
  }

  public static <T> ApiResponse<T> fail(int code, String message, T data) {
    return new ApiResponse<>(code, message, data);
  }
}
```

- [ ] **Step 2: 实现全局异常处理**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public ApiResponse<Object> handleException(Exception ex) {
    return ApiResponse.fail(50000, ex.getMessage(), null);
  }
}
```

- [ ] **Step 3: 添加最小健康检查接口验证返回格式**

```java
@RestController
@RequestMapping("/health")
public class HealthController {
  @GetMapping
  public ApiResponse<String> health() {
    return ApiResponse.ok("ok");
  }
}
```

- [ ] **Step 4: 访问接口验证**

Run:

```bash
curl http://localhost:8080/health
```

Expected:

```json
{ "code": 0, "message": "ok", "data": "ok" }
```

### Task 7: 配置 CORS、Session 与安全基线

**Files:**

- Create: `backend/src/main/java/com/pixspace/backend/config/WebCorsConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/SecurityConfig.java`
- Create: `backend/src/main/java/com/pixspace/backend/config/SessionConfig.java`

- [ ] **Step 1: 配置 CORS，允许前端本地联调**

```java
configuration.setAllowedOrigins(List.of("http://localhost:5173"));
configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
configuration.setAllowedHeaders(List.of("*"));
configuration.setAllowCredentials(true);
```

- [ ] **Step 2: 配置安全白名单**

公开接口：

```text
/auth/login
/auth/register
/auth/forgot-password
/health
/v3/api-docs/**
/swagger-ui/**
```

管理员接口前缀：

```text
/dashboard
/users/**
```

- [ ] **Step 3: 启用 Redis Session**

```java
@Configuration
@EnableRedisHttpSession
public class SessionConfig {
}
```

- [ ] **Step 4: 验证 Swagger 与未登录访问行为**

Run:

```bash
open http://localhost:8080/swagger-ui/index.html
curl -i http://localhost:8080/auth/session
```

Expected:

```text
Swagger 页面可打开
/auth/session 返回 401
```

### Task 8: 初始化数据库迁移脚本

**Files:**

- Create: `backend/src/main/resources/db/migration/V1__init_core_tables.sql`
- Create: `backend/src/main/resources/db/migration/V2__init_file_and_image_tables.sql`

- [ ] **Step 1: 创建核心用户表**

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  avatar_url VARCHAR(255) NULL,
  phone VARCHAR(32) NULL,
  bio VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_preferences (
  user_id BIGINT PRIMARY KEY,
  two_factor_enabled TINYINT(1) NOT NULL DEFAULT 0,
  notify_system TINYINT(1) NOT NULL DEFAULT 1,
  notify_email TINYINT(1) NOT NULL DEFAULT 1,
  notify_upload TINYINT(1) NOT NULL DEFAULT 0,
  notify_comment TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users(id)
);
```

- [ ] **Step 2: 创建文件与图片表**

```sql
CREATE TABLE files (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT NOT NULL,
  parent_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(32) NOT NULL,
  object_key VARCHAR(255) NULL,
  mime_type VARCHAR(128) NULL,
  size BIGINT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE images (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_id BIGINT NOT NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

- [ ] **Step 3: 启动应用触发 Flyway**

Run:

```bash
cd /Users/sss/Pro/pix-space/backend
./mvnw spring-boot:run
```

Expected: 日志出现 `Flyway` 执行成功信息。

### Task 9: 先落地认证最小链路

**Files:**

- Create: `backend/src/main/java/com/pixspace/backend/modules/auth/controller/AuthController.java`
- Create: `backend/src/main/java/com/pixspace/backend/modules/auth/dto/*`
- Create: `backend/src/main/java/com/pixspace/backend/modules/auth/service/AuthService.java`
- Create: `backend/src/main/java/com/pixspace/backend/modules/auth/service/SessionUser.java`

- [ ] **Step 1: 优先实现现有前端已依赖的认证接口**

接口清单：

```text
POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/forgot-password
GET /auth/session
```

- [ ] **Step 2: 返回结构严格对齐前端**

登录/会话响应：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": {
      "id": 1,
      "name": "admin",
      "email": "admin@pixspace.test",
      "role": "admin"
    }
  }
}
```

- [ ] **Step 3: 用 Session 保存当前用户最小信息**

```java
public record SessionUser(Long id, String name, String email, String role) {
}
```

- [ ] **Step 4: 联调验证**

Run:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" \
  -d '{"email":"admin@pixspace.test","password":"123456"}' \
  http://localhost:8080/auth/login

curl -i -b cookies.txt http://localhost:8080/auth/session
```

Expected:

```text
登录响应头含 Set-Cookie
会话接口返回当前用户
```

### Task 10: 补齐首批用户接口与联调配置

**Files:**

- Create: `backend/src/main/java/com/pixspace/backend/modules/user/*`
- Modify: `.env.example`
- Modify: `docs/README.md`

- [ ] **Step 1: 实现用户相关首批接口**

```text
PUT /user/profile
GET /user/preferences
PUT /user/preferences
DELETE /user/account
PUT /user/password
```

- [ ] **Step 2: 对照前端字段命名**

关键字段：

```text
AuthUser: id, name, email, role, avatar, phone, bio
UserPreferences: twoFactorEnabled, notifications.system/email/upload/comment
```

- [ ] **Step 3: 修改前端环境变量**

```bash
VITE_USE_MOCK_DATA=false
VITE_APP_API_BASE_URL=http://localhost:8080
```

- [ ] **Step 4: 启动前后端联调**

Run:

```bash
cd /Users/sss/Pro/pix-space/backend && ./mvnw spring-boot:run
cd /Users/sss/Pro/pix-space && npm run dev
```

Expected:

```text
前端登录成功
刷新后通过 /auth/session 恢复登录态
账户页能读写资料和偏好
```

### Task 11: 第二阶段接口顺序

**Files:**

- Create later: `backend/src/main/java/com/pixspace/backend/modules/adminuser/*`
- Create later: `backend/src/main/java/com/pixspace/backend/modules/file/*`
- Create later: `backend/src/main/java/com/pixspace/backend/modules/image/*`

- [ ] **Step 1: 先做后台用户管理**

```text
GET /users
POST /users
PUT /users/{id}
PATCH /users/{id}/status
DELETE /users/{id}
```

- [ ] **Step 2: 再做文件管理**

```text
GET /files
POST /files/upload
POST /files/folder
PUT /files/{id}
DELETE /files/{id}
GET /files/{id}/download
```

- [ ] **Step 3: 再做图片管理**

```text
GET /images
GET /images/{id}
POST /images/upload
PUT /images/{id}
DELETE /images/{id}
GET /images/{id}/download
```

- [ ] **Step 4: 最后做聚合页**

```text
GET /dashboard
GET /explore
/boards/*
/users/:userId/boards*
```

### Task 12: 验收清单

**Files:**

- Modify: `docs/README.md`

- [ ] **Step 1: 验收本地开发环境**

```text
JDK 17 可用
Docker 可用
MySQL/Redis/MinIO 容器正常运行
```

- [ ] **Step 2: 验收后端基础能力**

```text
Spring Boot 项目可启动
Swagger 可访问
Flyway 自动建表成功
ApiResponse 格式统一
CORS + Cookie Session 可联调
```

- [ ] **Step 3: 验收认证链路**

```text
登录成功写入 Cookie
刷新后 /auth/session 可恢复登录态
登出后会话失效
401/403 与前端预期一致
```

- [ ] **Step 4: 验收文档同步**

```text
docs/README.md 增加 backend 启动入口
.env.example 增加真实后端配置说明
```
