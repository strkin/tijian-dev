<template>
  <div class="chat-page">
    <AppHeader :title="doc.name + ' 医生'" />
    <div class="top-ban"></div>

    <!-- 状态提示条 -->
    <div class="chat-status">
      <i class="fa" :class="statusIcon"></i>
      <span>{{ statusText }}</span>
    </div>

    <!-- 消息列表 -->
    <div class="msg-list" ref="msgList">
      <div v-for="(m, i) in messages" :key="i" class="msg-row" :class="m.role">
        <img class="avatar" v-if="m.role === 'doctor'" :src="doc.avatar" :alt="doc.name" />
        <div class="bubble">{{ m.text }}</div>
        <div class="avatar user" v-if="m.role === 'user'">
          <i class="fa fa-user"></i>
        </div>
      </div>
    </div>

    <!-- 底部输入栏 -->
    <div class="input-bar">
      <i class="fa fa-plus-circle icon-btn"></i>
      <input v-model="inputText" placeholder="请输入您的问题..." @keyup.enter="send" />
      <button class="send-btn" @click="send" :disabled="!inputText.trim()">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()
const from = route.query.from || '继续问诊'

const docMap = {
  1: { name: '刘长胜', dept: '心血管内科', avatar: '/doctors/刘长胜.jpg' },
  2: { name: '赵桂凤', dept: '体检中心', avatar: '/doctors/赵桂凤.jpg' },
  3: { name: '吕文达', dept: '消化内科', avatar: '/doctors/吕文达.jpg' }
}
const doc = docMap[route.params.id] || docMap[1]

const initialMessages = {
  1: [
    { role: 'doctor', text: '您好，我是刘长胜医生，请问您哪里不舒服？' },
    { role: 'user', text: '刘医生您好，我最近经常头晕，血压一般在150/95左右，需要加药吗？' },
    { role: 'doctor', text: '您目前在吃什么降压药？头晕是持续性的还是阵发性的？' },
    { role: 'user', text: '在吃氨氯地平，每天一片。头晕主要是早上起床时明显。' },
    { role: 'doctor', text: '建议您早上起床时先卧床1-2分钟再缓慢起身，避免体位性低血压。另外建议监测一周早晚血压，记录后复诊。' }
  ],
  2: [
    { role: 'doctor', text: '您好，您的体检报告我已经看过了，请问有什么想了解的？' },
    { role: 'user', text: '赵医生，报告里说我血脂偏高，这个严重吗？需要吃药吗？' },
    { role: 'doctor', text: '您的总胆固醇6.2，低密度脂蛋白3.8，属于轻度升高。建议先饮食控制+运动3个月后复查，暂时不用吃药。' },
    { role: 'user', text: '好的，饮食上需要注意什么？' }
  ],
  3: [
    { role: 'user', text: '吕医生您好，我最近胃老是胀，尤其是饭后，是什么原因？' },
    { role: 'doctor', text: '您好，这种情况持续多久了？有没有胃痛、反酸的情况？' },
    { role: 'user', text: '大概两周了，不胃痛，就是胀，有时候打嗝。' }
  ]
}

const messages = ref(initialMessages[route.params.id] || initialMessages[1])
const inputText = ref('')
const msgList = ref(null)

const statusMap = {
  '继续问诊': { text: '问诊进行中 · 医生已读', icon: 'fa-circle text-online' },
  '再次咨询': { text: '上次问诊已结束 · 可继续追问', icon: 'fa-clock-o' },
  '追问医生': { text: '您的提问已发送，等待医生回复', icon: 'fa-hourglass-half text-wait' }
}
const statusInfo = statusMap[from] || statusMap['继续问诊']
const statusText = statusInfo.text
const statusIcon = statusInfo.icon

const send = () => {
  if (!inputText.value.trim()) return
  messages.value.push({ role: 'user', text: inputText.value.trim() })
  inputText.value = ''
  nextTick(() => {
    msgList.value.scrollTop = msgList.value.scrollHeight
  })
  // 模拟医生自动回复
  setTimeout(() => {
    messages.value.push({ role: 'doctor', text: '好的，收到您的问题，我会尽快为您解答。' })
    nextTick(() => {
      msgList.value.scrollTop = msgList.value.scrollHeight
    })
  }, 800)
}
</script>

<style scoped>
.chat-page {
  height: 100vh; display: flex; flex-direction: column;
  background: #F5F6F8;
}
.top-ban { height: 56px; flex-shrink: 0; }

.chat-status {
  text-align: center; font-size: 12px; color: #999;
  padding: 8px 0; background: #F0F7F9;
}
.chat-status .fa { margin-right: 4px; }
.text-online { color: #7DB35D; }
.text-wait { color: #FF9900; }

.msg-list {
  flex: 1; overflow-y: auto; padding: 12px 4%;
}
.msg-row {
  display: flex; margin-bottom: 16px; align-items: flex-start;
}
.msg-row.doctor { justify-content: flex-start; }
.msg-row.user { justify-content: flex-end; }

.avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  object-fit: cover;
}
div.avatar {
  background: #7DB35D; color: #FFF;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}

.bubble {
  max-width: 70%; padding: 10px 14px; border-radius: 10px;
  font-size: 14px; line-height: 1.6; margin: 0 10px;
  word-break: break-all;
}
.doctor .bubble {
  background: #FFF; color: #333; border-top-left-radius: 2px;
}
.user .bubble {
  background: #02A6C9; color: #FFF; border-top-right-radius: 2px;
}

.input-bar {
  display: flex; align-items: center; padding: 10px 4%;
  background: #FFF; border-top: solid 1px #EEE; flex-shrink: 0;
}
.icon-btn { font-size: 22px; color: #999; margin-right: 10px; cursor: pointer; }
.input-bar input {
  flex: 1; height: 38px; border-radius: 19px; border: none;
  background: #F2F3F5; padding: 0 14px; font-size: 14px; outline: none;
}
.send-btn {
  margin-left: 10px; height: 38px; padding: 0 20px; border: none;
  border-radius: 19px; background: #02A6C9; color: #FFF; font-size: 14px;
}
.send-btn:disabled { background: #BBB; }
</style>
