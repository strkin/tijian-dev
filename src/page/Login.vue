<template>
<div class="wrapper">
    <p>
        体检预约-登录
    </p>
    <div class="input">
        <div>
        <el-input type="text" placeholder="请输入手机号" v-model="countIn" style="width: 80vw;padding-bottom: 2vh;padding-top: 4vh;" maxlength="11" show-word-limit word-limit-position="outside" :prefix-icon="Avatar"></el-input>
        </div>
        <div>
        <el-input type="password" placeholder="请输入密码" v-model="passwordIn" style="width: 80vw;padding-bottom: 2vh;" maxlength="16" show-password  show-word-limit :prefix-icon="Lock">
          
        </el-input>
        </div>
        <div class="text">
            <RouterLink to="/Reg" style="text-decoration: none;">注册</RouterLink>
            <RouterLink to="" style="text-decoration: none;">忘记密码？</RouterLink>
        </div>
        <el-button style="width: 80vw;color: #FFF;background-color: #70B0BC;"@click="router.push('/home')">登录</el-button>
        
    </div>

</div>
</template>
<script setup>
import { ref } from 'vue'
import { Lock, Unlock } from '@element-plus/icons-vue'
import { Avatar} from '@element-plus/icons-vue'
import { RouterLink } from 'vue-router'
const input = ref('')
const countIn = ref('')     // 手机号
const passwordIn = ref('')   // 密码


</script>
<style scoped>
.wrapper{
    height: 100%;
    width: 100%;
    background-image: linear-gradient(45deg, #266C9F, #266C9F, #7EB059);

}
p{
    color: white;
    font-size: 9.5vw;
    text-align: center;
    padding-top: 14vh;
    padding-bottom: 2vh;

}
.input{
    text-align: center;
    margin:auto;
    width: 86vw;
    height: 40vh;
    background-color: #FFF;
    border-radius: 2.4vw;
    box-sizing: border-box;
}
.text{
    display: flex;
    justify-content: space-between;
    padding-bottom: 1vh;
    margin-left: 7vw;
    margin-right: 6vw;
    text-decoration: none;
}

</style>