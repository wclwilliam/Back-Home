<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import TabSwitcher from '@/components/TabSwitcher.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Pagination from '@/components/Pagination.vue'

// 1. 基礎狀態
const currentTab = ref("未來活動")
const favoriteTabs = [
  { label: '未來活動', value: '未來活動' },
  { label: '過去活動', value: '過去活動' }
]

const favoriteList = ref([]) // 這裡之後接 API 或是從 Vuex/Pinia 拿資料
const currentPage = ref(1)
const itemsPerPage = ref(9)

// 2. RWD 每頁數量邏輯 (複製志工活動頁面的做法)
const updateItemsPerPage = () => {
  const width = window.innerWidth;
  // 桌機 9 筆 (3*3), 平板以下 6 筆 (3*2 或 2*3)
  itemsPerPage.value = width < 1024 ? 6 : 9;
};

onMounted(() => {
  // 模擬獲取 27 筆資料來測試分頁
  favoriteList.value = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: `收藏活動收藏活動1234432 - ${i + 1}`,
    date: i < 15 ? '2026-05-20' : '2025-01-01', // 模擬未來與過去
    location: '新北市萬里區',
    currentPeople: 50,
    maxPeople: 100,
    type: '淨灘',
    image: 'https://picsum.photos/400/300'
  }))

  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

// 3. 過濾與分頁邏輯
const filteredFavorites = computed(() => {
  if (!favoriteList.value) return []
  const todayTime = new Date().setHours(0, 0, 0, 0)
  
  return favoriteList.value.filter(act => {
    const actTime = new Date(act.date).getTime()
    return currentTab.value === '過去活動' ? actTime < todayTime : actTime >= todayTime
  })
})

const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / itemsPerPage.value))

const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredFavorites.value.slice(start, end)
})

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 切換 Tab 時重置頁碼
watch(currentTab, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="container">
    <TabSwitcher v-model="currentTab" :tabs="favoriteTabs" />
    
      <div class="row cardList">
        <!-- 卡片列表 -->
        <div 
          class="col-sm-4 col-md-6 col-lg-4 card-gap" 
          v-for="activity in paginatedFavorites" 
          :key="activity.id"
        >
          <ActivityCard :event="activity" />
        </div>

        <!-- 無資料提示 -->
        <div v-if="paginatedFavorites.length === 0" class="no-data col-sm-4">
          <p>目前沒有符合條件的收藏活動！</p>
        </div>

        <!-- 分頁 -->
        <Pagination
          v-if="totalPages > 1"
          class="col-sm-4"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="goToPage"
        />
      </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/base/_var.scss";


.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
  flex: 0 0 100%;  // 占滿全寬
}
</style>