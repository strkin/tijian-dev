const CLIENT_KEY = 'tijian_discover_client'
const AUTHOR_KEY = 'tijian_discover_author'

/** 无登录体系时，用浏览器本地生成的访客标识给点赞去重。 */
export function getClientId() {
  let id = ''
  try {
    id = localStorage.getItem(CLIENT_KEY) || ''
  } catch {
    id = ''
  }
  if (/^[A-Za-z0-9_-]{6,64}$/.test(id)) return id

  id = createId()
  try {
    localStorage.setItem(CLIENT_KEY, id)
  } catch {
    /* 隐私模式下写不了 localStorage，本次会话仍可点赞 */
  }
  return id
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 24)
  }
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

export function getSavedAuthor() {
  try {
    return localStorage.getItem(AUTHOR_KEY) || ''
  } catch {
    return ''
  }
}

export function saveAuthor(name) {
  try {
    localStorage.setItem(AUTHOR_KEY, name)
  } catch {
    /* 忽略 */
  }
}

async function request(url, options = {}) {
  const { method = 'GET', body, headers = {} } = options
  const init = { method, headers: { ...headers } }

  if (body instanceof FormData) {
    init.body = body
  } else if (body !== undefined) {
    init.headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, init)
  } catch {
    throw new Error('连不上本地接口，请确认已运行 npm run server')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(data?.message || `请求失败（${response.status}）`)
    error.status = response.status
    throw error
  }
  return data
}

export function fetchPosts({ category = '', keyword = '', page = 1, pageSize = 20 } = {}) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (keyword) params.set('keyword', keyword)
  params.set('page', String(page))
  params.set('pageSize', String(pageSize))
  params.set('clientId', getClientId())
  return request(`/api/discover/posts?${params.toString()}`)
}

export function fetchPost(id) {
  const params = new URLSearchParams({ clientId: getClientId() })
  return request(`/api/discover/posts/${id}?${params.toString()}`)
}

export function createPost(payload) {
  return request('/api/discover/posts', { method: 'POST', body: payload })
}

export function toggleLike(id) {
  return request(`/api/discover/posts/${id}/like`, {
    method: 'POST',
    body: { clientId: getClientId() },
  })
}

export function uploadImage(file) {
  const form = new FormData()
  form.append('file', file)
  return request('/api/uploads', { method: 'POST', body: form })
}

export function fetchMeta() {
  return request('/api/discover/meta')
}
