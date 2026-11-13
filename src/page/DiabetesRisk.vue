<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">糖尿病风险评估</p>
  </div>

  <div class="card">
    <h4>基本信息</h4>
    <el-form :model="form" label-width="22vw">
      <el-form-item label="性别">
        <el-radio-group v-model="form.gender">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="form.age" placeholder="请输入年龄" maxlength="3"
          @input="form.age = form.age.replace(/\D/g, '')" />
      </el-form-item>
      <el-form-item label="身高(cm)">
        <el-input v-model="form.height" placeholder="如 170" maxlength="3"
          @input="form.height = form.height.replace(/\D/g, '')" />
      </el-form-item>
      <el-form-item label="体重(kg)">
        <el-input v-model="form.weight" placeholder="如 65" maxlength="3"
          @input="form.weight = form.weight.replace(/\D/g, '')" />
      </el-form-item>
      <el-form-item label="腰围(cm)">
        <el-input v-model="form.waist" placeholder="如 85" maxlength="3"
          @input="form.waist = form.waist.replace(/\D/g, '')" />
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>病史与指标</h4>
    <el-form :model="form" label-width="22vw">
      <el-form-item label="家族史">
        <el-checkbox v-model="form.family" label="直系亲属有糖尿病" />
      </el-form-item>
      <el-form-item label="血压">
        <el-select v-model="form.bp" style="width:100%;">
          <el-option label="正常" value="正常" />
          <el-option label="偏高" value="偏高" />
          <el-option label="高血压" value="高血压" />
        </el-select>
      </el-form-item>
      <el-form-item label="血糖">
        <el-select v-model="form.sugar" style="width:100%;">
          <el-option label="正常" value="正常" />
          <el-option label="偏高" value="偏高" />
          <el-option label="糖尿病" value="糖尿病" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>生活方式</h4>
    <el-form :model="form" label-width="22vw">
      <el-form-item label="运动">
        <el-select v-model="form.exercise" style="width:100%;">
          <el-option label="每天运动" value="每天运动" />
          <el-option label="每周3次以上" value="每周3次以上" />
          <el-option label="很少运动" value="很少运动" />
          <el-option label="几乎不运动" value="几乎不运动" />
        </el-select>
      </el-form-item>
      <el-form-item label="饮食">
        <el-select v-model="form.diet" style="width:100%;">
          <el-option label="荤素均衡" value="均衡" />
          <el-option label="偏油腻/甜食" value="偏油腻" />
          <el-option label="不规律" value="不规律" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <div class="btn-group">
    <el-button type="primary" @click="assess">开始评估</el-button>
    <el-button @click="reset">重新填写</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <p class="result-level">糖尿病风险：{{ result.level }}</p>
      <el-tag :type="result.tagType">{{ result.score }} 分</el-tag>
    </div>

    <div class="block" v-if="result.risks.length">
      <p class="block-title">主要风险因素</p>
      <ul class="risk-list">
        <li v-for="(r, i) in result.risks" :key="i">{{ r }}</li>
      </ul>
    </div>

    <div class="block">
      <p class="block-title">建议</p>
      <ul class="advice-list">
        <li v-for="(a, i) in result.advice" :key="i">{{ a }}</li>
      </ul>
    </div>

    <el-button type="primary" plain style="margin-top:2vw;" @click="router.push('/FreeConsultation')">转免费咨询</el-button>
  </div>

  <p class="disclaimer">注：本评估为风险参考，不能替代血糖检测与医生诊断。</p>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

let router = useRouter()
let result = ref(null)

// 表单
let form = reactive({
  gender: '男',
  age: '',
  height: '',
  weight: '',
  waist: '',
  family: false,
  bp: '正常',
  sugar: '正常',
  exercise: '每周3次以上',
  diet: '均衡'
})

// 开始评估
function assess() {
  console.log('开始评估', form)
  if (!form.age || !form.height || !form.weight) {
    alert('请先填写年龄、身高、体重')
    return
  }

  let score = 0
  let risks = []
  let advice = []

  // 年龄
  let age = Number(form.age)
  if (age >= 50) {
    score = score + 8
    risks.push('年龄偏大（≥50岁）')
  } else if (age >= 40) {
    score = score + 4
    risks.push('中年（40-49岁）')
  }

  // BMI
  let h = Number(form.height) / 100
  let w = Number(form.weight)
  let bmi = 0
  if (h > 0) {
    bmi = w / (h * h)
  }
  if (bmi >= 28) {
    score = score + 8
    risks.push('肥胖（BMI ' + bmi.toFixed(1) + '）')
  } else if (bmi >= 24) {
    score = score + 4
    risks.push('超重（BMI ' + bmi.toFixed(1) + '）')
  }

  // 腰围
  let waist = Number(form.waist)
  let waistLimit = 90
  if (form.gender === '女') {
    waistLimit = 85
  }
  if (waist && waist >= waistLimit) {
    score = score + 4
    risks.push('腰围超标（' + waist + 'cm）')
  }

  // 家族史
  if (form.family) {
    score = score + 5
    risks.push('直系亲属有糖尿病')
  }

  // 血压
  if (form.bp === '高血压') {
    score = score + 6
    risks.push('高血压')
  } else if (form.bp === '偏高') {
    score = score + 3
    risks.push('血压偏高')
  }

  // 血糖
  if (form.sugar === '糖尿病') {
    score = score + 10
    risks.push('已确诊糖尿病')
  } else if (form.sugar === '偏高') {
    score = score + 5
    risks.push('血糖偏高')
  }

  // 运动
  if (form.exercise === '几乎不运动') {
    score = score + 4
    risks.push('几乎不运动')
  } else if (form.exercise === '很少运动') {
    score = score + 4
    risks.push('运动不足')
  }

  // 饮食
  if (form.diet === '偏油腻') {
    score = score + 3
    risks.push('饮食偏油腻/甜食')
  } else if (form.diet === '不规律') {
    score = score + 3
    risks.push('饮食不规律')
  }

  let level = '低危'
  let tagType = 'success'
  if (score >= 20) {
    level = '高危'
    tagType = 'danger'
  } else if (score >= 10) {
    level = '中危'
    tagType = 'warning'
  }

  advice.push('控制总热量摄入，减少高糖、高油、精制主食。')
  advice.push('每周至少150分钟中等强度运动，如快走、慢跑。')
  advice.push('定期监测空腹及餐后血糖，必要时做糖耐量检查。')
  if (bmi >= 24) {
    advice.push('逐步控制体重，把BMI维持在18.5-23.9之间。')
  }

  result.value = {
    score: score,
    level: level,
    tagType: tagType,
    risks: risks,
    advice: advice
  }
}

// 重新填
function reset() {
  form.gender = '男'
  form.age = ''
  form.height = ''
  form.weight = ''
  form.waist = ''
  form.family = false
  form.bp = '正常'
  form.sugar = '正常'
  form.exercise = '每周3次以上'
  form.diet = '均衡'
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
  font-size: 4vw;
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
.result-level {
  font-size: 5vw;
  font-weight: 600;
  margin: 0;
  color: #127A90;
}
.block {
  margin-top: 3vw;
}
.block-title {
  font-size: 3.8vw;
  font-weight: 600;
  margin: 0 0 1vw;
}
.risk-list, .advice-list {
  padding-left: 5vw;
  font-size: 3.3vw;
  color: #555;
}
.risk-list li, .advice-list li {
  margin-bottom: 1.5vw;
}
.disclaimer {
  font-size: 3vw;
  color: #999;
  padding: 3vw;
}
</style>
