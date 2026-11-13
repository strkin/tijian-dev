<template>
<div class="chat-page">
  <div class="header">
    <span @click="router.back()">← 返回</span>
    <p>{{ doctorName }} · {{ consultType }}</p>
  </div>

  <div class="messages">
    <div class="msg doctor" v-for="(m, i) in messages" :key="i">
      <div class="bubble">{{ m.text }}</div>
    </div>
    <div class="msg me" v-for="(m, i) in myMessages" :key="i">
      <div class="bubble">{{ m.text }}
        <p v-if="m.type === 'text'">{{ m.text }}</p>
        <p v-else>{{ m.type === 'voice' ? '🔊 语音 0:15' : '📹 视频通话 05:30' }}</p>
      </div>
    </div>
  </div>

  <div class="input-bar">
    <el-input v-model="inputText" placeholder="请输入..." @keyup.enter="send" v-if="consultType.includes('图文')" />/>
    <el-button type="primary" @click="send" v-if="consultType.includes('图文')">发送</el-button>
    <el-button v-if="consultType.includes('语音')" @click="sendVoice">🎤 发起语音</el-button>
    <el-button v-if="consultType.includes('视频')" type="danger" @click="sendVideo">📹 发起视频</el-button>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { addNotification } from '@/store/messages'

let route = useRoute()
let router = useRouter()
let doctorName = route.query.doctor || '医生'
let consultType = route.query.type || '图文咨询'

let inputText = ref('')
let messages = ref([
  { text: '您好，请问有什么可以帮您？' },
])
let myMessages = ref([])

// 发送消息
function send() {
  if (inputText.value == '') {
    return
  }
  myMessages.value.push({ text: inputText.value })
  inputText.value = ''
  // 假装医生1秒后回复
  setTimeout(function () {
    let reply = '收到，我先了解一下您的情况。'
    messages.value.push({ text: reply })
    addNotification({ source: '网络问诊', title: doctorName, content: reply })
  }, 1000)
}

// 语音咨询
function sendVoice() {
  console.log('发起语音')
  myMessages.value.push({ type: 'voice' })
}

// 视频咨询
function sendVideo() {
  console.log('发起视频')
  myMessages.value.push({ type: 'video' })
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}
.header {
  background: #127A90;
  color: #fff;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 4vw;
}
.header p {
  margin-left: 10px;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.msg {
  display: flex;
  margin-bottom: 10px;
}
.msg.doctor {
  justify-content: flex-start;
}
.msg.me {
  justify-content: flex-end;
}
.bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 3.5vw;
}
.msg.doctor .bubble {
  background: #fff;
}
.msg.me .bubble {
  background: #127A90;
  color: #fff;
}
.input-bar {
  display: flex;
  padding: 10px;
  background: #fff;
  gap: 10px;
}
</style>
