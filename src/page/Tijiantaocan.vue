<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p style="font-size:5vw;">体检套餐</p>
  </div>

  <div class="pkg-list">
    <div class="pkg-card" v-for="(p, i) in packages" :key="i">
      <div class="pkg-head">
        <div class="pkg-title">
          <p class="pkg-name">{{ p.name }}</p>
          <p class="pkg-sub">{{ p.sub }}</p>
        </div>
        <div class="pkg-detail" @click="toggleDetail(p)">
          详情 <span :class="p.open ? 'up' : 'down'">⌄</span>
        </div>
      </div>

      <el-table v-show="p.open" :data="p.items" border stripe style="width:100%;">
        <el-table-column prop="project" label="检查项目" width="28%" />
        <el-table-column prop="content" label="检查内容" />
        <el-table-column prop="meaning" label="检查意义" />
      </el-table>
    </div>
  </div>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

let router = useRouter()

// 套餐数据（三个套餐里面的检查项是一样的，先复制一下）
let packages = ref([
  {
    name: '男士套餐',
    sub: '普通男士客户-基础套餐',
    open: false,
    items: [
      { project: '一般检查', content: '血压、身高、体重、腰围、臀围。', meaning: '通过仪器测定人体基本健康指标。' },
      { project: '血常规', content: '血常规24项：中性粒细胞计数绝对值、红细胞压积、血小板比容等。', meaning: '临床三大常规检测之一，判断血液状况及相关疾病。' },
      {
        project: '尿常规',
        content: '尿维生素C测定、尿比重测定、尿液酮体测定、尿胆红素测定、尿亚硝酸盐测定、尿液颜色、尿白细胞计数、尿蛋白定性、尿液镜检、尿葡萄糖测定、尿液隐血、尿液酸碱度、尿液清晰度、尿胆原。',
        meaning: '临床三大常规检测之一，可反映机体的代谢状况，是很多疾病诊断的重要指标。'
      },
    ]
  },
  {
    name: '男士套餐',
    sub: '普通男士客户-脑血管系统',
    open: false,
    items: [
      { project: '一般检查', content: '血压、身高、体重、腰围、臀围。', meaning: '通过仪器测定人体基本健康指标。' },
      { project: '血常规', content: '血常规24项：中性粒细胞计数绝对值、红细胞压积、血小板比容等。', meaning: '临床三大常规检测之一，判断血液状况及相关疾病。' },
      {
        project: '尿常规',
        content: '尿维生素C测定、尿比重测定、尿液酮体测定、尿胆红素测定、尿亚硝酸盐测定、尿液颜色、尿白细胞计数、尿蛋白定性、尿液镜检、尿葡萄糖测定、尿液隐血、尿液酸碱度、尿液清晰度、尿胆原。',
        meaning: '临床三大常规检测之一，可反映机体的代谢状况，是很多疾病诊断的重要指标。'
      },
    ]
  },
  {
    name: '男士套餐',
    sub: '普通男士客户-肝病检查',
    open: false,
    items: [
      { project: '一般检查', content: '血压、身高、体重、腰围、臀围。', meaning: '通过仪器测定人体基本健康指标。' },
      { project: '血常规', content: '血常规24项：中性粒细胞计数绝对值、红细胞压积、血小板比容等。', meaning: '临床三大常规检测之一，判断血液状况及相关疾病。' },
      {
        project: '尿常规',
        content: '尿维生素C测定、尿比重测定、尿液酮体测定、尿胆红素测定、尿亚硝酸盐测定、尿液颜色、尿白细胞计数、尿蛋白定性、尿液镜检、尿葡萄糖测定、尿液隐血、尿液酸碱度、尿液清晰度、尿胆原。',
        meaning: '临床三大常规检测之一，可反映机体的代谢状况，是很多疾病诊断的重要指标。'
      },
    ]
  }
])

// 展开/收起详情
function toggleDetail(p) {
  if (p.open == true) {
    p.open = false
  } else {
    p.open = true
  }
  console.log(p.name + ' 现在是 ' + p.open)
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
.header p {
  margin-left: 10px;
}
.pkg-list {
  padding: 3vw;
}
.pkg-card {
  background: #fff;
  border-radius: 2vw;
  box-shadow: 2px 2px 5px rgba(0,0,0,.08);
  margin-bottom: 4vw;
  overflow: hidden;
}
.pkg-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pkg-title {
  flex: 1;
  padding: 4vw;
}
.pkg-name {
  font-size: 4.5vw;
  font-weight: 600;
  margin: 0;
}
.pkg-sub {
  font-size: 3.5vw;
  color: #888;
  margin: 1vw 0 0;
}
.pkg-detail {
  width: 24vw;
  text-align: center;
  font-size: 3.8vw;
  color: #333;
  cursor: pointer;
  border-left: 1px solid #eee;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pkg-detail .down { display: inline-block; }
.pkg-detail .up { display: inline-block; transform: rotate(180deg); }
</style>
