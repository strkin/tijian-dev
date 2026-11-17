<template>
<div style="display: flex;">
    <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 30vw;background-color: white;color: black;border: none;"/>
    <p style="margin-left:0vw;font-size:5vw;">慢病管理</p>
</div>
<div class="card">
    <el-button @click="goMyFile">我的档案</el-button>
    <div style="display: flex;">

        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="血压">
                <template #default="scope">
                    <div contenteditable="true" @blur="editCell(scope.row, '血压', $event)">{{ scope.row.血压 }}</div>

                </template>
            </el-table-column>
            <el-table-column label="血糖">
                <template #default="scope">
                    <div contenteditable="true" @blur="editCell(scope.row, '血糖', $event)">{{ scope.row.血糖 }}</div>

                </template>
            </el-table-column>
            <el-table-column label="体重">
                <template #default="scope">
                    <div contenteditable="true" @blur="editCell(scope.row, '体重', $event)">{{ scope.row.体重 }}</div>

                </template>
            </el-table-column>
            <el-table-column prop="时间" label="时间">

            </el-table-column>
        </el-table>
    </div>
    <div >
        <p>下次复诊日期：2026-12-03</p>
    </div>
</div>


</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref,computed } from 'vue'

let router = useRouter()

// 表格数据
let tableData = [
    {
        血压: "",
        血糖: "",
        体重: "",
        时间: ""
    }
]

// 改完格子以后把时间也更新一下
function editCell(row, field, event) {
  row[field] = event.target.textContent
  let d = new Date()
  let month = d.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = d.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = d.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let minute = d.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  row.时间 = d.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute
  console.log('改好了：', row)
}

// 跳转到我的档案
function goMyFile() {
  router.push('/MyFile')
}

</script>
