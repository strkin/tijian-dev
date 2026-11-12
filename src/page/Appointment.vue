<template>
<div class="page">
    <div style="display: flex;">
        <el-button type="primary" :icon="ArrowLeftBold" @click="router.back()" style="margin-right: 25vw;background-color: white;color: black;border: none;"/>
        <p style="margin-left:0vw;font-size:5vw;;">用户体检预约</p>
    </div>
    <div style="width: 100%;height: 100vw;display: flex;margin-top: 2vw;margin-bottom: 4vw;">
        <img src="@/img/yuyue.png">
    </div>
    <div style="display: flex;margin-top: 10vw;padding: 0 3.6vw;justify-content: space-between;">
        <img src="@/img/benrenyuyue.png" @click="goHospital" style="width: 44vw;border-radius: 1.6vw;display: block;cursor: pointer;">
        <img src="@/img/jiashuyuyue.png" @click="goFamily" style="width: 44vw;border-radius: 1.6vw;display: block;cursor: pointer;">
    </div>
</div>
</template>
<script setup>
import{ArrowLeftBold} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref,computed } from 'vue'
import yuyue from "@/img/yuyue.png"


let router = useRouter()

// 本人预约，选医院
function goHospital() {
    router.push('/Hospital')
}

// 家属预约，先选家属
function goFamily() {
    router.push('/FamilyMember')
}
</script>
<style scoped>
.page {
  height: 100vh;
  overflow-y: auto;
}
/* 图片都是写死的，后面再改 */
</style>
