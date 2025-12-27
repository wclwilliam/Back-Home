<script setup>
// 列表
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 1. 定義資料
const productList = ref([])
// 2. 請求資料
onMounted(() => {
  axios.get('https://fakestoreapi.com/products').then((response) => {
    // handle success
    productList.value = response.data
    //把請求的到的資料丟進productList
  })
})
</script>
<template>
  <!-- {{ productList }} -->

  <RouterLink :to="`/about/${product.id}`" v-for="product in productList" :key="product.id">
    {{ product.id }}. {{ product.title }} / ${{ product.price }}
    <div><img :src="product.image" alt="" /></div>
  </RouterLink>
</template>
<style scoped>
img {
  width: 100px;
  height: auto;
}
</style>
