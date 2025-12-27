<script setup>
// 列表
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 定義資料 (預設空陣列)
const productlist = ref([])

// 渲染頁面抓資料
onMounted(() => {
  // 按門鈴去請求資料
  axios
    .get('https://fakestoreapi.com/products')
    .then((response) => {
      //console.log('資料回傳:', response.data) 
      productlist.value = response.data
    })
})
</script>

<template>
  <main>
    <h1>海龜圖鑑列表 (商品列表)</h1>
    
    <ul v-if="productlist.length > 0">
      <li v-for="item in productlist" :key="item.id">
        <router-link :to="{ name: 'GuideInfo', params: { id: item.id } }">
          {{ item.title }} - ${{ item.price }}
        </router-link>
      </li>
    </ul>

    <p v-else>載入中...</p>
  </main>
</template>

<style scoped>
li {
  margin-bottom: 10px; /* 讓列表不要擠在一起 */
}
</style>