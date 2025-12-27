<script setup>
//詳情
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

//定義資料
const info = ref(null)
//頁面渲染完抓資料
onMounted(() => {
  // debugger
  axios.get(`https://fakestoreapi.com/products/${props.id}`).then((response) => {
    // handle success
    info.value = response.data
  })
})
</script>
<template>
  <h1>志工活動詳情</h1>
  活動id : {{ props.id }}
  {{ info }}
  <!-- <div class="content" v:for:item ></div> -->
  
</template>
<style></style>
