<template>
  <div class="detail-page">
    <AppHeader title="服务详情" />
    <div class="top-ban"></div>

    <!-- 服务横幅 -->
    <div class="banner">
      <div class="icon-circle"><i class="fa" :class="detail.icon"></i></div>
      <p class="svc-name">{{ detail.title }}</p>
      <p class="svc-no">编号：{{ detail.no }}</p>
      <span class="svc-status" :class="detail.statusClass">{{ detail.statusText }}</span>
    </div>

    <!-- 服务详情 -->
    <div class="card">
      <div class="card-title">服务详情</div>
      <div class="row"><span class="label">服务编号</span><span class="value">{{ detail.no }}</span></div>
      <div class="row"><span class="label">服务类型</span><span class="value">{{ detail.type }}</span></div>
      <div class="row"><span class="label">购买时间</span><span class="value">{{ detail.buyTime }}</span></div>
      <div class="row"><span class="label">有效期至</span><span class="value">{{ detail.expire }}</span></div>
      <div class="row"><span class="label">适用人</span><span class="value">{{ detail.user }}</span></div>
    </div>

    <!-- 包含内容 -->
    <div class="card">
      <div class="card-title">包含内容</div>
      <div class="item" v-for="(it, i) in detail.includes" :key="i">
        <i class="fa fa-check-circle"></i>
        <span>{{ it }}</span>
      </div>
    </div>

    <!-- 使用情况 -->
    <div class="card" v-if="detail.usages.length">
      <div class="card-title">
        使用情况
        <span class="progress-text">已用 {{ detail.usedCount }}/{{ detail.totalCount }} 次</span>
      </div>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="usage-list">
        <div class="usage-item" v-for="(u, i) in detail.usages" :key="i">
          <div class="usage-left">
            <i class="fa" :class="u.icon"></i>
            <div>
              <p class="usage-title">{{ u.title }}</p>
              <p class="usage-time">{{ u.time }}</p>
            </div>
          </div>
          <span class="usage-count">-1次</span>
        </div>
      </div>
    </div>

    <!-- 空使用记录 -->
    <div class="card" v-else>
      <div class="empty">
        <i class="fa fa-inbox"></i>
        <p>暂无使用记录</p>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button class="btn-primary" @click="goUse">{{ detail.actionText }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const dataMap = {
  1: {
    title: '年度健康管家服务', icon: 'fa-shield', statusText: '使用中', statusClass: 'pay',
    no: 'FW202601010023', type: '年度会员服务', buyTime: '2026-01-01  10:30',
    expire: '2026-12-31', user: '黄药师',
    includes: ['12次在线图文问诊（不限科室）', '2次专家面诊预约', '1份年度体检报告解读', '专属健康顾问7×24小时在线'],
    usedCount: 7, totalCount: 14,
    usages: [
      { title: '在线问诊 · 心血管内科 · 陈志远', time: '2026-11-10  19:30', icon: 'fa-comments' },
      { title: '在线问诊 · 消化内科 · 赵明哲', time: '2026-10-22  20:15', icon: 'fa-comments' },
      { title: '专家面诊 · 内分泌科 · 王主任', time: '2026-10-08  14:00', icon: 'fa-stethoscope' },
      { title: '在线问诊 · 呼吸科 · 李医生', time: '2026-09-15  18:42', icon: 'fa-comments' },
      { title: '报告解读 · 基础健康体检', time: '2026-09-08  16:40', icon: 'fa-file-text-o' },
      { title: '在线问诊 · 骨科 · 张医生', time: '2026-08-20  11:20', icon: 'fa-comments' },
      { title: '专家面诊 · 心血管内科 · 陈志远', time: '2026-07-15  09:30', icon: 'fa-stethoscope' }
    ],
    actionText: '立即使用'
  },
  2: {
    title: '入职体检绿色通道', icon: 'fa-fast-forward', statusText: '待使用', statusClass: 'wait',
    no: 'FW202611120102', type: '单次服务', buyTime: '2026-11-12  15:20',
    expire: '2027-05-12', user: '黄药师',
    includes: ['体检免排队快速通道', '体检报告24小时加急出具', '一对一引导检线流程'],
    usedCount: 0, totalCount: 1,
    usages: [],
    actionText: '去使用'
  },
  3: {
    title: '体检报告解读服务', icon: 'fa-file-text-o', statusText: '已用完', statusClass: 'done',
    no: 'FW202609050045', type: '单次服务', buyTime: '2026-09-05  11:00',
    expire: '2026-09-30', user: '黄药师',
    includes: ['副主任医师一对一解读', '异常指标标注与建议', '饮食运动指导方案'],
    usedCount: 1, totalCount: 1,
    usages: [
      { title: '报告解读 · 林雅茹 副主任医师', time: '2026-09-08  16:40', icon: 'fa-file-text-o' }
    ],
    actionText: '再来一单'
  }
}

const detail = dataMap[route.params.id] || dataMap[1]
const progressPercent = computed(() => Math.round(detail.usedCount / detail.totalCount * 100))

const goUse = () => {
  if (detail.actionText === '再来一单') {
    router.push(`/personal/service/${route.params.id}/order`)
  } else {
    alert('正在进入使用流程...')
  }
}
</script>

<style scoped>
.detail-page { padding-bottom: 80px; }
.top-ban { height: 56px; }

.banner {
  width: 100%; padding: 24px 0; text-align: center; color: #FFF;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
}
.icon-circle {
  width: 60px; height: 60px; margin: 0 auto; border-radius: 50%;
  background: rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center;
}
.icon-circle .fa { font-size: 28px; }
.svc-name { font-size: 19px; font-weight: 600; margin-top: 12px; }
.svc-no { font-size: 12px; margin-top: 6px; opacity: .85; }
.svc-status {
  display: inline-block; margin-top: 10px; font-size: 12px;
  padding: 3px 14px; border-radius: 12px; background: rgba(255,255,255,.25);
}

.card {
  width: 92%; margin: 12px auto 0; background: #FFF;
  border-radius: 8px; padding: 16px; box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.card-title {
  font-size: 15px; font-weight: 600; color: #333;
  padding-bottom: 10px; margin-bottom: 6px;
  border-bottom: solid 1px #EEE;
  display: flex; justify-content: space-between; align-items: center;
}
.progress-text { font-size: 12px; color: #999; font-weight: normal; }
.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2.2; }
.label { color: #999; }
.value { color: #333; }

.item { display: flex; align-items: center; font-size: 13px; color: #333; line-height: 2.2; }
.item .fa { color: #7DB35D; margin-right: 8px; }

.progress-bar {
  width: 100%; height: 8px; background: #F0F0F0; border-radius: 4px;
  margin: 10px 0 16px; overflow: hidden;
}
.progress-inner {
  height: 100%; border-radius: 4px;
  background-image: linear-gradient(90deg, #7DB35D, #02A6C9);
  transition: width .3s;
}

.usage-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: solid 1px #F5F5F5;
}
.usage-item:last-child { border-bottom: none; }
.usage-left { display: flex; align-items: center; }
.usage-left > .fa {
  width: 32px; height: 32px; border-radius: 50%;
  background: #E0F6FB; color: #02A6C9; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-right: 10px;
}
.usage-title { font-size: 13px; color: #333; }
.usage-time { font-size: 11px; color: #999; margin-top: 2px; }
.usage-count { font-size: 13px; color: #FF6B6B; font-weight: 600; }

.empty { text-align: center; padding: 30px 0; color: #CCC; }
.empty .fa { font-size: 32px; display: block; margin-bottom: 8px; }
.empty p { font-size: 13px; }

.bottom-bar {
  position: fixed; left: 0; bottom: 0; width: 100%; max-width: 750px;
  padding: 10px 4%; box-sizing: border-box; background: #FFF;
  border-top: solid 1px #EEE;
}
.btn-primary {
  width: 100%; height: 44px; border-radius: 22px; border: none;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; font-size: 16px;
}
</style>
