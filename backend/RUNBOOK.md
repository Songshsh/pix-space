# Java 后端运行手册

> ⚠️ 本文档中出现的数据库密码、MinIO 凭据等仅适用于本地 Docker 开发环境。
> 生产环境请通过环境变量注入，参考 `.env.prod.example`。

本文档记录 Pix Space 当前 Java 后端的启动、停止、验证与常见排障命令。

适用范围：

- `backend/` 下的 Spring Boot 后端
- `docker-compose.dev.yml` 管理的本地基础设施

当前默认约定：

- 项目 Docker MySQL：`localhost:3307`
- 系统历史 MySQL：`localhost:3306`
- Redis：`localhost:6379`
- MinIO API：`http://localhost:9000`
- MinIO Console：`http://localhost:9001`
- Backend：`http://127.0.0.1:8080`
- Swagger：`http://127.0.0.1:8080/swagger-ui.html`

相关配置位置：

- `docker-compose.dev.yml`
- `backend/src/main/resources/application-dev.yml`

## 一、启动基础设施

在项目根目录执行：

```bash
docker compose -f docker-compose.dev.yml up -d
```

说明：

- `-f docker-compose.dev.yml`：`-f` = file，指定用哪个 compose 配置文件
- `up`：创建并启动所有服务容器
- `-d`：detach，后台运行，不阻塞终端（去掉 `-d` 可前台运行，能实时看到日志，Ctrl+C 即停止）
- 启动 `pix-space-mysql`、`pix-space-redis`、`pix-space-minio`

预期结果：

- 命令成功返回
- 容器状态变为 `Up`

查看容器状态：

```bash
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

说明：

- `-a`：all，包括已停止的容器（不加只显示运行中的）
- `--format`：自定义输出列为表格，`{{.Names}}` 容器名、`{{.Status}}` 状态、`{{.Ports}}` 端口映射

预期结果：

- 看到至少以下三个容器：
- `pix-space-mysql`
- `pix-space-redis`
- `pix-space-minio`

## 二、启动 backend

在项目根目录执行：

```bash
cd backend
./mvnw spring-boot:run
```

说明：

- 启动 Spring Boot 后端
- 启动时会连接 MySQL / Redis，并执行 Flyway 迁移

预期结果：

- 日志中出现 `Tomcat started on port 8080`
- 日志中出现 `Started BackendApplication`

> 停止顺序：先 `Ctrl + C` 停后端，再参考「十一、停止 Docker」停容器。

## 三、停止 backend

如果 backend 就在当前终端前台运行：

```text
Ctrl + C
```

说明：

- 停止当前 Spring Boot 进程

预期结果：

- 终端返回命令行提示符

## 四、查找 8080 端口占用

查谁在监听后端端口：

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

说明：

- `lsof`：list open files，列出打开的文件/网络连接
- `-n`：不把 IP 转成域名（避免 DNS 查询卡顿）
- `-P`：不把端口号转成服务名（直接显示 8080 而不是 http-alt）
- `-iTCP:8080`：只看 TCP 协议 8080 端口
- `-sTCP:LISTEN`：state，只看状态为 LISTEN（正在监听）的连接

预期结果：

- 正常会看到 `java` 进程监听 `*:8080`

示例：

```text
COMMAND   PID USER   FD   TYPE ... NAME
java    58529  sss  ...   TCP *:8080 (LISTEN)
```

其中：

- `PID` 就是要关注的进程号

## 五、按 PID 关闭 backend

正常结束进程：

```bash
kill <PID>
```

说明：

- 将 `<PID>` 替换成上一条命令查到的真实进程号

示例：

```bash
kill 58529
```

预期结果：

- 命令执行后无输出
- 再次检查 `8080` 时不再有监听

再次确认端口是否已释放：

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

预期结果：

- 没有任何输出

## 六、重新启动 backend

改完 Java 文件后，最稳的方式是重启 backend。

重启前先确保旧 backend 已停止：

- 如果 backend 就在当前终端前台运行：参考"三、停止 backend"
- 如果不确定 backend 是谁启动的：参考"四、查找 8080 端口占用"
- 如果查到了旧 backend 进程：参考"五、按 PID 关闭 backend"

确认旧进程已停止后，在项目根目录执行：

```bash
cd backend
./mvnw spring-boot:run
```

说明：

- 对当前项目来说，重启 backend 就等于重新编译并重新加载改动后的 Java 代码

预期结果：

- 新日志启动成功
- 重新访问 Swagger 时看到更新后的返回值

## 七、验证 backend 是否可访问

检查健康检查接口：

```bash
curl -s http://127.0.0.1:8080/health
```

说明：

- 如果超时或无响应，说明本机代理劫持了请求，改用 `curl --noproxy '*' -s http://127.0.0.1:8080/health` 跳过代理即可
- `curl -s`：silent，不显示进度条和错误信息，只输出响应内容

预期结果：

```json
{ "code": 0, "message": "ok", "data": { "status": "ok" } }
```

检查 Actuator 探针（容器编排 liveness/readiness 用）：

```bash
curl -s http://127.0.0.1:8080/actuator/health/liveness
curl -s http://127.0.0.1:8080/actuator/health/readiness
```

说明：

- liveness 反映进程是否存活；readiness 含 db/redis 连通性，二者独立
- readiness 返回 `{"status":"UP"}` 才表示数据库与 Redis 均就绪；若 db/redis 不可用会返回 `503` + `{"status":"DOWN"}`
- `show-details: never`，对外只返回 UP/DOWN，不暴露内部依赖细节

预期结果：

```json
{ "status": "UP" }
```

检查 Swagger 页面是否可访问：

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/swagger-ui.html
```

说明：

- `/dev/null` 是系统自带的"黑洞"文件，写入的内容会被直接丢弃，不占磁盘也不回显到屏幕
- `-o /dev/null`：把 Swagger 返回的几百行 HTML 丢进黑洞，你只需要状态码不需要看页面内容
- `-w "%{http_code}\n"`：只输出 HTTP 状态码（`\n` 是换行，避免结果后面紧跟终端提示符变成 `302%`）
- 返回 `200` 或 `302` 都表示正常

预期结果：

- 返回 `302` 或 `200`

浏览器访问地址：

- `http://127.0.0.1:8080/swagger-ui.html`

## 八、查看数据库

查看项目数据库列表：

```bash
docker exec pix-space-mysql mysql -upix -ppix123456 -e "SHOW DATABASES;"
```

说明：

- `docker exec`：在已有容器内执行命令
- `mysql -u`：user，数据库用户名
- `mysql -p`：password，密码直接跟在后面（注意 `-p` 和密码之间没有空格）
- `mysql -e`：execute，执行后面的 SQL 后自动退出，不用进入交互式 shell

预期结果：

- 能看到 `pix_space`（另外的 `information_schema`、`performance_schema` 是系统库，不用管；`mysql` 系统库只有 root 能看到）

查看项目库中的表：

```bash
docker exec pix-space-mysql mysql -upix -ppix123456 -D pix_space -e "SHOW TABLES;"
```

说明：

- `-D pix_space`：Database，指定要操作的数据库（等效于先 `USE pix_space;`）

预期结果：

- 当前至少能看到：
- `users`
- `user_preferences`
- `files`
- `images`
- `image_tags`
- `boards`
- `board_images`
- `flyway_schema_history`

进入 MySQL 命令行：

```bash
docker exec -it pix-space-mysql mysql -upix -ppix123456
```

说明：

- `-it`：`-i`（interactive）+ `-t`（tty，分配伪终端），合起来让你能在容器内交互式操作，就像直接 SSH 进去一样

进入后常用命令：

```sql
SHOW DATABASES;              -- 列出所有你有权限看的库
USE pix_space;               -- 切换到项目库
SHOW TABLES;                 -- 列出当前库的所有表
DESC users;                  -- 查看 users 表的结构（字段名、类型、是否可空等）
SELECT * FROM users;         -- 查 users 表全部数据
SELECT COUNT(*) FROM images; -- 统计 images 表有多少行
EXIT;                        -- 退出 MySQL 命令行（QUIT 也行）
```

确认 MySQL 用户使用的认证插件：

```bash
docker exec pix-space-mysql mysql -uroot -proot -e \
  "SELECT user, plugin FROM mysql.user WHERE user='pix';"
```

- `-uroot -proot`：必须用 root 才能查 `mysql.user` 系统表，`pix` 用户权限不够
- `plugin` 列应为 `caching_sha2_password`（MySQL 8.0+ 默认），说明 MySQL 没被降级

## 九、DBeaver 连接参数

当前项目应连接 Docker MySQL，而不是系统历史 MySQL。

连接参数：

```text
Host: localhost
Port: 3307
Database: pix_space
Username: pix
Password: pix123456
```

说明：

- `3307` 是项目 Docker MySQL
- `3306` 是系统历史 MySQL，不用于当前项目

## 十、Redis 与 MinIO 验证

验证 Redis：

```bash
docker exec pix-space-redis redis-cli ping
```

说明：

- `redis-cli ping`：Redis 自带的心跳检测命令，返回 `PONG` 说明连接正常

预期结果：

```text
PONG
```

MinIO Console 地址：

- `http://localhost:9001`

默认登录信息：

```text
username: minioadmin
password: minioadmin
```

## 十一、停止 Docker

```bash
docker compose -f docker-compose.dev.yml down
```

说明：

- `down`：停止并移除 infra 容器（MySQL / Redis / MinIO），数据卷保留不删

预期结果：

- `docker ps` 中不再看到 pix-space 容器

如需同时删除数据卷（清空所有数据重新开始）：

```bash
docker compose -f docker-compose.dev.yml down -v
```

说明：

- `-v`：volumes，连数据卷一起删除（清空数据库、Redis 缓存、MinIO 文件，彻底重置）

---

## 十二、Docker 镜像构建

镜像本身**不分 dev 或 prod**——它只包含 app.jar + JRE，三份配置文件（`application.yml`、`-dev.yml`、`-prod.yml`）全在里面。用哪份由启动时的环境变量决定：

- dev compose 不设 `SPRING_PROFILES_ACTIVE` → 走 `application.yml` 里的默认值 `dev` → 加载 `application-dev.yml`（连 `localhost:3307`）
- prod compose 设 `SPRING_PROFILES_ACTIVE=prod` → 覆盖默认值 → 加载 `application-prod.yml`（连 Docker 内网的 `mysql:3306`）

同一个镜像，不同环境变量，不同行为。

```bash
# 构建镜像（在项目根目录执行）
docker build -f backend/Dockerfile -t pix-space-backend:latest ./backend
```

- `-f backend/Dockerfile`：file，指定 Dockerfile 的位置
- `-t pix-space-backend:latest`：tag，给镜像打标签（`:` 前镜像名，后版本号）
- `./backend`：构建上下文目录，COPY 指令以此目录为根
- 多阶段构建：第一阶段用 Maven + JDK 编译打包，第二阶段只保留 JRE + app.jar

如果要部署到其他服务器，把镜像推到 Docker Hub：

```bash
# 打上 Docker Hub 规范的标签，然后推送（需先在 hub.docker.com 注册并 docker login）
docker tag pix-space-backend:latest 你的用户名/pix-space-backend:latest
docker push 你的用户名/pix-space-backend:latest
```

- `docker tag 原名 新名`：给已有镜像打新标签，不改镜像内容
- `docker push`：上传到 Docker Hub

预期结果：

- 构建成功，`docker images | grep pix-space-backend` 能看到该镜像
- 推送成功后 Docker Hub 上能看到你的镜像仓库

⚠ **不能 `docker run` 单独测试此镜像**。镜像内三份配置全有，默认走 dev 连 `localhost:3307`，容器内部没有 MySQL 会报 `Communications link failure`。必须通过 `docker compose` 和 MySQL/Redis/MinIO 一起启动。

### 远端操作速查

```bash
# 重新打标签
docker tag pix-space-backend:latest pix-space-backend:v2.0

# 从远端拉取
docker pull 你的用户名/pix-space-backend:latest

# 代码更新后，重新构建并推送
docker build -f backend/Dockerfile -t 你的用户名/pix-space-backend:latest ./backend
docker push 你的用户名/pix-space-backend:latest

# 删除本地镜像
docker rmi pix-space-backend:old-tag

# 清理悬挂镜像（标签 <none> 的旧版本，释放磁盘空间）
docker image prune
```

- `docker pull`：从 Docker Hub 下载
- `docker rmi`：remove image，删除本地镜像
- `docker image prune`：清理 `docker build` 产生的旧版残留

---

## 十三、生产部署

生产 compose 定义了 4 个服务：`backend`、`mysql`、`redis`、`minio`。其中 `mysql` / `redis` / `minio` 直接拉取官方镜像。

> 后端镜像如何构建和推送，见「十二、Docker 镜像构建」。这里只讲部署。

### 方案 A：先推镜像再部署（最佳实践，推荐）

代码不直接上生产服务器。本地（或 CI）打好镜像推到仓库，服务器从仓库拉取。

```bash
# 1. 把 compose 和 .env.prod 传到服务器
# user@your-server 替换为实际值，如 root@192.168.1.100（IP）或 root@example.com（域名）
scp docker-compose.prod.yml user@your-server:/opt/pix-space/
scp backend/.env.prod user@your-server:/opt/pix-space/

# 2. 在服务器上启动（compose 里的 image: 会从 Docker Hub 拉取镜像）
ssh user@your-server
cd /opt/pix-space
docker compose -f docker-compose.prod.yml --env-file backend/.env.prod up -d
```

- `scp`：secure copy，通过 SSH 把文件传到远程服务器

### 方案 B：代码已在服务器上，直接从源码构建部署（单机简化）

如果代码已经通过 git clone 等方式到了服务器，可以不推镜像仓库。

1. 编辑 `docker-compose.prod.yml`，取消 `build:` 的注释，注释掉 `image:` 行
2. 执行：

```bash
cp backend/.env.prod.example backend/.env.prod
vim backend/.env.prod  # 填入真实密码和密钥

docker compose -f docker-compose.prod.yml --env-file backend/.env.prod up -d
```

- `--env-file`：从指定文件读取环境变量注入容器

### 预期结果

- `docker ps` 看到 4 个容器均为 `Up`：`pix-space-backend-prod`、`pix-space-mysql-prod`、`pix-space-redis-prod`、`pix-space-minio-prod`
- 优先验证编排探针（与 `docker-compose.prod.yml` 的 healthcheck 一致，含 db/redis 就绪）：`curl -s http://localhost:8080/actuator/health/readiness` 返回 `{"status":"UP"}`
- 业务连通性快速自检（走统一返回体 `ApiResponse`）：`curl -s http://localhost:8080/health` 返回 `{"code":0,"message":"ok",...}`

### 网络拓扑与 Cookie 前提（重要）

本项目默认按**同源部署**设计：前端与后端 API 通过同一个 Nginx 反向代理对外，浏览器看到的是同一个站点（同一域名，Nginx 把 `/api` 之类路径转发给 backend）。这一前提直接影响 Session/CSRF Cookie 是否能正常携带：

- Session/CSRF Cookie 的 `SameSite=Lax`（见 `application.yml`）。在**同源反代**下，前端 fetch 会正常带上 Cookie，登录态正常，且比 `None` 更安全，是推荐拓扑。
- 若将来改为**跨站部署**（前端与后端 API 分属不同站点，如 `app.x.com` + `api.y.com`），`SameSite=Lax` 会导致跨站 fetch **不携带** Session/CSRF Cookie，表现为「明明登录了却一直 401」。此时必须：
  - 把 Cookie 改为 `SameSite=None; Secure`（`None` 必须同时 `Secure`，即强制 HTTPS）；
  - 在 `CORS_ALLOWED_ORIGINS` 里精确列出前端域名（不能用 `*`，因为要 `allowCredentials`）。
- 反代场景下已配置 `server.forward-headers-strategy: framework`（见 `application-prod.yml`），使 Spring 正确识别 `X-Forwarded-Proto` 的 https 与真实客户端 IP。

> 一句话：**默认同源反代，跨站部署需改 `SameSite=None; Secure` 并配好 CORS 白名单。**

---

## 十四、Maven 常用命令（在 backend/ 下执行）

编译（不启动）：

```bash
cd backend
./mvnw compile
```

运行测试：

```bash
./mvnw test
```

打包（跳过测试）：

```bash
./mvnw package -DskipTests
```

说明：

- `-DskipTests`：`-D` 定义 JVM 系统属性，`skipTests=true` 跳过测试执行（编译阶段仍会编译测试代码）

清理构建产物（遇到奇怪报错时先执行，再重新编译）：

```bash
./mvnw clean
```

说明：

- 以上命令均通过 `mvnw`（Maven Wrapper）执行，不需要宿主机安装 Maven

---

## 十五、MinIO 控制台操作

1. 浏览器打开 `http://localhost:9001`
2. 登录：用户名 `minioadmin`，密码 `minioadmin`
3. 创建 Bucket：`Buckets` → `Create Bucket` → 名称填 `pix-space-dev`
   - `pix-space-dev` 与 `application-dev.yml` 中的 `app.storage.bucket` 保持对应

---

## 十六、当前后端关键文件索引

### 启动与入口

- 主入口：[`src/main/java/com/pixspace/backend/BackendApplication.java`](src/main/java/com/pixspace/backend/BackendApplication.java)
- 健康检查：[`src/main/java/com/pixspace/backend/modules/system/controller/HealthController.java`](src/main/java/com/pixspace/backend/modules/system/controller/HealthController.java)

### 配置

- 公共配置：[`src/main/resources/application.yml`](src/main/resources/application.yml)
- 开发环境：[`src/main/resources/application-dev.yml`](src/main/resources/application-dev.yml)
- 生产环境：[`src/main/resources/application-prod.yml`](src/main/resources/application-prod.yml)
- 生产环境变量模板：[`.env.prod.example`](.env.prod.example)

### 数据库

- 用户与偏好表：[`src/main/resources/db/migration/V1__init_core_tables.sql`](src/main/resources/db/migration/V1__init_core_tables.sql)
- 文件与图片表：[`src/main/resources/db/migration/V2__init_file_and_image_tables.sql`](src/main/resources/db/migration/V2__init_file_and_image_tables.sql)
- 画板与标签表：[`src/main/resources/db/migration/V3__init_boards_and_tags.sql`](src/main/resources/db/migration/V3__init_boards_and_tags.sql)

### 构建与部署

- Docker 镜像构建：[`Dockerfile`](Dockerfile)
- 构建排除规则：[`.dockerignore`](.dockerignore)
- 项目依赖：[`pom.xml`](pom.xml)
- 开发基础设施：[`../docker-compose.dev.yml`](../docker-compose.dev.yml)
- 生产部署编排：[`../docker-compose.prod.yml`](../docker-compose.prod.yml)

### 核心代码

- 统一返回结构：[`src/main/java/com/pixspace/backend/common/api/ApiResponse.java`](src/main/java/com/pixspace/backend/common/api/ApiResponse.java)
- 全局异常处理：[`src/main/java/com/pixspace/backend/common/exception/GlobalExceptionHandler.java`](src/main/java/com/pixspace/backend/common/exception/GlobalExceptionHandler.java)
- 安全配置：[`src/main/java/com/pixspace/backend/config/SecurityConfig.java`](src/main/java/com/pixspace/backend/config/SecurityConfig.java)
- Session 配置：[`src/main/java/com/pixspace/backend/config/SessionConfig.java`](src/main/java/com/pixspace/backend/config/SessionConfig.java)
- 密码编码器：[`src/main/java/com/pixspace/backend/config/AppConfig.java`](src/main/java/com/pixspace/backend/config/AppConfig.java)
- 分页插件：[`src/main/java/com/pixspace/backend/config/MybatisPlusConfig.java`](src/main/java/com/pixspace/backend/config/MybatisPlusConfig.java)
- MinIO 客户端：[`src/main/java/com/pixspace/backend/config/MinioConfig.java`](src/main/java/com/pixspace/backend/config/MinioConfig.java)
- 自动填充：[`src/main/java/com/pixspace/backend/config/MyMetaObjectHandler.java`](src/main/java/com/pixspace/backend/config/MyMetaObjectHandler.java)

---

## 十七、Docker 基础命令速查

以下命令面向初次接触 Docker 的人，解释每条命令做了什么、什么时候用。

### 镜像（安装包）相关

```bash
# 列出本地所有镜像
docker images
```

你能看到类似：

```
REPOSITORY            TAG       IMAGE ID      SIZE
pix-space-backend     dev       b150c9ec6a85  581MB
mysql                 8.4       abc123...     600MB
redis                 7         def456...     100MB
minio/minio           latest    ghi789...     200MB
```

每一行是一个镜像。**镜像 = 安装包，不能直接用，需要启动成容器。**

Docker Desktop 中：左侧菜单 → **Images** 标签可看到相同内容。

```bash
# 删除指定镜像
docker rmi pix-space-backend:dev
```

### 容器（运行实例）相关

```bash
# 查看正在运行的容器
docker ps
```

能看到类似：

```
CONTAINER ID   IMAGE          STATUS          PORTS
abc123         mysql:8.4      Up 2 hours      0.0.0.0:3307->3306/tcp
def456         redis:7        Up 2 hours      0.0.0.0:6379->6379/tcp
```

Docker Desktop 中：左侧菜单 → **Containers** 标签可看到相同内容。

```bash
# 查看所有容器（包括已停止的）
docker ps -a
```

区别：

- `docker ps` = 只看正在跑的
- `docker ps -a` = 看全部，包括已停止的

```bash
# 查看容器日志
docker logs pix-space-mysql           # 全部日志
docker logs --tail 50 pix-space-mysql  # 最近 50 行
```

这是排查容器问题的第一步：容器启动失败时，先用 `docker logs` 看错误信息。

### 镜像 vs 容器（新手必读）

```
docker build  →  产生镜像（安装包），放在仓库里
docker run    →  基于镜像创建并启动一个容器（运行实例）

镜像 = 一次构建，永久存储
容器 = 运行时实例，可以创建、停止、删除
```

一个镜像可以启动多个容器（就像一个安装包可以在多台机器上安装运行）。

Docker Desktop 中验证：

- **Images** 标签里的 `pix-space-backend:dev` = 你刚构建的镜像
- **Containers** 标签里的 `pix-space-mysql` 等 = 正在运行的容器

---

## 十八、常见排障

以下按你执行操作时可能遇到问题的先后顺序排列（拉镜像 → 启容器 → 启后端 → 验证）。

### 1. Docker 构建镜像时网络超时

完整错误信息：

```
failed to fetch oauth token: dial tcp ... i/o timeout
```

或下载镜像层时卡住不动。

原因：

- 国内网络访问 Docker Hub（`docker.io`）可能很慢或超时

修复（任选其一）：

- **方案 A：配置 Docker Desktop 镜像加速**（推荐）

  Docker Desktop → 设置 → Docker Engine，在 JSON 中加入以下内容，然后 Apply & Restart：

  ```json
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run"
  ]
  ```

- **方案 B：使用代理**
  Docker Desktop → 设置 → Resources → Proxies，填入代理地址。需要 Clash 开启 Allow LAN（允许局域网连接）

### 2. Docker MySQL 启动失败

查看容器状态：

```bash
docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

查看 MySQL 日志：

```bash
docker logs --tail 120 pix-space-mysql
```

说明：

- `--tail 120`：只显示最后 120 行（不加会输出全部日志，可能很长）

### 3. 后端启动报 `Public Key Retrieval is not allowed`

完整错误信息：

```
Public Key Retrieval is not allowed
```

原因：

- MySQL 8.0 开始默认认证插件是 `caching_sha2_password`，JDBC 驱动连接时需要从服务器获取 RSA 公钥来验证密码
- 但 JDBC 驱动默认 `allowPublicKeyRetrieval=false`，导致连接失败

修法——在 JDBC 连接串（dev 为 `application-dev.yml`，prod 为 `docker-compose.prod.yml` 的 `DB_URL`）中加上参数：

```
allowPublicKeyRetrieval=true
```

即连接串改为 `jdbc:mysql://...?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=...`。

修改后重启后端即可生效。

### 4. backend 启动了，但 curl 访问 8080 失败

先检查 8080 是否在监听：

```bash
lsof -nP -iTCP:8080 -sTCP:LISTEN
```

如果监听正常，说明是本机代理劫持了 `curl`。去掉代理再试一次（两种写法等价，推荐前者）：

```bash
# 简洁写法（推荐）
curl --noproxy '*' -s http://127.0.0.1:8080/health

# 完整写法（等价，显式去掉所有代理变量）
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY -u all_proxy \
curl -s http://127.0.0.1:8080/health
```
