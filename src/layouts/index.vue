<script setup>
import MainHeader from '@/components/Header.vue'
import MainFooter from '@/components/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
// 判斷當前路由的 meta 是否設定了 hideFooter
const showFooter = computed(() => !route.meta.hideFooter)
</script>

<template>
  <MainHeader />
  <RouterView />
  <MainFooter v-if="showFooter"/>
</template>

<style scoped lang="scss"></style>
