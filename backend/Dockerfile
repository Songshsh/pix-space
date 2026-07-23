# ╔══════════════════════════════════════════════════════════════╗
# ║           后端 Dockerfile（多阶段构建，最终镜像不含 Maven）     ║
# ╚══════════════════════════════════════════════════════════════╝
#
# Dockerfile 作用：把一个 Java 源码项目打包成一个可运行的 Docker 镜像。
# 镜像 = 应用程序 + 运行环境，可以在任何装了 Docker 的机器上启动。
#
# 「多阶段构建」的含义：
#   阶段一：用一个带 Maven + JDK 的大镜像编译源码 → 产出 app.jar
#   阶段二：扔掉 Maven/JDK，只用带 JRE 的瘦镜像运行 app.jar
#   好处：最终镜像体积从 600MB 缩减到约 150MB，且不含编译器和源码


# ══════════════════════════ 阶段一：编译构建 ═══════════════════════

# FROM：指定基础镜像，Docker 从 Docker Hub 拉取这个镜像作为起点
# maven:3.9-eclipse-temurin-17  =  内置 Maven 3.9 + JDK 17（Eclipse 发行版）
# AS builder = 给这个阶段起别名 builder，供阶段二用 COPY --from=builder 引用
FROM maven:3.9-eclipse-temurin-17 AS builder

# WORKDIR：设置工作目录，后续的 RUN/COPY 都在这个目录下执行
# 如果目录不存在则自动创建，相当于 mkdir /app && cd /app
WORKDIR /app

# ── 技巧：先只复制依赖文件，利用 Docker 构建缓存 ──
# Docker 每执行一条指令就生成一层缓存。如果某层的输入没变，该层及之前所有层直接复用缓存。
# pom.xml 很少改，mvnw 和 .mvn 几乎不改，把它们单独 COPY 可以保证"依赖下载"这一层长期有效。
#
# COPY：从宿主机（你的 Mac）复制文件到容器内
#   参数1：pom.xml mvnw   →  宿主机上的文件（相对 Dockerfile 所在目录）
#   参数2：./              →  容器内的目标路径（当前 WORKDIR，即 /app）
#   效果：/app/pom.xml、/app/mvnw
COPY pom.xml mvnw ./

# 复制 Maven Wrapper 的配置目录（内含 maven-wrapper.properties，指定 Maven 版本和下载地址）
COPY .mvn .mvn

# RUN：在容器内执行命令（shell 模式）
# ./mvnw = /app/mvnw（前一步 COPY 复制进来的 Maven Wrapper 脚本，./ 即 WORKDIR），无需容器内安装 Maven
# dependency:go-offline = Maven 插件目标，预先下载 pom.xml 声明的所有依赖到本地仓库
# -B = --batch-mode，非交互模式，不会等待用户输入
RUN ./mvnw dependency:go-offline -B

# ── 依赖下载好了，现在复制源码并编译 ──
COPY src src

# ./mvnw package = 执行 Maven 的「打包」生命周期：编译 → 测试 → 打包
# -DskipTests = 跳过测试执行（CI 流水线中应单独跑测试，这里只做编译打包）
# -B = 非交互模式
# 产物：/app/target/backend-0.0.1-SNAPSHOT.jar（名称由 pom.xml 的 artifactId 决定）
RUN ./mvnw package -DskipTests -B


# ══════════════════════════ 阶段二：运行镜像 ═══════════════════════

# 第二个 FROM = 切换基础镜像，之前阶段的环境全部丢弃，重新开始
# eclipse-temurin:17-jre = 只包含 Java 17 运行时，不包含编译器（javac）
# 对比 maven 镜像（~400MB），JRE 镜像只需 ~100MB
FROM eclipse-temurin:17-jre
WORKDIR /app

# 安装 curl：供 docker-compose / 编排系统的 healthcheck 探测 Actuator readiness 端点使用
# --no-install-recommends 只装必要包，装完清理 apt 缓存，尽量不撑大镜像体积
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# ── 安全加固：创建一个非 root 系统用户来运行应用 ──
# 默认容器以 root 运行，一旦应用被攻破，攻击者在容器内即拥有 root 权限，风险更大，
# 故新建专用用户来跑 Java 进程。下面先建一个「组」、再建一个「用户」，两者同名为 spring
# （Linux 惯例：用户的主组与用户同名）。各参数含义：
#   groupadd --system spring          新建一个组，组名 spring（--system：系统级组，非普通登录用户使用）
#   useradd  --system                 新建一个用户（--system：系统级用户，不用于人工登录）
#            --gid spring             把该用户的主组指定为上面那个 spring 组
#            --home /app              指定用户家目录为 /app（应用所在目录）
#            --shell /usr/sbin/nologin 登录 shell 设为 nologin，禁止该用户交互式登录
#            spring                   末尾这个位置参数是新用户的用户名（故用户也叫 spring）
RUN groupadd --system spring \
    && useradd --system --gid spring --home /app --shell /usr/sbin/nologin spring

# COPY --from=builder = 从阶段一（别名 builder）的文件系统复制文件
# /app/target/*.jar = 阶段一编译产出的 jar 包（通配符 * 匹配任意文件名）
# app.jar = 重命名为 app.jar，方便后续 CMD/ENTRYPOINT 引用
# --chown=spring:spring：复制进来的 jar 归属非 root 用户 spring，确保其有读权限
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# EXPOSE：声明容器运行时监听的端口（仅文档用途，不自动映射端口）
# 实际的宿主机 ↔ 容器端口映射在 docker-compose.yml 的 ports 字段配置
# 值与 application.yml 的 server.port 保持一致
EXPOSE 8080

# ENTRYPOINT：容器启动时执行的命令（不可被 docker run 后的命令覆盖）
# 数组格式 ["可执行文件", "参数1", "参数2", ...]
#   优点：不经过 /bin/sh 解析，避免 shell 变量注入和信号转发问题
#   等价于在终端执行：java -jar app.jar
# 生产部署时可通过 docker compose 的 environment 传入 SPRING_PROFILES_ACTIVE=prod 切换环境
# USER：切换到非 root 用户运行后续进程（此行之后的 ENTRYPOINT/CMD 都以 spring 用户身份执行）
USER spring
ENTRYPOINT ["java", "-jar", "app.jar"]
