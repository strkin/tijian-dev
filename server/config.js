import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

const serverDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(serverDir, '..')

// 统一从项目根目录的 .env 读取配置（没有 .env 时使用默认值）。
dotenv.config({ path: path.join(rootDir, '.env'), quiet: true })

export const config = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tijian',
  },
  rootDir,
  serverDir,
}
