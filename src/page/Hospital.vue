<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p style="font-size:5vw;">请您选择体检机构</p>
  </div>

  <div class="hospital-list">
    <div class="hospital-card" v-for="(h, i) in hospitals" :key="i">
      <div class="card-title">
        <span class="bar"></span>
        <p>{{ h.name }}</p>
        <el-button :icon="ArrowRight" @click="router.push('/Tijiantaocan')" style="border: none;"></el-button>
      </div>
      <div class="card-body">
        <img :src="h.img">
        <div class="info">
          <div class="info">
          <p><span class="label">营业时间</span><span>{{ h.open }}</span></p>
          <p><span class="label">采血截止</span><span>{{ h.blood }}</span></p>
          <p><span class="label">电话</span><span>{{ h.phone }}</span></p>
          <p><span class="label">地址</span><span>{{ h.address }}</span></p>
          </div>

        </div>
      </div>
      <div class="card-btns">
        <el-button plain>联系我们</el-button>
        <el-button plain>查找位置</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ArrowLeftBold, ArrowRight } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import hospital1 from '@/img/hospital1.png'
import hospital2 from '@/img/hospital2.png'

let router = useRouter()

// 医院数据，先写两个
let hospitals = [
  {
    name: '沈阳熙康云医院-和平院区',
    open: '周一至周五 7:30-15:30（周六截止12:00）',
    blood: '采血截止时间 10:30',
    phone: '52433456',
    address: '文体路7号世贸大厦商都（五里河茶城）四楼西区',
    img: hospital1
  },
  {
    name: '沈阳熙康云医院-浑南院区',
    open: '周一至周六 7:30-11:30',
    blood: '10:30',
    phone: '52713658',
    address: '创新路175号（与智慧大厦交汇处）',
    img: hospital2
  }
]

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
.header p {
  margin-left: 10px;
}
.hospital-list {
  padding: 3vw;
}
.hospital-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 2vw;
  box-shadow: 2px 2px 5px rgba(0,0,0,.08);
  padding: 4vw;
  margin-bottom: 4vw;
}
.card-title {
  display: flex;
  align-items: center;
}
.bar {
  width: 1vw;
  height: 5vw;
  background: #127A90;
  margin-right: 2vw;
}
.card-title p {
  flex: 1;
  font-size: 4.3vw;
  font-weight: 500;
  margin: 0;
}
.arrow {
  color: #999;
  font-size: 5vw;
}
.card-body {
  display: flex;
  margin: 3vw 0;
}
.card-body img {
  width: 22vw;
  height: 22vw;
  border-radius: 1vw;
  margin-right: 3vw;
  object-fit: cover;
}
.info p {
  display: flex;
  margin: 1vw 0;
  font-size: 3.5vw;
  color: #666;
}
.info .label {
  width: 18vw;
  flex-shrink: 0;
}
.card-btns {
  display: flex;
  gap: 3vw;
  justify-content: flex-end;
}
</style>
