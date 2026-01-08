<script setup>
import { RouterLink ,useRouter } from 'vue-router'

const router = useRouter()

const goHome = ()=> {
  router.push('/');
}
</script>

<template>
  <header>
    <div class="wrapper">

      <div class="HeaderLogo" @click="goHome">
        <img src="/public/BackHomeLogo.png">
      </div>
      <nav class="HeaderLeft">
        <RouterLink to="/about">關於協會</RouterLink>
        <RouterLink to="/guide">認識海龜</RouterLink>
        <RouterLink to="/game">海洋守護</RouterLink>
        <RouterLink to="/activity">志工活動</RouterLink>
        <RouterLink to="/donation">支持保育</RouterLink>
        <RouterLink to="/member">會員中心</RouterLink>
        <RouterLink to="/product">Product</RouterLink>
      </nav>
    </div>

  </header>
</template>


<style scoped lang="scss">
  .HeaderLogo {
    cursor: pointer;
  }
</style>