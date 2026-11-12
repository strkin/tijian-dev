<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">心理年龄判断</p>
  </div>

  <div class="card" v-for="(item, i) in questions" :key="i">
    <h4>{{ i + 1 }}. {{ item.q }}</h4>
    <el-radio-group v-model="answers[i]" class="opt-group">
      <el-radio v-for="(opt, j) in item.options" :key="j" :label="opt.score" class="opt">
        {{ opt.label }}
      </el-radio>
    </el-radio-group>
  </div>

  <div class="btn-group">
    <el-button type="primary" @click="assess">开始测试</el-button>
    <el-button @click="reset">重新填写</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <p class="result-age">心理年龄约 {{ result.age }} 岁</p>
      <el-tag :type="result.tagType">{{ result.level }}</el-tag>
    </div>
    <p class="desc">{{ result.desc }}</p>
  </div>

  <p class="disclaimer">注：本测试为趣味心理参考，不能作为专业心理评估依据。</p>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

let router = useRouter()
let result = ref(null)

// 8道题，每个选项有分数
let questions = [
  {
    q: '周末你更愿意怎么安排？',
    options: [
      { label: '约朋友出门聚会', score: 25 },
      { label: '看电影、追剧、上网', score: 35 },
      { label: '在家安静休息', score: 45 }
    ]
  },
  {
    q: '对新鲜事物（新App、新玩法）你的态度是？',
    options: [
      { label: '马上去尝试', score: 20 },
      { label: '观望了解后再试', score: 35 },
      { label: '不太感兴趣', score: 50 }
    ]
  },
  {
    q: '遇到突发压力时，你通常？',
    options: [
      { label: '冷静想办法解决', score: 25 },
      { label: '有点慌，但能慢慢处理', score: 35 },
      { label: '容易紧张、不知所措', score: 50 }
    ]
  },
  {
    q: '你的穿搭风格更接近？',
    options: [
      { label: '潮流时尚，愿意尝试新款', score: 20 },
      { label: '简洁舒适，得体即可', score: 35 },
      { label: '稳重传统，少做改变', score: 50 }
    ]
  },
  {
    q: '你平时想得更多的是？',
    options: [
      { label: '未来的计划和目标', score: 20 },
      { label: '当下的生活，两者兼有', score: 35 },
      { label: '过去的经历和回忆', score: 50 }
    ]
  },
  {
    q: '你的情绪状态通常是？',
    options: [
      { label: '比较平稳，很少大起大落', score: 25 },
      { label: '偶尔有起伏', score: 35 },
      { label: '容易波动，喜怒明显', score: 50 }
    ]
  },
  {
    q: '学习一项新技能时，你会？',
    options: [
      { label: '很有兴趣，愿意钻研', score: 20 },
      { label: '看是否有用再学', score: 35 },
      { label: '觉得吃力，不太想学', score: 50 }
    ]
  },
  {
    q: '你的日常作息情况是？',
    options: [
      { label: '规律自律，早睡早起', score: 25 },
      { label: '基本规律，偶尔打乱', score: 35 },
      { label: '经常熬夜，作息较乱', score: 45 }
    ]
  }
]

// 每道题的答案，一开始都是空的
let answerList = []
for (let i = 0; i < questions.length; i++) {
  answerList.push(null)
}
let answers = ref(answerList)

// 开始测试
function assess() {
  for (let i = 0; i < answers.value.length; i++) {
    if (answers.value[i] === null) {
      alert('请完成全部题目后再测试')
      return
    }
  }

  let sum = 0
  for (let i = 0; i < answers.value.length; i++) {
    sum = sum + answers.value[i]
  }
  let age = Math.round(sum / answers.value.length)

  let level = '成熟稳重'
  let tagType = ''
  let desc = '心态平和，处事得体。'
  if (age < 25) {
    level = '心态年轻'
    tagType = 'success'
    desc = '好奇心强、乐于接受新事物，心态充满活力。'
  } else if (age <= 35) {
    level = '成熟稳重'
    tagType = ''
    desc = '心态平和，处事得体，能较好地平衡生活与情绪。'
  } else if (age <= 45) {
    level = '偏成熟'
    tagType = 'warning'
    desc = '心态较为保守，建议多接触新事物，保持开放。'
  } else {
    level = '心态偏老'
    tagType = 'danger'
    desc = '心态略显保守或疲惫，建议放松心情，多尝试新鲜活动。'
  }

  console.log('心理年龄：' + age)
  result.value = { age: age, level: level, tagType: tagType, desc: desc }
}

// 重新答
function reset() {
  let arr = []
  for (let i = 0; i < questions.length; i++) {
    arr.push(null)
  }
  answers.value = arr
  result.value = null
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
.header-title {
  margin-left: 10px;
  font-size: 5vw;
}
.card {
  background: #fff;
  margin: 3vw;
  padding: 4vw;
  border-radius: 2vw;
}
.card h4 {
  margin: 0 0 3vw;
  font-size: 3.8vw;
}
.opt-group {
  display: block;
}
.opt {
  display: block;
  margin-bottom: 2.5vw;
  font-size: 3.5vw;
}
.btn-group {
  display: flex;
  gap: 3vw;
  padding: 0 3vw;
}
.btn-group .el-button {
  flex: 1;
}
.result-head {
  display: flex;
  align-items: center;
  gap: 3vw;
}
.result-age {
  font-size: 5vw;
  font-weight: 600;
  margin: 0;
  color: #127A90;
}
.desc {
  font-size: 3.5vw;
  color: #555;
  margin: 2vw 0 0;
}
.disclaimer {
  font-size: 3vw;
  color: #999;
  padding: 3vw;
}
</style>
