<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'

let route = useRoute()

// 个人中心自己有底部导航，这里就不用再显示了
let showBottomNav = computed(function () {
  if (route.path.indexOf('/personal') == 0) {
    return false
  } else {
    return true
  }
})
</script>

<template>

<RouterView>

</RouterView>
<!-- 底部导航 -->
<BottomNav v-if="showBottomNav" />
</template>

<style>
/* 整个app的样式 */
html, body, div, span, h1, h2, h3, h4, h5, h6, ul, ol, li, p {
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  min-height: 100%;
  font-family: "微软雅黑";
  background-color: #F7F9FA;
}
ul, ol {
  list-style: none;
}
a {
  text-decoration: none;
}
input {
  outline: none;
  border: none;
}
button {
  cursor: pointer;
  border: none;
}
#app {
  width: 100%;
  max-width: 750px;        /* 手机App在桌面端居中显示，最大宽度750px */
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);  /* 可选：加个阴影区分 */
  background-color: #F7F9FA;
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
  padding-bottom: 8vh;
  box-sizing: border-box;
}
</style>
