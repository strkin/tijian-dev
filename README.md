# tiJian 健康服务平台

大学实训课小组项目：一个面向手机端的健康服务网页。前端使用 Vue 3 + Vite + Element Plus，页面按 750px 宽的移动端容器设计。

目前包含登录、注册、首页、商城、「发现」健康社区、个人中心和体检相关页面；其中「发现」页接的是项目内的 Express + 本地 MySQL，其余页面是静态 UI 或本地模拟数据。

## 技术栈

- Vue 3.5 / Vue Router 5 / Vite 8
- Element Plus 2.14 + `@element-plus/icons-vue`
- Express 5 + MySQL 8（`mysql2`、`multer`）
- 开发时 Vite 把 `/api`、`/uploads` 代理到 `http://127.0.0.1:3000`

## 本地运行

前置条件：Node.js `^22.18.0 || >=24.12.0`，本机 MySQL 8。

```bash
npm install

# 配置数据库（Windows 用 copy，macOS/Linux 用 cp）
copy .env.example .env
# 编辑 .env，把 DB_PASSWORD 改成自己的 MySQL 密码

npm run db:init   # 建库、建表、写入示例帖
npm run server    # 终端 1：接口服务，端口 3000
npm run dev       # 终端 2：前端，端口 5173
```

打开 [http://localhost:5173](http://localhost:5173)，登录后进入首页；发现页地址是 [http://localhost:5173/discover](http://localhost:5173/discover)。

生产构建：`npm run build` 后执行 `npm run server`，直接访问 [http://127.0.0.1:3000/discover](http://127.0.0.1:3000/discover)（Express 会托管 `dist/` 并做 SPA 路由回退）。

## 新机器启动「发现」页（打不开先看这里）

「发现」页的数据来自项目内的 Express 接口 + 本机 MySQL，**只执行 `npm run dev` 是打不开的**：页面会提示连不上接口，或列表一直停在加载状态。新机器请按下面的顺序完整走一遍，每步都有可核对的预期结果。

### 0. 确认拿到的是最新代码

```bash
git pull origin main
npm run
```

`npm run` 打印的命令列表里必须能看到 `server`、`db:init`、`test:api`。

如果报 `npm error Missing script: "server"`，不是 npm 坏了，而是本地的 `package.json` 还是旧版本（历史上 `package.json` 和 `vite.config.js` 在合并时被其他分支覆盖过，导致服务端脚本、依赖和 `/api` 代理一起丢失）。处理方式：先 `git pull origin main`；本地有改动拉不下来时，先 `git stash` 再拉，或换一个干净目录重新 clone。不要靠删 `node_modules` 解决这个问题。

### 1. 检查 Node.js 版本

```bash
node -v
```

需要 `v22.18+` 或 `v24.12+`（推荐 Node 24 LTS）。版本过低时 `npm install` 可能只警告，但 `npm run dev` 会直接启动失败。

### 2. 安装依赖

```bash
npm install
```

**每次拉到改动 `package.json` 的更新后都要重跑一次**，否则会出现"脚本存在但依赖没装"的报错。受限电脑若报缓存目录权限错误，改用：

```bash
npm install --cache .npm-cache
```

### 3. 创建 `.env`（新机器最容易漏的一步）

`.env` 里有数据库密码，已被 `.gitignore` 忽略，所以**新机器 clone 下来一定没有这个文件**，必须从示例复制：

```bash
# Windows
copy .env.example .env
# macOS / Linux
cp .env.example .env
```

然后编辑 `.env`，把 `DB_PASSWORD` 改成这台机器 MySQL 的真实密码（不要加引号）：

```ini
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=tijian
```

### 4. 启动 MySQL 8

确认本机 MySQL 服务已运行、3306 端口可连接。Windows 下常见服务名是 `MySQL80`：

```powershell
Get-Service MySQL80 | Start-Service
```

### 5. 初始化数据库

```bash
npm run db:init
```

成功的输出会包含 `数据库 tijian 就绪`、`数据表已创建 / 已存在`，首次还会写入 12 条示例帖。脚本可重复执行，不会重复插入数据。想彻底重来：先在 MySQL 里 `DROP DATABASE tijian;`，再执行一次。

### 6. 启动接口和前端（两个终端）

```bash
# 终端 1：接口服务，端口 3000
npm run server

# 终端 2：前端，端口 5173
npm run dev
```

Windows 也可以直接双击项目根目录的 [run.bat](run.bat)，它会自动开两个窗口并打开首页。

### 7. 三步验证

1. 接口直连：打开 [http://127.0.0.1:3000/api/health](http://127.0.0.1:3000/api/health)，应返回 `{"ok":true,"db":"up"}`。
2. 代理转发：打开 [http://localhost:5173/api/health](http://localhost:5173/api/health)，返回内容应与上一步一致。
3. 打开 [http://localhost:5173/discover](http://localhost:5173/discover)，能看到瀑布流帖子即完成。

### 发现页打不开：按现象对照排查

| 现象                                                    | 原因                                                         | 处理                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `npm error Missing script: "server"`                  | 本机 `package.json` 是旧版本                               | 回到第 0 步，`git pull origin main` 后重试                            |
| 页面提示"连不上本地接口" / `fetch failed`             | 接口没启动，或 3000 端口被占用                               | 另开终端 `npm run server`；用 `netstat -ano \| findstr :3000` 查占用 |
| `/api/health` 返回 `{"ok":true,"db":"down"}`        | MySQL 没启动，或 `.env` 缺失 / 密码不对                    | 启动 MySQL；按第 3 步检查 `.env`                                      |
| `ECONNREFUSED 127.0.0.1:3306`                         | MySQL 服务未运行                                             | 启动 `MySQL80` 服务                                                   |
| `ER_ACCESS_DENIED_ERROR`                              | `DB_USER` / `DB_PASSWORD` 不对，或 root 不允许该登录方式 | 用 MySQL 客户端验证账号密码后同步到 `.env`                            |
| 列表一直骨架屏 / 接口 500 且日志有 `ER_NO_SUCH_TABLE` | 没执行数据库初始化                                           | `npm run db:init`                                                     |
| `npm run dev` 一启动就报错                            | Node 版本不满足 `engines`                                  | 升级到 Node 24 LTS                                                      |
| 上传的配图 404                                          | 接口未启动，或 `server/uploads/` 不存在                    | 启动接口；重跑 `npm run db:init` 会重建该目录                         |
| `npm install` 报缓存权限错误                          | 全局缓存目录不可写                                           | `npm install --cache .npm-cache`                                      |

以上都正常但页面仍报错时，打开浏览器开发者工具 → Network，看 `/api/...` 请求的状态码和响应，再对照终端 1 的日志，一般能直接定位到是代理、接口还是数据库的问题。

## 页面进度

| 页面 | 路由          | 当前状态                                                               |
| ---- | ------------- | ---------------------------------------------------------------------- |
| 登录 | `/login`    | 静态 UI，点击登录直接进入首页，未接账号接口                            |
| 注册 | `/reg`      | 静态 UI，提交只在控制台打印                                            |
| 首页 | `/home`     | 静态 UI：医院下拉、功能六宫格、健康报告、医生列表                      |
| 商城 | `/shop`     | 本地商品数据、分类筛选、购物车抽屉、模拟结算                           |
| 发现 | `/discover` | 已完成：瀑布流列表、搜索、分类、详情、发布图文、点赞，数据存本地 MySQL |

「发现」页的接口、表结构、实现细节和常见问题见 [docs/discover.md](docs/discover.md)。

## 目录结构

```
db/                建表与示例数据 SQL
docs/              页面开发说明
public/covers/     发现页内置封面（SVG）
server/            Express 接口、数据库连接、初始化与冒烟测试脚本
src/api/           前端请求封装
src/components/    公共组件（TabBar）
src/page/          页面组件
src/router.js      路由表
src/utils/         时间/数字格式化等工具
```

## 可用命令

| 命令                 | 说明                                              |
| -------------------- | ------------------------------------------------- |
| `npm run dev`      | 启动前端开发服务器（5173）                        |
| `npm run server`   | 启动本地接口（3000）                              |
| `npm run db:init`  | 初始化数据库（可重复执行，不会重复插入示例数据）  |
| `npm run build`    | 打包到 `dist/`                                  |
| `npm run test:api` | 发现页接口冒烟测试（需先启动 `npm run server`） |

## 已知待办

- 登录 / 注册尚未接后端，首页数据也还是写死的。
- 免费问诊页面（`FreeConsultation.vue`）目前是空文件，路由尚未注册。
- 首页底栏仍是早期的 `width: 100vw` 写法，后续可统一换成 `src/components/TabBar.vue`。
- 发现页的点赞是"浏览器本地身份"，没有账号体系；后续接入登录后可换成真实用户 id。
