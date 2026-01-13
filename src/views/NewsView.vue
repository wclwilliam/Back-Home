<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' 
import NewsCard from '../components/cards/NewsCard.vue'
import Banner from "@/components/Banner.vue";

const router = useRouter() 


const newslist = ref([])
onMounted(() => {
  axios
    .get('/data/NewsList.json')
    .then((response) => {
      newslist.value = response.data
    })
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
const goToDetail = (id) => {
  router.push({ 
    name: 'NewsDetail', // 對應 router/index.js 中的 name
    params: { id: id }  // 傳遞參數
  })
}
</script>

<template>
  <Banner  imgName="news" title="最新消息"/>
  <main class="container">
    
    <div class="row" v-if="newslist.length > 0">
      
      <NewsCard 
        v-for="item in newslist" 
        :key="item.article_id"
        :id="item.article_id"
        :title="item.title"
        :date="formatDate(item.publish_time)" 
        :typeBadge="item.category" 
        :image="item.image_url"
        @click="goToDetail(item.article_id)"
        style="cursor: pointer;" 
      />
      </div>

  </main>
</template>

<style lang="scss" scoped>
h1 {
  color: $primary-color;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>