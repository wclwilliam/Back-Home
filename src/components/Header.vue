<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { MENU_ITEMS } from '@/config/menu.js'
import { useAuthStore } from '@/stores/auth.js'

//回首頁
const router = useRouter()
const goHome = () => {
  router.push({ name: 'home' })
}

//動態渲染nav
const menuItems = MENU_ITEMS

//漢堡選單
const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// ========== 2026/1/16 加入 Pinia 使用者選單功能 ==========
//使用者選單
const authStore = useAuthStore()
const isUserMenuOpen = ref(false)
const userName = ref('Cathy') // 這裡之後可以從 authStore 取得使用者名稱

const toggleUserMenu = () => {
  // 如果未登入，開啟登入燈箱
  if (!authStore.isLogin) {
    authStore.openLoginModal()
    return
  }
  // 已登入則切換選單顯示
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const goToMemberCenter = () => {
  router.push('/member')
  isUserMenuOpen.value = false
}

const logout = () => {
  authStore.isLogin = false
  isUserMenuOpen.value = false
  router.push({ name: 'home' })
}
// ========== 2026/1/16 Pinia 使用者選單功能結束 ==========
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

        <!-- 2026/1/16 原本的會員中心連結（已改為下拉選單） -->
        <!-- <RouterLink to="/member">
          <span class="material-symbols-outlined icon-white"> account_circle </span>
        </RouterLink> -->

        <!-- 2026/1/16 新增：使用者下拉選單 -->
        <div class="userMenuWrapper">
          <span class="material-symbols-outlined icon-white userIcon" @click="toggleUserMenu">
            account_circle
          </span>

          <!-- 下拉選單（僅在已登入時顯示） -->
          <div v-if="authStore.isLogin && isUserMenuOpen" class="dropdownMenu">
            <div class="userGreeting">{{ userName }}，您好</div>
            <button class="menuItem" @click="goToMemberCenter">
              <span class="material-symbols-outlined menuIcon">person</span>
              會員中心
            </button>
            <button class="menuItem" @click="logout">
              <span class="material-symbols-outlined menuIcon">logout</span>
              登出
            </button>
          </div>
        </div>

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
