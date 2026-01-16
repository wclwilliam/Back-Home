<script setup>
import { ref, onMounted, computed, watch } from 'vue'
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


const currentPage = ref(1);
const pageSize = 9;

onMounted(() => {
  axios
    .get('/data/NewsList.json')
    .then((response) => {
      newslist.value = response.data.sort((a, b) => {
        return new Date(b.publish_time) - new Date(a.publish_time);
      });
    })
    .catch((error) => {
      console.error('載入新聞列表失敗:', error);
    })
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const goToDetail = (id) => {
  console.log('跳轉到詳細頁，ID:', id); 
  router.push({
    name: 'NewsDetail', 
    params: { id: id }  
  })
}

// Tab 篩選資料
const filteredNews = computed(() => {
  if (currentNewsTab.value === '全部') {
    return newslist.value;
  }
  return newslist.value.filter(item => item.category === currentNewsTab.value);
});

//頁碼切分資料
const displayNews = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredNews.value.slice(startIndex, endIndex);
});

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(filteredNews.value.length / pageSize);
});

// 換頁函式
const changePage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 監聽 Tab 變化：切換分類時回到第 1 頁
watch(currentNewsTab, () => {
  currentPage.value = 1;
});

</script>

<template>
  <Banner imgName="news" title="最新消息" />

  <main class="container">
    <clickBar 
        v-model="currentNewsTab" 
        :tabs="newsTabs" 
    />
    <searchBox/>

    <div class="row" v-if="filteredNews.length > 0">
      
      <NewsCard 
        v-for="item in displayNews" 
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

    <div v-else class="noData">
        目前尚無此分類的消息
    </div>

    <div class="pagination-container" v-if="totalPages > 1">
      <button 
        class="pageBtn" 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        &lt;
      </button>

      <button 
        v-for="page in totalPages" 
        :key="page" 
        class="pageBtn number"
        :class="{ active: currentPage === page }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button 
        class="pageBtn" 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        &gt;
      </button>
    </div>

  </main>
</template>

<style lang="scss" scoped>
h1 {
  color: $primary-color;
  font-weight: bold;
  margin-bottom: 20px;
}

//這邊會再換統一樣式
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
  gap: 10px;
}

.pageBtn {
  background-color: white;
  border: 1px solid $text-color;
  color: $text-color;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #f0f0f0;
    border-color: #ccc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.active {
    background-color: $primary-color; 
    color: white;
    border-color: $primary-color;
  }
}

.noData {
  @include font-body-l;
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>