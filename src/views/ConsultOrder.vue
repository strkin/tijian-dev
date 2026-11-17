<template>
  <div class="sub-page">
    <AppHeader title="问诊订单" />
    <div class="top-ban"></div>

    <!-- 订单列表 -->
    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-head">
        <span class="title">{{ item.title }}</span>
        <span class="status" :class="item.statusClass">{{ item.statusText }}</span>
      </div>
      <div class="row"><span class="label">订单编号</span><span class="value">{{ item.no }}</span></div>
      <div class="row"><span class="label">科室</span><span class="value">{{ item.dept }}</span></div>
      <div class="row"><span class="label">{{ item.timeLabel }}</span><span class="value">{{ item.time }}</span></div>
      <div class="row"><span class="label">金额</span><span class="value price">{{ item.price }}</span></div>
      <div class="card-foot">
        <template v-if="item.statusText === '待支付'">
          <span class="btn" @click="openCancel(item)">取消订单</span>
          <span class="btn primary" @click="openPay(item)">去支付</span>
        </template>
        <template v-else-if="item.statusText === '已取消'">
          <span class="btn" @click="removeItem(item)">删除记录</span>
        </template>
        <template v-else-if="item.statusText === '已支付'">
          <span class="btn" @click="goChat(item)">进入会话</span>
        </template>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="list.length === 0" class="empty">
      <i class="fa fa-inbox"></i>
      <p>暂无问诊订单</p>
    </div>

    <!-- 取消订单确认弹窗 -->
    <transition name="fade">
      <div v-if="cancelTarget" class="modal-mask" @click.self="cancelTarget = null">
        <div class="modal">
          <i class="fa fa-exclamation-circle warn"></i>
          <p class="modal-title">确认取消该订单？</p>
          <p class="modal-desc">取消后需重新发起问诊，已支付金额将原路退回</p>
          <div class="modal-btns">
            <button class="modal-btn" @click="cancelTarget = null">再想想</button>
            <button class="modal-btn danger" @click="confirmCancel">确认取消</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 支付弹窗 -->
    <transition name="fade">
      <div v-if="payTarget" class="modal-mask" @click.self="closePay">
        <div class="modal">
          <p class="pay-title">确认支付</p>
          <div class="pay-amount">{{ payTarget.price }}</div>

          <div class="pay-methods">
            <div v-for="m in methods" :key="m.id"
                 class="pay-method" :class="{ active: payMethod === m.id }"
                 @click="payMethod = m.id">
              <i class="fa" :class="m.icon"></i>
              <span>{{ m.name }}</span>
              <i class="fa fa-check-circle check" v-if="payMethod === m.id"></i>
            </div>
          </div>

          <div class="modal-btns">
            <button class="modal-btn" @click="closePay">取消</button>
            <button class="modal-btn primary" @click="confirmPay">确认支付</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 支付成功提示 -->
    <transition name="fade">
      <div v-if="paySuccess" class="toast">
        <i class="fa fa-check-circle"></i> 支付成功
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()

const list = ref([
  {
    id: 1, title: '图文问诊 · 吕文达', statusText: '待支付', statusClass: 'wait',
    no: 'WD202611150066', dept: '消化内科',
    timeLabel: '下单时间', time: '2026-11-15  21:08', price: '¥ 39.00',
    doctorId: 3
  }
])

const cancelTarget = ref(null)
const payTarget = ref(null)
const payMethod = ref(1)
const paySuccess = ref(false)

const methods = [
  { id: 1, name: '微信支付', icon: 'fa-weixin' },
  { id: 2, name: '支付宝', icon: 'fa-alipay' },
  { id: 3, name: '账户余额', icon: 'fa-credit-card' }
]

const openCancel = (item) => { cancelTarget.value = item }
const confirmCancel = () => {
  cancelTarget.value.statusText = '已取消'
  cancelTarget.value.statusClass = 'cancel'
  cancelTarget.value = null
}

const openPay = (item) => {
  payTarget.value = item
  payMethod.value = 1
}
const closePay = () => { payTarget.value = null }

const confirmPay = () => {
  payTarget.value.statusText = '已支付'
  payTarget.value.statusClass = 'pay'
  payTarget.value = null
  paySuccess.value = true
  setTimeout(() => { paySuccess.value = false }, 1500)
}

const removeItem = (item) => {
  list.value = list.value.filter(i => i.id !== item.id)
}

const goChat = (item) => {
  router.push(`/doctor/${item.doctorId}/consult`)
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
.status.cancel { color: #999; background: #F0F0F0; }

.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2; }
.label { color: #999; }
.value { color: #333; }
.price { color: #FF5000; font-weight: 600; }
.card-foot { display: flex; justify-content: flex-end; margin-top: 10px; }
.btn { font-size: 13px; padding: 6px 16px; border-radius: 14px; border: solid 1px #02A6C9; color: #02A6C9; margin-left: 8px; cursor: pointer; }
.btn.primary { background-image: linear-gradient(135deg,#7DB35D,#02A6C9); color: #FFF; border: none; }

.empty { text-align: center; padding: 60px 0; color: #CCC; }
.empty .fa { font-size: 40px; display: block; margin-bottom: 10px; }
.empty p { font-size: 14px; }

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
.modal-btn { flex: 1; height: 40px; border-radius: 20px; border: solid 1px #DDD; background: #FFF; color: #666; font-size: 14px; }
.modal-btn.danger { background: #FF6B6B; color: #FFF; border: none; }
.modal-btn.primary { background-image: linear-gradient(135deg,#7DB35D,#02A6C9); color: #FFF; border: none; }

.pay-title { font-size: 17px; font-weight: 600; color: #333; }
.pay-amount { font-size: 28px; color: #FF5000; font-weight: 700; margin: 12px 0; }
.pay-methods { text-align: left; margin: 10px 0; }
.pay-method {
  display: flex; align-items: center; padding: 12px;
  border: solid 1px #EEE; border-radius: 8px; margin-bottom: 8px;
  font-size: 14px; color: #333;
}
.pay-method.active { border-color: #02A6C9; background: #E0F6FB; }
.pay-method > .fa:first-child { font-size: 20px; margin-right: 10px; color: #02A6C9; }
.pay-method .check { margin-left: auto; color: #02A6C9; }

.toast {
  position: fixed; left: 50%; top: 40%; transform: translate(-50%, -50%);
  background: rgba(0,0,0,.75); color: #FFF;
  padding: 16px 28px; border-radius: 10px; font-size: 15px; z-index: 1000;
}
.toast .fa { margin-right: 6px; color: #7DB35D; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
