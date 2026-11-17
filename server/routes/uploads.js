import path from 'node:path'
import crypto from 'node:crypto'
import { Router } from 'express'
import multer from 'multer'
import { config } from '../config.js'

const router = Router()
export const uploadDir = path.join(config.serverDir, 'uploads')

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const MAX_SIZE = 5 * 1024 * 1024

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase()
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE, files: 1 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase()
    if (!file.mimetype.startsWith('image/') || !ALLOWED_EXT.has(ext)) {
      const err = new Error('只支持 jpg / png / webp / gif 图片')
      err.status = 400
      cb(err)
      return
    }
    cb(null, true)
  },
})

/** 图片上传：表单字段名 file。返回可直接放进 <img src> 的相对地址。 */
router.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.status = 400
        err.message = '图片不能超过 5MB'
      }
      next(err)
      return
    }
    if (!req.file) {
      const e = new Error('请选择要上传的图片')
      e.status = 400
      next(e)
      return
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` })
  })
})

export default router
