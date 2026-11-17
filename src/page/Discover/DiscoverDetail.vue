<template>
  <div class="detail-page">
    <header class="detail-top">
      <button type="button" class="icon-btn" aria-label="返回" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <span class="top-title">帖子详情</span>
      <button type="button" class="icon-btn" aria-label="回发现页" @click="router.push('/discover')">
        <el-icon><Compass /></el-icon>
      </button>
    </header>

    <div v-if="loading" class="loading-wrap">
      <div class="skeleton-cover" />
      <div class="skeleton-body">
        <div class="skeleton-line w70" />
        <div class="skeleton-line w90" />
        <div class="skeleton-line w80" />
        <div class="skeleton-line w60" />
      </div>
    </div>

    <div v-else-if="error" class="state">
      <el-icon class="state-icon"><WarningFilled /></el-icon>
      <p class="state-title">这篇内容暂时看不到</p>
      <p class="state-desc">{{ error }}</p>
      <el-button round type="primary" plain @click="router.push('/discover')">回到发现页</el-button>
    </div>

    <article v-else-if="post" class="article">
      <div class="hero">
        <img :src="post.cover" :alt="post.title" />
      </div>

      <div class="sheet">
        <div class="tag-row">
          <span class="tag">{{ post.category }}</span>
          <span class="time">{{ formatTime(post.createdAt) }}</span>
        </div>

        <h1 class="title">{{ post.title }}</h1>

        <div class="author-row">
          <span class="avatar">{{ initial(post.author) }}</span>
          <div class="author-info">
            <span class="author-name">{{ post.author }}</span>
            <span class="publish-time">发布于 {{ formatDateTime(post.createdAt) }}</span>
          </div>
        </div>

        <div class="divider" />

        <div class="content">
          <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
        </div>

        <div v-if="post.images && post.images.length" class="image-grid">
          <el-image
            v-for="(url, index) in post.images"
            :key="url"
            :src="url"
            :preview-src-list="post.images"
            :initial-index="index"
            fit="cover"
            class="post-image"
            preview-teleported
          />
        </div>

        <p class="footnote" style="text-align: center;">本文由用户发布，内容仅供参考</p>
      </div>
    </article>

    <div v-if="post" class="action-bar">
      <button type="button" class="like-btn" :class="{ liked: post.liked }" :disabled="liking" @click="onLike">
        <el-icon><StarFilled /></el-icon>
        <span>{{ post.liked ? '已点赞' : '点赞' }}</span>
        <span class="like-count">{{ formatCount(post.likeCount) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Compass, StarFilled, WarningFilled } from '@element-plus/icons-vue'
import { fetchPost, toggleLike } from '@/api/discover'
import { formatCount, formatDateTime, formatTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)
const error = ref('')
const liking = ref(false)

const paragraphs = computed(() => {
  if (!post.value?.content) return []
  return post.value.content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
})

const initial = (name) => (name || '匿').trim().charAt(0)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/discover')
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchPost(route.params.id)
    post.value = data.post
  } catch (err) {
    error.value = err.message || '请稍后重试'
    post.value = null
  } finally {
    loading.value = false
  }
}

async function onLike() {
  if (!post.value || liking.value) return
  const previous = { liked: post.value.liked, likeCount: post.value.likeCount }

  // 先更新界面，失败再回滚，点击反馈更跟手
  post.value.liked = !previous.liked
  post.value.likeCount = previous.likeCount + (previous.liked ? -1 : 1)
  liking.value = true

  try {
    const data = await toggleLike(post.value.id)
    post.value.liked = data.liked
    post.value.likeCount = data.likeCount
  } catch (err) {
    post.value.liked = previous.liked
    post.value.likeCount = previous.likeCount
    ElMessage.error(err.message || '点赞失败，请稍后再试')
  } finally {
    liking.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f4f7f8;
  padding-bottom: calc(84px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  color: #22343a;
}

.detail-top {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #eef2f3;
}

.top-title {
  font-size: 15px;
  font-weight: 600;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #33505a;
  font-size: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:active {
  background: #eef4f5;
}

.hero {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #dfeaec;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sheet {
  position: relative;
  margin-top: -22px;
  border-radius: 22px 22px 0 0;
  background: #fff;
  padding: 20px 18px 28px;
  box-shadow: 0 -6px 20px rgba(18, 60, 72, 0.05);
}

.tag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #e7f3f5;
  color: #127a90;
  font-size: 11px;
  font-weight: 600;
}

.time {
  font-size: 11px;
  color: #9aabb0;
}

.title {
  margin: 12px 0 16px;
  font-size: 21px;
  line-height: 1.45;
  font-weight: 700;
  letter-spacing: 0.2px;
  word-break: break-word;
}

.author-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d9eef1, #bfe2e7);
  color: #127a90;
  font-size: 16px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
}

.publish-time {
  font-size: 11px;
  color: #9aabb0;
}

.divider {
  height: 1px;
  background: #f0f3f4;
  margin: 16px 0;
}

.content p {
  margin: 0 0 14px;
  font-size: 15.5px;
  line-height: 1.9;
  color: #35494f;
  text-align: justify;
  word-break: break-word;
}

.content p:last-child {
  margin-bottom: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 18px;
}

.post-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: #eef3f4;
}

.footnote {
  margin: 20px 0 0;
  padding-top: 14px;
  border-top: 1px dashed #e8edef;
  font-size: 11px;
  line-height: 1.7;
  color: #a3b2b7;
}

.action-bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 750px;
  padding: 10px 18px calc(10px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #eef2f3;
  box-sizing: border-box;
  z-index: 30;
}

.like-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 999px;
  background: #127a90;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}

.like-btn:active {
  transform: scale(0.985);
}

.like-btn.liked {
  background: #fdf1ec;
  color: #d95636;
}

.like-btn .el-icon {
  font-size: 18px;
}

.like-count {
  margin-left: 4px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.36);
  font-weight: 500;
}

.like-btn.liked .like-count {
  border-left-color: rgba(217, 86, 54, 0.3);
}

.state {
  margin: 80px 24px;
  text-align: center;
  color: #7b8d94;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.state-icon {
  font-size: 48px;
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
}

.loading-wrap {
  background: #fff;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(100deg, #e8eef0 30%, #f5f8f9 50%, #e8eef0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-body {
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skeleton-line {
  height: 15px;
  border-radius: 7px;
  background: linear-gradient(100deg, #e8eef0 30%, #f5f8f9 50%, #e8eef0 70%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-line.w70 {
  width: 70%;
}

.skeleton-line.w90 {
  width: 90%;
}

.skeleton-line.w80 {
  width: 80%;
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
