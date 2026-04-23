# Vue 3 + Element Plus + Pinia 项目模板

这是一个基于 Vue 3、Element Plus 和 Pinia 的前端工程模板。

## 功能特性

- ✅ Vue 3 组合式 API
- ✅ Element Plus 组件库
- ✅ Pinia 状态管理
- ✅ Vite 构建工具
- ✅ 示例组件和 Store

## 环境要求

本项目需要 Node.js 20.19.0 或更高版本。如果你的系统已安装 [nvm](https://github.com/nvm-sh/nvm)，项目已包含 `.nvmrc` 配置文件。

### 自动切换 Node 版本 (推荐)

如果你使用 nvm，进入项目目录后运行：

```bash
nvm use
```

这将自动切换到项目所需的 Node.js 版本 (v20.19.3)。

### 手动切换 Node 版本

如果你没有安装 nvm，可以手动安装并切换：

1. 安装 Node.js 20.19.3：

   ```bash
   nvm install 20.19.3
   nvm use 20.19.3
   ```

2. 验证版本：
   ```bash
   node --version  # 应该显示 v20.19.3
   npm --version   # 应该显示 v10.8.2
   ```

## 项目结构

```
vue-project/
├── public/              # 静态资源
├── src/
│   ├── components/      # Vue组件
│   ├── layouts/         # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   │   └── user.ts      # 用户 store
│   ├── views/           # 页面视图
│   │   ├── DashboardView.vue
│   │   ├── FileManagement.vue
│   │   ├── ImageManagement.vue
│   │   ├── LoginView.vue
│   │   ├── SettingsView.vue
│   │   └── UserManagement.vue
│   ├── App.vue          # 根组件
│   └── main.ts          # 应用入口
├── .env.example         # 环境变量示例
├── index.html           # HTML 模板
├── vite.config.ts       # Vite 配置
├── package.json         # 项目依赖
└── README.md
```

## 快速开始

### 配置环境变量

复制并按需修改：

```bash
cp .env.example .env
```

关键变量：

- `VITE_APP_API_BASE_URL`：后端 API 基地址
- `VITE_ALLOW_MOCK_AUTH`：开发环境下允许在登录接口不可用时使用模拟登录（默认关闭）
- `VITE_USE_MOCK_DATA`：页面是否使用 mock 数据（默认开启）

开发期推荐保持 `VITE_USE_MOCK_DATA=true`，项目会通过 MSW 拦截请求，让页面始终调用真实 API 形态，后续接入后端无需改页面。

相关文档：

- `docs/FRONTEND_SPEC.md`（前端开发综合规范）
- `design/pencil/README.md`（原型工作流约定）
- `src/api/README.md`（API 契约约定）
- `src/utils/README.md`（请求错误处理约定）
- `src/mocks/README.md`（Mock 方案）

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 主要依赖

- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - 基于 Vue 3 的组件库
- **Pinia** - Vue 官方推荐的状态管理库
- **Vite** - 下一代前端构建工具

## 使用说明

### Element Plus 组件

项目已全局注册 Element Plus 组件，可以直接在模板中使用：

```vue
<template>
  <el-button type="primary">主要按钮</el-button>
  <el-input v-model="text" placeholder="请输入" />
  <el-select v-model="value">
    <el-option label="选项1" value="1" />
  </el-select>
</template>
```

### Pinia Store

项目内置用户 Store：`src/stores/user.ts`

在组件中使用 Store：

```vue
<script setup>
import { useUserStore } from './stores/user';

const userStore = useUserStore();

console.log(userStore.userInfo);
</script>
```

### 图标使用

Element Plus 图标已全局注册，可以直接使用：

```vue
<template>
  <el-button :icon="Edit">编辑</el-button>
</template>

<script setup>
import { Edit } from '@element-plus/icons-vue';
</script>
```

## 自定义配置

### Vite 配置

修改 `vite.config.ts` 文件进行构建配置。

### 添加新依赖

```bash
npm install <package-name>
```

### 添加新的 Store

创建新的 Store 文件：

```javascript
// src/stores/example.js
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({
    data: null,
  }),
  // ... getters, actions
});
```

## 注意事项

1. 确保 Node.js 版本 >= 20.19.0 以获得最佳兼容性
2. 项目使用 Vue 3 组合式 API，推荐使用 `<script setup>` 语法
3. Element Plus 组件已通过 `unplugin-vue-components` 和 `unplugin-auto-import` 配置为**按需自动导入**，无需手动引入组件即可直接使用，且打包体积已自动优化。

## 许可证

ISC
