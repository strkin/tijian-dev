<template>
  <div class="login">
    <div class="brand">
      <div class="logo"><i class="fa fa-heartbeat"></i></div>
      <h1>东软体检</h1>
      <p>健康管理 · 从这里开始</p>
      <p v-if="loggedOut" class="logout-tip">
        <i class="fa fa-check-circle"></i> 您已安全退出登录
      </p>
    </div>

    <div class="form">
      <div class="input-row">
        <i class="fa fa-mobile"></i>
        <input v-model="form.phone" type="tel" placeholder="请输入手机号" maxlength="11" />
      </div>
      <div class="input-row">
        <i class="fa fa-lock"></i>
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </div>

      <div class="opts">
        <label><input type="checkbox" v-model="remember" /> 记住我</label>
        <span @click="forgot">忘记密码？</span>
      </div>

      <button class="login-btn" @click="doLogin">登 录</button>

      <div class="other">
        <span>其他登录方式</span>
        <div class="icons">
          <i class="fa fa-weixin"></i>
          <i class="fa fa-qq"></i>
          <i class="fa fa-alipay"></i>
        </div>
      </div>

      <p class="register">还没有账号？<span @click="register">立即注册</span></p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loggedOut = ref(route.query.out === '1')

const form = reactive({ phone: '', password: '' })
const remember = ref(true)

const doLogin = () => {
  if (!form.phone || !form.password) {
    alert('请输入手机号和密码')
    return
  }
  router.push('/personal')
}
const forgot = () => alert('请联系客服重置密码')
const register = () => alert('跳转注册页')
</script>

<style scoped>
.login { min-height: 100vh; }
.brand {
  padding: 70px 0 40px; text-align: center; color: #FFF;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
}
.brand .logo {
  width: 72px; height: 72px; margin: 0 auto; border-radius: 50%;
  background-color: rgba(255, 255, 255, .25);
  display: flex; align-items: center; justify-content: center;
}
.brand .logo .fa { font-size: 36px; }
.brand h1 { font-size: 24px; margin-top: 16px; letter-spacing: 2px; }
.brand p { font-size: 14px; margin-top: 8px; opacity: .9; }
.brand .logout-tip {
  display: inline-block; margin-top: 16px; font-size: 13px;
  padding: 6px 16px; background: rgba(255, 255, 255, .2); border-radius: 16px;
}

.form {
  width: 88%; margin: -24px auto 0; background: #FFF;
  border-radius: 12px; padding: 24px; box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .05);
}
.input-row {
  display: flex; align-items: center; height: 46px;
  border-bottom: solid 1px #EEE;
}
.input-row .fa { font-size: 18px; color: #999; margin-right: 12px; }
.input-row input { flex: 1; background: transparent; font-size: 15px; }
.input-row input::placeholder { color: #BBB; }

.opts {
  display: flex; justify-content: space-between; align-items: center;
  margin: 16px 0; font-size: 13px; color: #666;
}
.opts label { display: flex; align-items: center; }
.opts input { margin-right: 6px; }
.opts span { color: #02A6C9; cursor: pointer; }

.login-btn {
  width: 100%; height: 44px; border-radius: 22px;
  background-image: linear-gradient(135deg, #7DB35D, #02A6C9);
  color: #FFF; font-size: 17px; letter-spacing: 4px;
}

.other { margin-top: 32px; text-align: center; color: #999; font-size: 13px; }
.other .icons { margin-top: 12px; }
.other .icons .fa { font-size: 28px; margin: 0 16px; color: #666; cursor: pointer; }

.register { margin-top: 24px; text-align: center; font-size: 13px; color: #999; }
.register span { color: #02A6C9; cursor: pointer; }
</style>
