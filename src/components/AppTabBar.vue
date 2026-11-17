<template>
  <footer class="tab-bar">
    <ul>
      <li v-for="item in tabs" :key="item.label"
          :class="{ active: currentPath === item.path }"
          @click="go(item.path)">
        <i class="fa" :class="item.icon"></i>
        <p>{{ item.label }}</p>
      </li>
    </ul>
  </footer>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const tabs = [
  { path: '/personal', icon: 'fa-home', label: '云医院' },
  { path: '/personal', icon: 'fa-opencart', label: '商城' },
  { path: '/personal', icon: 'fa-compass', label: '发现' },
  { path: '/personal', icon: 'fa-user', label: '我' }
]

const currentPath = route.path
const go = (path) => { if (path && path !== route.path) router.push(path) }
</script>

<style scoped>
.tab-bar {
  width: 100%;
  max-width: 750px;
  height: 56px;
  box-sizing: border-box;
  border-top: solid 1px #E9E9E9;
  background-color: #FFF;
  position: fixed;
  left: 0; bottom: 0;
}
.tab-bar ul {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: space-around;
}
.tab-bar li {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  font-size: 12px; color: #999;
  cursor: pointer; user-select: none;
}
.tab-bar li.active { color: #02A6C9; }
.tab-bar li .fa { font-size: 20px; margin-bottom: 2px; }
</style>
