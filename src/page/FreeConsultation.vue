<template>
<div class="page">
    <div style="display: flex;">
        <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
        <p style="margin-left:0vw;font-size:5vw;">免费咨询</p>
      </div>
    <!-- 搜索框 -->
    <el-input-tag
    v-model="input"
    placeholder="请输入症状、疾病"
    aria-label="Please click the Enter key after input"
    />
    <div style="display: flex;">
    <el-checkbox-group v-model="checkList">
    <el-checkbox label="内科" value="内科" />
    <el-checkbox label="外科" value="外科" />

    </el-checkbox-group>
    <el-checkbox v-model="showMine" label="我的问题" value="我的问题" style="margin-left: 7vw;"/>
    </div>
    <div class="question-list">
    <div class="question-item" v-for="(item, index) in filteredQuestions" :key="index">
    <p class="q-title">{{ item.title }}</p>
    <p class="q-meta">{{ item.dept }} · {{ item.time }}</p>
    <p v-if="item.answer" style="color:#127A90;">医生：{{ item.answer }}</p>
    <p v-else style="color:#e6a23c;">待回答</p>
    </div>
    </div>
    <div>
        <el-form :model="form" label-width="60px">
            <el-form-item label="科室">
            <el-select v-model="form.dept" placeholder="选择科室">
            <el-option label="内科" value="内科" />
            <el-option label="外科" value="外科" />
            </el-select>
            </el-form-item>
            <el-form-item label="症状">
            <el-input v-model="form.title" placeholder="请输入症状" />
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="setQuestion">提交</el-button>
            </el-form-item>
        </el-form>
    </div>



</div>

</template>

<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { RouterLink, useRouter } from 'vue-router'
import { ref,computed } from 'vue'
import { reactive } from 'vue'
import { addNotification } from '@/store/messages'

// 提问的表单
let form = reactive({ dept: '', title: '' })
let router = useRouter()
let input = ref()
let showMine = ref(false)

// 问题列表，先写死几条
let questions = ref([
  {title:'感冒发烧38度需要去医院吗？', dept:'内科', time:'2026-11-08', answer:'如持续高烧超过3天建议就医'},
  {title:'体检发现血压偏高怎么办？', dept:'内科', time:'2026-11-07', answer:'先低盐饮食，监测一周血压'},
  {title:'阑尾炎一定要手术吗？', dept:'外科', time:'2026-11-07', answer:''},
  {title:'甲状腺结节会癌变吗？', dept:'内科', time:'2026-11-06', answer:''},
  {title:'骨折后多久能走路？', dept:'外科', time:'2026-11-06', answer:''},
])

// 日期转成 2026-11-08
function formatDate(d) {
    let month = d.getMonth() + 1
    if (month < 10) {
        month = '0' + month
    }
    let day = d.getDate()
    if (day < 10) {
        day = '0' + day
    }
    return d.getFullYear() + '-' + month + '-' + day
}

// 提交问题
function setQuestion() {
  console.log('提交问题：' + form.title)
  let q = {
    title: form.title,
    dept: form.dept,
    time: formatDate(new Date()),
    answer: '',
    mine: true
  }
  questions.value.unshift(q)
  form.dept = ''
  form.title = ''

  // 模拟医生回复，收到回答后写入消息中心
  setTimeout(function () {
    let ans = '您好，已收到您的问题，建议补充症状持续时间，必要时及时就医。'
    q.answer = ans
    addNotification({ source: '免费咨询', title: q.title, content: ans })
  }, 1500)
}

let checkList = ref([])

// 把问题筛选出来
let filteredQuestions = computed(function () {
  let list = questions.value
  //只看我的问题
  if (showMine.value) {
    let list1 = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].mine) {
        list1.push(list[i])
      }
    }
    list = list1
  }
  // 按科室筛选
  if (checkList.value.length > 0) {
    let list2 = []
    for (let i = 0; i < list.length; i++) {
      let q = list[i]
      for (let j = 0; j < checkList.value.length; j++) {
        if (q.dept === checkList.value[j]) {
          list2.push(q)
          break
        }
      }
    }
    list = list2
  }
  // 按关键词筛选
  if (input.value && input.value.length > 0) {
    let keyword = input.value[0]
    let list3 = []
    for (let i = 0; i < list.length; i++) {
      if (list[i].title.includes(keyword)) {
        list3.push(list[i])
      }
    }
    list = list3
  }
  return list
})

// 这个没用上
let options = [
  {
    value: '内科',
    label: '内科',
  },
  {
    value: '外科',
    label: '外科',
  },
  {
    value: '我的问题',
    label: '我的问题',
  }
]

</script>
<style scoped>
.question-list {
  padding: 10px;
}
.question-item {
  background: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}
.q-title {
  font-size: 4vw;
  font-weight: 500;
  margin: 0 0 5px;
}
.q-meta {
  font-size: 3vw;
  color: #999;
  margin: 0;
}

</style>
