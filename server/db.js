import mysql from 'mysql2/promise'
import { config } from './config.js'

export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  connectTimeout: 5000,
})

/** 启动时探活，失败只提示、不退出，方便前端展示友好错误。 */
export async function pingDatabase() {
  const conn = await pool.getConnection()
  try {
    await conn.ping()
  } finally {
    conn.release()
  }
}
