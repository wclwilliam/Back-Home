<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header>
    <div class="container">
      <div class="HeaderLogo" @click="goHome">
        <img src="/public/BackHomeLogo.png" />
      </div>
      <div class="functionWrapper">
        <nav class="navHeader">
          <ul>
            <li><RouterLink to="/about">關於協會</RouterLink></li>
            <li><RouterLink to="/News">最新消息</RouterLink></li>
            <li><RouterLink to="/guide">認識海龜</RouterLink></li>
            <li><RouterLink to="/game">海洋守護</RouterLink></li>
            <li><RouterLink to="/activity">志工活動</RouterLink></li>
            <li><RouterLink to="/donation">支持保育</RouterLink></li>
          </ul>
          <!-- <li><RouterLink to="/product">Product</RouterLink></li> -->
        </nav>
        <RouterLink to="/member"
          ><span class="material-symbols-outlined icon-white"> account_circle </span></RouterLink
        >
        <div class="hamburger">
          <span class="material-symbols-outlined icon-white">menu</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.icon-white {
  @include icon-style($color: $text-white);
}
.headerLogo {
  cursor: pointer;
}
</style>

<style scoped lang="scss"></style>
