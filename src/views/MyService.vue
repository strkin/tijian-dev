<template>
  <div class="sub-page">
    <AppHeader title="我的服务" />
    <div class="top-ban"></div>

    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-head">
        <span class="title">{{ item.title }}</span>
        <span class="status" :class="item.statusClass">{{ item.statusText }}</span>
      </div>
      <div class="row"><span class="label">服务编号</span><span class="value">{{ item.no }}</span></div>
      <div class="row"><span class="label">包含内容</span><span class="value">{{ item.content }}</span></div>
      <div class="row"><span class="label">{{ item.remainLabel }}</span><span class="value">{{ item.remain }}</span></div>
      <div class="card-foot">
        <span class="btn" v-if="item.detailBtn" @click="goDetail(item.id)">{{ item.detailBtn }}</span>
        <span class="btn primary" @click="goAction(item)">{{ item.actionBtn }}</span>
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
    id: 1, title: '年度健康管家服务', statusText: '使用中', statusClass: 'pay',
    no: 'FW202601010023', content: '12次在线问诊 + 2次专家面诊',
    remainLabel: '有效期至', remain: '2026-12-31（在线问诊剩5次 / 面诊剩1次）',
    detailBtn: '服务详情', actionBtn: '立即使用'
  },
  {
    id: 2, title: '入职体检绿色通道', statusText: '待使用', statusClass: 'wait',
    no: 'FW202611120102', content: '免排队体检 + 报告加急出具',
    remainLabel: '有效期至', remain: '2027-05-12',
    detailBtn: '服务详情', actionBtn: '去使用'
  },
  {
    id: 3, title: '体检报告解读服务', statusText: '已用完', statusClass: 'done',
    no: 'FW202609050045', content: '副主任医师报告一对一解读',
    remainLabel: '完成时间', remain: '2026-09-08  16:40',
    detailBtn: '', actionBtn: '再来一单'
  }
]

const goDetail = (id) => router.push(`/personal/service/${id}`)
const goAction = (item) => {
  if (item.actionBtn === '再来一单') {
    router.push(`/personal/service/${item.id}/order`)
  } else {
    router.push(`/personal/service/${item.id}`)
  }
}
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
.status.pay { color: #02A6C9; background: #E0F6FB; }
.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2; }
.label { color: #999; }
.value { color: #333; }
.card-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
.btn { font-size: 13px; padding: 6px 16px; border-radius: 14px; border: solid 1px #02A6C9; color: #02A6C9; margin-left: 8px; cursor: pointer; }
.btn.primary { background-image: linear-gradient(135deg,#7DB35D,#02A6C9); color: #FFF; border: none; }
</style>
