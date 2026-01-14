<script setup>
import { onMounted } from 'vue'
import axios from 'axios'

const parseAssets = (fileName) => {
  return new URL(`../../assets/image/about/${fileName}`, import.meta.url).href
}
</script>
<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-2 col-md-3 col-sm-2"></div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
