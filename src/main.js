// 入口文件，把vue和路由都挂上去

import { createWebHistory, createRouter } from 'vue-router'
import { createApp, nextTick } from 'vue'
import App from './App.vue'
import routers from './router.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 先创建路由
let router = createRouter({
  history: createWebHistory(),
  routes: routers,
  // 跳转的时候回到顶部
  scrollBehavior: function (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 记录每个页面的滚动位置，这样返回的时候还在原来的地方
let scrollMap = new Map()

// 找可以滚动的元素
function getScrollEl() {
  let el1 = document.querySelector('.content')
  let el2 = document.querySelector('.page')
  let arr = [el1, el2]
  for (let i = 0; i < arr.length; i++) {
    let el = arr[i]
    if (el) {
      if (el.scrollHeight > el.clientHeight) {
        return el
      }
    }
  }
  // 都找不到就先返回第一个
  if (arr[0]) {
    return arr[0]
  }
  return document.scrollingElement
}

router.beforeEach(function (to, from) {
  console.log('要跳到：' + to.path)
  let el = getScrollEl()
  if (el) {
    scrollMap.set(from.fullPath, el.scrollTop)
  }
})

router.afterEach(function (to) {
  nextTick(function () {
    let el = getScrollEl()
    if (el) {
      let top = scrollMap.get(to.fullPath)
      if (!top) {
        top = 0
      }
      el.scrollTop = top
    }
  })
})

let app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
console.log('项目启动好了')
