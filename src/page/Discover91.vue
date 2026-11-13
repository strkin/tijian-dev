<template>
  <div class="discover-page">
    <header class="topbar">
      <div class="brand">
        <div class="brand-text">
          <span class="fs-4">发现</span>
          <span>测试页面</span>
        </div>
      </div>
      <button type="button" class="publish-btn" @click="goPublish">
        <el-icon><Plus /></el-icon>
        <span>发布内容</span>
      </button>
    </header>

    <!-- GIF图区域 -->
    <div>
    </div>

    <div class="search-wrap">
      <el-input
        v-model="keyword"
        :prefix-icon="Search"
        placeholder="搜索更多精彩内容..."
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
      <p class="state-title">Error:404 NotFound</p>
      <p class="state-desc">{{ error }}</p>
      <el-button round type="primary" plain @click="load">重新加载</el-button>
    </div>

    <template v-else>
      <div v-if="loading" class="feed">
        <div v-for="col in 2" :key="col" class="column">
          <div v-for="i in 2" :key="i" class="card skeleton-card">
            <div class="skeleton-cover" />
            <div class="skeleton-body">
              <div class="skeleton-line w90" />
              <div class="skeleton-line w60" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="posts.length" class="feed">
        <div v-for="(column, index) in columns" :key="index" class="column">
          <!-- 帖子卡片模板 -->
          <article
            v-for="post in column"
            :key="post.id"
            class="card"
            @click="openPost(post.id)"
          >
            <div class="cover">
              <img :src="post.cover" :alt="post.title" loading="lazy" />
              <span class="cover-tag">{{ post.category }}</span>
            </div>
            <div class="card-body">
              <h3 class="title">
                {{ post.title }}
              </h3>
              <div class="meta">
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
        <h1 style="color: #ffffff;">404 NotFound</h1>
        <p class="state-title">{{ keyword ? '暂无内容' : '还没有人发布内容' }}</p>
        <p class="state-desc">
          {{ keyword ? '似乎出了些小问题，稍后再试' : '搜索失败，暂无相关内容' }}
        </p>
        <el-button round type="primary" @click="goPublish">去发布</el-button>
      </div>

      <!-- 分页：每页 10 条，左右各 5 条 -->
      <div v-if="posts.length && !loading" class="pager">
        <div class="pager-row">
          <button type="button" class="page-btn" :disabled="page <= 1" @click="goPage(1)">顶页</button>
          <button type="button" class="page-btn" :disabled="page <= 1" @click="goPage(page - 1)">-1</button>

          <!-- 页数按钮列表 -->
          <div class="pager-row pager-numbers">
            <button
              v-for="n in pageNumbers"
              :key="n"
              type="button"
              class="page-btn page-num"
              :class="{ active: n === page }"
              @click="goPage(n)"
            >
              {{ n }}
            </button>
          </div>

          <button type="button" class="page-btn" :disabled="page >= totalPages" @click="goPage(page + 1)">+1</button>
          <button type="button" class="page-btn" :disabled="page >= totalPages" @click="goPage(totalPages)">底页</button>
        </div>

        <!-- 页数搜索框 -->
        <div class="pager-search">
          <div style="width: 5px;"></div>
          <input
            v-model="pageInput"
            class="page-input"
            type="number"
            min="1"
            :max="totalPages"
            inputmode="numeric"
            placeholder="输入页码"
            @keyup.enter="searchPage"
          />
          <button type="button" class="page-btn" @click="searchPage">搜索</button>
        </div>
        
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus, StarFilled, WarningFilled } from '@element-plus/icons-vue'
import { fetchMeta, fetchPosts } from '@/api/discover'
import { formatCount } from '@/utils/format'

const router = useRouter()

const categories = ref(['全部', '医疗科普', '养生保健', '运动健康', '心理健康', '饮食营养'])
const activeCategory = ref('全部')
const keyword = ref('')

const posts = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 10
const loading = ref(true)
const error = ref('')

const pageInput = ref('1')
let searchTimer = null
let requestSeq = 0

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

/**
 * 卡片高度固定，两列自然等高，按奇偶交替分配，每页 10 条正好左右各 5 条。
 * 高度、封面高度、标题行数全部由 CSS 变量控制，无需在 JS 里计算。
 */
const columns = computed(() => {
  const left = []
  const right = []

  posts.value.forEach((post, index) => {
    if (index % 2 === 0) {
      left.push(post)
    } else {
      right.push(post)
    }
  })
  return [left, right]
})

/** 页码按钮：优先显示当前页前后各 2 页，尽量凑满 5 个，不够时贴着首/尾页显示。 */
const pageNumbers = computed(() => {
  const count = totalPages.value
  const size = 5
  if (count <= size) {
    return Array.from({ length: count }, (_, index) => index + 1)
  }
  const start = Math.max(1, Math.min(page.value - 2, count - size + 1))
  return Array.from({ length: size }, (_, index) => start + index)
})

const initial = (name) => (name || '匿').trim().charAt(0)

function buildQuery(targetPage) {
  return {
    category: activeCategory.value === '全部' ? '' : activeCategory.value,
    keyword: keyword.value.trim(),
    page: targetPage,
    pageSize,
  }
}

async function load(targetPage = 1) {
  const seq = ++requestSeq
  loading.value = true
  error.value = ''
  try {
    const wanted = Math.max(1, Math.floor(Number(targetPage)) || 1)
    let data = await fetchPosts(buildQuery(wanted))
    if (seq !== requestSeq) return

    const totalCount = Number(data.total) || 0
    const lastPage = Math.max(1, Math.ceil(totalCount / pageSize))

    // 请求页码超出末页时，自动取最后一页的内容
    if (wanted > lastPage) {
      data = await fetchPosts(buildQuery(lastPage))
      if (seq !== requestSeq) return
      page.value = lastPage
    } else {
      page.value = wanted
    }

    posts.value = data.list || []
    total.value = Number(data.total) || totalCount
    pageInput.value = String(page.value)
  } catch (err) {
    if (seq !== requestSeq) return
    error.value = err.message || '请稍后重试'
    posts.value = []
  } finally {
    if (seq === requestSeq) loading.value = false
  }
}

function goPage(target) {
  const wanted = Math.min(Math.max(1, Math.floor(Number(target)) || 1), totalPages.value)
  pageInput.value = String(wanted)
  if (wanted === page.value) return
  load(wanted)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function searchPage() {
  const raw = String(pageInput.value).trim()
  const num = Number(raw)
  if (!raw || !Number.isFinite(num) || num < 1) {
    ElMessage.warning('请输入正确的页码')
    return
  }
  goPage(num)
}

function selectCategory(item) {
  if (activeCategory.value === item) return
  activeCategory.value = item
  load()
}

function goPublish() {
  router.push('/discover91/publish')
}

function openPost(id) {
  router.push(`/discover91/${id}`)
}

watch(keyword, () => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(load, 350)
})

onMounted(async () => {
  await load()

  fetchMeta()
    .then((meta) => {
      if (Array.isArray(meta?.categories) && meta.categories.length) {
        categories.value = ['全部', ...meta.categories]
      }
    })
    .catch(() => {
      /* 分类接口失败时保留内置分类 */
    })
})

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer)
})
</script>

<style scoped>
.discover-page {
  /* 卡片尺寸统一在这里调：整卡高度、封面高度、标题最多行数 */
  --card-height: 210px;
  --cover-height: 130px;
  --title-lines: 3;
  min-height: 100vh;
  background: #000000;
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
  background: rgba(0, 0, 0, 0.94);
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

.brand-text span {
  margin: 2px 10px 0 0;
  font-size: 12px;
  color: #d8d8d8;
  letter-spacing: 0.5px;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 5px;
  padding: 9px 14px;
  background: linear-gradient(135deg, #ba0000, #122590);
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
  border-radius: 3px;
  background: #232323;
  box-shadow: 0 1px 3px rgba(18, 60, 72, 0.06);
  padding: 4px 12px;
}

.search-input :deep(.el-input__inner) {
  font-size: 13px;
  color:#e4e4e4;
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
  background: #232323;
  color: #ffffff;
  font-size: 12px;
  padding: 4px 13px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip.active {
  background: #555555;
  color: #fff;
  font-weight: 550;
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
  display: flex;
  flex-direction: column;
  height: var(--card-height);
  background: #000000;
  border: solid 1px #616161;
  border-radius: 0px;
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
  flex: 0 0 var(--cover-height);
  width: 100%;
  height: var(--cover-height);
  overflow: hidden;
  background: #dfeaec;
  border-bottom: solid 1px #444444;
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
  border-radius: 3px;
  font-size: 10px;
  color: #fff;
  background: rgba(10, 40, 48, 0.42);
  backdrop-filter: blur(4px);
  letter-spacing: 0.3px;
}

.card-body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 4px 5px 4px;
}

.title {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 300;
  color: #ffffff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--title-lines);
  line-clamp: var(--title-lines);
  overflow: hidden;
  word-break: break-word;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: auto;
  padding-top: 2px;
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

/* 分页 */
.pager {
  margin: 18px 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.pager-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.page-btn {
  min-width: 36px;
  min-height: 36px;
  padding: 8px 2px;
  border: 1px solid #616161;
  border-radius: 3px;
  background: #111111;
  color: #e4e4e4;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #9a9a9a;
  background: #1f1f1f;
}

.page-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-num {
  min-width: 40px;
}

.page-btn.active {
  border-color: #8f8f8f;
  background: #555555;
  color: #ffffff;
  font-weight: 600;
}

.pager-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.page-input {
  width: 64px;
  padding: 6px 8px;
  border: 1px solid #616161;
  border-radius: 3px;
  background: #232323;
  color: #e4e4e4;
  font-size: 12px;
  outline: none;
  box-sizing: border-box;
  text-align: left;
}

.page-input:focus {
  border-color: #9a9a9a;
}

.page-input::placeholder {
  color: #7b8d94;
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
  color: #e4e4e4;
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
  flex: 0 0 var(--cover-height);
  width: 100%;
  height: var(--cover-height);
  background: linear-gradient(100deg, #e8eef0 30%, #f5f8f9 50%, #e8eef0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  flex: 1 1 auto;
  min-height: 0;
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
