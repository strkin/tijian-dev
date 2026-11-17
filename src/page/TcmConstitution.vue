<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">中医体质辨识</p>
  </div>

  <div class="card" v-for="g in groups" :key="g.key">
    <h4>{{ g.name }}</h4>
    <el-checkbox-group v-model="checked[g.key]">
      <el-checkbox v-for="s in g.symptoms" :key="s" :label="s" :value="s" class="cb" />
    </el-checkbox-group>
  </div>

  <div class="btn-group">
    <el-button type="primary" @click="assess">开始辨识</el-button>
    <el-button @click="reset">重新填写</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <p class="result-name">主要体质：{{ result.name }}</p>
    </div>
    <p class="desc">{{ result.desc }}</p>
    <div class="block">
      <p class="block-title">调养建议</p>
      <p class="advice">{{ result.advice }}</p>
    </div>
  </div>

  <p class="disclaimer">注：体质辨识结果仅供养生参考，不能替代中医辨证与医师诊断。</p>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

let router = useRouter()
let result = ref(null)

// 9种体质和对应的症状
let groups = [
  {
    key: 'pinghe', name: '平和质',
    symptoms: ['精力充沛', '睡眠良好', '情绪稳定', '适应力强'],
    advice: '继续保持规律作息、均衡饮食和适度运动。'
  },
  {
    key: 'qixu', name: '气虚质',
    symptoms: ['容易疲乏', '气短懒言', '稍动就出汗', '反复感冒'],
    advice: '益气健脾，避免过度劳累，可适当食用山药、黄芪、大枣等。'
  },
  {
    key: 'yangxu', name: '阳虚质',
    symptoms: ['手脚发凉', '怕冷喜暖', '吃凉易不适', '精神不振'],
    advice: '温阳散寒，注意保暖，少食生冷，可适度进行日光浴。'
  },
  {
    key: 'yinxu', name: '阴虚质',
    symptoms: ['口干咽燥', '手足心热', '夜间盗汗', '大便干燥'],
    advice: '滋阴润燥，少吃辛辣燥热食物，保证充足睡眠。'
  },
  {
    key: 'tanshi', name: '痰湿质',
    symptoms: ['体形偏胖', '腹部松软', '痰多黏腻', '身体沉重'],
    advice: '饮食清淡，少甜腻油腻，坚持规律运动，帮助代谢。'
  },
  {
    key: 'shire', name: '湿热质',
    symptoms: ['面部油腻', '易生痤疮', '口苦口臭', '大便黏滞'],
    advice: '清热利湿，戒烟限酒，避免熬夜，保持作息规律。'
  },
  {
    key: 'xueyu', name: '血瘀质',
    symptoms: ['面色晦暗', '容易出现瘀斑', '口唇偏暗', '健忘'],
    advice: '活血通络，适度运动促进血液循环，注意保暖。'
  },
  {
    key: 'qiyu', name: '气郁质',
    symptoms: ['情绪低落', '多愁善感', '胁肋胀痛', '容易叹气'],
    advice: '疏肝解郁，多与人交流，培养兴趣爱好，调节情绪。'
  },
  {
    key: 'tebing', name: '特禀质',
    symptoms: ['容易过敏', '鼻炎或哮喘', '皮肤容易起疹'],
    advice: '尽量远离过敏原，增强体质，症状明显时及时就医。'
  }
]

// 每个体质选中的症状
let checked = reactive({})
for (let i = 0; i < groups.length; i++) {
  checked[groups[i].key] = []
}

// 每种体质的说明
let descMap = {
  '平和质': '阴阳气血调和，体态适中、面色红润，是较为健康的体质状态。',
  '气虚质': '元气不足，容易疲乏、气短、抵抗力偏弱。',
  '阳虚质': '阳气不足，畏寒怕冷、手足不温。',
  '阴虚质': '阴液偏少，口燥咽干、手足心偏热。',
  '痰湿质': '痰湿凝聚，体形偏胖、身体沉重。',
  '湿热质': '湿热内蕴，面垢油光、易生疮疖。',
  '血瘀质': '血行不畅，面色晦暗、容易出现瘀斑。',
  '气郁质': '气机郁滞，情绪偏低落、敏感多虑。',
  '特禀质': '先天禀赋特殊，容易出现过敏反应。'
}

// 开始辨识
function assess() {
  let best = null
  let bestScore = 0
  for (let i = 0; i < groups.length; i++) {
    let g = groups[i]
    if (g.key === 'pinghe') {
      continue
    }
    let score = checked[g.key].length
    if (score > bestScore) {
      bestScore = score
      best = g
    }
  }

  let name
  let advice
  let desc
  if (!best || bestScore === 0) {
    name = '平和质'
    let pinghe = null
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].key === 'pinghe') {
        pinghe = groups[i]
      }
    }
    advice = pinghe.advice
    desc = descMap[name]
  } else {
    name = best.name
    advice = best.advice
    desc = descMap[name]
  }

  console.log('体质：' + name)
  result.value = { name: name, advice: advice, desc: desc }
}

// 重新填
function reset() {
  for (let i = 0; i < groups.length; i++) {
    checked[groups[i].key] = []
  }
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
.cb {
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
}
.result-name {
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
.block {
  margin-top: 3vw;
}
.block-title {
  font-size: 3.8vw;
  font-weight: 600;
  margin: 0 0 1vw;
}
.advice {
  font-size: 3.5vw;
  color: #555;
  margin: 0;
}
.disclaimer {
  font-size: 3vw;
  color: #999;
  padding: 3vw;
}
</style>
