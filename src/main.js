
import { createWebHistory, createRouter } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import routers  from './router.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const router = createRouter({
  history: createWebHistory(),
  routes:routers,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})
const app=createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
