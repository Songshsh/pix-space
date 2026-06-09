# System Views 模块规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## 页面定位

- MUST：本目录只承载系统级状态页与兜底页，如 `403`、`404`
- MUST：页面职责聚焦状态表达、跳转引导与最小恢复路径
- AVOID：在本目录混入 Portal 或 Admin 的业务页面

## 路由与访问

- MUST：系统页路由声明以 `src/router/index.ts` 为准
- MUST：`403`、`404` 等状态页变更时，同步检查对应路由入口与测试覆盖
- SHOULD：状态页提供明确返回路径，如回首页、返回上一页或重新登录

## 样式与品牌边界

- MUST：状态页可以使用少量品牌化装饰，但不得扩散为主业务界面的并行主题体系
- MUST：样式约束仍遵循 `src/styles/AGENTS.md` 与全局 token 体系

## 相关规范

- 根视图规范：[../AGENTS.md](../AGENTS.md)
- 路由说明：[../../router/README.md](../../router/README.md)
- 路由约束：[../../router/AGENTS.md](../../router/AGENTS.md)
