<template>
<div class="page">
  <div class="header">
    <el-button :icon="ArrowLeftBold" @click="router.back()" style="background:white;border:none;" />
    <p style="font-size:5vw;">选择家属</p>
  </div>

  <div class="member-list">
    <div v-for="(m, i) in members" :key="i" class="member-row"
         :class="{ active: selected.name === m.name }"
         @click="selectMember(m)">
      <div class="avatar">{{ m.name.charAt(0) }}</div>
      <div class="member-info">
        <p class="member-name">{{ m.name }}</p>
        <p class="member-sub">{{ m.relation }} · {{ m.gender }} · {{ m.age }}岁</p>
      </div>
      <el-tag v-if="selected.name === m.name" type="success">已选</el-tag>
    </div>

    <div class="add-row" @click="openAdd">
      <span class="add-icon">＋</span>
      <span>新增家属</span>
    </div>
  </div>

  <el-button type="primary" class="next-btn" @click="next">下一步</el-button>

  <el-dialog v-model="dialogVisible" title="新增家属" width="90%">
    <el-form :model="form" label-width="20vw">
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入家属姓名" />
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
      <el-form-item label="关系">
        <el-select v-model="form.relation" placeholder="请选择与本人关系" style="width:100%;">
          <el-option label="父亲" value="父亲" />
          <el-option label="母亲" value="母亲" />
          <el-option label="配偶" value="配偶" />
          <el-option label="子女" value="子女" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="form.phone" placeholder="请输入11位手机号" maxlength="11"
          @input="form.phone = form.phone.replace(/\D/g, '')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveMember">保存</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

let router = useRouter()
let selected = ref({})
let dialogVisible = ref(false)

// 已经有的家属
let members = ref([
  { name: '王秀兰', relation: '母亲', gender: '女', age: 58, phone: '13800000001' },
  { name: '李建国', relation: '父亲', gender: '男', age: 60, phone: '13800000002' }
])

// 新增家属的表单
let form = reactive({
  name: '',
  gender: '男',
  age: '',
  relation: '',
  phone: ''
})

// 选中一个家属
function selectMember(m) {
  if (selected.value.name === m.name) {
    selected.value = {}
  } else {
    selected.value = m
  }
}

// 打开新增弹窗
function openAdd() {
  form.name = ''
  form.gender = '男'
  form.age = ''
  form.relation = ''
  form.phone = ''
  dialogVisible.value = true
}

// 保存家属
function saveMember() {
  if (!form.name) {
    alert('请输入家属姓名')
    return
  }
  if (!form.relation) {
    alert('请选择与本人关系')
    return
  }
  if (!form.age) {
    alert('请输入年龄')
    return
  }
  if (!/^1\d{10}$/.test(form.phone)) {
    alert('手机号格式不正确，请输入11位手机号')
    return
  }
  let obj = {
    name: form.name,
    gender: form.gender,
    age: form.age,
    relation: form.relation,
    phone: form.phone
  }
  members.value.push(obj)
  selected.value = obj
  dialogVisible.value = false
  console.log('新增了家属：' + form.name)
}

// 下一步去选医院
function next() {
  if (!selected.value.name) {
    alert('请先选择一位家属')
    return
  }
  router.push({
    path: '/Hospital',
    query: {
      name: selected.value.name,
      relation: selected.value.relation,
      gender: selected.value.gender,
      age: selected.value.age,
      phone: selected.value.phone
    }
  })
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
.member-list {
  padding: 3vw;
}
.member-row {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 2vw;
  padding: 3.5vw;
  margin-bottom: 3vw;
}
.member-row.active {
  border-color: #127A90;
  background: #e8f4f8;
}
.avatar {
  width: 12vw;
  height: 12vw;
  border-radius: 50%;
  background: #127A90;
  color: #fff;
  text-align: center;
  line-height: 12vw;
  font-size: 4.5vw;
  margin-right: 3vw;
}
.member-info {
  flex: 1;
}
.member-name {
  font-size: 4vw;
  margin: 0;
}
.member-sub {
  font-size: 3.2vw;
  color: #888;
  margin: 1vw 0 0;
}
.add-row {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #127A90;
  border-radius: 2vw;
  padding: 3.5vw;
  color: #127A90;
  font-size: 3.8vw;
}
.add-icon {
  font-size: 5vw;
  margin-right: 2vw;
}
.next-btn {
  width: 90%;
  margin: 4vw 5vw;
}
</style>
