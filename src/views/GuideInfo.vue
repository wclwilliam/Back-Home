<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 接收路由傳來的 id
const props = defineProps({
  id: String
})

// 定義資料 (預設 null，因為還沒抓到資料)
const info = ref(null)

// 渲染頁面抓資料
onMounted(() => {
  axios
    .get(`https://fakestoreapi.com/products/${props.id}`) 
    .then((response) => {
      console.log('單筆資料回來囉:', response.data)
      info.value = response.data
    })
})
</script>

<template>
  <main>
    <div v-if="info">
      <h1>{{ info.title }}</h1>
      <p>分類：{{ info.category }}</p>
      <img :src="info.image" alt="商品圖片" width="200" />
      <p>{{ info.description }}</p>
      <h3>價格: ${{ info.price }}</h3>
      
      <router-link to="/">回列表</router-link>
    </div>

    <div v-else>
      資料讀取中...
    </div>
  </main>
</template>