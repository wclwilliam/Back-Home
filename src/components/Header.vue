<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { MENU_ITEMS } from '@/config/menu.js'

//回首頁
const router = useRouter()
const goHome = () => {
  router.push('/')
}

//動態渲染nav
const menuItems = MENU_ITEMS

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
        <img src="/BackHomeLogo.png" alt="Back Home Logo" />
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

<style scoped lang="scss">
@import '@/assets/scss/layouts/header.scss';
</style>
