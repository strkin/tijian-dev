<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">体检报告</p>
    <div class="header-right"></div>
  </div>

  <nav class="tab-nav">
    <div :class="{ active: activeTab === 'conclusion' }" @click="changeTab('conclusion')">总检结论</div>
    <div :class="{ active: activeTab === 'detail' }" @click="changeTab('detail')">报告详情</div>
  </nav>

  <!-- 总检结论 -->
  <div class="content" v-show="activeTab === 'conclusion'">
    <div class="item">
      <div class="title">异常项</div>
      <ul>
        <li v-for="(a, i) in abnormal" :key="i">
          <div class="indications">
            <div class="left">
              <div v-if="a.abnormal" class="badge">异</div>
              <p>{{ a.name }}</p>
            </div>
            <div class="right">
              <p>{{ a.value }}</p>
              <p class="range">{{ a.range }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="item">
      <div class="title">一、尊敬的顾客，您本次体检结论如下：</div>
      <ul>
        <li class="conclusion-title" v-for="(c, i) in conclusions" :key="i">{{ i + 1 }}、{{ c }}</li>
      </ul>
    </div>

    <div class="item">
      <div class="title">二、尊敬的顾客，您本次体检建议信息如下：</div>
      <ul>
        <li class="conclusion-content" v-for="(ad, i) in advices" :key="i">
          <h3>{{ ad.title }}</h3>
          <p>{{ ad.text }}</p>
        </li>
      </ul>
    </div>
  </div>

  <!-- 报告详情 -->
  <div class="content" v-show="activeTab === 'detail'">
    <div class="item" v-for="(g, i) in detailGroups" :key="i">
      <div class="title">{{ g.title }}</div>
      <ul>
        <li v-for="(item, j) in g.items" :key="j">
          <div v-if="item.type === 'text'" class="indications-type-4">
            <div>{{ item.name }}</div>
            <div>{{ item.content }}</div>
          </div>
          <div v-else class="indications">
            <div class="left">
              <div v-if="item.abnormal" class="badge">异</div>
              <p>{{ item.name }}</p>
            </div>
            <div class="right">
              <p>{{ item.value }}</p>
              <p class="range" v-if="item.range">{{ item.range }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

let router = useRouter()
let activeTab = ref('conclusion')

// 异常项（数据是照着体检报告抄的，以后要改成接口）
let abnormal = [
  { name: '收缩压', value: '149', range: '正常值范围：<140', abnormal: true },
  { name: '白细胞计数', value: '3.56 10^9/L', range: '正常值范围：4-10', abnormal: true }
]

// 结论
let conclusions = ['超重', '血压增高', '血常规异常']

// 建议
let advices = [
  {
    title: '1、超重',
    text: '您的体重指标属超重。体内脂肪过度增加，使体重超过正常范围，可引起高血压、高血脂、糖尿病、冠心病以及免疫功能降低等并发症。建议: 合理膳食，以低盐、低脂、高纤维为原则；三餐定时，不吃零食；根据自身情况适量运动，以消耗体内脂肪，维持正常体重。'
  },
  {
    title: '2、血压增高',
    text: '此次检测血压增高，已经达到高血压的诊断标准，建议就诊心血管内科进一步明确高血压诊断，积极控制好血压。低盐、低脂、低胆固醇饮食。戒烟酒，避免情绪激动，长期过度紧张工作或劳累，保持心境平和，保证充足睡眠。定期到医院系统复查，预防并发症。'
  },
  {
    title: '3、血常规异常',
    text: '此次检测白细胞减少，将会导致免疫功能的下降。建议就诊做进一步诊断。同时注意：胆固醇高不要吃油的、甜的，多吃水果和蔬菜，多吃富含蛋白质的食物，如牛奶和豆奶。注意锻炼，坚持每天三次，超过10分钟，中等强度，每周锻炼不少于5次。'
  }
]

// 报告详情分组
let detailGroups = [
  {
    title: '一般检测',
    items: [
      { name: '收缩压', value: '149', range: '正常值范围：<140', abnormal: true },
      { name: '舒张压', value: '90', range: '正常值范围：<90' },
      { name: '身高', value: '177.00 cm' },
      { name: '体重', value: '80 kg' }
    ]
  },
  {
    title: '血常规',
    items: [
      { name: '白细胞计数', value: '3.56 10^9/L', range: '正常值范围：4-10', abnormal: true },
      { name: '红细胞压值', value: '47.4 %', range: '正常值范围：36-50' },
      { name: '淋巴细胞计数百分比', value: '19.03 %', range: '正常值范围：18.3-47.9' },
      { name: '单核细胞计数百分比', value: '8.00 %', range: '正常值范围：4.2-15.2' },
      { name: '嗜酸性粒细胞计数百分比', value: '1.20 %', range: '正常值范围：0.2-7.6' }
    ]
  },
  {
    title: '尿常规',
    items: [
      { name: '尿白细胞', value: '- /ul', range: '正常值范围：-' },
      { name: '尿亚硝酸盐', value: '-', range: '正常值范围：阴性' },
      { name: '尿液酸碱度', value: '6.0', range: '正常值范围：5.5-6.5' }
    ]
  },
  {
    title: '妇科检查',
    items: [
      { type: 'text', name: '盆腔检查', content: '盆腔检查结果内容，盆腔检查结果内容，盆腔检查结果内容，盆腔检查结果内容。' },
      { type: 'text', name: '乳腺检查', content: '正常' },
      { type: 'text', name: '子宫检查', content: '正常' }
    ]
  }
]

// 切换tab
function changeTab(tab) {
  activeTab.value = tab
  console.log('切换到了：' + tab)
}
</script>

<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
  background: #f9f9f9;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 3.6vw;
  height: 15.7vw;
}
.header-title {
  font-size: 5vw;
  margin: 0;
}
.header-right {
  width: 8vw;
}
.tab-nav {
  display: flex;
  background: #f9f9f9;
}
.tab-nav div {
  flex: 1;
  height: 14vw;
  text-align: center;
  line-height: 14vw;
  font-size: 4.2vw;
  font-weight: 600;
  color: #555;
}
.tab-nav .active {
  border-bottom: solid 2px #137E92;
  color: #137E92;
}
.content {
  padding-bottom: 4vw;
}
.item {
  width: 92vw;
  margin: 3vw auto;
  overflow: hidden;
  border-radius: 3vw;
  background: #fff;
}
.item .title {
  width: 100%;
  height: 10vw;
  background: #7BAFD7;
  line-height: 10vw;
  box-sizing: border-box;
  padding-left: 4vw;
  font-size: 4.2vw;
  color: #fff;
}
.item ul {
  width: 100%;
}
.item ul li {
  border-bottom: solid 1px #eee;
}
.item ul li:last-child {
  border-bottom: none;
}
.indications {
  width: 100%;
  height: 14vw;
  padding: 0 3vw;
  display: flex;
  align-items: center;
  font-size: 3.2vw;
  color: #333;
}
.left {
  flex: 1;
  display: flex;
  align-items: center;
}
.badge {
  background: #BA634E;
  color: #fff;
  padding: 0.2vw 0.6vw;
  border-radius: 0.6vw;
}
.left p {
  font-weight: 600;
  margin-left: 2vw;
}
.right {
  flex: 1;
  text-align: right;
}
.range {
  color: #999;
}
.indications-type-4 {
  width: 100%;
  box-sizing: border-box;
  padding: 0 3vw;
  font-size: 3.2vw;
  color: #333;
}
.indications-type-4 div {
  margin: 5vw 0;
}
.indications-type-4 div:first-child {
  font-weight: 600;
}
.indications-type-4 div:last-child {
  color: #999;
}
.conclusion-title {
  width: 100%;
  height: 12vw;
  box-sizing: border-box;
  border-bottom: solid 1px #eee;
  padding: 0 3vw;
  display: flex;
  align-items: center;
  font-size: 4vw;
  color: #555;
}
.conclusion-content {
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid 1px #eee;
  padding: 4vw 3vw;
  font-size: 3.6vw;
  color: #555;
}
.conclusion-content h3 {
  font-size: 4vw;
  font-weight: 600;
  margin-bottom: 2vw;
}
.conclusion-content p {
  text-indent: 8vw;
}
</style>
