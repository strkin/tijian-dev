import { reactive } from 'vue'

// 全局的消息，本来想用接口的，还没弄好就先写死几条
export const notifications = reactive([
  {
    id: 1,
    source: '免费咨询',
    title: '感冒发烧38度需要去医院吗？',
    content: '如持续高烧超过3天建议就医',
    time: '2026-11-08 10:20',
    read: false
  },
  {
    id: 2,
    source: '免费咨询',
    title: '体检发现血压偏高怎么办？',
    content: '先低盐饮食，监测一周血压',
    time: '2026-11-07 15:40',
    read: false
  }
])

// 把时间格式化成 2026-11-08 10:20 这种样子
export function formatTime(d) {
  if (!d) {
    d = new Date()
  }
  let month = d.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = d.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = d.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let minute = d.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  return d.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

// 添加一条消息，新的放最前面
export function addNotification(n) {
  let obj = {
    id: Date.now() + Math.random(),
    read: false,
    time: formatTime(),
    source: n.source,
    title: n.title,
    content: n.content
  }
  notifications.unshift(obj)
}
