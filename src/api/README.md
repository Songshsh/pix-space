# API 契约约定

## 响应格式

默认约定后端返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

- `code = 0` 表示成功，前端会自动取 `data` 作为最终返回值。
- `code != 0` 表示业务失败，前端会按错误处理策略抛出错误对象，并按需提示。

如果后端暂时无法按该格式返回，前端也兼容“直接返回 data”的形式，但建议尽快统一到上述结构。

## 鉴权接口

### 登录

`POST /auth/login`

请求：

```json
{ "email": "demo@example.com", "password": "******" }
```

响应 data：

```json
{
  "token": "access-token",
  "user": { "name": "Demo", "email": "demo@example.com" }
}
```

### 登出

`POST /auth/logout`

响应 data：`true`

### 当前用户

`GET /user/info`

响应 data：

```json
{ "user": { "name": "Demo", "email": "demo@example.com" } }
```

## 资源接口（示例）

### Dashboard

`GET /dashboard`

响应 data：

```json
{
  "stats": {
    "totalImages": 0,
    "totalUsers": 0,
    "totalFiles": 0,
    "totalViews": 0
  },
  "chartData": [],
  "recentActivities": [],
  "recentUploads": []
}
```

### 列表分页

推荐 query：

- `page`
- `pageSize`
- `keyword`（可选）

推荐响应 data：

```json
{ "list": [], "total": 0 }
```
