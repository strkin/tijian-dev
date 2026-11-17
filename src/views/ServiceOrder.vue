<template>
  <div class="order-page">
    <AppHeader title="确认订单" />
    <div class="top-ban"></div>

    <!-- 商品信息 -->
    <div class="goods-card">
      <div class="goods-img"><i class="fa" :class="goods.icon"></i></div>
      <div class="goods-info">
        <p class="goods-name">{{ goods.name }}</p>
        <p class="goods-desc">{{ goods.desc }}</p>
        <p class="goods-price">¥ {{ goods.price.toFixed(2) }}</p>
      </div>
    </div>

    <!-- 规格选择 -->
    <div class="card">
      <div class="card-title">套餐规格</div>
      <div class="spec-list">
        <div v-for="s in specs" :key="s.id"
             class="spec-item" :class="{ active: s.id === selectedSpec }"
             @click="selectedSpec = s.id">
          <p class="spec-name">{{ s.name }}</p>
          <p class="spec-price">¥ {{ s.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- 数量 -->
    <div class="card">
      <div class="row-between">
        <span class="label">购买数量</span>
        <div class="stepper">
          <button @click="qty > 1 && qty--">-</button>
          <span class="qty">{{ qty }}</span>
          <button @click="qty < 10 && qty++">+</button>
        </div>
      </div>
    </div>

    <!-- 金额明细 -->
    <div class="card">
      <div class="card-title">金额明细</div>
      <div class="row"><span class="label">商品金额</span><span class="value">¥ {{ subtotal.toFixed(2) }}</span></div>
      <div class="row"><span class="label">优惠折扣</span><span class="value discount">- ¥ {{ discount.toFixed(2) }}</span></div>
      <div class="row total-row">
        <span class="label">实付款</span>
        <span class="total-price">¥ {{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="card">
      <div class="card-title">支付方式</div>
      <div class="pay-item" v-for="p in payMethods" :key="p.id"
           :class="{ active: p.id === payMethod }" @click="payMethod = p.id">
        <i class="fa" :class="p.icon"></i>
        <span>{{ p.name }}</span>
        <i class="fa fa-check-circle check" v-if="p.id === payMethod"></i>
      </div>
    </div>

    <!-- 底部支付栏 -->
    <div class="bottom-bar">
      <div class="total-info">
        <span class="total-label">合计：</span>
        <span class="total-amount">¥ {{ total.toFixed(2) }}</span>
      </div>
      <button class="pay-btn" @click="paying = true">立即支付</button>
    </div>

    <!-- 支付成功弹窗 -->
    <transition name="fade">
      <div v-if="paying" class="modal-mask">
        <div class="modal">
          <div class="success-circle">
            <i class="fa fa-check"></i>
          </div>
          <p class="modal-title">支付成功</p>
          <p class="modal-desc">您已成功购买「{{ goods.name }}」</p>
          <div class="modal-btns">
            <button class="modal-btn" @click="viewOrder">查看订单</button>
            <button class="modal-btn primary" @click="goHome">返回个人中心</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const router = useRouter()
const route = useRoute()

const goodsMap = {
  1: { name: '年度健康管家服务', desc: '12次在线问诊 + 2次专家面诊 + 报告解读', price: 399 },
  2: { name: '入职体检绿色通道', desc: '免排队体检 + 报告24小时加急出具', price: 99 },
  3: { name: '体检报告解读服务', desc: '副主任医师一对一报告解读 + 饮食运动指导', price: 99 }
}
const goods = goodsMap[route.params.id] || goodsMap[3]

const specs = [
  { id: 1, name: '标准套餐', price: goods.price },
  { id: 2, name: '升级套餐（+1次专家面诊）', price: goods.price + 100 },
  { id: 3, name: '家庭共享套餐（2人）', price: goods.price * 1.6 }
]
const selectedSpec = ref(1)
const qty = ref(1)
const payMethod = ref(1)
const paying = ref(false)

const payMethods = [
  { id: 1, name: '微信支付', icon: 'fa-weixin' },
  { id: 2, name: '支付宝', icon: 'fa-alipay' },
  { id: 3, name: '账户余额', icon: 'fa-credit-card' }
]

const subtotal = computed(() => specs.find(s => s.id === selectedSpec.value).price * qty.value)
const discount = computed(() => +(subtotal.value * 0.1).toFixed(2))
const total = computed(() => +(subtotal.value - discount.value).toFixed(2))

const viewOrder = () => router.push('/personal/service')
const goHome = () => router.push('/personal')
</script>

<style scoped>
.order-page { padding-bottom: calc(80px + 8vh); }
.top-ban { height: 56px; }

.goods-card {
  width: 92%; margin: 12px auto 0; background: #FFF;
  border-radius: 8px; padding: 16px; box-sizing: border-box;
  display: flex; box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.goods-img {
  width: 70px; height: 70px; border-radius: 8px; flex-shrink: 0;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  display: flex; align-items: center; justify-content: center;
}
.goods-img .fa { font-size: 32px; color: #FFF; }
.goods-info { margin-left: 12px; flex: 1; }
.goods-name { font-size: 15px; color: #333; font-weight: 600; }
.goods-desc { font-size: 12px; color: #999; margin-top: 4px; line-height: 1.4; }
.goods-price { font-size: 17px; color: #FF5000; font-weight: 700; margin-top: 6px; }

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

.spec-list { display: flex; flex-wrap: wrap; gap: 10px; }
.spec-item {
  flex: 1; min-width: 45%; padding: 12px; border-radius: 8px;
  border: solid 1px #E5E5E5; cursor: pointer; box-sizing: border-box;
}
.spec-item.active { border-color: #02A6C9; background: #E0F6FB; }
.spec-name { font-size: 13px; color: #333; }
.spec-price { font-size: 13px; color: #FF5000; margin-top: 4px; }

.row-between { display: flex; justify-content: space-between; align-items: center; }
.label { font-size: 14px; color: #333; }
.stepper { display: flex; align-items: center; }
.stepper button {
  width: 28px; height: 28px; border-radius: 4px; border: solid 1px #DDD;
  background: #FFF; font-size: 16px; color: #666;
}
.stepper .qty { width: 40px; text-align: center; font-size: 14px; }

.row { display: flex; justify-content: space-between; font-size: 13px; color: #666; line-height: 2.2; }
.value { color: #333; }
.discount { color: #7DB35D; }
.total-row { border-top: dashed 1px #EEE; margin-top: 6px; padding-top: 6px; }
.total-price { color: #FF5000; font-weight: 700; font-size: 16px; }

.pay-item {
  display: flex; align-items: center; padding: 12px 0;
  border-bottom: solid 1px #F5F5F5; font-size: 14px; color: #333;
}
.pay-item:last-child { border-bottom: none; }
.pay-item > .fa:first-child { font-size: 20px; margin-right: 10px; color: #02A6C9; }
.pay-item .check { margin-left: auto; color: #02A6C9; }

.bottom-bar {
  position: fixed; left: 50%; bottom: 8vh; transform: translateX(-50%); width: 100%; max-width: 750px;
  padding: 10px 4%; box-sizing: border-box; background: #FFF;
  border-top: solid 1px #EEE;
  display: flex; align-items: center; justify-content: space-between;
}
.total-label { font-size: 13px; color: #666; }
.total-amount { font-size: 20px; color: #FF5000; font-weight: 700; }
.pay-btn {
  width: 45%; height: 42px; border-radius: 21px; border: none;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; font-size: 15px;
}

.modal-mask {
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,.45); z-index: 999;
  display: flex; align-items: center; justify-content: center;
}
.modal {
  width: 80%; background: #FFF; border-radius: 12px;
  padding: 28px 20px; text-align: center;
}
.success-circle {
  width: 60px; height: 60px; margin: 0 auto; border-radius: 50%;
  background: #7DB35D; color: #FFF;
  display: flex; align-items: center; justify-content: center;
}
.success-circle .fa { font-size: 30px; }
.modal-title { font-size: 18px; font-weight: 600; color: #333; margin-top: 14px; }
.modal-desc { font-size: 13px; color: #999; margin-top: 8px; }
.modal-btns { display: flex; gap: 12px; margin-top: 20px; }
.modal-btn {
  flex: 1; height: 40px; border-radius: 20px; border: solid 1px #DDD;
  background: #FFF; color: #666; font-size: 14px;
}
.modal-btn.primary {
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; border: none;
}

.fade-enter-active, .fade-leave-active { transition: opacity .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
