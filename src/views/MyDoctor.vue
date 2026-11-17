<template>
  <div class="sub-page">
    <AppHeader title="我的医生" />
    <div class="top-ban"></div>

    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-head">
        <div class="doc-left">
          <img class="doc-avatar" :src="item.avatar" :alt="item.name" />
          <div>
            <span class="title">{{ item.name }}  {{ item.title }}</span>
            <div class="status" :class="item.statusClass">{{ item.statusText }}</div>
          </div>
        </div>
      </div>
      <div class="row"><span class="label">科室</span><span class="value">{{ item.dept }}</span></div>
      <div class="row"><span class="label">执业医院</span><span class="value">{{ item.hospital }}</span></div>
      <div class="row"><span class="label">擅长</span><span class="value">{{ item.skill }}</span></div>
      <div class="row"><span class="label">{{ item.timeLabel }}</span><span class="value">{{ item.time }}</span></div>
      <div class="card-foot">
        <span class="btn" @click="goProfile(item.id)">查看主页</span>
        <span class="btn primary" @click="goConsult(item.id, item.actionText)">{{ item.actionText }}</span>
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
    id: 1, name: '刘长胜', title: '主任医师', statusText: '问诊中', statusClass: 'pay',
    avatar: '/doctors/刘长胜.jpg',
    dept: '心血管内科', hospital: '东软云医院',
    skill: '高血压、冠心病、心律失常诊疗',
    timeLabel: '最近咨询', time: '2026-11-10  19:30',
    actionText: '继续问诊'
  },
  {
    id: 2, name: '赵桂凤', title: '副主任医师', statusText: '已结束', statusClass: 'done',
    avatar: '/doctors/赵桂凤.jpg',
    dept: '体检中心 / 健康管理', hospital: '东软健康体检中心',
    skill: '体检报告解读、慢病风险评估',
    timeLabel: '最近咨询', time: '2026-09-08  16:40',
    actionText: '再次咨询'
  },
  {
    id: 3, name: '吕文达', title: '主治医师', statusText: '待回复', statusClass: 'wait',
    avatar: '/doctors/吕文达.jpg',
    dept: '消化内科', hospital: '东软云医院',
    skill: '胃炎、脂肪肝、肠道功能调理',
    timeLabel: '提问时间', time: '2026-11-15  21:08',
    actionText: '追问医生'
  }
]

const goProfile = (id) => router.push(`/doctor/${id}`)
const goConsult = (id, from) => router.push({ path: `/doctor/${id}/consult`, query: { from } })
</script>

<style scoped>
.sub-page { padding-bottom: 20px; }
.top-ban { height: 56px; }
.card { width: 92%; margin: 12px auto 0; background: #FFF; border-radius: 8px; padding: 16px; box-sizing: border-box; box-shadow: 0 1px 4px rgba(0,0,0,.04); }
.card-head { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: dashed 1px #EEE; }
.doc-left { display: flex; align-items: center; }
.doc-avatar {
  width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
  margin-right: 12px; border: solid 2px #E0F6FB;
}
.title { font-size: 16px; color: #333; font-weight: 600; display: block; }
.status { font-size: 11px; padding: 2px 8px; border-radius: 8px; display: inline-block; margin-top: 4px; }
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
