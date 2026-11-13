<template>
  <div class="publish-page">
    <header class="pub-top">
      <button type="button" class="icon-btn" aria-label="返回" @click="goBack">
        <el-icon style="color:#fff"><ArrowLeft /></el-icon>
      </button>
      <span class="top-title">发布内容</span>
      <span class="top-placeholder" />
    </header>

    <div class="form">
      <section class="block">
        <h2 class="block-title">选择话题分类</h2>
        <div class="chips">
          <button
            v-for="item in categories"
            :key="item"
            type="button"
            class="chip"
            :class="{ active: form.category === item }"
            @click="form.category = item"
          >
            {{ item }}
          </button>
        </div>
      </section>

      <section class="block">
        <h2 class="block-title">标题</h2>
        <el-input
          v-model="form.title"
          :maxlength="limits.title"
          show-word-limit
          placeholder="试着写点攒劲的标题把用户骗进来"
          class="title-input"
        />
      </section>

      <section class="block">
        <h2 class="block-title">正文</h2>
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="7"
          :maxlength="limits.content"
          show-word-limit
          resize="none"
          placeholder="写点好东西给别的用户看吧！"
          class="content-input"
        />
      </section>

      <section class="block">
        <h2 class="block-title">封面图</h2>
        <div class="cover-preview">
          <img :src="form.cover" alt="封面预览" />
          <span class="cover-hint">封面会显示在发现页卡片上</span>
          <button type="button" class="cover-upload" :disabled="uploadingCover" @click="pickCover">
            <el-icon><Upload /></el-icon>
            {{ uploadingCover ? '上传中…' : '上传封面' }}
          </button>
        </div>

        <div class="cover-grid">
          <button
            v-for="cover in covers"
            :key="cover"
            type="button"
            class="cover-option"
            :class="{ active: form.cover === cover }"
            @click="form.cover = cover"
          >
            <img :src="cover" alt="" />
            <el-icon v-if="form.cover === cover" class="cover-check"><Select /></el-icon>
          </button>
        </div>
        <p class="hint">也可以从上面选一张内置封面</p>
      </section>

      <section class="block">
        <h2 class="block-title">正文配图 <span class="block-sub">最多 {{ limits.images }} 张</span></h2>
        <div class="image-grid">
          <div v-for="(url, index) in form.images" :key="url" class="image-item">
            <img :src="url" alt="配图" />
            <button type="button" class="remove-btn" aria-label="移除" @click="removeImage(index)">
              <el-icon><Close /></el-icon>
            </button>
          </div>
          <button
            v-if="form.images.length < limits.images"
            type="button"
            class="image-add"
            :disabled="uploadingImages"
            @click="pickImages"
          >
            <el-icon class="add-icon"><Plus /></el-icon>
            <span>{{ uploadingImages ? '上传中…' : '添加图片' }}</span>
          </button>
        </div>
      </section>

      <section class="block">
        <h2 class="block-title">昵称 <span class="block-sub">选填</span></h2>
        <el-input
          v-model="form.author"
          maxlength="30"
          placeholder="不填则以「匿名用户」发布"
          class="author-input"
        />
      </section>

      <div class="text-center">
        <p class="notice">发布内容请遵循★中华人民共和国★相关法律法规</p>
        <p class="notice">违者直接枪毙</p>
      </div>
    </div>

    <div class="action-bar">
      <el-button
        type="primary"
        round
        class="submit-btn"
        :loading="submitting"
        @click="submit"
      >
        发布
      </el-button>
    </div>

    <input ref="coverInput" type="file" accept="image/*" hidden @change="onCoverChange" />
    <input ref="imageInput" type="file" accept="image/*" multiple hidden @change="onImagesChange" />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Close, Plus, Select, Upload } from '@element-plus/icons-vue'
import { createPost, fetchMeta, getSavedAuthor, saveAuthor, uploadImage } from '@/api/discover'

const router = useRouter()

const categories = ref(['医疗科普', '养生保健', '运动健康', '心理健康', '饮食营养'])
// 内置封面兜底清单：对应 public/covers/ 下的 svg，正常会由 /api/discover/meta 覆盖
const covers = ref([1, 2, 3, 4, 5, 6, 7].map((n) => `/covers/cover-${n}.svg`))
const limits = reactive({ title: 80, content: 5000, images: 9 })

const form = reactive({
  title: '',
  content: '',
  category: '医疗科普',
  author: getSavedAuthor(),
  cover: '/covers/cover-1.svg',
  images: [],
})

const submitting = ref(false)
const uploadingCover = ref(false)
const uploadingImages = ref(false)
const coverInput = ref(null)
const imageInput = ref(null)

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/discover')
  }
}

function pickCover() {
  coverInput.value?.click()
}

function pickImages() {
  imageInput.value?.click()
}

function validateImage(file) {
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('只能上传图片文件')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('单张图片不能超过 5MB')
    return false
  }
  return true
}

async function onCoverChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file || !validateImage(file)) return

  uploadingCover.value = true
  try {
    const data = await uploadImage(file)
    form.cover = data.url
    ElMessage.success('封面已上传')
  } catch (err) {
    ElMessage.error(err.message || '封面上传失败')
  } finally {
    uploadingCover.value = false
  }
}

async function onImagesChange(event) {
  const files = Array.from(event.target.files || [])
  event.target.value = ''
  if (!files.length) return

  const remain = limits.images - form.images.length
  if (remain <= 0) {
    ElMessage.warning(`最多添加 ${limits.images} 张配图`)
    return
  }
  if (files.length > remain) {
    ElMessage.warning(`最多再添加 ${remain} 张，已自动截取`)
  }

  uploadingImages.value = true
  try {
    for (const file of files.slice(0, remain)) {
      if (!validateImage(file)) continue
      const data = await uploadImage(file)
      form.images.push(data.url)
    }
  } catch (err) {
    ElMessage.error(err.message || '图片上传失败')
  } finally {
    uploadingImages.value = false
  }
}

function removeImage(index) {
  form.images.splice(index, 1)
}

async function submit() {
  if (submitting.value) return

  const title = form.title.trim()
  const content = form.content.trim()

  if (!title) {
    ElMessage.warning('请填写标题')
    return
  }
  if (!content) {
    ElMessage.warning('请填写正文')
    return
  }

  submitting.value = true
  try {
    const data = await createPost({
      title,
      content,
      category: form.category,
      author: form.author.trim(),
      cover: form.cover,
      images: form.images,
    })
    saveAuthor(form.author.trim())
    ElMessage.success('发布成功')
    router.replace(`/discover/${data.post.id}`)
  } catch (err) {
    ElMessage.error(err.message || '发布失败，请稍后再试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchMeta()
    .then((meta) => {
      if (Array.isArray(meta?.categories) && meta.categories.length) categories.value = meta.categories
      if (Array.isArray(meta?.covers) && meta.covers.length) covers.value = meta.covers
      if (meta?.limits) {
        limits.title = meta.limits.title || limits.title
        limits.content = meta.limits.content || limits.content
        limits.images = meta.limits.images || limits.images
      }
    })
    .catch(() => {
      /* 接口不可用时使用内置选项，表单仍可填写 */
    })
})
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #000000;
  padding-bottom: calc(88px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  color: #22343a;
}

.pub-top {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  background: rgba(0, 0, 0, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #878787;
}

.top-title {
  font-size: 15px;
  font-weight: 600;
  color:#ffffff
}

.top-placeholder {
  width: 38px;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: #747474;
  font-size: 19px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:active {
  background: #444444;
}

.form {
  padding: 12px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.block {
  background: #000000;
  border: solid 1px #7f7f7f;
  border-radius: 4px;
  padding: 14px 14px 16px;
}

.block-title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

.block-sub {
  margin-left: 6px;
  font-size: 11px;
  font-weight: 400;
  color: #b1b1b1;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: 1px solid transparent;
  background: #232323;
  color: #ffffff;
  font-size: 12px;
  padding: 7px 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.chip.active {
  background: #555555;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(163, 163, 163, 0.22);
}

.title-input :deep(.el-input__inner) {
  color: #e4e4e4;
}

.title-input :deep(.el-input__wrapper) {
  --el-fill-color-blank: transparent;
  --el-input-placeholder-color: #6b6b6b;
  background: #232323;
  box-shadow: none;
}

.author-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  background: #232323;
  box-shadow: none;
  padding: 3px 12px;
}

.content-input {
  --el-fill-color-blank: transparent;
  --el-input-placeholder-color: #6b6b6b;
  user-select: none;
}
.content-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  background: #232323;
  box-shadow: none;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.8;
  font-family: inherit;
  user-select: none;
  color:#e4e4e4;
}

.cover-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 8;
  border-radius: 12px;
  overflow: hidden;
  background: #e8eff0;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-hint {
  position: absolute;
  left: 10px;
  bottom: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(35, 35, 35, 0.4);
  color: #fff;
  font-size: 10px;
  backdrop-filter: blur(4px);
}

.cover-upload {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.92);
  color: #000000;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.cover-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.cover-option {
  position: relative;
  padding: 0;
  border: 2px solid #515151;
  border-radius: 10px;
  overflow: hidden;
  background: #000000;
  cursor: pointer;
  aspect-ratio: 4 / 3;
}

.cover-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover-option.active {
  border-color: #ffffff;
}

.cover-check {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #d80000;
  color: #ffffff;
  font-size: 12px;
}

.hint {
  margin: 8px 0 0;
  font-size: 11px;
  color: #9aabb0;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: #000000;
}

.image-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  overflow: hidden;
  background: #232323;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.remove-btn {
  position: absolute;
  right: 3px;
  top: 3px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(20, 35, 40, 0.55);
  color: #fff;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.image-add {
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  background: #4d4d4d;
  color: #ffffff;
  font-size: 11px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
}

.image-add:disabled {
  opacity: 0.6;
  cursor: progress;
}

.add-icon {
  font-size: 22px;
  color: #c7c7c7;
}

.notice {
  margin: 0px auto 0px;
  font-size: 12px;
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
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: rgba(0, 0, 0, 0.96);
  border-top: 1px solid #3b3b3b;
  box-sizing: border-box;
  z-index: 30;
}

.submit-btn {
  width: 100%;
  height: 46px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #b50000);
  box-shadow: 0 6px 16px rgba(18, 122, 144, 0.24);
}

.submit-btn :deep(span) {
  color: #fff;
}
.title-input :deep(.el-input__count) {
  background: none;
  right: 8px;
  color: var(--el-color-info);
}
</style>
