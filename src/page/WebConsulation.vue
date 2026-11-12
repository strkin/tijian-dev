<template>
<div class="page">
    <div style="display: flex;">
        <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
        <p style="margin-left:0vw;font-size:5vw;">网络问诊</p>
    </div>
    <div style="display: flex;">
         <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
         <el-input v-model="keyword" @keyup.enter="search"></el-input>
    </div>
    <div class="m-4">

    <el-select
      v-model="checkList"
      multiple
      placeholder="Select"
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
  <div class="doctorList">

        <div class="doctor-card" v-for="(item, index) in filteredDoctors" :key="index">
        <img :src="item.img">
        <div class="info">
        <p class="name">{{ item.title }} <span class="online-dot" v-if="item.isOnline"></span></p>
        <p class="meta">{{ item.level }} · {{ item.dept }}</p>
        <p class="good">擅长：{{ item.good }}</p>
        <p class="price">图文 ¥{{ item.price }}/次</p>
        </div>
        <div class="methods" >
        <el-button type="primary" size="small" @click="openDialog(item)">咨询</el-button>

        </div>

        </div>
        <el-dialog v-model="dialogVisible" title="选择咨询方式" width="80%">
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div v-for="(m, i) in methods" :key="i" @click="selectType(m)" style="padding:15px;border:1px solid #eee;border-radius:8px;cursor:pointer;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <h4>{{ m.name }}</h4>
                <span class="dialog-price">¥{{ m.price }}/次</span>
            </div>
            <p style="color:#888;font-size:3vw;">{{ m.desc }}</p>
            </div>
        </div>
        </el-dialog>

  </div>
</div>

</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { ref,computed } from 'vue'
import { useRouter } from 'vue-router'
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'

import doctor1 from '@/img/doctor1.jpg'
import doctor2 from '@/img/doctor2.jpg'
import doctor3 from '@/img/doctor3.jpg'
import doctor4 from '@/img/doctor4.jpg'
import doctor5 from '@/img/doctor5.jpg'
import doctor6 from '@/img/doctor6.jpg'
import doctor7 from '@/img/doctor7.jpg'
import doctor8 from '@/img/doctor8.jpg'

let dialogVisible = ref(false)
let currentDoctor = ref({})
let router = useRouter()
let checkList = ref([])
let keyword = ref('')
let searchResult = ref([])
let searchKeyword = ref('')

// 打开选咨询方式的弹窗
function openDialog(item) {
  console.log('选医生：' + item.title)
  currentDoctor.value = item
  dialogVisible.value = true
}

// 搜索
function search() {
  searchKeyword.value = keyword.value
}

// 这两个没用上
let value1 = ref([])
let value2 = ref([])

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

// 三种咨询方式
let methods = computed(function () {
  let arr = []
  arr.push({ name: '图文咨询', desc: '文字描述症状，医生图文回复', price: currentDoctor.value.price })
  arr.push({ name: '语音咨询', desc: '与医生语音通话', price: currentDoctor.value.voicePrice })
  arr.push({ name: '视频咨询', desc: '与医生视频通话', price: currentDoctor.value.videoPrice })
  return arr
})

// 选了方式就进聊天页
function selectType(action) {
  dialogVisible.value = false
  router.push('/Chat?doctor=' + currentDoctor.value.title + '&type=' + action.name)
}

// 医生数据
let doctors = [
    {title:'刘长胜',level:'主任医师',dept:'内科',good:'慢阻肺、哮喘',price:30,voicePrice:50,videoPrice:80,status:'空闲',img:doctor1,isOnline:true},
    {title:'孙鹿',level:'主任医师',dept:'外科',good:'冠心病、高血压',price:50,voicePrice:80,videoPrice:120,status:'空闲',img:doctor2,isOnline:false},
    {title:'吕文达',level:'主任医师',dept:'内科',good:'胃炎、肠炎',price:30,voicePrice:50,videoPrice:80,status:'忙碌',img:doctor3,isOnline:true},
    {title:'李若辰',level:'主任医师',dept:'外科',good:'糖尿病、甲状腺',price:50,voicePrice:80,videoPrice:120,status:'忙碌',img:doctor4,isOnline:true},
    {title:'张石凡',level:'主任医师',dept:'外科',good:'头痛、失眠',price:30,voicePrice:50,videoPrice:80,status:'空闲',img:doctor5,isOnline:true},
    {title:'赵桂凤',level:'主任医师',dept:'内科',good:'儿童呼吸、消化',price:20,voicePrice:40,videoPrice:60,status:'忙碌',img:doctor6,isOnline:false},
    {title:'李文',level:'主任医师',dept:'外科',good:'颈椎病、腰突',price:30,voicePrice:50,videoPrice:80,status:'空闲',img:doctor7,isOnline:true},
    {title:'吴晓梦',level:'主任医师',dept:'内科',good:'月经不调、炎症',price:50,voicePrice:80,videoPrice:120,status:'忙碌',img:doctor8,isOnline:true}
]

// 筛选医生
let filteredDoctors = computed(function () {
    let list = doctors
    // 先按科室
    if (checkList.value.length > 0) {
        let newList = []
        for (let i = 0; i < list.length; i++) {
            if (checkList.value.includes(list[i].dept)) {
                newList.push(list[i])
            }
        }
        list = newList
    }
    // 再按搜索词
    if (searchKeyword.value) {
        let newList2 = []
        for (let i = 0; i < list.length; i++) {
            let d = list[i]
            if (d.title.includes(searchKeyword.value)) {
                newList2.push(d)
            } else if (d.good.includes(searchKeyword.value)) {
                newList2.push(d)
            }
        }
        list = newList2
    }
    return list;
})
</script>
<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
}
.doctor-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.doctor-card img {
  width: 15vw;
  height: 15vw;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}
.doctor-card .info {
  flex: 1;
}
.name {
  font-size: 4vw;
  font-weight: 500;
  margin: 0;
}
.online-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #67c23a;
  border-radius: 50%;
  margin-left: 5px;
}
.meta, .good {
  font-size: 3vw;
  color: #888;
  margin: 3px 0;
}
.price {
  font-size: 3.5vw;
  color: #e6a23c;
  margin: 3px 0 0;
}
.dialog-price {
  font-size: 3.5vw;
  font-weight: 500;
  color: #e6a23c;
}
</style>
