<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import NewsCard from '../components/cards/NewsCard.vue'
import Banner from "@/components/Banner.vue";
import clickBar from '@/components/clickBar.vue';
import searchBox from '@/components/searchBox.vue';


const newsTabs = ['全部', '重要公告', '異動通知'];
const currentNewsTab = ref('全部');


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
    name: 'NewsDetail',
    params: { id: id }  
  })
}
</script>

<template>
  <Banner imgName="news" title="最新消息" />

  <main class="container">
    <clickBar 
        v-model="currentNewsTab" 
        :tabs="newsTabs" 
    />
    <searchBox/>
    <div class="row" v-if="newslist.length > 0">

      <NewsCard v-for="item in newslist" :key="item.article_id" :id="item.article_id" :title="item.title"
        :date="formatDate(item.publish_time)" :typeBadge="item.category" :image="item.image_url"
        @click="goToDetail(item.article_id)" style="cursor: pointer;" />
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