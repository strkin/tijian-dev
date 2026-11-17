<template>
  <header class="app-header">
    <i class="fa fa-angle-left back" @click="goBack"></i>
    <p class="title">{{ title }}</p>
    <div class="right-slot"><slot name="right" /></div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
defineProps({ title: String })
const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped>
.app-header {
  width: 100%;
  max-width: 750px;
  height: 56px;
  background-color: #FFF;
  position: fixed;
  left: 0; top: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 14px;
  border-bottom: solid 1px #EFEFEF;
}
.app-header .back { font-size: 28px; color: #333; cursor: pointer; }
.app-header .title { font-size: 17px; color: #333; font-weight: 600; }
.app-header .right-slot { width: 28px; }
</style>
