<template>
<div class="page">
<div style="display: flex;">
    <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
    <p style="margin-left:0vw;font-size:5vw;">上门护理</p>
</div>
<div class="serviceList">
    <div style="display: flex;">
        <h4>服务项目</h4>
    <div style="display:flex;flex-wrap:wrap;gap:10px;">
    <div v-for="(s, i) in services" :key="i"
     class="service-btn"
     :class="{ active: selectedService.name === s.name }"
     @click="selectService(s)">
        {{ s.name }} ¥{{ s.price }}
    <span v-if="selectedService.name === s.name" class="check">✓已选</span>
    </div>
    </div>

    </div>
</div>
<div class="nurseList">
    <h4>选择护士</h4>
    <div v-for="(n, i) in nurses" :key="i" class="nurse-row"
     :class="{ active: selectedNurse.name === n.name }"
     @click="selectNurse(n)">
    <img :src="n.img">
        <div>
        <p>{{ n.name }}</p>
        <p style="color:#888;font-size:3vw;">{{ n.title }}</p>
        </div>
    <el-tag v-if="selectedNurse.name === n.name" type="success">已选</el-tag>
    </div>
</div>
<div class="appointment">
    <h4>预约信息</h4>
    <el-date-picker v-model="date" placeholder="选择日期" style="margin-bottom:10px;" />
    <el-select v-model="timeSlot" placeholder="选择时段" style="width:100%;">
      <el-option label="上午 8:00-10:00" value="上午" />
      <el-option label="下午 14:00-16:00" value="下午" />
    </el-select>
    <el-input v-model="address" placeholder="上门地址" style="margin-top:10px;" />
    <el-input v-model="phone" placeholder="联系电话" style="margin-top:10px;" maxlength="11"
          @input="phone = phone.replace(/\D/g, '')" />
    <el-input v-model="note" type="textarea" placeholder="备注（病情、注意事项）" style="margin-top:10px;" />
</div>
<el-button type="primary" style="width:90%;margin:10px;" @click="submit">提交预约</el-button>
</div>
</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref,computed } from 'vue'
import nurse1 from '@/img/nurse1.jpg'
import nurse2 from '@/img/nurse2.jpg'
import nurse3 from '@/img/nurse3.jpg'

let selectedService = ref({})
let selectedNurse = ref({})
let date = ref('')
let timeSlot = ref('')
let address = ref('')
let phone = ref('')
let note = ref('')
let router = useRouter()

// 服务项目
let services = [
  { name: '打针换药', price: 50 },
  { name: '静脉输液', price: 80 },
  { name: '导尿护理', price: 120 },
  { name: '褥疮护理', price: 100 },

]

// 护士
let nurses = [
  { name: '王护士', title: '主管护师', img: nurse1 },
  { name: '李护士', title: '护师', img: nurse2 },
  { name: '张护士', title: '护师', img: nurse3 },
]

// 提交预约
function submit() {
  if (!/^1\d{10}$/.test(phone.value)) {
    alert('手机号格式不正确，请输入11位手机号')
    return
  }
  console.log('提交了：', selectedService.value, selectedNurse.value)
  alert('预约成功：' + selectedService.value.name + ' ' + selectedNurse.value.name)
}

// 选服务，再点一下就取消
function selectService(s) {
  if (selectedService.value.name === s.name) {
    selectedService.value = {}
  } else {
    selectedService.value = s
  }
}

// 选护士
function selectNurse(n) {
  if (selectedNurse.value.name === n.name) {
    selectedNurse.value = {}
  } else {
    selectedNurse.value = n
  }
}
</script>
<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
}
.card {
  background: #fff;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
}
.service-btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 3.5vw;
  position: relative;
}
.service-btn.active {
  border-color: #127A90;
  background: #e8f4f8;
  color: #127A90;
}
.check {
  font-size: 2.5vw;
  margin-left: 5px;
}
.nurse-row {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.nurse-row img {
  width: 12vw;
  height: 12vw;

  margin-right: 15px;
}

</style>
