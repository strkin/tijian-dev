import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import { config } from './config.js'
import { pingDatabase } from './db.js'
import discoverRouter from './routes/discover.js'
import uploadsRouter, { uploadDir } from './routes/uploads.js'

const app = express()

app.disable('x-powered-by')
app.use(cors())
app.use(express.json({ limit: '2mb' }))

// 仅本地上传的图片，直接静态托管
fs.mkdirSync(uploadDir, { recursive: true })
app.use('/uploads', express.static(uploadDir, { maxAge: '7d', fallthrough: true }))

app.get('/api/health', async (req, res) => {
  let db = 'down'
  try {
    await pingDatabase()
    db = 'up'
  } catch {
    db = 'down'
  }
  res.json({ ok: true, db })
})

app.use('/api/discover', discoverRouter)
app.use('/api/uploads', uploadsRouter)

// 生产构建后由后端直接托管 dist，支持前端路由刷新
const distDir = path.join(config.rootDir, 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next()
      return
    }
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

app.use('/api', (req, res) => {
  res.status(404).json({ message: '接口不存在' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 400 : 500)
  if (status >= 500) console.error('[server]', err)
  res.status(status).json({ message: err.message || '服务器开小差了，请稍后再试' })
})

app.listen(config.port, () => {
  console.log(`[server] 接口已启动：http://127.0.0.1:${config.port}`)
  console.log(`[server] 数据库：${config.db.host}:${config.db.port}/${config.db.database}`)
})

export default app
