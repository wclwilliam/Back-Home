<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
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
const userMenuRef = ref(null)

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false
})

// 從 authStore 取得使用者名稱（使用 computed 自動更新）
const userName = computed(() => {
  return authStore.user?.MEMBER_REALNAME || '會員'
})

const toggleUserMenu = () => {
  // 如果未登入，開啟登入燈箱並設定登入後導向會員中心
  if (!authStore.isLogin) {
    authStore.redirectAfterLogin = '/member'
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

const logout = async () => {
  // 呼叫 authStore 的 logout 方法
  await authStore.logout()
  isUserMenuOpen.value = false
  // 登出後導向首頁
  router.push({ name: 'home' })
}
// ========== 2026/1/16 Pinia 使用者選單功能結束 ==========

// ========== 2026/2/4 滾動隱藏 Header 功能 ==========
const isHeaderVisible = ref(true)
let lastScrollY = 0
const scrollThreshold = 10 // 滾動閾值，避免太敏感

const handleScroll = () => {
  const currentScrollY = window.scrollY

  // 如果在頁面最頂部，永遠顯示 header
  if (currentScrollY < 100) {
    isHeaderVisible.value = true
    return
  }

  // 判斷滾動方向
  if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
    // 如果選單開啟中，不隱藏 Header
    if (isMenuOpen.value || isUserMenuOpen.value) {
      isHeaderVisible.value = true
      lastScrollY = currentScrollY
      return
    }

    if (currentScrollY > lastScrollY) {
      // 向下滾動，隱藏 header
      isHeaderVisible.value = false
    } else {
      // 向上滾動，顯示 header
      isHeaderVisible.value = true
    }
    lastScrollY = currentScrollY
  }
}

// 組件掛載時添加滾動監聽
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

// 組件卸載時移除滾動監聽
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
// ========== 2026/2/4 滾動隱藏 Header 功能結束 ==========
</script>

<template>
  <header :class="{ 'hide-header': !isHeaderVisible }">
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
        <div class="userMenuWrapper" ref="userMenuRef">
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
