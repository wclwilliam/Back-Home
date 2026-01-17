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
import Boss from '@/components/about/boss.vue'
import piniapractice from '@/components/about/piniapractice.vue'
</script>
<template>
  <main>
    <RouterLink :to="`/about/`"> 回列表 </RouterLink>

    <Boss />
    <piniapractice />

    <hr />
  </main>
</template>
<style lang="scss" scoped></style>
