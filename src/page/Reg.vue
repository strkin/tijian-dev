<template>
    <div style="margin: auto;margin-bottom: 3vh;">
        <el-button type="primary" :icon="ArrowLeftBold" @click="router.push('/login')" style="margin-right: 30vw;"/>
        注册
    </div>
<p style="font-size: 7.4vw;">欢迎注册</p>
<el-form :model="form" label-width="auto" style="max-width:90vw;">
<el-form-item label="手机号">
    <el-input v-model="form.count" placeholder="请输入手机号"></el-input>
</el-form-item>
<el-form-item label="真实姓名">
    <el-input v-model="form.name" placeholder="真实姓名用于查看体检报告"></el-input>
</el-form-item>
<el-form-item label="生日">
    <el-date-picker type="date" v-model="form.birthday"></el-date-picker>
</el-form-item>
<el-form-item label="性别">
    <el-radio-group v-model="form.sex">
        <el-radio :value="1">男</el-radio>
        <el-radio :value="2">女</el-radio>
    </el-radio-group>
</el-form-item>
<el-form-item label="身份证号">
    <el-input v-model="form.id" placeholder="请输入身份证号" maxlength="18" show-word-limit word-limit-position="outside"></el-input>
</el-form-item>
<el-form-item label="密码">
    <el-input v-model="form.password" placeholder="请输入密码" show-password type="password"></el-input>
</el-form-item>
<el-form-item label="确认密码">
    <el-input v-model="form.confirmPassword" placeholder="请再次输入密码" show-password type="password"></el-input>
</el-form-item>
<el-button type="primary" @click="handleRegister" style="width: 92.8vw;margin: auto;margin-left: 4vw;height: 12vw;">完成</el-button>
</el-form>
</template>
<script setup>

import { reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ArrowLeftBold } from '@element-plus/icons-vue'

const router = useRouter()

const form = reactive({
    count: '',
    name: '',
    birthday: '',
    sex: 1,
    id: '',
    password: '',
    confirmPassword: ''
})

function handleRegister() {
    console.log(form)
    // 这里可以加：两次密码是否一致的校验
    // if (form.password !== form.confirmPassword) {
    //     alert('两次密码不一致')
    //     return
    // }
    router.push('/login')
}

</script>