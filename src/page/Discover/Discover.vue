<template>
  <div class="discover-page">
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">+</div>
        <div class="brand-text">
          <h1>发现</h1>
          <p>健康知识 · 经验分享</p>
        </div>
      </div>
      <button type="button" class="publish-btn" @click="goPublish">
        <el-icon><Plus /></el-icon>
        <span>发布内容</span>
      </button>
    </header>

    <div class="search-wrap">
      <el-input
        v-model="keyword"
        :prefix-icon="Search"
        placeholder="搜点好康的..."
        clearable
        class="search-input"
      />
    </div>

    <div class="chips">
      <button
        v-for="item in categories"
        :key="item"
        type="button"
        class="chip"
        :class="{ active: item === activeCategory }"
        @click="selectCategory(item)"
      >
        {{ item }}
      </button>
    </div>

    <div v-if="error" class="state state-error">
      <el-icon class="state-icon"><WarningFilled /></el-icon>
      <p class="state-title">内容没能加载出来</p>
      <p class="state-desc">{{ error }}</p>
      <el-button round type="primary" plain @click="load">重新加载</el-button>
    </div>

    <template v-else>
      <div v-if="loading" class="feed">
        <div v-for="col in 2" :key="col" class="column">
          <div v-for="i in 2" :key="i" class="card skeleton-card">
            <div class="skeleton-cover" :style="{ aspectRatio: `1 / ${col === 1 ? 1.15 : 0.9}` }" />
            <div class="skeleton-body">
              <div class="skeleton-line w90" />
              <div class="skeleton-line w60" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length" class="feed">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <article
            v-for="post in column"
            :key="post.id"
            class="card"
            @click="openPost(post.id)"
          >
            <div class="cover" :style="{ aspectRatio: `1 / ${coverRatio(post)}` }">
              <img :src="post.cover" :alt="post.title" loading="lazy" />
              <span class="cover-tag">{{ post.category }}</span>
            </div>
            <div class="card-body">
              <h2 class="title" :style="{ WebkitLineClamp: titleLines(post) }">
                {{ post.title }}
              </h2>
              <div class="meta">
                <span class="author">
                  <span class="avatar">{{ initial(post.author) }}</span>
                  <span class="author-name">{{ post.author }}</span>
                </span>
                <span class="likes" :class="{ liked: post.liked }">
                  <el-icon><StarFilled /></el-icon>
                  {{ formatCount(post.likeCount) }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else class="state">
        <el-icon class="state-icon"><Reading /></el-icon>
        <p class="state-title">{{ keyword ? '没有找到相关内容' : '还没有人发布内容' }}</p>
        <p class="state-desc">
          {{ keyword ? '换个关键词试试，或者成为第一个分享的人' : '把你了解的医疗、养生知识分享给大家吧' }}
        </p>
        <el-button round type="primary" @click="goPublish">去发布</el-button>
      </div>

      <div ref="sentinel" class="sentinel">
        <el-button v-if="hasMore" text :loading="loadingMore" @click="loadMore">
          再多来点内容
        </el-button>
        <span v-else-if="posts.length" class="end-line" style="user-select: none;">— 你已抵达最深处 —</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus, StarFilled, WarningFilled, Reading } from '@element-plus/icons-vue'
import { fetchMeta, fetchPosts } from '@/api/discover'
import { formatCount, hashString } from '@/utils/format'

const router = useRouter()

const categories = ref(['全部', '医疗科普', '养生保健', '运动健康', '心理健康', '饮食营养'])
const activeCategory = ref('全部')
const keyword = ref('')

const posts = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 12
const hasMore = ref(false)
const loading = ref(true)
const loadingMore = ref(false)
const error = ref('')

const sentinel = ref(null)
let observer = null
let searchTimer = null
let requestSeq = 0
// 从详情页返回时列表会重新请求，这里记一下滚动位置，等内容回来再恢复
const SCROLL_KEY = 'tijian_discover_scroll'
let pendingScroll = 0

/** 封面高度比例（高 / 宽）按帖子 id 稳定地“随机”，让两列卡片长短错落。 */
const COVER_RATIOS = [1.06, 0.82, 1.28, 0.94, 1.16, 0.74]

function coverRatio(post) {
  const seed = hashString(`${post.id}-${post.title}`)
  return COVER_RATIOS[seed % COVER_RATIOS.length]
}

/** 根据标题长度决定最多显示几行，尽量完整、太长才省略。 */
const viewportWidth = ref(typeof window === 'undefined' ? 375 : window.innerWidth)
const titleLines = (post) => {
  const columnWidth = Math.min(viewportWidth.value, 750) / 2 - 16
  const charsPerLine = Math.max(9, Math.floor(columnWidth / 15))
  const lines = Math.ceil((post.title || '').length / charsPerLine)
  return Math.min(5, Math.max(2, lines))
}

const columns = computed(() => {
  const left = []
  const right = []
  let leftHeight = 0
  let rightHeight = 0

  for (const post of posts.value) {
    // 粗略估算卡片高度：封面 + 标题行数 + 作者行
    const height = coverRatio(post) * 100 + titleLines(post) * 20 + 46
    if (leftHeight <= rightHeight) {
      left.push(post)
      leftHeight += height
    } else {
      right.push(post)
      rightHeight += height
    }
  }
  return [left, right]
})

const initial = (name) => (name || '匿').trim().charAt(0)

async function load() {
  const seq = ++requestSeq
  loading.value = true
  loadingMore.value = false
  error.value = ''
  page.value = 1
  try {
    const data = await fetchPosts({
      category: activeCategory.value === '全部' ? '' : activeCategory.value,
      keyword: keyword.value.trim(),
      page: 1,
      pageSize,
    })
    if (seq !== requestSeq) return
    posts.value = data.list || []
    total.value = data.total || 0
    hasMore.value = Boolean(data.hasMore)
  } catch (err) {
    if (seq !== requestSeq) return
    error.value = err.message || '请稍后重试'
    posts.value = []
    hasMore.value = false
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  const seq = requestSeq
  loadingMore.value = true
  try {
    const nextPage = page.value + 1
    const data = await fetchPosts({
      category: activeCategory.value === '全部' ? '' : activeCategory.value,
      keyword: keyword.value.trim(),
      page: nextPage,
      pageSize,
    })
    if (seq !== requestSeq) return
    page.value = nextPage
    posts.value = posts.value.concat(data.list || [])
    hasMore.value = Boolean(data.hasMore)
  } catch (err) {
    if (seq !== requestSeq) return
    // 加载更多失败时保留已加载的内容，只做轻提示
    ElMessage.error(err.message || '加载更多失败')
  } finally {
    loadingMore.value = false
  }
}

function selectCategory(item) {
  if (activeCategory.value === item) return
  activeCategory.value = item
  load()
}

function goPublish() {
  router.push('/discover/publish')
}

function openPost(id) {
  router.push(`/discover/${id}`)
}

function onResize() {
  viewportWidth.value = window.innerWidth
}

watch(keyword, () => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(load, 350)
})

onMounted(async () => {
  window.addEventListener('resize', onResize)
  pendingScroll = Number(window.sessionStorage.getItem(SCROLL_KEY) || 0)
  await load()

  if (pendingScroll > 0) {
    await nextTick()
    window.requestAnimationFrame(() => {
      window.scrollTo(0, pendingScroll)
      pendingScroll = 0
    })
  }

  fetchMeta()
    .then((meta) => {
      if (Array.isArray(meta?.categories) && meta.categories.length) {
        categories.value = ['全部', ...meta.categories]
      }
    })
    .catch(() => {
      /* 分类接口失败时保留内置分类 */
    })

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) loadMore()
    },
    { rootMargin: '120px' },
  )
  if (sentinel.value) observer.observe(sentinel.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.clearTimeout(searchTimer)
  if (observer) observer.disconnect()
  if (window.scrollY > 0) {
    window.sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)))
  } else {
    window.sessionStorage.removeItem(SCROLL_KEY)
  }
})
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: #f4f7f8;
  padding-bottom: 76px;
  box-sizing: border-box;
  color: #22343a;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 10px;
  background: rgba(244, 247, 248, 0.94);
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1596ad, #127a90);
  color: #fff;
  font-size: 26px;
  font-weight: 300;
  line-height: 36px;
  text-align: center;
  box-shadow: 0 6px 14px rgba(18, 122, 144, 0.28);
}

.brand-text h1 {
  margin: 0;
  font-size: 21px;
  letter-spacing: 1px;
  line-height: 1.2;
}

.brand-text p {
  margin: 2px 0 0;
  font-size: 11px;
  color: #8b9ba1;
  letter-spacing: 0.5px;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 999px;
  padding: 9px 14px;
  background: linear-gradient(135deg, #1596ad, #127a90);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(18, 122, 144, 0.26);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.publish-btn:active {
  transform: scale(0.96);
  box-shadow: 0 3px 8px rgba(18, 122, 144, 0.24);
}

.search-wrap {
  padding: 2px 16px 10px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(18, 60, 72, 0.06);
  padding: 4px 12px;
}

.search-input :deep(.el-input__inner) {
  font-size: 13px;
}

.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0 16px 12px;
  scrollbar-width: none;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  flex: 0 0 auto;
  border: 1px solid transparent;
  background: #e9eff1;
  color: #5a6d74;
  font-size: 12px;
  padding: 6px 13px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip.active {
  background: #127a90;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(18, 122, 144, 0.24);
}

.feed {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 12px;
  align-items: start;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(18, 60, 72, 0.06);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card:active {
  transform: scale(0.975);
  box-shadow: 0 1px 5px rgba(18, 60, 72, 0.12);
}

.cover {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #dfeaec;
}

.cover img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.cover-tag {
  position: absolute;
  left: 8px;
  top: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  color: #fff;
  background: rgba(10, 40, 48, 0.42);
  backdrop-filter: blur(4px);
  letter-spacing: 0.3px;
}

.card-body {
  padding: 9px 10px 10px;
}

.title {
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
  color: #22343a;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 8px;
  font-size: 11px;
  color: #93a3a8;
}

.author {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.avatar {
  flex: 0 0 auto;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #e2f0f2;
  color: #127a90;
  font-size: 10px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.author-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.likes {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: 0 0 auto;
}

.likes .el-icon {
  font-size: 12px;
}

.likes.liked {
  color: #e0603f;
}

.sentinel {
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a8b6bb;
  font-size: 12px;
}

.end-line {
  letter-spacing: 1px;
}

.state {
  margin: 36px 24px;
  text-align: center;
  color: #7b8d94;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.state-icon {
  font-size: 46px;
  color: #b6c8cc;
}

.state-title {
  margin: 4px 0 0;
  font-size: 15px;
  font-weight: 600;
  color: #3e565e;
}

.state-desc {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.6;
  color: #8b9ba1;
}

/* 骨架屏 */
.skeleton-card {
  cursor: default;
}

.skeleton-cover {
  width: 100%;
  background: linear-gradient(100deg, #e8eef0 30%, #f5f8f9 50%, #e8eef0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(100deg, #e8eef0 30%, #f5f8f9 50%, #e8eef0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line.w90 {
  width: 90%;
}

.skeleton-line.w60 {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 150% 0;
  }
  100% {
    background-position: -50% 0;
  }
}
</style>
