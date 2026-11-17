/** 把后端返回的时间格式化成适合信息流的相对时间。 */
export function formatTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const now = Date.now()
  const diff = Math.floor((now - date.getTime()) / 1000)

  if (diff < 0) return '刚刚'
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 86400 * 2) return '昨天'
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 天前`

  const sameYear = date.getFullYear() === new Date().getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return sameYear ? `${month}-${day}` : `${date.getFullYear()}-${month}-${day}`
}

/** 详情页用的完整时间：2026-11-11 15:32 */
export function formatDateTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** 点赞数展示：超过 10000 显示为 1.2w */
export function formatCount(count) {
  const n = Number(count) || 0
  if (n < 10000) return String(n)
  return `${(n / 10000).toFixed(1).replace(/\.0$/, '')}w`
}

/** 根据字符串生成稳定的伪随机数，用于瀑布流封面比例。 */
export function hashString(value) {
  const text = String(value ?? '')
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash
}
