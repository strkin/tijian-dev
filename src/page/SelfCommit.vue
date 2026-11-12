<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">新冠自测评估</p>
  </div>

  <div class="card">
    <h4>基本信息</h4>
    <el-form :model="form" label-width="20vw">
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
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
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" placeholder="请输入11位手机号" maxlength="11"
          @input="form.phone = form.phone.replace(/\D/g, '')" />
      </el-form-item>
      <el-form-item label="所在地区">
        <el-input v-model="form.region" placeholder="请输入所在地区" />
      </el-form-item>
    </el-form>
  </div>

  <div class="card">
    <h4>症状情况</h4>
    <el-checkbox-group v-model="form.symptoms">
      <el-checkbox v-for="s in symptoms" :key="s.key" :label="s.label" :value="s.key" />
    </el-checkbox-group>
    <div class="row">
      <span class="label">体温(℃)</span>
      <el-input v-model="form.temp" placeholder="如 36.5" style="width:40vw;"
        @input="form.temp = form.temp.replace(/[^\d.]/g, '')" />
    </div>
    <div class="row">
      <span class="label">症状天数</span>
      <el-input v-model="form.days" placeholder="如 3 天" style="width:40vw;"
        @input="form.days = form.days.replace(/\D/g, '')" />
    </div>
  </div>

  <div class="card">
    <h4>流行病学史</h4>
    <el-checkbox-group v-model="form.contacts">
      <el-checkbox v-for="c in contacts" :key="c.key" :label="c.label" :value="c.key" />
    </el-checkbox-group>
  </div>

  <div class="btn-group">
    <el-button type="primary" @click="submit">开始评估</el-button>
    <el-button @click="reset">重新测评</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <el-tag :type="result.tagType">{{ result.level }}</el-tag>
      <p class="conclusion">{{ result.conclusion }}</p>
    </div>
    <p class="advice-title">建议：</p>
    <ul class="advice">
      <li v-for="(a, i) in result.advice" :key="i">{{ a }}</li>
    </ul>
    <el-button type="primary" plain style="margin-top:2vw;" @click="router.push('/FreeConsultation')">转免费咨询</el-button>
  </div>

  <p class="disclaimer">注：本测评仅为初步自我判断，不能替代医生诊断，如有不适请及时就医。</p>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

let router = useRouter()
let result = ref(null)

// 症状，key是英文的，用来判断，label是页面上显示的字
let symptoms = [
  { key: 'fever', label: '发热' },
  { key: 'dryCough', label: '干咳' },
  { key: 'fatigue', label: '乏力' },
  { key: 'soreThroat', label: '咽痛' },
  { key: 'runnyNose', label: '鼻塞流涕' },
  { key: 'chestTight', label: '胸闷' },
  { key: 'breathless', label: '呼吸困难' },
  { key: 'musclePain', label: '肌肉酸痛' },
  { key: 'diarrhea', label: '腹泻' },
  { key: 'smellLoss', label: '嗅觉/味觉减退' }
]

// 接触史
let contacts = [
  { key: 'contactFever', label: '近14天接触过发热/呼吸道症状人员' },
  { key: 'confirmed', label: '接触过确诊/疑似病例' },
  { key: 'gathering', label: '参加过聚集性活动' }
]

// 表单
let form = reactive({
  name: '',
  gender: '男',
  age: '',
  phone: '',
  region: '',
  temp: '',
  days: '',
  symptoms: [],
  contacts: []
})

// 有没有选这个症状
function hasSymptom(key) {
  for (let i = 0; i < form.symptoms.length; i++) {
    if (form.symptoms[i] === key) {
      return true
    }
  }
  return false
}

// 有没有这段接触史
function hasContact(key) {
  for (let i = 0; i < form.contacts.length; i++) {
    if (form.contacts[i] === key) {
      return true
    }
  }
  return false
}

// 开始评估
function submit() {
  console.log('开始评估', form)
  if (form.phone) {
    if (!/^1\d{10}$/.test(form.phone)) {
      alert('手机号格式不正确，请输入11位手机号')
      return
    }
  }

  let highTemp = false
  if (Number(form.temp) >= 38.5) {
    highTemp = true
  }

  let severe = false
  if (hasSymptom('breathless')) {
    severe = true
  }
  if (hasSymptom('chestTight')) {
    severe = true
  }

  let symptomCount = form.symptoms.length

  let level = 'low'
  if (severe) {
    level = 'high'
  } else if (hasContact('confirmed') && highTemp) {
    level = 'high'
  } else if (highTemp && symptomCount >= 3) {
    level = 'high'
  } else if (highTemp) {
    level = 'medium'
  } else if (symptomCount >= 2) {
    level = 'medium'
  } else if (hasContact('confirmed')) {
    level = 'medium'
  } else if (hasContact('contactFever')) {
    level = 'medium'
  }

  if (level == 'high') {
    result.value = {
      level: '高风险',
      tagType: 'danger',
      conclusion: '您的症状或接触史存在较高感染风险，建议尽快就医。',
      advice: [
        '请尽快前往发热门诊或线下医院就诊，途中全程佩戴口罩。',
        '避免乘坐公共交通工具，与他人保持距离。',
        '主动告知医生症状、体温及相关接触史。'
      ]
    }
  } else if (level == 'medium') {
    result.value = {
      level: '中风险',
      tagType: 'warning',
      conclusion: '您存在部分相关症状或接触史，建议进一步咨询观察。',
      advice: [
        '建议线上咨询医生或就近就诊，居家观察并每日监测体温。',
        '注意休息、多饮水，清淡饮食，做好个人防护与居家消毒。',
        '如症状加重或出现胸闷、呼吸困难，请立即就医。'
      ]
    }
  } else {
    result.value = {
      level: '低风险',
      tagType: 'success',
      conclusion: '暂无明显相关风险，请继续做好日常防护。',
      advice: [
        '保持规律作息，勤洗手、多通风，出入人员密集场所佩戴口罩。',
        '如后续出现发热、咳嗽等不适，请及时再次测评或就医。'
      ]
    }
  }
}

// 重新填
function reset() {
  form.name = ''
  form.age = ''
  form.phone = ''
  form.region = ''
  form.temp = ''
  form.days = ''
  form.symptoms = []
  form.contacts = []
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
.row {
  display: flex;
  align-items: center;
  margin-top: 3vw;
}
.label {
  width: 20vw;
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
.result {
  margin-top: 2vw;
}
.result-head {
  display: flex;
  align-items: center;
  gap: 3vw;
}
.conclusion {
  font-size: 3.8vw;
  margin: 0;
}
.advice-title {
  font-size: 3.5vw;
  margin: 3vw 0 1vw;
}
.advice {
  padding-left: 5vw;
  font-size: 3.3vw;
  color: #555;
}
.advice li {
  margin-bottom: 1.5vw;
}
.disclaimer {
  font-size: 3vw;
  color: #999;
  padding: 3vw;
}
</style>
