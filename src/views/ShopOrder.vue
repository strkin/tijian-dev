<template>
  <div class="sub-page">
    <AppHeader title="商城订单" />
    <div class="top-ban"></div>

    <!-- 订单列表 -->
    <div class="card" v-for="item in list" :key="item.id">
      <div class="card-head">
        <span class="title">{{ item.title }}</span>
        <span class="status" :class="item.statusClass">{{ item.statusText }}</span>
      </div>
      <div class="row"><span class="label">订单编号</span><span class="value">{{ item.no }}</span></div>
      <div class="row"><span class="label">数量</span><span class="value">{{ item.qty }}</span></div>
      <div class="row"><span class="label">{{ item.timeLabel }}</span><span class="value">{{ item.time }}</span></div>
      <div class="row"><span class="label">实付款</span><span class="value price">{{ item.price }}</span></div>
      <div class="card-foot">
        <template v-if="item.statusText === '待收货'">
          <span class="btn" @click="openLogistics(item)">查看物流</span>
          <span class="btn primary" @click="openConfirm(item)">确认收货</span>
        </template>
        <template v-else-if="item.statusText === '待发货'">
          <span class="btn" @click="openCancel(item)">取消订单</span>
          <span class="btn primary" @click="openPayDetail(item)">付款详情</span>
        </template>
        <template v-else-if="item.statusText === '已取消'">
          <span class="btn" @click="removeItem(item)">删除记录</span>
        </template>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="list.length === 0" class="empty">
      <i class="fa fa-inbox"></i>
      <p>暂无商城订单</p>
    </div>

    <!-- 查看物流弹窗 -->
    <transition name="fade">
      <div v-if="logisticsTarget" class="modal-mask" @click.self="logisticsTarget = null">
        <div class="modal">
          <p class="modal-title">物流信息</p>
          <div class="logistics-box">
            <div class="lg-row" v-for="(lg, i) in logisticsTarget.logistics" :key="i"
                 :class="{ active: i === 0 }">
              <div class="lg-dot"></div>
              <div class="lg-content">
                <p class="lg-text">{{ lg.text }}</p>
                <p class="lg-time">{{ lg.time }}</p>
              </div>
            </div>
          </div>
          <div class="modal-btns">
            <button class="modal-btn primary" @click="logisticsTarget = null">关闭</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 确认收货弹窗 -->
    <transition name="fade">
      <div v-if="confirmTarget" class="modal-mask" @click.self="confirmTarget = null">
        <div class="modal">
          <i class="fa fa-check-circle success-icon"></i>
          <p class="modal-title">确认已收到商品？</p>
          <p class="modal-desc">确认收货后订单将完成，货款将打给商家</p>
          <div class="modal-btns">
            <button class="modal-btn" @click="confirmTarget = null">再想想</button>
            <button class="modal-btn primary" @click="confirmReceive">确认收货</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 取消订单弹窗 -->
    <transition name="fade">
      <div v-if="cancelTarget" class="modal-mask" @click.self="cancelTarget = null">
        <div class="modal">
          <i class="fa fa-exclamation-circle warn"></i>
          <p class="modal-title">确认取消该订单？</p>
          <p class="modal-desc">取消后订单将关闭，已支付金额将原路退回</p>
          <div class="modal-btns">
            <button class="modal-btn" @click="cancelTarget = null">再想想</button>
            <button class="modal-btn danger" @click="confirmCancel">确认取消</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 付款详情弹窗 -->
    <transition name="fade">
      <div v-if="payTarget" class="modal-mask" @click.self="payTarget = null">
        <div class="modal">
          <p class="modal-title">付款详情</p>
          <div class="pay-amount">{{ payTarget.price }}</div>
          <div class="pay-detail">
            <div class="pd-row"><span>订单编号</span><span>{{ payTarget.no }}</span></div>
            <div class="pd-row"><span>商品金额</span><span>{{ payTarget.price }}</span></div>
            <div class="pd-row"><span>运费</span><span>¥ 0.00</span></div>
            <div class="pd-row"><span>支付方式</span><span>微信支付</span></div>
            <div class="pd-row"><span>下单时间</span><span>{{ payTarget.time }}</span></div>
            <div class="pd-row total"><span>实付金额</span><span class="red">{{ payTarget.price }}</span></div>
          </div>
          <div class="modal-btns">
            <button class="modal-btn" @click="payTarget = null">关闭</button>
            <button class="modal-btn primary" @click="payTarget = null; doPay = true">去支付</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 成功提示 -->
    <transition name="fade">
      <div v-if="toast" class="toast">
        <i class="fa fa-check-circle"></i> {{ toast }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const list = ref([
  {
    id: 1, title: '电子血压计（臂式）', statusText: '待收货', statusClass: 'pay',
    no: 'SC202611130156', qty: '× 1',
    timeLabel: '下单时间', time: '2026-11-13  10:24', price: '¥ 189.00',
    logistics: [
      { text: '【郑州市】快件已签收，签收人：本人签收，感谢使用京东物流，欢迎再次光临。', time: '2026-11-16  09:30' },
      { text: '【郑州市】快件已到达 郑州金水配送站', time: '2026-11-16  07:15' },
      { text: '【郑州市】快件已离开 郑州转运中心', time: '2026-11-15  22:40' },
      { text: '【德州市】快件已发出', time: '2026-11-14  16:20' }
    ]
  },
  {
    id: 2, title: '复合维生素B族片 100片', statusText: '待发货', statusClass: 'wait',
    no: 'SC202611150089', qty: '× 2',
    timeLabel: '下单时间', time: '2026-11-15  18:02', price: '¥ 76.00'
  }
])

const logisticsTarget = ref(null)
const confirmTarget = ref(null)
const cancelTarget = ref(null)
const payTarget = ref(null)
const toast = ref('')
const doPay = ref(false)

const openLogistics = (item) => { logisticsTarget.value = item }
const openConfirm = (item) => { confirmTarget.value = item }
const openCancel = (item) => { cancelTarget.value = item }
const openPayDetail = (item) => { payTarget.value = item }

const confirmReceive = () => {
  confirmTarget.value.statusText = '已完成'
  confirmTarget.value.statusClass = 'done'
  confirmTarget.value = null
  showToast('确认收货成功')
}

const confirmCancel = () => {
  cancelTarget.value.statusText = '已取消'
  cancelTarget.value.statusClass = 'cancel'
  cancelTarget.value = null
  showToast('订单已取消')
}

const removeItem = (item) => {
  list.value = list.value.filter(i => i.id !== item.id)
}

const showToast = (msg) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 1500)
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
  width: 85%; background: #FFF; border-radius: 12px;
  padding: 20px; max-height: 80vh; overflow-y: auto;
}
.modal-title { font-size: 16px; font-weight: 600; color: #333; text-align: center; }
.modal-desc { font-size: 13px; color: #999; margin-top: 8px; text-align: center; line-height: 1.6; }
.modal .warn { font-size: 36px; color: #FF9900; display: block; text-align: center; }
.success-icon { font-size: 36px; color: #7DB35D; display: block; text-align: center; }
.modal-btns { display: flex; gap: 12px; margin-top: 18px; }
.modal-btn { flex: 1; height: 40px; border-radius: 20px; border: solid 1px #DDD; background: #FFF; color: #666; font-size: 14px; }
.modal-btn.danger { background: #FF6B6B; color: #FFF; border: none; }
.modal-btn.primary { background-image: linear-gradient(135deg,#7DB35D,#02A6C9); color: #FFF; border: none; }

/* 物流 */
.logistics-box { margin-top: 14px; padding-left: 4px; }
.lg-row { display: flex; padding-bottom: 16px; position: relative; }
.lg-row .lg-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #CCC; margin-top: 6px; margin-right: 12px; flex-shrink: 0;
}
.lg-row.active .lg-dot { background: #7DB35D; box-shadow: 0 0 0 3px rgba(125,179,93,.2); }
.lg-row:not(:last-child)::before {
  content: ''; position: absolute; left: 4px; top: 18px; bottom: 0;
  width: 1px; background: #E5E5E5;
}
.lg-text { font-size: 13px; color: #333; line-height: 1.5; }
.lg-row.active .lg-text { color: #7DB35D; }
.lg-time { font-size: 11px; color: #999; margin-top: 4px; }

/* 付款详情 */
.pay-amount { font-size: 26px; color: #FF5000; font-weight: 700; text-align: center; margin: 12px 0; }
.pay-detail { background: #F9F9F9; border-radius: 8px; padding: 12px; margin-top: 10px; }
.pd-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2.2; }
.pd-row.total { border-top: dashed 1px #DDD; margin-top: 6px; padding-top: 6px; font-weight: 600; }
.pd-row .red { color: #FF5000; }

.toast {
  position: fixed; left: 50%; top: 40%; transform: translate(-50%, -50%);
  background: rgba(0,0,0,.75); color: #FFF;
  padding: 16px 28px; border-radius: 10px; font-size: 15px; z-index: 1000;
}
.toast .fa { margin-right: 6px; color: #7DB35D; }

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
