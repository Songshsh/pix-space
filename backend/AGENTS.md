# Java 后端模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 技术栈

| 组件           | 版本/选型                                     |
| -------------- | --------------------------------------------- |
| Java           | 17                                            |
| Spring Boot    | 3.5.0                                         |
| 构建工具       | Maven（Maven Wrapper）                        |
| 数据库         | MySQL 8.4（开发端口 3307）                    |
| ORM            | MyBatis-Plus 3.5.7                            |
| 数据库迁移     | Flyway（含 flyway-mysql）                     |
| 缓存与 Session | Redis 7 + Spring Session Data Redis           |
| 安全框架       | Spring Security（CSRF Cookie + Session 认证） |
| API 文档       | springdoc-openapi 2.8.9                       |
| 健康探针       | Spring Boot Actuator（liveness/readiness）    |
| 对象存储       | MinIO 8.5.17                                  |
| 参数校验       | Spring Boot Validation                        |
| 工具           | Lombok                                        |

## 包结构约定

- MUST：业务代码按 `modules/{模块名}/` 分包，模块内按 `controller`、`service`、`mapper`、`entity`、`dto` 分层
- MUST：跨模块共享的通用代码放在 `common/` 包
- SHOULD：配置类统一放在 `config/` 包

示例结构：

```
com.pixspace.backend
├── common
│   ├── api          → 统一响应体 ApiResponse
│   └── exception    → 全局异常处理
├── config           → SecurityConfig、SessionConfig、AppConfig、MybatisPlusConfig、MinioConfig
└── modules
    ├── auth         → 认证模块（login/register/logout/session）
    ├── user         → 用户模块（profile/preferences/password）
    ├── adminuser    → 后台用户管理
    ├── file         → 文件管理（上传/下载/文件夹）
    ├── image        → 图片管理
    └── system       → 系统模块（health 等基础设施接口）
```

## 数据库迁移（Flyway）

- MUST：所有 DDL 变更通过 Flyway 迁移脚本进行，禁止手动改库
- MUST：迁移脚本放在 `src/main/resources/db/migration/`
- MUST：命名规则 `V{序号}__{描述}.sql`，序号递增，双下划线分隔
- MUST：新迁移不得修改已执行的旧迁移（Flyway checksum 校验）

## 接口规范

- MUST：统一使用 `com.pixspace.backend.common.api.ApiResponse` 作为返回体
- MUST：分页接口返回 `{ list, total, page, pageSize, hasMore }`
- SHOULD：请求体使用 DTO + `@Valid` 校验
- SHOULD：Controller 只做参数接收与结果返回，业务逻辑放 Service

## 安全

- MUST：公开路径在 SecurityConfig.permitAll() 中显式声明
- MUST：敏感配置（密码、密钥）通过环境变量注入，不在代码中硬编码
- MUST：密码统一使用 BCryptPasswordEncoder 编码存储
- MUST：角色→Spring 权限映射统一约定：DB `users.role` 存小写（admin/user/viewer），构造 `UserDetails`/权限时必须转为大写并加 `ROLE_` 前缀（如 `ROLE_ADMIN`），与 `hasRole("ADMIN")` 匹配。Spring 不做自动大小写/前缀映射，禁止直接用 DB 原值当权限名
- MUST：细粒度授权用方法级注解 `@PreAuthorize`（已在 SecurityConfig 开启 `@EnableMethodSecurity`）；方法级抛出的 `AuthenticationException`/`AccessDeniedException` 由 `GlobalExceptionHandler` 统一转 401（40100）/403（40300）JSON，新增鉴权分支不得让其落到 500 兜底
- MUST：生产走 HTTPS，Session / CSRF Cookie 均开启 `Secure`（由 `server.servlet.session.cookie.secure` 单一开关控制，prod=true / dev 默认 false）
- MUST：生产环境关闭 Swagger / OpenAPI（`springdoc.api-docs.enabled=false`、`springdoc.swagger-ui.enabled=false`）
- MUST：生产 Redis 开启密码认证（容器 `--requirepass` + `spring.data.redis.password`）

## 健康检查

- MUST：容器编排探针使用 Actuator 端点，不依赖业务 `/health`
  - liveness：`/actuator/health/liveness`（失败触发重启）
  - readiness：`/actuator/health/readiness`（含 db/redis，失败仅摘流量不重启）
- MUST：`/actuator/**` 仅暴露 `health` 且 `show-details: never`，不对外泄露内部依赖细节
- MUST：actuator health 端点需在 SecurityConfig 中显式 permitAll（探针无法携带认证）

## 测试

- MUST：Web 层单元测试优先用 `@WebMvcTest`（仅加载 Controller + 安全链），不依赖 MySQL/Redis/MinIO，保证无基础设施的 CI 可稳定运行
- SHOULD：需真实依赖的集成测试（含 DB/Redis 的全上下文）待引入 Testcontainers 后再补；新增 Testcontainers 等测试依赖需先评审确认
- AVOID：用 `@SpringBootTest` 加载全上下文做“冒烟”测试（会因连不上基础设施而在 CI 失败）

## 关键文件

- 公共配置：[src/main/resources/application.yml](src/main/resources/application.yml)
- 开发环境：[src/main/resources/application-dev.yml](src/main/resources/application-dev.yml)
- 生产环境：[src/main/resources/application-prod.yml](src/main/resources/application-prod.yml)
- 运行手册：[RUNBOOK.md](RUNBOOK.md)
- 生产环境变量模板：[.env.prod.example](.env.prod.example)

## 相关文档

- 项目根规则：[../.trae/rules/project_rules.md](../.trae/rules/project_rules.md)
- 文档地图：[../docs/README.md](../docs/README.md)
- 认证架构：[../docs/AUTH_ARCHITECTURE.md](../docs/AUTH_ARCHITECTURE.md)
