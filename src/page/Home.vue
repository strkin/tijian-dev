<template>
<div class="page">
  <div  style="height: 6vh;position: fixed;" class="top">
    <el-select v-model="value" placeholder="Select" style="width: 60vw;margin-right: 28vw;font-size: 5.6vh;">
      <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
    </el-select>
    <el-button type="primary" :icon="Message" />
</div>
  <div class="content">
    <div class="logo-img">
      <img src="@/img/logo.png">
    </div>
    <div class="menu">
      <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="8"
           v-for="(item, index) in menus" :key="index"
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
        <el-button style="float: right;background-color: #127A90;color: #f9f9f9;">立即查看</el-button>
      </div>
      
    <div class="doctor">
      <div class="itemTitle">
        <p style="height: 5vw;line-height: 5vw;box-sizing: border-box;padding-left: 3vw;font-size: 4.3vw;border-left: solid 1vw #127A90;letter-spacing: 0.2vw;">推荐医生</p>
      </div>
      <el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
        <el-col :xs="6" :sm="8" :md="8" :lg="8" :xl="8"
          v-for="(item, index) in doctors" :key="index"
          @click="router.push(doctor.path)">
          <div class="doctor-item">
            <img :src="item.img">
            {{ item.title }}
            <p class="subtitle" style="font-size: 3vw;color: #888;">{{ item.subtitle }}</p>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</div>
<div class="bottom" style="height: 10vh;width: 100vw;text-align: center;background-color: #127A90;position: fixed;bottom: 0;box-sizing: border-box;">
<el-row :gutter="10" style="padding: 10px;width: 100%; box-sizing: border-box;">
            <el-col :xs="6" :sm="8" :md="8" :lg="8" :xl="8"
           v-for="(item, index) in navs" :key="index"
           @click="router.push(nav.path)">
            <div class="nav-item" style="height: 10vh;">
            <img :src="item.img">
            {{ item.title }}
            
            </div>
            </el-col>
        </el-row>
</div>
</div>
</template>
<script setup>
import { ref } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { RouterLink, useRouter } from 'vue-router'
const router = useRouter()
const value = ref('')
const options = [
  {
    value: '沈阳云医院',
    label: '沈阳云医院',
  },
  {
    value: 'Option2',
    label: 'Option2',
    // disabled: true,
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
const menus = [
  { title: '免费咨询',subtitle: '新型冠状病毒肺炎', img: 'src/img/menu01.png', path: '/FreeConsultation' },
  { title: '网络问诊',subtitle: '图文视频网络咨询', img: 'src/img/menu02.png', path: '' },
  { title: 'e心门诊',subtitle:  '复旦医科大学专家', img: 'src/img/menu03.png', path: '' },
  { title: '慢病管理',subtitle: '血压血糖健康管理', img: 'src/img/menu04.png', path: '' },
  { title: '上门护理',subtitle: '网上购买上门服务', img: 'src/img/menu05.png', path: '' },
  { title: '团检预约',subtitle: '团体体检套餐定制', img: 'src/img/menu06.png', path: '' },
]
const doctors=[
    {title: '刘长胜',subtitle: '主任医师', img: 'src/img/doctor1.jpg', path: ''},
    {title: '孙鹿',subtitle: '主任医师', img: 'src/img/doctor2.jpg', path: ''},
    {title: '吕文达',subtitle: '主任医师', img: 'src/img/doctor3.jpg', path: ''},
    {title: '李若辰',subtitle: '主任医师', img: 'src/img/doctor4.jpg', path: ''},
    {title: '张石凡',subtitle: '主任医师', img: 'src/img/doctor5.jpg', path: ''},
    {title: '赵桂凤',subtitle: '主任医师', img: 'src/img/doctor6.jpg', path: ''},
    {title: '李文',subtitle: '主任医师', img: 'src/img/doctor7.jpg', path: ''},
    {title: '吴晓梦',subtitle: '主任医师', img: 'src/img/doctor8.jpg', path: ''}
]
const navs=[
  {title:'云医院',img:'',path:''},
  {title:'商城',img:'',path:''},
  {title:'发现',img:'',path:''},
  {title:'我',img:'',path:''}
]
</script>
<style scoped>
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
    height: 32vw;
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
.doctor-item img{
  width: 100%;
  display: block;
  overflow: hidden;
  border-radius: 20vw;
}
</style>