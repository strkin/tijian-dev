<template>
  <div class="detail-page">
    <AppHeader title="预约详情" />
    <div class="top-ban"></div>

    <!-- 取消成功提示 -->
    <transition name="fade">
      <div v-if="cancelled" class="success-tip">
        <i class="fa fa-check-circle"></i> 预约取消成功
      </div>
    </transition>

    <!-- 状态横幅 -->
    <div class="banner" :class="detail.statusClass">
      <i class="fa" :class="detail.statusIcon"></i>
      <p class="banner-title">{{ detail.statusText }}</p>
      <p class="banner-sub">{{ detail.statusSub }}</p>
    </div>

    <!-- 基本信息 -->
    <div class="card">
      <div class="card-title">基本信息</div>
      <div class="row"><span class="label">预约编号</span><span class="value">{{ detail.no }}</span></div>
      <div class="row"><span class="label">体检套餐</span><span class="value">{{ detail.title }}</span></div>
      <div class="row"><span class="label">体检机构</span><span class="value">{{ detail.org }}</span></div>
      <div class="row"><span class="label">预约时间</span><span class="value">{{ detail.time }}</span></div>
      <div class="row"><span class="label">体检人</span><span class="value">{{ detail.person }}</span></div>
      <div class="row"><span class="label">联系电话</span><span class="value">{{ detail.phone }}</span></div>
    </div>

    <!-- 体检项目 -->
    <div class="card">
      <div class="card-title">包含项目</div>
      <div class="item" v-for="(p, i) in detail.items" :key="i">
        <i class="fa fa-check-circle"></i>
        <span>{{ p }}</span>
      </div>
    </div>

    <!-- 注意事项 -->
    <div class="card">
      <div class="card-title">注意事项</div>
      <div class="notice" v-for="(n, i) in detail.notices" :key="i">
        <span class="num">{{ i + 1 }}</span>
        <span>{{ n }}</span>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-bar">
      <button v-if="!cancelled && detail.cancelable" class="btn-cancel" @click="showConfirm = true">取消预约</button>
      <button v-else-if="!cancelled" class="btn-primary" @click="router.back()">返回列表</button>
      <button v-else class="btn-primary" @click="router.push('/personal/appointment')">返回预约列表</button>
    </div>

    <!-- 确认取消弹窗 -->
    <transition name="fade">
      <div v-if="showConfirm" class="modal-mask" @click.self="showConfirm = false">
        <div class="modal">
          <i class="fa fa-exclamation-circle warn"></i>
          <p class="modal-title">确认取消预约？</p>
          <p class="modal-desc">取消后需重新预约，距体检不足24小时将无法取消</p>
          <div class="modal-btns">
            <button class="modal-btn cancel" @click="showConfirm = false">再想想</button>
            <button class="modal-btn ok" @click="confirmCancel">确认取消</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const showConfirm = ref(false)
const cancelled = ref(false)

const dataMap = {
  1: {
    title: '入职体检套餐', statusText: '待体检', statusSub: '请按预约时间准时到达',
    statusClass: 'wait', statusIcon: 'fa-clock-o',
    no: 'YY202611120089', org: '东软健康体检中心（红旗路店）',
    time: '2026-11-18  08:30-10:00', person: '黄药师', phone: '156****4589',
    cancelable: true,
    items: ['一般检查（身高/体重/血压）', '内科、外科常规检查', '血常规（18项）', '尿常规（12项）', '肝功能（ALT/AST）', '胸部X光正位片'],
    notices: ['体检前一天晚10点后请勿进食、饮水', '体检当日请空腹，抽血及B超检查后再进食', '请携带本人身份证原件', '穿宽松衣物，避免金属饰品']
  },
  2: {
    title: '中老年全面深度体检', statusText: '待体检', statusSub: '请按预约时间准时到达',
    statusClass: 'wait', statusIcon: 'fa-clock-o',
    no: 'YY202611100031', org: '东软健康体检中心（高新店）',
    time: '2026-11-22  08:00-11:30', person: '黄药师', phone: '156****4589',
    cancelable: true,
    items: ['一般检查 + 体脂分析', '血常规 + 尿常规 + 便常规', '肝肾功能 + 血糖 + 血脂四项', '心电图（12导联）', '腹部彩超（肝/胆/胰/脾/双肾）', '甲状腺彩超', '胸部CT平扫', '肿瘤标志物筛查（AFP/CEA）'],
    notices: ['体检前三天请清淡饮食，勿饮酒', '体检前一天晚10点后禁食禁水', '长期服药者请正常服药并告知医生', 'CT检查前请摘除金属物品']
  },
  3: {
    title: '基础健康体检', statusText: '已完成', statusSub: '体检报告已出具',
    statusClass: 'done', statusIcon: 'fa-check-circle',
    no: 'YY202609020156', org: '东软健康体检中心（红旗路店）',
    time: '2026-09-05  09:00', person: '黄药师', phone: '156****4589',
    cancelable: false,
    items: ['一般检查', '血常规', '尿常规', '肝功能', '胸部X光'],
    notices: []
  },
  4: {
    title: '女性专项体检套餐', statusText: '已取消', statusSub: '该预约已于 2026-08-18 14:22 取消',
    statusClass: 'cancel', statusIcon: 'fa-times-circle',
    no: 'YY202608150077', org: '东软健康体检中心（高新店）',
    time: '2026-08-20  09:00', person: '黄药师', phone: '156****4589',
    cancelable: false,
    items: [], notices: []
  }
}

const detail = reactive(dataMap[route.params.id] || dataMap[1])

const confirmCancel = () => {
  showConfirm.value = false
  cancelled.value = true
  detail.statusText = '已取消'
  detail.statusSub = '预约已成功取消'
  detail.statusClass = 'cancel'
  detail.statusIcon = 'fa-times-circle'
}
</script>

<style scoped>
.detail-page { padding-bottom: 80px; }
.top-ban { height: 56px; }

.success-tip {
  width: 92%; margin: 12px auto 0; padding: 12px;
  background: #EAF6E2; color: #5A9E3E; border-radius: 8px;
  text-align: center; font-size: 14px;
}
.success-tip .fa { margin-right: 6px; }

.banner {
  width: 100%; padding: 24px 0; text-align: center; color: #FFF;
}
.banner.wait { background-image: linear-gradient(135deg, #FFB347, #FF8C00); }
.banner.done { background-image: linear-gradient(135deg, #7DB35D, #4CAF50); }
.banner.cancel { background-image: linear-gradient(135deg, #AAA, #888); }
.banner .fa { font-size: 36px; }
.banner-title { font-size: 20px; font-weight: 600; margin-top: 8px; }
.banner-sub { font-size: 13px; margin-top: 6px; opacity: .9; }

.card {
  width: 92%; margin: 12px auto 0; background: #FFF;
  border-radius: 8px; padding: 16px; box-sizing: border-box;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.card-title {
  font-size: 15px; font-weight: 600; color: #333;
  padding-bottom: 10px; margin-bottom: 6px;
  border-bottom: solid 1px #EEE;
}
.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2.2; }
.label { color: #999; }
.value { color: #333; }

.item { display: flex; align-items: center; font-size: 13px; color: #333; line-height: 2.2; }
.item .fa { color: #7DB35D; margin-right: 8px; }

.notice { display: flex; align-items: flex-start; font-size: 13px; color: #555; line-height: 1.8; margin-top: 8px; }
.notice .num {
  flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%;
  background: #E0F6FB; color: #02A6C9; font-size: 11px;
  display: flex; align-items: center; justify-content: center;
  margin-right: 8px; margin-top: 2px;
}

.bottom-bar {
  position: fixed; left: 0; bottom: 0; width: 100%; max-width: 750px;
  padding: 10px 4%; box-sizing: border-box; background: #FFF;
  border-top: solid 1px #EEE; display: flex; gap: 12px;
}
.btn-cancel, .btn-primary {
  flex: 1; height: 44px; border-radius: 22px; font-size: 15px;
}
.btn-cancel { background: #FFF; border: solid 1px #FF6B6B; color: #FF6B6B; }
.btn-primary {
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; border: none;
}

.modal-mask {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.45); z-index: 999;
  display: flex; align-items: center; justify-content: center;
}
.modal {
  width: 80%; background: #FFF; border-radius: 12px;
  padding: 24px 20px; text-align: center;
}
.modal .warn { font-size: 36px; color: #FF9900; }
.modal-title { font-size: 17px; font-weight: 600; color: #333; margin-top: 12px; }
.modal-desc { font-size: 13px; color: #999; margin-top: 8px; line-height: 1.6; }
.modal-btns { display: flex; gap: 12px; margin-top: 20px; }
.modal-btn { flex: 1; height: 40px; border-radius: 20px; font-size: 14px; }
.modal-btn.cancel { background: #F2F2F2; color: #666; border: none; }
.modal-btn.ok { background: #FF6B6B; color: #FFF; border: none; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
