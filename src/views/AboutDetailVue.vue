<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
const prop = defineProps(['id'])
const productList = ref([])
const targetProd = computed(() => {
  if (!productList.value) return {}
  return productList.value.find((item) => item.id == prop.id)
})
const fetchData = () => {
  axios
    .get('https://fakestoreapi.com/products')
    .then((response) => {
      productList.value = response.data || []
    })
    .catch((error) => {})
    .finally(() => {})
}
// onMounted(() => {
//   fetchData()
// })
watch(
  () => prop.id,
  () => {
    fetchData()
  },
  {
    immediate: true,
  },
)

import { useClipboard } from '@vueuse/core'

const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })
</script>
<template>
  <h1>商品詳情 {{ prop.id }}</h1>
  <div v-if="targetProd">{{ targetProd }}</div>
  <div v-else>404</div>
  <RouterLink to="/about/1">About 1</RouterLink>
  <RouterLink to="/about/2">About 2</RouterLink>
  <RouterLink to="/about/3">About 3</RouterLink>
  <hr />
  <input v-model="source" />

  <div v-if="isSupported">
    <button @click="copy(source)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
    <p>
      Current copied: <code>{{ text || 'none' }}</code>
    </p>
  </div>
  <p v-else>Your browser does not support Clipboard API</p>
</template>
<style lang="scss" scoped></style>
