<script setup>
// 列表
import AboutBanner from '@/components/about/Banner.vue'
import AboutIntro from '@/components/about/Intro.vue'
import Experts from '@/components/about/Experts.vue'

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
// 1. 定義資料
const expertList = ref([])
// 2. 請求資料
onMounted(() => {
  axios.get('/data/experts.json').then((response) => {
    expertList.value = response.data
    resultList.value = response.data
  })
})

const searchStr = ref('')
const colors = ref('#rrggbb')
const fontSizeValue = ref(10)
const resultList = ref([])
const search = () => {
  if (searchStr.value === '') {
    resultList.value = expertList.value
    return
  }
  resultList.value = expertList.value.filter((item) => {
    return item.title.includes(searchStr.value)
  })
}

const listCount = computed(() => {
  return resultList.value.length
})

import aboutbutton from '@/components/about/button.vue'

//圖片引用方法1
import awardImg1 from '@/assets/image/about/1.png'
const parseAssetsIcon = (fileName) => {
  return new URL(`../assets/image/about/${fileName}`, import.meta.url).href
}
</script>
<template>
  <div class="banner">
    <AboutBanner />
  </div>
  <div class="intro">
    <AboutIntro />
  </div>
  <div class="experts">
    <Experts />
  </div>

  <!-- <h1 :style="{ fontSize: `${fontSizeValue}px` }">商品</h1>
  <input type="number" v-model="fontSizeValue" />
  {{ typeof fontSizeValue }}
  <input type="text" v-model="searchStr" />
  <input type="color" v-model="colors" />
  {{ searchStr }}
  {{ colors }} -->

  <h1>人員</h1>
  <input type="text" v-model="searchStr" />
  <button @click="search">搜尋</button>
  <p>商品總數：{{ listCount }}</p>

  <!-- <div class="color"></div> -->
  <!-- <aboutbutton title="12345"></aboutbutton>
  <aboutbutton title="3456789"></aboutbutton>
  <aboutbutton title="1234567" class="large"></aboutbutton> -->
  <aboutbutton>123453456765432</aboutbutton>
  <aboutbutton>123453456765432</aboutbutton>

  <img :src="awardImg1" alt="" class="award" />
  <!-- 圖片引用方法1 -->
  <img :src="parseAssetsIcon('3.png')" alt="" class="award" />
</template>
<style scoped>
/* .color {
  width: 100px;
  height: 100px;
  background-color: v-bind(colors);
} */
.award {
  width: 200px;
}

.banner {
  margin: 5.5rem 0;
}
.intro {
  margin: 3.5rem 0;
}
</style>
