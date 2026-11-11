import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

export const CATEGORIES = ['医疗科普', '养生保健', '运动健康', '心理健康', '饮食营养']
const MAX_IMAGES = 9
const MAX_TITLE = 80
const MAX_CONTENT = 5000

function fail(status, message) {
  const err = new Error(message)
  err.status = status
  return err
}

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/** 访客标识：前端 localStorage 生成，用于在没有登录体系时区分点赞人。 */
function normalizeClientId(value) {
  if (typeof value !== 'string') return ''
  const id = value.trim()
  return /^[A-Za-z0-9_-]{6,64}$/.test(id) ? id : ''
}

function pickCover(value) {
  if (typeof value === 'string') {
    const cover = value.trim()
    if (cover.startsWith('/covers/') || cover.startsWith('/uploads/')) return cover
  }
  return `/covers/cover-${1 + Math.floor(Math.random() * 6)}.svg`
}

function pickImages(value) {
  if (!Array.isArray(value)) return []
  return value
    .filter((url) => typeof url === 'string' && (url.startsWith('/uploads/') || url.startsWith('/covers/')))
    .slice(0, MAX_IMAGES)
}

async function findPost(id, clientId) {
  const [rows] = await pool.query(
    `SELECT id, title, content, category, author, cover,
            like_count AS likeCount, created_at AS createdAt
       FROM discover_posts WHERE id = ?`,
    [id],
  )
  if (!rows.length) return null

  const post = rows[0]
  const [images] = await pool.query(
    'SELECT url FROM discover_post_images WHERE post_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  )
  post.images = images.map((row) => row.url)

  if (clientId) {
    const [likes] = await pool.query(
      'SELECT 1 FROM discover_likes WHERE post_id = ? AND client_id = ? LIMIT 1',
      [id, clientId],
    )
    post.liked = likes.length > 0
  } else {
    post.liked = false
  }
  return post
}

/** 帖子列表：支持分类筛选、关键词搜索、分页。 */
router.get(
  '/posts',
  wrap(async (req, res) => {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const pageSize = Math.min(40, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 10))
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : ''
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword.trim() : ''
    const clientId = normalizeClientId(req.query.clientId)

    const where = []
    const params = []
    if (category && category !== '全部') {
      where.push('category = ?')
      params.push(category)
    }
    if (keyword) {
      where.push('(title LIKE ? OR content LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM discover_posts ${whereSql}`,
      params,
    )

    const offset = (page - 1) * pageSize
    const [rows] = await pool.query(
      `SELECT id, title, LEFT(REPLACE(content, '\\n', ' '), 60) AS excerpt,
              category, author, cover, like_count AS likeCount,
              created_at AS createdAt
         FROM discover_posts ${whereSql}
        ORDER BY created_at DESC, id DESC
        LIMIT ${pageSize} OFFSET ${offset}`,
      params,
    )

    // 当前访客对这页帖子的点赞状态
    if (clientId && rows.length) {
      const ids = rows.map((row) => row.id)
      const [likes] = await pool.query(
        'SELECT post_id FROM discover_likes WHERE client_id = ? AND post_id IN (?)',
        [clientId, ids],
      )
      const likedSet = new Set(likes.map((row) => row.post_id))
      rows.forEach((row) => {
        row.liked = likedSet.has(row.id)
      })
    } else {
      rows.forEach((row) => {
        row.liked = false
      })
    }

    res.json({
      list: rows,
      total: Number(total),
      page,
      pageSize,
      hasMore: offset + rows.length < Number(total),
    })
  }),
)

/** 帖子详情。 */
router.get(
  '/posts/:id',
  wrap(async (req, res) => {
    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) throw fail(400, '帖子不存在')

    const post = await findPost(id, normalizeClientId(req.query.clientId))
    if (!post) throw fail(404, '帖子不存在或已被删除')

    res.json({ post })
  }),
)

/** 发布帖子（正文可带最多 9 张图片）。 */
router.post(
  '/posts',
  wrap(async (req, res) => {
    const body = req.body || {}
    const title = String(body.title ?? '').trim()
    const content = String(body.content ?? '').trim()
    const category = CATEGORIES.includes(body.category) ? body.category : CATEGORIES[0]
    const author = String(body.author ?? '').trim().slice(0, 30) || '匿名用户'
    const cover = pickCover(body.cover)
    const images = pickImages(body.images)

    if (!title) throw fail(400, '请填写标题')
    if (title.length > MAX_TITLE) throw fail(400, `标题不能超过 ${MAX_TITLE} 个字`)
    if (!content) throw fail(400, '请填写正文')
    if (content.length > MAX_CONTENT) throw fail(400, `正文不能超过 ${MAX_CONTENT} 个字`)

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [result] = await conn.execute(
        'INSERT INTO discover_posts (title, content, category, author, cover) VALUES (?, ?, ?, ?, ?)',
        [title, content, category, author, cover],
      )
      const postId = result.insertId
      if (images.length) {
        const values = images.map((url, index) => [postId, url, index])
        await conn.query(
          'INSERT INTO discover_post_images (post_id, url, sort_order) VALUES ?',
          [values],
        )
      }
      await conn.commit()
      res.status(201).json({ post: await findPost(postId, '') })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }),
)

/** 点赞 / 取消点赞（同一访客重复点击即取消）。 */
router.post(
  '/posts/:id/like',
  wrap(async (req, res) => {
    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) throw fail(400, '帖子不存在')

    const clientId = normalizeClientId((req.body || {}).clientId)
    if (!clientId) throw fail(400, '缺少访客标识，请刷新页面后重试')

    const conn = await pool.getConnection()
    try {
      await conn.beginTransaction()
      const [posts] = await conn.query(
        'SELECT id FROM discover_posts WHERE id = ? FOR UPDATE',
        [id],
      )
      if (!posts.length) throw fail(404, '帖子不存在或已被删除')

      const [existing] = await conn.query(
        'SELECT 1 FROM discover_likes WHERE post_id = ? AND client_id = ? LIMIT 1',
        [id, clientId],
      )

      let liked
      if (existing.length) {
        await conn.query('DELETE FROM discover_likes WHERE post_id = ? AND client_id = ?', [id, clientId])
        await conn.query(
          'UPDATE discover_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?',
          [id],
        )
        liked = false
      } else {
        await conn.query('INSERT INTO discover_likes (post_id, client_id) VALUES (?, ?)', [id, clientId])
        await conn.query('UPDATE discover_posts SET like_count = like_count + 1 WHERE id = ?', [id])
        liked = true
      }

      const [[row]] = await conn.query('SELECT like_count AS likeCount FROM discover_posts WHERE id = ?', [id])
      await conn.commit()
      res.json({ liked, likeCount: row.likeCount })
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.release()
    }
  }),
)

/** 分类等基础信息，发布页直接复用，避免前后端各维护一份。 */
router.get('/meta', (req, res) => {
  res.json({
    categories: CATEGORIES,
    covers: [1, 2, 3, 4, 5, 6].map((n) => `/covers/cover-${n}.svg`),
    limits: { title: MAX_TITLE, content: MAX_CONTENT, images: MAX_IMAGES },
  })
})

export default router
