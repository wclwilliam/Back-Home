<script setup>
  //列表
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
//定義資料
const productList = ref([])
//頁面渲染完抓資料
  onMounted(() => {
  // debugger
  axios
    .get('https://fakestoreapi.com/products')
    .then((response) => {
      // handle success
      productList.value = response.data
    })
    
})

</script>
<template>
  <!-- <h1>志工活動</h1> -->
  <main>
    <RouterLink 
    v-for="item in productList" :key="item.id" :to="`/activity/${item.id}`">
      {{ item.id }}
      {{ item.title }}
    </RouterLink>
  </main>
  
</template>
<style scoped>
  a {
    display: block;
  }
</style>