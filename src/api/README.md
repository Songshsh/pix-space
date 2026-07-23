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
{ "email": "admin@pixspace.test", "password": "<non-empty-password>" }
```

响应 data：

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "email": "admin@pixspace.test",
    "role": "admin"
  }
}
```

说明：登录成功后由后端通过 Cookie 建立会话，前端不保存 token。

失败时返回 `401`，message 为登录失败原因；若账号存在但被停用，返回 `403`。

### 注册

`POST /auth/register`

请求：

```json
{
  "name": "pixelUser",
  "email": "user@example.com",
  "password": "<user-password>"
}
```

响应 data：`true`

邮箱重复时返回 `400`，message 为 `该邮箱已被注册`。

### 登出

`POST /auth/logout`

响应 data：`true`

### 忘记密码

`POST /auth/forgot-password`

请求：

```json
{ "email": "user@pixspace.test" }
```

响应 data：`true`

说明：无论邮箱是否存在，前端均按统一成功语义处理，避免泄露账号存在性。

### 当前会话

`GET /auth/session`

响应 data：

```json
{
  "user": {
    "id": 1,
    "name": "admin",
    "email": "admin@pixspace.test",
    "role": "admin"
  }
}
```

无有效会话时返回 `401`。

说明：该请求用于应用启动阶段的静默会话探测；前端调用时应带 `skipAuthRedirect: true`，避免把启动探测的 `401` 误走全局认证失效跳转链路。

## 资源接口（示例）

### Explore 数据

`GET /explore`

响应 data：

```json
{
  "categories": ["全部"],
  "searchTags": ["全部"],
  "relatedSearches": ["设计系统"],
  "items": [
    {
      "id": "img-1",
      "title": "灵感素材 1",
      "imageHeight": 300,
      "bgColor": "var(--el-color-primary-light-9)",
      "imageUrl": "/mock-images/sample-01.png",
      "tags": ["UI设计"],
      "author": { "id": 201, "username": "User 1" }
    }
  ]
}
```

### 仪表盘

`GET /dashboard`

说明：仅 `admin` 可访问；未登录返回 `401`，非管理员返回 `403`。

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

## 用户资料接口

### 更新用户资料

`PUT /user/profile`

请求 data：

```json
{
  "name": "新昵称",
  "email": "new@pixspace.test",
  "phone": "13800000000",
  "bio": "个人简介",
  "avatar": "data:image/png;base64,..."
}
```

类型：`Partial<AuthUser>`

响应 data：

```json
{
  "name": "新昵称",
  "email": "new@pixspace.test",
  "role": "admin",
  "phone": "13800000000",
  "bio": "个人简介",
  "avatar": "data:image/png;base64,..."
}
```

类型：`AuthUser`

### 删除账户

`DELETE /user/account`

响应 data：`true`

### 获取账户偏好

`GET /user/preferences`

响应 data：

```json
{
  "twoFactorEnabled": false,
  "notifications": {
    "system": true,
    "email": true,
    "upload": false,
    "comment": true
  }
}
```

### 更新账户偏好

`PUT /user/preferences`

请求 data：

```json
{
  "twoFactorEnabled": true,
  "notifications": {
    "system": true,
    "email": false,
    "upload": true,
    "comment": true
  }
}
```

响应 data：更新后的完整账户偏好对象

### 修改密码

`PUT /user/password`

请求 data：

```json
{ "oldPassword": "Old123!", "newPassword": "New123!" }
```

响应 data：`true`

旧密码错误时返回 `400`，message 为失败原因。

## 图片管理接口

说明：以下后台图片管理接口仅 `admin` 可访问；未登录返回 `401`，非管理员返回 `403`。

### 图片列表

`GET /images`

query：

- `page` — 页码
- `pageSize` — 每页条数
- `query`（可选）— 搜索关键词
- `sortBy`（可选）— 排序字段
- `collection`（可选）— 所属合集
- `tag`（可选）— 标签筛选

响应 data：

```json
{
  "list": [],
  "total": 0
}
```

类型：`{ list: Image[], total: number }`

### 图片详情

`GET /images/:id`

响应 data：

```json
{
  "id": "img-1",
  "title": "灵感素材 2",
  "createdAt": "2026-05-25",
  "tags": [],
  "author": { "id": 202, "username": "User 2" },
  "isLiked": false,
  "source": "explore"
}
```

类型：`ImageDetail`

说明：图片不存在时返回 `404`。

### 上传图片

`POST /images/upload`

请求：`FormData`（包含图片文件）

响应 data：`true`

### 删除图片

`DELETE /images/:id`

响应 data：`true`

### 更新图片

`PUT /images/:id`

请求 data：

```json
{ "title": "新的图片名称", "isFavorite": true, "tags": ["自然", "城市"] }
```

类型：`{ title?: string; isFavorite?: boolean; tags?: string[] }`

响应 data：`true`

### 下载图片

`GET /images/:id/download`

响应为原始 blob，前端使用 `requestRaw` 发起请求，不走自动解包。

## 文件管理接口

说明：以下后台文件管理接口仅 `admin` 可访问；未登录返回 `401`，非管理员返回 `403`。

### 文件列表

`GET /files`

query：

- `page` — 页码
- `pageSize` — 每页条数
- `keyword`（可选）— 搜索关键词
- `parentId`（可选）— 当前目录 ID；不传表示根目录

响应 data：

```json
{
  "list": [],
  "total": 0
}
```

类型：`{ list: FileItem[], total: number }`

### 上传文件

`POST /files/upload`

请求：

- body：`FormData`（包含文件）
- query：`parentId`（可选，目标目录 ID；不传表示上传到根目录）

响应 data：

```json
{
  "id": "1001",
  "name": "example.pdf",
  "type": "document",
  "size": 1024,
  "updatedAt": "2026-05-22",
  "parentId": "1"
}
```

类型：`FileItem`

### 更新文件

`PUT /files/:id`

请求 data：

```json
{ "name": "重命名后的文件名.pdf" }
```

类型：`{ name: string }`

响应 data：`FileItem`

### 删除文件

`DELETE /files/:id`

响应 data：`true`

### 创建文件夹

`POST /files/folder`

请求 data（二选一）：

```json
{ "name": "新文件夹", "parentId": "1" }
```

或

```json
{ "name": "新文件夹", "parentPath": ["我的文件", "项目资料"] }
```

响应 data：

```json
{ "id": "1001", "name": "新文件夹", "parentId": "1" }
```

类型：`{ id: string, name: string, parentId?: string, parentPath?: string[] }`

### 下载文件

`GET /files/:id/download`

响应为原始 blob，前端使用 `requestRaw` 发起请求，不走自动解包。

## 用户管理接口（后台）

说明：以下后台用户管理接口仅 `admin` 可访问；未登录返回 `401`，非管理员返回 `403`。

### 用户列表

`GET /users`

query：

- `page` — 页码
- `pageSize` — 每页条数
- `username`（可选）— 用户名筛选
- `email`（可选）— 邮箱筛选
- `status`（可选）— 状态筛选

响应 data：

```json
{
  "list": [],
  "total": 0
}
```

类型：`{ list: User[], total: number }`

### 创建用户

`POST /users`

请求 data：

```json
{
  "username": "new-user",
  "email": "new@pixspace.test",
  "password": "<user-password>",
  "role": "user",
  "status": "active"
}
```

类型：`UserForm`

响应 data：`User`

### 更新用户

`PUT /users/:id`

请求 data：

```json
{
  "username": "updated-user",
  "email": "updated@pixspace.test",
  "role": "viewer",
  "status": "inactive"
}
```

类型：`UserForm`

响应 data：`User`

说明：创建/更新时若用户名或邮箱重复，返回 `400`，message 为失败原因。

### 更新用户状态

`PATCH /users/:id/status`

请求 data：

```json
{ "status": "active" }
```

类型：`{ status: "active" | "inactive" }`

响应 data：`User`

### 删除用户

`DELETE /users/:id`

响应 data：`true`

## 用户画板接口（前台）

### 用户主页摘要

`GET /users/:userId/summary`

响应 data：

```json
{
  "profile": {
    "id": 101,
    "username": "pixelNomad",
    "bio": "记录灵感与收藏"
  },
  "stats": {
    "publicBoards": 12,
    "publicUploads": 86,
    "likes": 240
  }
}
```

类型：`UserBoardsSummary`

### 用户画板列表

`GET /users/:userId/boards?page=1&pageSize=20`

响应 data：

```json
{
  "list": [],
  "page": 1,
  "pageSize": 20,
  "total": 0,
  "hasMore": false
}
```

类型：`PagedListResult<Board>`

说明：本人视角返回全部画板；访客视角仅返回 `public` 画板。

### 用户上传列表

`GET /users/:userId/uploads?page=1&pageSize=20&keyword=&sort=newest`

响应 data：

```json
{
  "list": [],
  "page": 1,
  "pageSize": 20,
  "total": 0,
  "hasMore": false
}
```

类型：`PagedListResult<UploadImage>`

说明：本人视角返回全部上传记录；访客视角仅返回 `public` 上传内容，`private/pending` 不可见。

### 用户赞过列表

`GET /users/:userId/likes?page=1&pageSize=20&keyword=`

响应 data：

```json
{
  "list": [],
  "page": 1,
  "pageSize": 20,
  "total": 0,
  "hasMore": false
}
```

类型：`PagedListResult<LikedImage>`

### 创建画板

`POST /users/:userId/boards`

请求 data：

```json
{
  "name": "灵感收集",
  "description": "收集配色和构图参考",
  "visibility": "public"
}
```

类型：`BoardFormPayload`

响应 data：`Board`

说明：仅当前登录用户可在自己的 `/users/:userId/*` 空间下创建画板；未登录返回 `401`，越权返回 `403`。

### 更新画板

`PUT /boards/:boardId`

请求 data：

```json
{
  "name": "灵感收集",
  "description": "更新后的描述",
  "visibility": "private"
}
```

类型：`BoardFormPayload`

响应 data：`Board`

说明：仅画板所有者可更新；前端只需传 `boardId`，由服务端根据当前会话判断归属与权限；未登录返回 `401`，无权限返回 `403`，画板不存在时返回 `404`；名称为空等校验失败时返回 `400`。

### 删除画板

`DELETE /boards/:boardId`

响应 data：`true`

说明：仅画板所有者可删除；前端只需传 `boardId`，由服务端根据当前会话判断权限；未登录返回 `401`，无权限返回 `403`。

### 采集图片到画板

`POST /users/:userId/boards/:boardId/collect`

请求 data：

```json
{
  "imageId": "upload-1",
  "source": "upload"
}
```

类型：`{ imageId: string; source: "upload" | "like" | "explore" | "gallery" }`

响应 data：`Board`

说明：仅当前登录用户可在自己的空间内采集到自己的画板；未登录返回 `401`，越权返回 `403`。采集按图片真实来源执行，不再要求“先点赞再采集”；画板或图片不存在时返回 `404`，重复采集等业务失败返回 `400`。

### 更新已上传图片状态

`PATCH /users/:userId/uploads/:imageId/status`

请求 data：

```json
{ "status": "public" }
```

类型：`{ status: UploadImageStatus }`

响应 data：`UploadImage`

说明：仅当前登录用户可更新自己上传图片的状态；未登录返回 `401`，越权返回 `403`。

### 删除已上传图片

`DELETE /users/:userId/uploads/:imageId`

响应 data：`true`

说明：仅当前登录用户可删除自己的上传内容；未登录返回 `401`，越权返回 `403`。

### 取消点赞图片

`DELETE /users/:userId/likes/:imageId`

响应 data：`true`

说明：仅当前登录用户可取消自己点赞的图片；未登录返回 `401`，越权返回 `403`。

### 点赞图片

`POST /users/:userId/likes/:imageId`

响应 data：`true`

说明：仅当前登录用户可点赞到自己的点赞列表；未登录返回 `401`，越权返回 `403`。

## 画板详情接口（前台）

### 画板详情

`GET /boards/:boardId`

响应 data：

```json
{
  "id": "1",
  "title": "界面设计灵感",
  "description": "整理 Web 与 App 端界面设计参考。",
  "imageCount": 4,
  "visibility": "public",
  "canEdit": false,
  "owner": { "id": 101, "username": "Username" },
  "images": []
}
```

类型：`BoardDetail`

说明：`canEdit` 表示当前登录用户是否可编辑该画板；画板不存在时返回 `404`；画板为私有且无权限时返回 `403`。

### 上传图片到画板

`POST /boards/:boardId/images/upload`

请求：`FormData`

- `files`：图片文件数组（可重复 append 多次）

响应 data：`BoardDetail`（上传完成后的最新画板详情）

说明：仅画板所有者可上传；未登录返回 `401`，无权限返回 `403`；未选择文件或超过数量限制返回 `400`。
