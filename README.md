# tiJian 健康服务平台

大学实训课小组项目：一个面向手机端的健康服务网页。前端使用 Vue 3 + Vite + Element Plus，页面按 750px 宽的移动端容器设计。

目前包含登录、注册、首页、商城和「发现」健康社区五个页面；其中「发现」页已接上项目内的 Express + 本地 MySQL，其余页面仍是静态 UI 或本地模拟数据。

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
