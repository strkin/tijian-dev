<template>
  <div class="sub-page">
    <AppHeader title="我的预约" />
    <div class="top-ban"></div>

    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-head">
        <span class="title">{{ item.title }}</span>
        <span class="status" :class="item.statusClass">{{ item.statusText }}</span>
      </div>
      <div class="row"><span class="label">预约编号</span><span class="value">{{ item.no }}</span></div>
      <div class="row"><span class="label">体检机构</span><span class="value">{{ item.org }}</span></div>
      <div class="row"><span class="label">{{ item.timeLabel }}</span><span class="value">{{ item.time }}</span></div>
      <div class="row"><span class="label">体检人</span><span class="value">{{ item.person }}</span></div>
      <div class="card-foot">
        <span v-if="item.cancelable" class="btn" @click="goDetail(item.id)">取消预约</span>
        <span class="btn primary" @click="goDetail(item.id)">查看详情</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const list = [
  {
    id: 1, title: '入职体检套餐', statusText: '待体检', statusClass: 'wait',
    no: 'YY202611120089', org: '东软健康体检中心（红旗路店）',
    timeLabel: '预约时间', time: '2026-11-18  08:30-10:00', person: '黄药师',
    cancelable: true
  },
  {
    id: 2, title: '中老年全面深度体检', statusText: '待体检', statusClass: 'wait',
    no: 'YY202611100031', org: '东软健康体检中心（高新店）',
    timeLabel: '预约时间', time: '2026-11-22  08:00-11:30', person: '黄药师',
    cancelable: true
  },
  {
    id: 3, title: '基础健康体检', statusText: '已完成', statusClass: 'done',
    no: 'YY202609020156', org: '东软健康体检中心（红旗路店）',
    timeLabel: '体检时间', time: '2026-09-05  09:00', person: '黄药师',
    cancelable: false
  },
  {
    id: 4, title: '女性专项体检套餐', statusText: '已取消', statusClass: 'cancel',
    no: 'YY202608150077', org: '东软健康体检中心（高新店）',
    timeLabel: '取消时间', time: '2026-08-18  14:22', person: '黄药师',
    cancelable: false
  }
]

const goDetail = (id) => router.push(`/personal/appointment/${id}`)
</script>

<style scoped>
.sub-page { padding-bottom: 20px; }
.top-ban { height: 56px; }
.card { width: 92%; margin: 12px auto 0; background: #FFF; border-radius: 8px; padding: 16px; box-sizing: border-box; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.card-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: dashed 1px #EEE; }
.title { font-size: 16px; color: #333; font-weight: 600; }
.status { font-size: 12px; padding: 3px 10px; border-radius: 10px; }
.status.wait { color: #FF9900; background: #FFF4E0; }
.status.done { color: #7DB35D; background: #EAF6E2; }
.status.cancel { color: #999; background: #F0F0F0; }
.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2; }
.label { color: #999; }
.value { color: #333; }
.card-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
.btn { font-size: 13px; padding: 6px 16px; border-radius: 14px; border: solid 1px #02A6C9; color: #02A6C9; margin-left: 8px; cursor: pointer; }
.btn.primary { background-image: linear-gradient(135deg,#7DB35D,#02A6C9); color: #FFF; border: none; }
</style>
