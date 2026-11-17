<template>
<div class="page">
  <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
  <template v-if="doctor">
  <div class="doctor-info">
    <img :src="doctor.img">
    <div class="info">
      <h2>{{ doctor.title }}</h2>
      <p class="title">{{ doctor.subtitle }}</p>
      <p class="dept">{{ doctor.dept }}</p>
    </div>
  </div>
  <div class="section">
    <h4>擅长领域</h4>
    <p>{{ doctor.good }}</p>
  </div>
  <div class="section">
    <h4>出诊时间</h4>
    <p>周一至周五 上午 8:00-11:30</p>
  </div>
  <div class="btns">
    <el-button type="primary" @click="goAppointment">预约挂号</el-button>
    <el-button plain @click="goConsult">在线问诊</el-button>
  </div>
  </template>
</div>
</template>

<script setup>
import { ref,computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import{ArrowLeftBold} from '@element-plus/icons-vue'
import doctor1 from '@/img/doctor1.jpg'
import doctor2 from '@/img/doctor2.jpg'
import doctor3 from '@/img/doctor3.jpg'
import doctor4 from '@/img/doctor4.jpg'
import doctor5 from '@/img/doctor5.jpg'
import doctor6 from '@/img/doctor6.jpg'
import doctor7 from '@/img/doctor7.jpg'
import doctor8 from '@/img/doctor8.jpg'

let route = useRoute()
let router = useRouter()

// 8个医生的信息
let doctorList = [
  {title:'刘长胜',subtitle:'主任医师',dept:'呼吸内科',good:'慢阻肺、哮喘、肺炎等呼吸系统疾病的诊断与治疗',img:doctor1},
  {title:'孙鹿',subtitle:'主任医师',dept:'心血管内科',good:'冠心病、高血压、心律失常等心血管疾病的诊断与治疗',img:doctor2},
  {title:'吕文达',subtitle:'主任医师',dept:'消化内科',good:'胃炎、肠炎、胃溃疡等消化系统疾病的诊断与治疗',img:doctor3},
  {title:'李若辰',subtitle:'主任医师',dept:'内分泌科',good:'糖尿病、甲状腺疾病等内分泌代谢疾病的诊断与治疗',img:doctor4},
  {title:'张石凡',subtitle:'主任医师',dept:'神经内科',good:'头痛、失眠、脑卒中相关神经系统疾病的诊断与治疗',img:doctor5},
  {title:'赵桂凤',subtitle:'主任医师',dept:'儿科',good:'儿童呼吸、消化系统疾病的诊断与治疗',img:doctor6},
  {title:'李文',subtitle:'主任医师',dept:'骨科',good:'颈椎病、腰突、关节炎等骨科疾病的诊断与治疗',img:doctor7},
  {title:'吴晓梦',subtitle:'主任医师',dept:'妇科',good:'月经不调、妇科炎症等女性健康疾病的诊断与治疗',img:doctor8}
]

// 根据地址上的id取医生
let doctor = computed(function () {
  let id = Number(route.params.id)
  return doctorList[id]
})

// 预约挂号
function goAppointment() {
  router.push('/Appointment')
}

// 在线问诊
function goConsult() {
  router.push('/WebConsulation')
}
</script>

<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  background: #f5f5f5;
}
.header {
  padding: 10px;
  background: #fff;
}
.doctor-info {
  display: flex;
  padding: 15px;
  background: #fff;
  margin-bottom: 10px;
}
.doctor-info img {
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  margin-right: 15px;
}
.doctor-info h2 {
  margin: 0 0 5px;
  font-size: 5vw;
}
.title {
  color: #888;
  margin: 0 0 5px;
}
.dept {
  color: #127A90;
  font-size: 3.5vw;
  margin: 0;
}
.section {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
}
.section h4 {
  margin: 0 0 10px;
  font-size: 4vw;
}
.section p {
  margin: 0;
  color: #666;
  font-size: 3.5vw;
}
.btns {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px;
}
</style>
