<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">消息</p>
  </div>

  <div class="msg-list">
    <div class="msg-item" v-for="item in notifications" :key="item.id" @click="readMessage(item)">
      <div class="msg-main">
        <div class="msg-top">
          <el-tag :type="item.source === '网络问诊' ? 'primary' : 'success'" size="small">{{ item.source }}</el-tag>
          <p class="msg-title">{{ item.title }}</p>
          <span class="unread" v-if="!item.read"></span>
        </div>
        <p class="msg-content">{{ item.content }}</p>
        <p class="msg-time">{{ item.time }}</p>
      </div>
    </div>
    <div class="empty" v-if="notifications.length === 0">暂无消息</div>
  </div>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { notifications } from '@/store/messages'

let router = useRouter()

// 点一下消息就当成读过了
function readMessage(item) {
  console.log('点了消息：' + item.title)
  item.read = true
}
</script>

<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
}
.header {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
}
.header-title {
  margin-left: 10px;
  font-size: 5vw;
}
.msg-list {
  padding: 3vw;
}
.msg-item {
  background: #fff;
  border-radius: 2vw;
  padding: 4vw;
  margin-bottom: 3vw;
}
.msg-top {
  display: flex;
  align-items: center;
  gap: 2vw;
}
.msg-title {
  font-size: 4vw;
  font-weight: 500;
  margin: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.unread {
  width: 1.8vw;
  height: 1.8vw;
  background: #f56c6c;
  border-radius: 50%;
  flex-shrink: 0;
}
.msg-content {
  font-size: 3.5vw;
  color: #555;
  margin: 2vw 0 0;
}
.msg-time {
  font-size: 3vw;
  color: #999;
  margin: 1.5vw 0 0;
}
.empty {
  text-align: center;
  color: #999;
  padding: 10vw 0;
  font-size: 3.5vw;
}
</style>
