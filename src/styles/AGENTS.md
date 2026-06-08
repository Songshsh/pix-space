# Styles 规范

## 表述约定

- MUST：强制要求
- SHOULD：推荐做法
- AVOID：应避免

## Design Token

涉及以下内容，在不破坏 `--el-*` 主题链路的前提下，必须优先使用 token：

- MUST：color（主题主色消费除外；B/C 端主业务界面优先直接使用 `--el-*`）
- MUST：spacing
- MUST：radius
- MUST：shadow
- MUST：z-index

主题色来源补充约定：

- MUST：B 端与 C 端主业务界面的主题色统一以 `--el-*` 为唯一来源
- MUST：B 端主题色跟随后台“外观设置”变化，业务组件不得用固定品牌色替代 `--el-*`
- MUST：C 端主业务界面即使当前为固定紫色系，也应直接使用 `--el-*`；禁止在业务样式层增加 `ds -> el`、`el -> ds` 一类中间映射
- MUST：若 C 端固定主题预设需要写入 `--el-*`，只允许在统一主题初始化入口处理；业务样式层仍必须直接消费 `--el-*`
- MUST：`ds-color-brand*` 不得用于主业务交互态（如 hover、active、selected、focus、链接高亮、主按钮强调等）；仅可用于登录/注册与 403/404 状态页等少量非业务品牌装饰场景，或由统一主题切换入口管理固定的 C 端主题预设
- SHOULD：若 `ds-color-brand*` 仅服务于登录/注册等页面，优先收敛到对应页面样式文件；如暂未迁移，至少在定义处加注释说明适用范围

## 禁止事项

- MUST：禁止硬编码主题/品牌色系列；允许黑白灰与 transparent/currentColor 等基础色硬编码
- MUST：禁止随意新增层级
- MUST：禁止在组件/页面局部随意覆盖 Element Plus 主题变量；仅当属于组件个例且不具备跨模块复用价值时，允许在组件内局部覆盖；跨组件/跨页面的通用覆盖必须集中在 `src/styles/` 下
- MUST：禁止为了“统一 token”而把本应直接使用 `--el-*` 的主题消费点改成固定品牌 token
- MUST：禁止使用 `!important`，除非覆盖第三方库内联样式且无其他手段；每次使用必须注释原因

## 全局样式与覆盖策略

- MUST：需要全局样式（reset、主题类、组件库覆盖）时，只允许放在 `src/styles/` 下，避免散落在业务组件中
- MUST：Element Plus 的通用覆盖应集中在 `element-overrides.css` 或明确的主题文件中；组件个例覆盖可在局部实现，但需控制作用域并避免演变为通用规则
- SHOULD：全局覆盖同样优先使用 `tokens.css` 中的变量，避免引入新的硬编码值

## 新增 Token

新增 token 时：

- MUST：命名必须语义化
- MUST：保持层级统一
- SHOULD：优先复用现有 token

## 相关文件

- token 定义：[tokens.css](tokens.css)
- Element Plus 覆盖：[element-overrides.css](element-overrides.css)
- 登录/注册品牌样式：[auth-page.css](auth-page.css)
