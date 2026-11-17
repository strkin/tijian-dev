<script setup>
</script>

<template>
  <router-view />
</template>

<style>
html, body, div, span, h1, h2, h3, h4, h5, h6, ul, ol, li, p {
  margin: 0;
  padding: 0;
}
html, body {
  width: 100%;
  min-height: 100%;
  font-family: "微软雅黑";
  background-color: #F7F9FA;
}
ul, ol { list-style: none; }
a { text-decoration: none; }
input { outline: none; border: none; }
button { cursor: pointer; border: none; }
#app {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #F7F9FA;
}
</style>
