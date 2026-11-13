<template>
  <div class="bottom-nav">
    <!-- 导航用栅格分成4份 -->
    <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
      <el-col :xs="6" :sm="8" :md="8" :lg="8" :xl="8"
        v-for="(item, index) in navs" :key="index"
        @click="go(item)">
        <div class="nav-item">
          <el-icon :size="22" class="nav-icon"><component :is="item.icon" /></el-icon>
          {{ item.title }}
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { House, ShoppingCart, Search, User } from '@element-plus/icons-vue'

let router = useRouter()

// 底部的4个导航
let navs = [
  { title: '云医院', icon: House, path: '/home' },
  { title: '商城', icon: ShoppingCart, path: '/shop' },
  { title: '发现', icon: Search, path: '/discover91' },
  { title: '我', icon: User, path: '' }
]

// 点击导航
function go(item) {
  if (item.path) {
    router.push(item.path)
  } else {
    // 其他几个还没做
    console.log('这个页面还没做')
  }
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 750px;
  height: 8vh;
  background: #fff;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  z-index: 1000;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 3vw;
  gap: 1vw;
  height: 100%;
  cursor: pointer;
}
.nav-icon {
  color: #000;
}
/* 下面这几个暂时没用上 */
/* .nav-item:hover {
  color: #127A90;
} */
</style>
