/**
 * 数据库一键初始化：
 *   1. 创建数据库（默认 tijian）
 *   2. 执行 db/schema.sql 建表
 *   3. 如果帖子表为空，写入 db/seed.sql 示例数据
 *
 * 用法：npm run db:init
 * 依赖：项目根目录的 .env（可从 .env.example 复制）
 */
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { config } from '../config.js'

const { host, port, user, password, database } = config.db
const schemaFile = path.join(config.rootDir, 'db', 'schema.sql')
const seedFile = path.join(config.rootDir, 'db', 'seed.sql')

function fail(message) {
  console.error(`\n[db:init] ${message}\n`)
  process.exit(1)
}

if (!/^[A-Za-z0-9_]+$/.test(database)) {
  fail(`DB_NAME「${database}」只能包含字母、数字和下划线。`)
}

let conn
try {
  conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    connectTimeout: 5000,
    multipleStatements: true,
    charset: 'utf8mb4',
  })
} catch (err) {
  const hints = []
  if (err.code === 'ECONNREFUSED') {
    hints.push('MySQL 服务似乎没有启动，可用 `Get-Service MySQL80 | Start-Service` 启动。')
  }
  if (err.code === 'ER_ACCESS_DENIED_ERROR') {
    hints.push('账号或密码不对，请检查 .env 里的 DB_USER / DB_PASSWORD。')
  }
  fail(`连接 MySQL 失败：${err.code || err.message}${hints.length ? `\n  → ${hints.join('\n  → ')}` : ''}`)
}

try {
  console.log(`[db:init] 已连接 ${host}:${port}（用户 ${user}）`)

  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\`
       DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  await conn.changeUser({ database })
  console.log(`[db:init] 数据库 ${database} 就绪`)

  await conn.query(fs.readFileSync(schemaFile, 'utf8'))
  console.log('[db:init] 数据表已创建 / 已存在')

  const [[{ total }]] = await conn.query('SELECT COUNT(*) AS total FROM discover_posts')
  if (Number(total) === 0) {
    await conn.query(fs.readFileSync(seedFile, 'utf8'))
    const [[after]] = await conn.query('SELECT COUNT(*) AS total FROM discover_posts')
    console.log(`[db:init] 已写入 ${after.total} 条示例帖子`)
  } else {
    console.log(`[db:init] 已有 ${total} 条帖子，跳过示例数据`)
  }

  fs.mkdirSync(path.join(config.serverDir, 'uploads'), { recursive: true })
  console.log('[db:init] 上传目录 server/uploads 就绪')
  console.log('\n完成。接下来运行 `npm run server` 启动接口，另开一个终端运行 `npm run dev`。')
} catch (err) {
  fail(`初始化失败：${err.code || ''} ${err.sqlMessage || err.message}`)
} finally {
  await conn.end()
}
