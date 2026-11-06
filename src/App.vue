<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const isMobile = ref(window.innerWidth < 768)
function onResize() { isMobile.value = window.innerWidth < 768 }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<template>
    
<RouterView>
  
</RouterView>
</template>

<style>
#app {
  max-width: 750px;        /* 手机App在桌面端居中显示，最大宽度750px */
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);  /* 可选：加个阴影区分 */
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
</style>
