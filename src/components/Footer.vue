<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { MENU_ITEMS } from '@/config/menu.js'

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'auto',
  })
}

//回首頁
const router = useRouter()
const goHome = () => {
  router.push('/').then(() => {
    scrollToTop()
  })
}
const menuItems = MENU_ITEMS
</script>

<template>
  <footer>
    <div class="container">
      <div class="footerLogo" @click="goHome">
        <img src="/BackHomeLogo.png" alt="Back Home Logo" />
      </div>

      <nav class="navFooter">
        <ul>
          <li v-for="item in menuItems" :key="item.path">
            <RouterLink :to="item.path" @click="scrollToTop">{{ item.text }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="socialLinks">
        <a href="https://www.facebook.com/">
          <i class="fab fa-facebook-f"></i>
          <span>Facebook</span>
        </a>
        <a href="https://www.instagram.com/">
          <i class="fab fa-instagram"></i>
          <span>Instagram</span>
        </a>
        <a href="https://www.youtube.com/">
          <i class="fab fa-youtube"></i>
          <span>Youtube</span>
        </a>
      </div>

      <div class="contactInfo">
        <p>桃園市中壢區復興路46號8樓</p>
        <p>03-425-1108</p>
        <p>service@tibame.com</p>
      </div>

      <div class="divider"></div>

      <div class="copyright">
        <p>© 2025 龜途 Back Home, copyright</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
@import '@/assets/scss/layouts/footer.scss';
</style>
