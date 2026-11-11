/**
 * 发现页接口冒烟测试。
 *
 * 前置条件：
 *   1. 已执行 `npm run db:init`
 *   2. 已执行 `npm run server`
 *
 * 用法：`npm run test:api`
 * 说明：脚本会创建一条临时帖子、点两次赞、上传一张 1x1 的测试图片，
 *      结束后按 id 删除自己创建的帖子，不会动其他数据。
 */
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'
import { config } from '../config.js'

const base = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${config.port}`
const clientId = 'smoke_test_client'
const title = `接口自测帖 ${new Date().toISOString().slice(0, 19)}`

const results = []
let createdId = null
let uploadedUrl = ''

function check(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ::  ${detail}` : ''}`)
}

async function main() {
  const health = await (await fetch(`${base}/api/health`)).json()
  check('健康检查 /api/health', health.ok === true && health.db === 'up', JSON.stringify(health))

  const createRes = await fetch(`${base}/api/discover/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      content: '接口冒烟测试正文第一段。\n\n第二段，用来验证段落与中文。',
      category: '养生保健',
      author: '接口自测',
      cover: '/covers/cover-3.svg',
      images: ['/covers/cover-3.svg'],
    }),
  })
  const created = await createRes.json()
  createdId = created.post?.id || null
  check('创建帖子', createRes.status === 201 && Boolean(createdId), `id=${createdId}`)
  check('中文标题回显', created.post?.title === title, created.post?.title)

  const list = await (
    await fetch(`${base}/api/discover/posts?pageSize=5&clientId=${clientId}`)
  ).json()
  check(
    '列表分页',
    Array.isArray(list.list) && list.list.length > 0 && list.list.length <= 5,
    `total=${list.total}`,
  )
  check('列表含新帖', list.list.some((post) => post.id === createdId), `total=${list.total}`)

  const detail = await (
    await fetch(`${base}/api/discover/posts/${createdId}?clientId=${clientId}`)
  ).json()
  check(
    '详情与配图',
    detail.post?.title === title && detail.post?.images?.length === 1,
    `images=${detail.post?.images?.length}`,
  )

  const like = async () =>
    (
      await fetch(`${base}/api/discover/posts/${createdId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
    ).json()
  const like1 = await like()
  const like2 = await like()
  check(
    '点赞切换',
    like1.liked === true && like1.likeCount === 1 && like2.liked === false && like2.likeCount === 0,
    `${like1.liked}/${like1.likeCount} -> ${like2.liked}/${like2.likeCount}`,
  )

  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  )
  const form = new FormData()
  form.append('file', new Blob([png], { type: 'image/png' }), 'smoke-1x1.png')
  const uploadRes = await fetch(`${base}/api/uploads`, { method: 'POST', body: form })
  const uploaded = await uploadRes.json()
  uploadedUrl = uploaded.url || ''
  check('上传图片', uploadRes.status === 201 && uploadedUrl.startsWith('/uploads/'), uploadedUrl)

  if (uploadedUrl) {
    const fileRes = await fetch(`${base}${uploadedUrl}`)
    check('上传文件可访问', fileRes.ok, String(fileRes.status))
  }

  const bad = await fetch(`${base}/api/discover/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '', content: '' }),
  })
  check('空内容被拒绝', bad.status === 400, String(bad.status))
}

async function cleanup() {
  const conn = await mysql.createConnection(config.db)
  try {
    if (createdId) await conn.query('DELETE FROM discover_posts WHERE id = ?', [createdId])
    await conn.query('DELETE FROM discover_likes WHERE client_id = ?', [clientId])
  } finally {
    await conn.end()
  }
  if (uploadedUrl) {
    const file = path.join(config.serverDir, 'uploads', path.basename(uploadedUrl))
    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
}

try {
  await main()
} catch (err) {
  check('请求流程', false, err.message)
} finally {
  try {
    await cleanup()
  } catch (err) {
    check('清理测试数据', false, err.message)
  }
}

const failed = results.filter((item) => !item.ok)
console.log(`\n${results.length - failed.length}/${results.length} 项通过`)
process.exit(failed.length ? 1 : 0)
