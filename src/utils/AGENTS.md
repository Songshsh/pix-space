# Utils 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 职责边界

- MUST：`src/utils/` 仅承载通用工具、请求基础设施与无页面归属的底层能力
- MUST：请求基础设施统一收敛到 `request.ts` 及其直接依赖中
- MUST：页面与业务组件不得绕过 `src/api/` 直接调用底层 request
- AVOID：把业务领域判断、页面状态或组件交互塞进 utils

## 请求与错误处理

- MUST：新增或修改请求层公共行为时，同步更新 `README.md`
- MUST：错误归一化、toast、401 跳转等公共策略只能在请求层集中维护
- MUST：启动期会话探测、下载等特殊请求的约定，必须在文档中说明适用场景
- SHOULD：新增配置项时给出默认行为、覆盖方式与典型调用示例

## 修改原则

- SHOULD：优先复用已有工具，避免创建语义重复的辅助函数
- MUST：修改 request 行为时评估 `src/api/`、`src/mocks/`、路由守卫与认证启动链路的影响
- MUST：若公共行为变更影响调用方感知，需同步更新 `docs/README.md` 中的入口索引

## 相关文档

- 错误与请求约定：[README.md](README.md)
- API 契约：[../api/README.md](../api/README.md)
- Mock 方案：[../mocks/README.md](../mocks/README.md)
