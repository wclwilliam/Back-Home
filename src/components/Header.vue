<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

//回首頁
const router = useRouter()
const goHome = () => {
  router.push('/')
}

//動態渲染nav
const menuItems = [
  { text: '關於協會', path: '/about' },
  { text: '最新消息', path: '/News' },
  { text: '認識海龜', path: '/guide' },
  { text: '海洋守護', path: '/game' },
  { text: '志工活動', path: '/activity' },
  { text: '支持保育', path: '/donation' },
]

//漢堡選單
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header>
    <div class="container">
      <div class="headerLogo" @click="goHome">
        <img src="/BackHomeLogo.png" alt="Logo" />
      </div>
      <div class="functionWrapper">
        <nav class="navHeader" :class="{ showMenu: isMenuOpen }">
          <ul>
            <li v-for="item in menuItems" :key="item.path" @click="isMenuOpen = false">
              <RouterLink :to="item.path">{{ item.text }}</RouterLink>
            </li>
          </ul>
        </nav>
        <RouterLink to="/member"
          ><span class="material-symbols-outlined icon-white"> account_circle </span></RouterLink
        >
        <div class="hamburger" :class="{ isActive: isMenuOpen }" @click="toggleMenu">
          <span class="material-symbols-outlined icon-white">{{
            isMenuOpen ? 'close' : 'menu'
          }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss"></style>
