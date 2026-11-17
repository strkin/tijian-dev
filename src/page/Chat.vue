<template>
<div class="chat-page">
  <AppHeader :title="doctorName + ' 医生'" />
  <div class="top-ban"></div>

  <!-- 状态提示条 -->
  <div class="chat-status">
    <i class="fa fa-comments-o"></i>
    <span>{{ consultType }} · 问诊进行中</span>
  </div>

  <!-- 消息列表 -->
  <div class="msg-list" ref="msgList">
    <div v-for="(m, i) in messages" :key="i" class="msg-row" :class="m.role">
      <img class="avatar" v-if="m.role === 'doctor'" :src="doctorAvatar" :alt="doctorName" />
      <div class="bubble">
        <template v-if="m.type === 'voice'">🔊 语音 0:15</template>
        <template v-else-if="m.type === 'video'">📹 视频通话 05:30</template>
        <template v-else>{{ m.text }}</template>
      </div>
      <div class="avatar user" v-if="m.role === 'user'">
        <i class="fa fa-user"></i>
      </div>
    </div>
  </div>

  <!-- 底部输入栏 -->
  <div class="input-bar">
    <template v-if="consultType.includes('图文')">
      <i class="fa fa-plus-circle icon-btn"></i>
      <input v-model="inputText" placeholder="请输入您的问题..." @keyup.enter="send" />
      <button class="send-btn" @click="send" :disabled="!inputText.trim()">发送</button>
    </template>
    <template v-else>
      <button class="action-btn" @click="startCall">
        {{ consultType.includes('语音') ? '🎤 发起语音' : '📹 发起视频' }}
      </button>
    </template>
  </div>
</div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { addNotification } from '@/store/messages'
import doctor1 from '@/img/doctor1.jpg'
import doctor2 from '@/img/doctor2.jpg'
import doctor3 from '@/img/doctor3.jpg'
import doctor4 from '@/img/doctor4.jpg'
import doctor5 from '@/img/doctor5.jpg'
import doctor6 from '@/img/doctor6.jpg'
import doctor7 from '@/img/doctor7.jpg'
import doctor8 from '@/img/doctor8.jpg'

let route = useRoute()
let doctorName = route.query.doctor || '医生'
let consultType = route.query.type || '图文咨询'

// 医生头像，按名字找
let avatarMap = {
  '刘长胜': doctor1,
  '孙鹿': doctor2,
  '吕文达': doctor3,
  '李若辰': doctor4,
  '张石凡': doctor5,
  '赵桂凤': doctor6,
  '李文': doctor7,
  '吴晓梦': doctor8
}
let doctorAvatar = avatarMap[doctorName] || doctor1

let inputText = ref('')
let msgList = ref(null)
// 医生和我的消息都放在一个数组里，按顺序显示
let messages = ref([
  { role: 'doctor', type: 'text', text: '您好，请问有什么可以帮您？' }
])

// 滚到最下面
function scrollToBottom() {
  nextTick(function () {
    if (msgList.value) {
      msgList.value.scrollTop = msgList.value.scrollHeight
    }
  })
}

// 发送消息
function send() {
  if (!inputText.value.trim()) {
    return
  }
  messages.value.push({ role: 'user', type: 'text', text: inputText.value.trim() })
  inputText.value = ''
  scrollToBottom()
  // 假装医生1秒后回复
  setTimeout(function () {
    let reply = '收到，我先了解一下您的情况。'
    messages.value.push({ role: 'doctor', type: 'text', text: reply })
    scrollToBottom()
    addNotification({ source: '网络问诊', title: doctorName, content: reply })
  }, 1000)
}

// 语音/视频咨询
function startCall() {
  if (consultType.includes('语音')) {
    messages.value.push({ role: 'user', type: 'voice' })
  } else {
    messages.value.push({ role: 'user', type: 'video' })
  }
  scrollToBottom()
  console.log('发起' + consultType)
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F5F6F8;
}
.top-ban { height: 56px; flex-shrink: 0; }

.chat-status {
  text-align: center; font-size: 12px; color: #999;
  padding: 8px 0; background: #F0F7F9;
}
.chat-status .fa { margin-right: 4px; }

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
.action-btn {
  width: 100%; height: 38px; border: none; border-radius: 19px;
  background: #02A6C9; color: #FFF; font-size: 14px;
}
</style>
