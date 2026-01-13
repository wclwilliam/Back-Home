<script setup>
// 列表
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue'
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
</script>
<template>
  <div class="container">
    <div class="row">
      <TeamMemberCard
        v-for="expert in resultList"
        :key="expert.id"
        :image="expert.image"
        :title="expert.title"
        :jobTitle="expert.jobTitle"
        :expertise="expert.expertise"
        :description="expert.description"
      >
      </TeamMemberCard>
    </div>
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
</template>
<style scoped>
/* .color {
  width: 100px;
  height: 100px;
  background-color: v-bind(colors);
} */
</style>
