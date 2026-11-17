<template>
  <div class="personal">
    <div class="top-ban"></div>

    <section>
      <div class="info">
        <div class="content">
          <img src="https://api.dicebear.com/7.x/identicon/svg?seed=huang" alt="avatar" />
          <div>
            <p class="name">{{ user.name }}</p>
            <p class="account">账号: {{ user.phone }}</p>
          </div>
        </div>
      </div>

      <ul class="menu">
        <li v-for="item in menus" :key="item.label" @click="go(item.path)">
          <div class="left">
            <i class="fa" :class="item.icon"></i>
            <p>{{ item.label }}</p>
          </div>
          <i class="fa fa-angle-right arrow"></i>
        </li>
      </ul>
    </section>

    <div class="bottom-ban"></div>
    <AppTabBar />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppTabBar from '@/components/AppTabBar.vue'

const router = useRouter()

const user = { name: '黄药师', phone: '13523651693' }

const menus = [
  { path: '/appointment', icon: 'fa-user-plus', label: '我的预约' },
  { path: '/service',     icon: 'fa-volume-control-phone', label: '我的服务' },
  { path: '/doctor',      icon: 'fa-bed', label: '我的医生' },
  { path: '/consult',     icon: 'fa-sticky-note', label: '问诊订单' },
  { path: '/shop',        icon: 'fa-cart-plus', label: '商城订单' },
  { path: '/login?out=1', icon: 'fa-sign-out', label: '退出登录' }
]

const go = (path) => router.push(path)
</script>

<style scoped>
.personal { padding-bottom: 10px; }
.top-ban { height: 56px; }
.bottom-ban { height: 56px; }

.info {
  width: 100%; height: 110px;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  display: flex; align-items: center;
}
.info .content { width: 90%; margin: 0 auto; display: flex; align-items: center; }
.info .content img {
  width: 52px; height: 52px; border-radius: 50%;
  background: #fff; padding: 4px; box-sizing: border-box;
}
.info .content div { margin-left: 12px; color: #FFF; }
.info .name { font-size: 18px; }
.info .account { font-size: 13px; margin-top: 8px; opacity: .9; }

.menu { width: 86%; margin: 16px auto 0; background: #fff; border-radius: 8px; overflow: hidden; }
.menu li {
  height: 54px; border-bottom: solid 1px #EEE;
  color: #555; font-size: 16px; font-weight: 600;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 12px; box-sizing: border-box; cursor: pointer;
}
.menu li:last-child { border-bottom: none; }
.menu .left { display: flex; align-items: center; }
.menu .left .fa { font-size: 18px; width: 24px; color: #02A6C9; }
.menu .left p { margin-left: 10px; font-weight: normal; color: #333; }
.menu .arrow { font-size: 20px; color: #CCC; }
</style>
