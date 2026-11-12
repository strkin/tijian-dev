<template>
<div style="display: flex;">
    <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
    <p style="margin-left:0vw;font-size:5vw;">我的档案</p>
</div>
<el-table :data="tableData" border style="width:100%;display: flex;">
  <el-table-column prop="label" label="项目" />
  <el-table-column prop="value" label="内容" />
</el-table>



</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref,computed } from 'vue'
import { reactive } from 'vue'

let router = useRouter()

// 档案数据，先写死
let tableData = [
  { label: '性别', value: '男' },
  { label: '年龄', value: '45' },
  { label: '身高', value: '175cm' },
  { label: '体重', value: '70kg' },
  { label: '病史', value: '高血压5年' },
  { label: '用药', value: '硝苯地平缓释片' },
  { label: '过敏史', value: '青霉素' },
]

// 这个保存按钮页面上没有，先放着
function save() {
  console.log('保存')
  alert('保存成功')
}

// 以后要能编辑，用这个
// function edit() {
//   console.log('编辑')
// }
</script>
