<template>
<div style="display: flex;">
    <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
    <p style="margin-left:0vw;font-size:5vw;">e心门诊</p>
</div>
<!-- 科室筛选 -->
<div>
    <el-select
      v-model="deptFilter"
      multiple
      placeholder="请选择科室"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
</div>
<div class="flex justify-center">
    <el-date-picker-panel v-model="date" :disabled-date="disabledDate" />
    <div class="schedule">

        <div class="schedule-row" v-for="(item, index) in filteredSchedule" :key="index">
            <img :src="item.img">
            <div class="info">
                <p>{{ item.title }} · {{ item.dept }}</p>
                <p class="time">{{ item.time }}</p>
            </div>
            <el-button size="small" type="primary" @click="book(item)" :disabled="item.remaining === 0">
            {{ item.remaining > 0 ? '预约(' + item.remaining + ')' : '约满' }}
            </el-button>
        </div>
    </div>
</div>
</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref,computed } from 'vue'
import doctor1 from '@/img/doctor1.jpg'
import doctor2 from '@/img/doctor2.jpg'


let date = ref(new Date())
let router = useRouter()
let deptFilter = ref('')
let options = [
  {
    value: '内科',
    label: '内科',
  },
  {
    value: '外科',
    label: '外科',
  }
]

// 只能选今天之后的两个星期
function disabledDate(time) {
  let today = new Date()
  let twoWeeksLater = new Date()
  twoWeeksLater.setDate(today.getDate() + 14)
  if (time < today) {
    return true
  }
  if (time > twoWeeksLater) {
    return true
  }
  return false
}

// 排班表
let schedule = ref([
  { title: '刘长胜', dept: '呼吸内科', time: '上午 8:00-11:30', remaining: 5, img: doctor1 },
  { title: '孙鹿', dept: '心血管内科', time: '下午 14:00-17:00', remaining: 0, img: doctor2 },
])

// 点预约
function book(item) {
  item.remaining = item.remaining - 1
  alert('预约成功：' + item.title + ' ' + item.time)
}

// 按科室筛选
let filteredSchedule = computed(function () {
  let list = schedule.value
  if (!deptFilter.value) {
    return list
  }
  let newList = []
  for (let i = 0; i < list.length; i++) {
    let s = list[i]
    if (s.dept.includes(deptFilter.value)) {
      newList.push(s)
    }
  }
  return newList
})

</script>
<style scoped>
.schedule-row {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.schedule-row img {
  width: 12vw;
  height: 12vw;
  border-radius: 50%;
  margin-right: 15px;
}
.schedule-row .info {
  flex: 1;
}
.time {
  color: #888;
  font-size: 3vw;
}

</style>
