<template>
  <nav class="tabbar">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      class="tab"
      :class="{ active: tab.key === active }"
      @click="go(tab)"
    >
      <el-icon class="tab-icon"><component :is="tab.icon" /></el-icon>
      <span>{{ tab.title }}</span>
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { HomeFilled, ShoppingBag, Compass, UserFilled } from '@element-plus/icons-vue'

const props = defineProps({
  active: { type: String, default: 'discover' },
})

const router = useRouter()

const tabs = [
  { key: 'home', title: '云医院', path: '/home', icon: HomeFilled },
  { key: 'shop', title: '商城', path: '/shop', icon: ShoppingBag },
  { key: 'discover', title: '发现', path: '/discover', icon: Compass },
  { key: 'me', title: '我', path: '', icon: UserFilled },
]

function go(tab) {
  if (!tab.path) {
    ElMessage.info('个人中心还在开发中')
    return
  }
  if (tab.key === props.active) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  router.push(tab.path)
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 750px;
  display: flex;
  align-items: stretch;
  background: #ffffff;
  border-top: 1px solid #eef2f3;
  box-shadow: 0 -4px 16px rgba(18, 122, 144, 0.06);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.tab {
  flex: 1;
  height: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: none;
  background: transparent;
  color: #93a3a8;
  font-size: 11px;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.tab-icon {
  font-size: 21px;
}

.tab.active {
  color: #127a90;
  font-weight: 600;
}

.tab:active {
  background: #f6fafb;
}
</style>
