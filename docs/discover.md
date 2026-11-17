# 「发现」页开发说明

「发现」页是一个类似健康社区 / 贴吧的信息流：可以浏览大家分享的医疗、养生内容，也可以自己发布图文帖子并点赞。数据全部保存在本机 MySQL，接口由项目内的 Express 提供，目前不依赖任何线上服务。

## 1. 已实现的功能

- **两列瀑布流**：卡片封面高度按帖子 id 稳定地"随机"成 6 档，两列长短错落；标题按长度估算显示 2–5 行，尽量完整显示，超出才用省略号。
- **列表信息**：封面、分类角标、标题、作者（首字头像 + 昵称）、点赞数。
- **搜索与分类**：顶部搜索框（350ms 防抖）按标题 / 正文模糊搜索；横向分类 chips 筛选。
- **帖子详情**：大图封面、分类、发布时间（同时显示相对时间和 `YYYY-MM-DD HH:mm`）、完整正文（按空行分段）、正文配图（可点开预览）、免责声明。
- **发布帖子**：分类、标题（≤80 字）、正文（≤5000 字）、封面（6 张内置 SVG 或上传自定义图）、正文配图（最多 9 张）、昵称（选填，会记住上次填写）。
- **点赞**：匿名的 `clientId` 存在 localStorage 里，同一浏览器重复点击是"点赞 / 取消点赞"；`like_count` 与点赞记录在同一个事务里更新。
- **体验细节**：骨架屏、空状态、接口失败重试、上拉自动加载更多、返回列表时恢复滚动位置、吸底 TabBar。

## 2. 本地运行

前置条件：Node.js `^22.18.0 || >=24.12.0`，本机 MySQL 8（默认 `127.0.0.1:3306`）。

```bash
# 1. 安装依赖
npm install

# 2. 配置数据库连接（Windows 下 copy，macOS/Linux 用 cp）
copy .env.example .env
#    然后编辑 .env，把 DB_PASSWORD 改成自己的 MySQL root 密码

# 3. 建库、建表、写入示例数据（可重复执行）
npm run db:init

# 4. 启动接口（终端 1，端口 3000）
npm run server

# 5. 启动前端（终端 2，端口 5173）
npm run dev
```

浏览器打开 <http://localhost:5173/discover>。

> 开发服务器只监听 `localhost`，个别环境用 `http://127.0.0.1:5173` 可能连不上，属正常现象。
> 如果 npm 没有权限写全局缓存（例如受限的实验室电脑），给 npm 命令加 `--cache .npm-cache` 即可，该项目已把 `.npm-cache` 加入 `.gitignore`。

### 生产构建 / 单端口预览

```bash
npm run build
npm run server
# 打开 http://127.0.0.1:3000/discover
```

`server/index.js` 在检测到 `dist/` 时会托管静态文件，并把非 `/api` 路径回退到 `index.html`，所以直接访问 `/discover/1` 这类前端路由也不会 404。

## 3. 数据库

库名默认 `tijian`，三张表：

| 表 | 作用 | 关键字段 |
| --- | --- | --- |
| `discover_posts` | 帖子 | `id, title, content, category, author, cover, like_count, created_at` |
| `discover_post_images` | 帖子正文配图（有序） | `post_id, url, sort_order` |
| `discover_likes` | 点赞去重 | `post_id, client_id`（联合主键） |

- `db/schema.sql` 建表，`db/seed.sql` 是 12 条示例帖。
- `npm run db:init` 会：建库 → 建表 → 仅当帖子表为空时写入示例数据 → 创建 `server/uploads/`。重复执行不会重复插入。
- MySQL 8 的数据文件默认在 MySQL 安装目录的 `data/` 下，不在项目目录里；所以这里用**初始化脚本**保证任何人拉下项目后都能一键重建，不把二进制库文件塞进仓库。
- 想彻底重来：先 `DROP DATABASE tijian;`，再执行 `npm run db:init`。

## 4. 接口

所有接口都以 `/api` 开头，开发环境由 Vite 代理到 `http://127.0.0.1:3000`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 服务与数据库状态 |
| GET | `/api/discover/meta` | 分类、内置封面、字数限制 |
| GET | `/api/discover/posts` | 列表，支持 `page`、`pageSize`（≤40）、`category`、`keyword`、`clientId` |
| GET | `/api/discover/posts/:id` | 详情，含配图与当前 `clientId` 是否点过赞 |
| POST | `/api/discover/posts` | 发布，body：`title, content, category, author, cover, images[]` |
| POST | `/api/discover/posts/:id/like` | 点赞 / 取消，body：`{ clientId }` |
| POST | `/api/uploads` | 图片上传，`multipart/form-data`，字段名 `file`，≤5MB |

列表返回结构：

```json
{
  "list": [
    {
      "id": 1,
      "title": "标题",
      "excerpt": "正文前 60 字…",
      "category": "养生保健",
      "author": "匿名用户",
      "cover": "/covers/cover-1.svg",
      "likeCount": 128,
      "createdAt": "2026-11-11T05:19:00.000Z",
      "liked": false
    }
  ],
  "total": 12,
  "page": 1,
  "pageSize": 12,
  "hasMore": false
}
```

## 5. 几个实现上的选择

- **瀑布流不是 CSS `column-count`**：把帖子按"预估高度"贪心分到左右两列（`titleLines * 20 + coverRatio * 100 + 46`），这样顺序稳定、不会出现某列被拉长后错位的问题。
- **封面高度"随机"但稳定**：`hashString(id + title)` 对 6 档比例取模，刷新不会跳变。
- **标题行数**：按当前列宽和每行约 15px 的汉字宽度估算，clamp 到 2–5 行，再用 `-webkit-line-clamp` 真正截断。
- **无登录体系**：点赞用 localStorage 里的随机 `clientId`；昵称同样本地记住，不涉及账号。
- **上传文件**：存到 `server/uploads/`，文件名带时间戳和随机串；该目录内容不进 Git，只保留 `.gitkeep`。

## 6. 自测

接口冒烟测试（需要先启动 `npm run server`）：

```bash
npm run test:api
```

会临时创建一条帖子、验证列表 / 详情 / 点赞切换 / 图片上传 / 参数校验，最后按 id 删除自己创建的数据。当前结果：**10/10 通过**。

前端已手动验证：列表加载、搜索、分类筛选、发布（含配图）→ 详情 → 点赞、TabBar 互相跳转、返回列表恢复滚动位置。

## 7. 常见问题

| 现象 | 处理 |
| --- | --- |
| `ECONNREFUSED 127.0.0.1:3306` | 启动 MySQL 服务（Windows 服务名通常是 `MySQL80`） |
| `ER_ACCESS_DENIED_ERROR` | `.env` 里的 `DB_PASSWORD` 不对，或 root 不允许该方式登录 |
| 页面提示"连不上本地接口" | 另开终端执行 `npm run server` |
| 上传后的图片 404 | 确认 `server/uploads/` 存在、接口已启动；Vite 已配置 `/uploads` 代理 |
| `npm run build` 报 `spawn EPERM` | 仅出现在受限沙箱环境，改用 `npx vite build --configLoader native` |
| 开发时右下角有黑色 V 圆球 | Vue DevTools 的悬浮球，只在开发环境出现，打包后没有 |
