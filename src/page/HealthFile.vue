<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">健康档案</p>
    <div class="header-right"></div>
  </div>

  <div class="content">
    <img class="banner" src="@/img/report.png">

    <ul class="file-list">
      <li class="file-item" v-for="(f, i) in files" :key="i" @click="goReport">
        <div class="left">
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="text">
            <p class="file-title">{{ f.title }}</p>
            <p class="file-subtitle">{{ f.subtitle }}</p>
          </div>
        </div>
        <el-button :icon="ArrowRight" @click="goReport" style="border: none;"></el-button>
      </li>
    </ul>
  </div>
</div>
</template>

<script setup>
import { ArrowLeftBold, ArrowRight, Document } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

let router = useRouter()

// 报告列表
let files = ref([
  { title: '2021年11月24日 体检报告', subtitle: '沈阳世贸熙康健康管理中心' },
  { title: '2019年10月11日 体检报告', subtitle: '沈阳熙康云医院' }
])

// 点进去看报告
function goReport() {
  console.log('看报告')
  router.push('/TijianReport')
}

// 以后要加删除功能
// function delReport() {
//   console.log('删除')
// }
</script>

<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  background: #f9f9f9;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 3.6vw;
  height: 15.7vw;
}
.header-title {
  font-size: 5vw;
  margin: 0;
}
.header-right {
  width: 8vw;
}
.banner {
  width: 100%;
  display: block;
}
.file-list {
  width: 86vw;
  margin: 0 auto;
  list-style: none;
  padding: 0;
}
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 18vw;
  border-bottom: 1px solid #eee;
}
.left {
  display: flex;
  align-items: center;
}
.file-icon {
  font-size: 8vw;
  color: #6BB9B6;
  margin-right: 3vw;
}
.file-title {
  color: #555;
  font-size: 4.2vw;
  font-weight: 600;
  margin: 0;
}
.file-subtitle {
  color: #999;
  font-size: 3.2vw;
  font-weight: 600;
  margin: 1vw 0 0;
}
.arrow {
  color: #999;
  font-size: 6vw;
}
</style>
