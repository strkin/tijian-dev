<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p class="header-title">寿命计算器</p>
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

  <div class="btn-group">
    <el-button type="primary" @click="calculate">开始测算</el-button>
    <el-button @click="reset">重新填写</el-button>
  </div>

  <div class="card result" v-if="result">
    <div class="result-head">
      <p class="result-age">预计寿命 {{ result.age }} 岁</p>
      <el-tag :type="result.tagType">{{ result.level }}</el-tag>
    </div>
    <p class="bmi" v-if="result.bmi">当前 BMI：{{ result.bmi }}（{{ result.bmiText }}）</p>
  </div>

  <p class="disclaimer">注：本测算基于通用统计模型估算，仅供健康参考，不能替代医生诊断。</p>
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
  job: '久坐办公',
  smoke: '不吸烟',
  drink: '不饮酒',
  exercise: '每周3次以上',
  sleep: '一般',
  diet: '均衡',
  stress: '一般'
})

// 开始算
function calculate() {
  console.log('开始测算', form)
  if (!form.age || !form.height || !form.weight) {
    alert('请先填写年龄、身高、体重')
    return
  }

  let base = 76
  if (form.gender === '女') {
    base = 81
  }
  let years = 0

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
    years = years - 4
    bmiText = '肥胖'
  } else if (bmiNum >= 24) {
    years = years - 2
    bmiText = '超重'
  } else if (bmiNum < 18.5) {
    bmiText = '偏瘦'
  } else {
    years = years + 1
  }

  // 吸烟
  if (form.smoke === '经常吸烟') {
    years = years - 5
  } else if (form.smoke === '偶尔吸烟') {
    years = years - 2
  } else if (form.smoke === '已戒烟') {
    years = years + 1
  }

  // 饮酒
  if (form.drink === '经常饮酒') {
    years = years - 3
  } else if (form.drink === '偶尔饮酒') {
    years = years - 1
  }

  // 运动
  if (form.exercise === '每天运动') {
    years = years + 2
  } else if (form.exercise === '每周3次以上') {
    years = years + 1
  } else if (form.exercise === '很少运动') {
    years = years - 2
  } else {
    years = years - 4
  }

  // 睡眠
  if (form.sleep === '充足') {
    years = years + 1
  } else if (form.sleep === '不足') {
    years = years - 2
  }

  // 饮食
  if (form.diet === '均衡') {
    years = years + 1
  } else if (form.diet === '偏油腻') {
    years = years - 2
  } else {
    years = years - 2
  }

  // 压力
  if (form.stress === '较低') {
    years = years + 1
  } else if (form.stress === '较高') {
    years = years - 2
  }

  let predict = Math.round(base + years)
  if (predict < 55) {
    predict = 55
  }
  if (predict > 100) {
    predict = 100
  }

  let level = '良好'
  let tagType = 'success'
  if (predict < 70) {
    level = '风险偏高'
    tagType = 'danger'
  } else if (predict < 78) {
    level = '一般'
    tagType = 'warning'
  }

  result.value = {
    age: predict,
    bmi: bmi,
    bmiText: bmiText,
    level: level,
    tagType: tagType
  }
}

// 重新填
function reset() {
  form.gender = '男'
  form.age = ''
  form.height = ''
  form.weight = ''
  form.job = '久坐办公'
  form.smoke = '不吸烟'
  form.drink = '不饮酒'
  form.exercise = '每周3次以上'
  form.sleep = '一般'
  form.diet = '均衡'
  form.stress = '一般'
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
.result-age {
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
.disclaimer {
  font-size: 3vw;
  color: #999;
  padding: 3vw;
}
</style>
