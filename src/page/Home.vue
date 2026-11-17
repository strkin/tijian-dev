<template>
<div class="page">
  <div class="top" style="height: 6vh;display: flex;">
    <el-select v-model="selectValue" placeholder="Select" style="width: 60vw;margin-right: 28vw;font-size: 5.6vh;">
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>
    <el-button type="primary" :icon="Message" @click="router.push('/Message')"/>
  </div>

  <div class="content">
    <div class="logo-img">
      <img src="@/img/logo.png">
    </div>

    <!-- 6个功能菜单 -->
    <div class="menu">
      <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8"
           v-for="(item, index) in menuList" :key="index"
           @click="router.push(item.path)">
          <div class="menu-item">
            <img :src="item.img">
            {{ item.title }}
            <p class="subtitle" style="font-size: 3vw;color: #888;">{{ item.subtitle }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="report">
      <div class="itemTitle">
        <p style="height: 4.3vw;line-height: 4.3vw;box-sizing: border-box;padding-left: 3vw;font-size: 4.3vw;border-left: solid 1vw #127A90;letter-spacing: 0.2vw;">我的健康报告</p>
      </div>
      <div class="reportContent" style="margin-left: 4vw;margin-bottom: 4vw;">
         随时随地查看体检报告
        <el-button style="float: right;background-color: #127A90;color: #f9f9f9;" @click="router.push('/HealthFile')">立即查看</el-button>
      </div>
    </div>

    <!-- 推荐医生，点了进详情 -->
    <div class="doctor">
      <div class="itemTitle">
        <p style="height: 5vw;line-height: 5vw;box-sizing: border-box;padding-left: 3vw;font-size: 4.3vw;border-left: solid 1vw #127A90;letter-spacing: 0.2vw;">推荐医生</p>
      </div>
      <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
        <el-col :xs="6" :sm="8" :md="8" :lg="8" :xl="8"
          v-for="(item, index) in doctorList" :key="index">
          <div class="doctor-item" @click="router.push('/DoctorDetail/' + index)">
            <img :src="item.img">
            <p class="doctor-name">{{ item.title }}</p>
            <p class="doctor-title">{{ item.subtitle }}</p>
          </div>
        </el-col>
      </el-row>
    </div>

  <div class="healthAssessment">
    <div class="assessment" style="display: flex; justify-content: space-between; align-items: center; padding: 0 3vw;margin-bottom: 1vh;">
      <p style="font-size: 4.3vw; border-left: solid 1vw #127A90; padding-left: 3vw; line-height: 4.3vw;">健康评估</p>
      <p style="color: #888; font-size: 3.5vw;">更多</p>
    </div>
    <div>
      <el-scrollbar>
        <div class="scrollbar-flex-content">
          <img v-for="(item, index) in assessList" :key="index"
            :src="item.img" class="assess-img"
            @click="router.push(item.path)">
        </div>
      </el-scrollbar>
    </div>
  </div>

  <div class="healthConsulation">
    <div>
      <p style="height: 4.3vw;line-height: 4.3vw;box-sizing: border-box;padding-left: 3vw;font-size: 4.3vw;border-left: solid 1vw #127A90;letter-spacing: 0.2vw;margin-top: 1vh;padding-left: 3vw;margin-left: 2.5vw;">健康咨询</p>
    </div>
    <div class="consulationContent" style="margin-left: 4vw;margin-bottom: 4vw;">
      <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8"
           v-for="(item, index) in consultList" :key="index"
           @click="router.push(item.path)">
          <div class="consulation-item">
            <img :src="item.img">
            <div class="text-box">
              {{ item.title }}
              <p class="subtitle" style="font-size: 3vw;color: #888;">{{ item.subtitle }}</p>
              <el-button type="primary" :icon="ChatDotRound" style="margin-left: 45vw;font-size: 3vw;color: #999;background-color: white;border: none;"/>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Message, ChatDotRound } from '@element-plus/icons-vue'
import { RouterLink, useRouter } from 'vue-router'

let router = useRouter()
// 上面选医院的下拉框
let selectValue = ref('')

// 医院选项，后面再补
let optionList = [
  {
    value: '沈阳云医院',
    label: '沈阳云医院',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

// 首页功能
let menuList = [
  { title: '免费咨询', subtitle: '新型冠状病毒肺炎', img: 'src/img/menu01.png', path: '/FreeConsultation' },
  { title: '网络问诊', subtitle: '图文视频网络咨询', img: 'src/img/menu02.png', path: '/WebConsulation' },
  { title: 'e心门诊', subtitle: '复旦医科大学专家', img: 'src/img/menu03.png', path: 'Outpatient' },
  { title: '慢病管理', subtitle: '血压血糖健康管理', img: 'src/img/menu04.png', path: '/DiseaseManagement' },
  { title: '上门护理', subtitle: '网上购买上门服务', img: 'src/img/menu05.png', path: '/HomeCare' },
  { title: '团检预约', subtitle: '团体体检套餐定制', img: 'src/img/menu06.png', path: '/Appointment' },
]

// 医生列表
let doctorList = [
  { title: '刘长胜', subtitle: '主任医师', img: 'src/img/doctor1.jpg', path: '/doctorDetail' },
  { title: '孙鹿', subtitle: '主任医师', img: 'src/img/doctor2.jpg', path: '/doctorDetail' },
  { title: '吕文达', subtitle: '主任医师', img: 'src/img/doctor3.jpg', path: '/doctorDetail' },
  { title: '李若辰', subtitle: '主任医师', img: 'src/img/doctor4.jpg', path: '/doctorDetail' },
  { title: '张石凡', subtitle: '主任医师', img: 'src/img/doctor5.jpg', path: '/doctorDetail' },
  { title: '赵桂凤', subtitle: '主任医师', img: 'src/img/doctor6.jpg', path: '/doctorDetail' },
  { title: '李文', subtitle: '主任医师', img: 'src/img/doctor7.jpg', path: '/doctorDetail' },
  { title: '吴晓梦', subtitle: '主任医师', img: 'src/img/doctor8.jpg', path: '/doctorDetail' }
]

// 健康评估的图片
let assessList = [
  { img: 'src/img/assess1.png', path: '/SelfCommit' },
  { img: 'src/img/assess2.png', path: '/HealthRisk' },
  { img: 'src/img/assess3.png', path: '/LifeEstimate' },
  { img: 'src/img/assess4.png', path: '/MentalAge' },
  { img: 'src/img/assess5.png', path: '/TcmConstitution' },
  { img: 'src/img/assess6.png', path: '/DiabetesRisk' }
]

// 健康咨询（先放两条）
let consultList = [
  { title: '查出肺结核，我是不是要得肺癌了？', subtitle: '肺结核一定会导致肺癌吗？', img: 'src/img/info1.png', path: '' },
  { title: '体检发现甲状腺结节，怎么办？', subtitle: '日常需注意什么？', img: 'src/img/info2.png', path: '' },
]


onMounted(function () {
  console.log('首页加载完了')
})
</script>
<style scoped>
.page {
  height: 100vh;
  display: block;
  overflow: hidden;
}
.content {
  height: calc(100vh - 6vh - 10vh);
  overflow-y: auto;
}
.menu-item {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  margin-bottom: 10px;
  overflow: hidden;
}
.menu-item img {
  width: 10vw;
  height: 10vw;
  float: left;
  margin-right: 3vw;
}
.logo-img {
  width: 100%;
  overflow: hidden;
}
.logo-img img {
  width: 100%;
  display: block;
}
.report{
    width: 100%;
    background-color: #fff;
    margin-bottom: 3vw;
}
.itemTitle{
    width: 100%;
    height: 13vw;
    box-sizing: border-box;
    padding: 0 3.6vw;
    border-bottom: solid 1vw #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.doctor-item{
  text-align: center;
  padding-bottom: 10px;
}
.doctor-item img{
  width: 60%;
  display: block;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
}
.doctor-name{
  font-size: 4vw;
  font-weight: 500;
  margin: 2vw 0 0;
}
.doctor-title{
  font-size: 3vw;
  color: #888;
  margin: 1vw 0;
}
.assess-img {
  flex-shrink: 0;
  width: 40vw;
  height: 22vw;
  margin-right: 10px;
  margin-left: 10px;
}
.scrollbar-flex-content {
  display: flex;
  width: fit-content;
}
.consulation-item{
  font-size: 4vw;
  font-weight: 500;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  align-items: flex-start;
}
.consulation-item img{
  width: 30vw;
  height: 19.8vw;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 3vw;
}
/* 先留着，以后可能要用 */
/* .menu-item:hover {
  background: #e8f4f8;
} */
</style>
