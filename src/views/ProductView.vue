<script setup>
// 列表
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 1.定義資料
const productList = ref([])
// 2.頁面渲染完畢,去抓資料
onMounted(() => {
  axios.get('https://fakestoreapi.com/products').then((response) => {
    productList.value = response.data
  })
})
// import TheWelcome from '../components/TheWelcome.vue'
</script>
<template>
  <main>
    <!-- {{ productList }} -->
  
  <RouterLink 
    v-for="product in productList" 
    :key="product.id" 
    :to="`/product/${product.id}`"
    >
    {{ product.id }}
    {{ product.title }}
  </RouterLink>
  </main>
</template>
<style lang="scss" scoped>
   a{
    display: block;
   }
</style>
