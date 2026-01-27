<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { publicApi } from '@/utils/publicApi'
import { useRouter, useRoute } from 'vue-router'
import NewsCard from '../components/cards/NewsCard.vue'
import Banner from "@/components/Banner.vue";
import clickBar from '@/components/clickBar.vue';
import searchBox from '@/components/searchBox.vue';
import Pagination from '@/components/Pagination.vue';

const router = useRouter()
const route = useRoute() 
const newsTabs = ['全部', '重要公告', '異動通知'];

//初始化時從網址讀取狀態，若無則預設
const currentNewsTab = ref(route.query.category || '全部');
const currentPage = ref(Number(route.query.page) || 1);
const searchKeyword = ref('');
const activeSearchKeyword = ref('');
let timer = null;

const newslist = ref([])
const pageSize = 9;
//監聽網址變化 
watch(() => route.query, (newQuery) => {
  currentNewsTab.value = newQuery.category || '全部';
  currentPage.value = Number(newQuery.page) || 1;
});

//建立更新網址
const updateQueryParams = () => {
  router.push({
    query: {
      ...route.query, 
      category: currentNewsTab.value === '全部' ? undefined : currentNewsTab.value, 
      page: currentPage.value === 1 ? undefined : currentPage.value 
    }
  });
};




watch(currentNewsTab, () => {
  currentPage.value = 1;
  updateQueryParams();
});

onMounted(() => {
  publicApi.get('data/NewsList.json')
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
  router.push({
    name: 'NewsDetail', // 確保你的路由名稱正確
    params: { id },
    query: {
      // 將目前的過濾狀態帶入網址，方便詳細頁知道是從哪來的
      fromCategory: currentNewsTab.value === '全部' ? undefined : currentNewsTab.value,
      fromPage: currentPage.value === 1 ? undefined : currentPage.value,
      fromSearch: activeSearchKeyword.value || undefined
    }
  });
}

// Tab 與搜尋框篩選在這邊
const filteredNews = computed(() => {
  let result = newslist.value;

  if (currentNewsTab.value !== '全部') {
    result = result.filter(item => item.category === currentNewsTab.value);
  }

  if (activeSearchKeyword.value.trim() !== '') {
    const Keyword = activeSearchKeyword.value.toLowerCase().trim();
    result = result.filter(item => {
      return item.title && item.title.toLowerCase().includes(Keyword);
    });
  }
  return result;
});

// 頁碼切分
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
  updateQueryParams(); // 更新網址
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 搜尋框延遲計數器在這邊
watch(searchKeyword, (newVal) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    activeSearchKeyword.value = newVal;
    currentPage.value = 1;
    // 將搜尋字串同步網址
    router.push({
      query: {
        ...route.query,
        search: newVal || undefined,
        page: 1
      }
    });
  }, 800);
});

</script>

<template>
  <Banner imgName="news" title="最新消息" />

  <main class="container">
    <clickBar v-model="currentNewsTab" :tabs="newsTabs" />
    <searchBox v-model="searchKeyword" />

    <div class="row" v-if="filteredNews.length > 0">
      <NewsCard v-for="item in displayNews" :key="item.article_id" :id="item.article_id" :title="item.title"
        :date="formatDate(item.publish_time)" :typeBadge="item.category" :image="item.image_url"
        @click="goToDetail(item.article_id)" style="cursor: pointer;" />
    </div>

    <div v-else class="noData">
      目前尚無此分類的消息
    </div>

    <div class="col-12 w-100">
      <Pagination :total-pages="totalPages" :current-page="currentPage" @page-change="changePage" />
    </div>

  </main>
</template>

<style lang="scss" scoped>
h1 {
  color: $primary-color;
  font-weight: bold;
  margin-bottom: 20px;
}

.noData {
  @include font-body-l;
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>