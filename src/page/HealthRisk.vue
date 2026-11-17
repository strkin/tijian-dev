<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">健康风险评估</p>
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
        <el-input v-model="form.waist" placeholder="如 80" maxlength="3"
          @input="form.waist = form.waist.replace(/\D/g, '')" />
      </el-form-item>
      <el-form-item label="职业">
        <el-select v-model="form.job" style="width:100%;">
          <el-option label="久坐办公" value="久坐办公" />
          <el-option label="轻度活动" value="轻度活动" />
          <el-option label="体力劳动" value="体力劳动" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>生活方式</h4>
    <el-form :model="form" label-width="22vw">
      <el-form-item label="吸烟">
        <el-select v-model="form.smoke" style="width:100%;">
          <el-option label="不吸烟" value="不吸烟" />
          <el-option label="已戒烟" value="已戒烟" />
          <el-option label="偶尔吸烟" value="偶尔吸烟" />
          <el-option label="经常吸烟" value="经常吸烟" />
        </el-select>
      </el-form-item>
      <el-form-item label="饮酒">
        <el-select v-model="form.drink" style="width:100%;">
          <el-option label="不饮酒" value="不饮酒" />
          <el-option label="偶尔饮酒" value="偶尔饮酒" />
          <el-option label="经常饮酒" value="经常饮酒" />
        </el-select>
      </el-form-item>
      <el-form-item label="运动">
        <el-select v-model="form.exercise" style="width:100%;">
          <el-option label="每天运动" value="每天运动" />
          <el-option label="每周3次以上" value="每周3次以上" />
          <el-option label="很少运动" value="很少运动" />
          <el-option label="几乎不运动" value="几乎不运动" />
        </el-select>
      </el-form-item>
      <el-form-item label="睡眠">
        <el-select v-model="form.sleep" style="width:100%;">
          <el-option label="充足(7-8小时)" value="充足" />
          <el-option label="一般" value="一般" />
          <el-option label="不足" value="不足" />
        </el-select>
      </el-form-item>
      <el-form-item label="饮食">
        <el-select v-model="form.diet" style="width:100%;">
          <el-option label="荤素均衡" value="均衡" />
          <el-option label="偏油腻/甜食" value="偏油腻" />
          <el-option label="不规律" value="不规律" />
        </el-select>
      </el-form-item>
      <el-form-item label="压力">
        <el-select v-model="form.stress" style="width:100%;">
          <el-option label="较低" value="较低" />
          <el-option label="一般" value="一般" />
          <el-option label="较高" value="较高" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>体检指标</h4>
    <el-form :model="form" label-width="22vw">
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
      <el-form-item label="血脂">
        <el-select v-model="form.lipid" style="width:100%;">
          <el-option label="正常" value="正常" />
          <el-option label="偏高" value="偏高" />
          <el-option label="高血脂" value="高血脂" />
        </el-select>
      </el-form-item>
      <el-form-item label="心率(次/分)">
        <el-input v-model="form.heartRate" placeholder="如 72" maxlength="3"
          @input="form.heartRate = form.heartRate.replace(/\D/g, '')" />
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>病史与家族史</h4>
    <el-form :model="form" label-width="22vw">
      <el-form-item label="既往病史">
        <el-checkbox-group v-model="form.chronic">
          <el-checkbox label="高血压" value="高血压" />
          <el-checkbox label="糖尿病" value="糖尿病" />
          <el-checkbox label="心脏病" value="心脏病" />
          <el-checkbox label="高血脂" value="高血脂" />
          <el-checkbox label="肿瘤" value="肿瘤" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="家族病史">
        <el-checkbox-group v-model="form.family">
          <el-checkbox label="高血压家族史" value="高血压家族史" />
          <el-checkbox label="糖尿病家族史" value="糖尿病家族史" />
          <el-checkbox label="心脏病家族史" value="心脏病家族史" />
          <el-checkbox label="肿瘤家族史" value="肿瘤家族史" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>

  <div class="btn-group">
    <el-button type="primary" @click="assess">开始评估</el-button>
    <el-button @click="reset">重新填写</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <p class="result-score">健康评分 {{ result.score }} 分</p>
      <el-tag :type="result.tagType">{{ result.level }}</el-tag>
    </div>
    <p class="bmi" v-if="result.bmi">当前 BMI：{{ result.bmi }}（{{ result.bmiText }}）</p>

    <div class="block" v-if="result.diseases.length">
      <p class="block-title">慢病风险提示</p>
      <div class="disease-row" v-for="(d, i) in result.diseases" :key="i">
        <span>{{ d.name }}</span>
        <el-tag :type="d.tagType" size="small">{{ d.level }}</el-tag>
      </div>
    </div>

    <div class="block" v-if="result.risks.length">
      <p class="block-title">主要风险因素</p>
      <ul class="risk-list">
        <li v-for="(r, i) in result.risks" :key="i">{{ r }}</li>
      </ul>
    </div>

    <div class="block">
      <p class="block-title">改善建议</p>
      <ul class="advice-list">
        <li v-for="(a, i) in result.advice" :key="i">{{ a }}</li>
      </ul>
    </div>

    <el-button type="primary" plain style="margin-top:2vw;" @click="router.push('/FreeConsultation')">转免费咨询</el-button>
  </div>

  <p class="disclaimer">注：本评估为健康风险参考，不能替代医生诊断，如有异常请及时就医。</p>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

let router = useRouter()
let result = ref(null)

// 表单数据
let form = reactive({
  gender: '男',
  age: '',
  height: '',
  weight: '',
  waist: '',
  job: '久坐办公',
  smoke: '不吸烟',
  drink: '不饮酒',
  exercise: '每周3次以上',
  sleep: '一般',
  diet: '均衡',
  stress: '一般',
  bp: '正常',
  sugar: '正常',
  lipid: '正常',
  heartRate: '',
  chronic: [],
  family: []
})

// 开始评估
function assess() {
  console.log('开始评估', form)
  if (!form.age || !form.height || !form.weight) {
    alert('请先填写年龄、身高、体重')
    return
  }

  let score = 100
  let risks = []
  let advice = []

  // BMI
  let h = Number(form.height) / 100
  let w = Number(form.weight)
  let bmi = '0'
  if (h > 0) {
    bmi = (w / (h * h)).toFixed(1)
  }
  let bmiNum = Number(bmi)
  let bmiText = '正常'
  if (bmiNum >= 28) {
    score = score - 12
    bmiText = '肥胖'
    risks.push('肥胖（BMI ' + bmi + '）')
    advice.push('控制体重，减少高热量饮食，坚持规律运动。')
  } else if (bmiNum >= 24) {
    score = score - 6
    bmiText = '超重'
    risks.push('超重（BMI ' + bmi + '）')
    advice.push('适当减重，控制主食与油脂摄入。')
  } else if (bmiNum < 18.5) {
    bmiText = '偏瘦'
  } else {
    score = score + 2
  }

  // 吸烟
  if (form.smoke === '经常吸烟') {
    score = score - 10
    risks.push('经常吸烟')
    advice.push('建议戒烟，降低心肺及心血管疾病风险。')
  } else if (form.smoke === '偶尔吸烟') {
    score = score - 4
    risks.push('偶尔吸烟')
  } else if (form.smoke === '已戒烟') {
    score = score + 2
  }

  // 饮酒
  if (form.drink === '经常饮酒') {
    score = score - 6
    risks.push('经常饮酒')
    advice.push('限制饮酒，避免空腹饮酒。')
  } else if (form.drink === '偶尔饮酒') {
    score = score - 2
  }

  // 运动
  if (form.exercise === '每天运动') {
    score = score + 3
  } else if (form.exercise === '每周3次以上') {
    score = score + 1
  } else if (form.exercise === '很少运动') {
    score = score - 5
    risks.push('运动不足')
    advice.push('每周至少3次中等强度运动，每次30分钟以上。')
  } else {
    score = score - 8
    risks.push('几乎不运动')
    advice.push('尽快开始规律运动，从快走、慢跑等低强度项目起步。')
  }

  // 睡眠
  if (form.sleep === '充足') {
    score = score + 2
  } else if (form.sleep === '不足') {
    score = score - 5
    risks.push('睡眠不足')
    advice.push('保证每天7-8小时睡眠，规律作息。')
  }

  // 饮食
  if (form.diet === '均衡') {
    score = score + 2
  } else if (form.diet === '偏油腻') {
    score = score - 5
    risks.push('饮食偏油腻')
    advice.push('低盐低脂高纤维，多吃蔬菜水果。')
  } else {
    score = score - 5
    risks.push('饮食不规律')
    advice.push('三餐定时定量，避免暴饮暴食。')
  }

  // 压力
  if (form.stress === '较低') {
    score = score + 2
  } else if (form.stress === '较高') {
    score = score - 5
    risks.push('压力较高')
    advice.push('学会放松调节，必要时寻求心理疏导。')
  }

  // 血压
  if (form.bp === '高血压') {
    score = score - 10
    risks.push('高血压')
    advice.push('规律监测血压，遵医嘱服药，低盐饮食。')
  } else if (form.bp === '偏高') {
    score = score - 5
    risks.push('血压偏高')
  }

  // 血糖
  if (form.sugar === '糖尿病') {
    score = score - 10
    risks.push('糖尿病')
    advice.push('控制血糖，定期复查，规范饮食与用药。')
  } else if (form.sugar === '偏高') {
    score = score - 5
    risks.push('血糖偏高')
  }

  // 血脂
  if (form.lipid === '高血脂') {
    score = score - 10
    risks.push('高血脂')
    advice.push('低脂饮食，必要时遵医嘱调脂治疗。')
  } else if (form.lipid === '偏高') {
    score = score - 5
    risks.push('血脂偏高')
  }

  // 既往病史
  for (let i = 0; i < form.chronic.length; i++) {
    score = score - 8
    risks.push('既往病史：' + form.chronic[i])
  }

  // 家族病史
  for (let j = 0; j < form.family.length; j++) {
    score = score - 3
    risks.push('家族史：' + form.family[j])
  }

  if (score < 0) {
    score = 0
  }
  if (score > 100) {
    score = 100
  }

  let level = '低危'
  let tagType = 'success'
  if (score < 60) {
    level = '高危'
    tagType = 'danger'
  } else if (score < 80) {
    level = '中危'
    tagType = 'warning'
  }

  // 慢病风险提示
  let diseases = []
  if (form.bp === '高血压' || form.chronic.includes('高血压')) {
    diseases.push({ name: '高血压', level: '高风险', tagType: 'danger' })
  } else if (form.bp === '偏高' || form.family.includes('高血压家族史') || bmiNum >= 24) {
    diseases.push({ name: '高血压', level: '需关注', tagType: 'warning' })
  }
  if (form.sugar === '糖尿病' || form.chronic.includes('糖尿病')) {
    diseases.push({ name: '糖尿病', level: '高风险', tagType: 'danger' })
  } else if (form.sugar === '偏高' || form.family.includes('糖尿病家族史') || bmiNum >= 28) {
    diseases.push({ name: '糖尿病', level: '需关注', tagType: 'warning' })
  }
  if (form.lipid === '高血脂' || form.chronic.includes('高血脂')) {
    diseases.push({ name: '高血脂', level: '高风险', tagType: 'danger' })
  } else if (form.lipid === '偏高' || form.diet === '偏油腻') {
    diseases.push({ name: '高血脂', level: '需关注', tagType: 'warning' })
  }
  if (form.smoke === '经常吸烟' || form.bp === '高血压' || form.family.includes('心脏病家族史') || form.chronic.includes('心脏病')) {
    diseases.push({ name: '心血管疾病', level: '需关注', tagType: 'warning' })
  }

  if (advice.length == 0) {
    advice.push('继续保持当前健康的生活方式。')
  }

  result.value = {
    score: score,
    bmi: bmi,
    bmiText: bmiText,
    level: level,
    tagType: tagType,
    diseases: diseases,
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
  form.job = '久坐办公'
  form.smoke = '不吸烟'
  form.drink = '不饮酒'
  form.exercise = '每周3次以上'
  form.sleep = '一般'
  form.diet = '均衡'
  form.stress = '一般'
  form.bp = '正常'
  form.sugar = '正常'
  form.lipid = '正常'
  form.heartRate = ''
  form.chronic = []
  form.family = []
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
.result-score {
  font-size: 5vw;
  font-weight: 600;
  margin: 0;
  color: #127A90;
}
.bmi {
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
.disease-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5vw 0;
  font-size: 3.5vw;
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
