<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BottomNav from './components/BottomNav.vue'

// 判断是不是手机（好像现在没用到，先写着）
let isMobile = ref(window.innerWidth < 768)

// 屏幕变宽变窄的时候重新判断一下
function onResize() {
  isMobile.value = window.innerWidth < 768
  // console.log('现在是不是手机：', isMobile.value)
}

onMounted(function () {
  window.addEventListener('resize', onResize)
})

onUnmounted(function () {
  window.removeEventListener('resize', onResize)
})
</script>

<template>

<RouterView>

</RouterView>
<!-- 底部导航 -->
<BottomNav />
</template>

<style>
/* 整个app的样式 */
#app {
  max-width: 750px;        /* 手机App在桌面端居中显示，最大宽度750px */
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);  /* 可选：加个阴影区分 */
  /* width: 100%; */
}
.el-col {
  border-radius: 4px;
  text-decoration: none;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-decoration: none;
}
/* 给各页面底部留出全局导航栏高度，避免内容被遮挡 */
.page, .content, .chat-page {
  padding-bottom: 10vh;
  box-sizing: border-box;
}
</style>
