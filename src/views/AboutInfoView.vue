<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 詳情
const props = defineProps({
  id: String,
})
// 1. 定義資料
const info = ref(null)
// 2. 請求資料
onMounted(() => {
  // debugger
  axios.get(`https://fakestoreapi.com/products/${props.id}`).then((response) => {
    // handle success
    info.value = response.data
    //把請求的到的資料丟進productList
    //debugger
  })
})
</script>
<template>
  <main>
    <RouterLink :to="`/about/`"> 回列表 </RouterLink>
    <hr />
    商品詳情
    {{ props.id }}

    {{ info }}
    <hr />
    <!-- {{ info.title }}
    <div><img :src="info.image" alt="" /></div>
    <div>{{ info.description }}</div>
    <div>{{ info.price }}</div> -->
  </main>
</template>
<style lang="scss" scoped></style>
