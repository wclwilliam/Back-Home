<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TabSwitcher from '@/components/TabSwitcher.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Pagination from '@/components/Pagination.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue'

const router = useRouter()
const route = useRoute()

// --- 基礎狀態 ---
const currentTab = ref("未來活動")
const favoriteTabs = [
  { label: '未來活動', value: '未來活動' },
  { label: '過去活動', value: '過去活動' }
]

const favoriteList = ref([]) 
const currentPage = ref(1)
const itemsPerPage = ref(9)

// --- 燈箱控制狀態 ---
const isLightboxOpen = ref(false)
const activeType = ref('')
const selectedActivity = ref(null)

// --- API 串接：讀取收藏清單 ---
const fetchFavorites = async () => {
  try {
    // 指向你的 PHP API
    const response = await fetch('http://localhost:8888/api/member/auth_favorite_list.php');
    if (!response.ok) throw new Error('網路回應不正確');
    
    const data = await response.json();
    
    // 將資料庫格式對應至 Vue 元件所需的格式
    favoriteList.value = data.map(item => ({
      id: item.activityId,
      title: item.title,
      date: item.startDate,
      location: item.location,
      image: item.image,
      isFavorite: true, // 既然是在收藏清單，預設皆為 true
      currentPeople: 0, // 若資料庫未提供則給預設值
      maxPeople: 100,
      type: '活動'
    }));
  } catch (error) {
    console.error('抓取收藏失敗:', error);
  }
};

// --- API 串接：執行移除收藏 ---
const handleLightboxConfirm = async () => {
  if (activeType.value === 'removeFavorite') {
    try {
      const response = await fetch('http://localhost:8888/api/member/auth_favorite_delete.php', {
        method: 'POST', // 配合你目前的 PHP 接收邏輯
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId: selectedActivity.value.id })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        // 從前端陣列中移除，達成即時更新
        favoriteList.value = favoriteList.value.filter(act => act.id !== selectedActivity.value.id);
        
        isLightboxOpen.value = false;
        // 顯示成功移除的燈箱
        setTimeout(() => {
          activeType.value = 'removeFavoriteSuccess';
          isLightboxOpen.value = true;
        }, 300);
      }
    } catch (error) {
      console.error('移除失敗:', error);
      alert('移除收藏時發生錯誤');
    }
  }
};

// --- RWD 與 生命週期 ---
const updateItemsPerPage = () => {
  const width = window.innerWidth;
  itemsPerPage.value = width < 1024 ? 6 : 9;
};

onMounted(() => {
  fetchFavorites(); // 組件掛載後抓取真實資料
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

// --- 燈箱邏輯與點擊攔截 ---
const openRemoveConfirm = (activity) => {
  selectedActivity.value = activity;
  activeType.value = 'removeFavorite';
  isLightboxOpen.value = true;
};

const handleWrapperClick = (e, activity) => {
  const bookmarkEl = e.target.closest('.bookmark');
  if (bookmarkEl) {
    e.preventDefault();
    e.stopPropagation();
    openRemoveConfirm(activity);
  }
};

// --- 分頁與過濾邏輯 ---
const filteredFavorites = computed(() => {
  const todayTime = new Date().setHours(0, 0, 0, 0)
  return favoriteList.value.filter(act => {
    const actTime = new Date(act.date).getTime()
    return currentTab.value === '過去活動' ? actTime < todayTime : actTime >= todayTime
  })
})

const totalPages = computed(() => Math.ceil(filteredFavorites.value.length / itemsPerPage.value))
const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredFavorites.value.slice(start, start + itemsPerPage.value)
})

const goToPage = (page) => {
  currentPage.value = page
  router.push({ query: { ...route.query, page: page === 1 ? undefined : page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(currentTab, () => {
  currentPage.value = 1
  router.push({ query: { tab: currentTab.value, page: undefined } })
})

watch(() => route.query, () => {
  if (route.query.tab) currentTab.value = route.query.tab
  if (route.query.page) currentPage.value = parseInt(route.query.page)
}, { immediate: true })
</script>

<template>
  <div class="container">
    <TabSwitcher v-model="currentTab" :tabs="favoriteTabs" />
    
    <div class="row cardList">
      <div 
        class="col-sm-4 col-md-6 col-lg-4 card-gap" 
        v-for="activity in paginatedFavorites" 
        :key="activity.id"
        @click.capture="handleWrapperClick($event, activity)" 
      >
        <ActivityCard :event="activity" />
      </div>

      <div v-if="paginatedFavorites.length === 0" class="no-data col-sm-4">
        <p>目前沒有符合條件的收藏活動！</p>
      </div>

      <Pagination
        v-if="totalPages > 1"
        class="col-sm-4"
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-change="goToPage"
      />
    </div>

    <MemberLightbox 
  v-model="isLightboxOpen" 
  :type="activeType" 
  :initialData="selectedActivity"
  @confirm="handleLightboxConfirm"
  />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/base/_var.scss";

// 讓愛心強行變橘色實心 (驗證視覺)
:deep(.bookmark) {
  color: $highlight-color2 !important;
  font-variation-settings: 'FILL' 1 !important;
}

.no-data {
  text-align: center; padding: 40px;
  color: #666; font-size: 18px; flex: 0 0 100%;
}
.cardList { margin-top: rem(20px); }
// 手機板 RWD
@media (max-width: 768px) {
  :deep(.bookmark) {
    color: $highlight-color2 !important;
    font-variation-settings: 'FILL' 1 !important;
  }

  .no-data {
    text-align: center;
    padding: rem(20px);
    color: #666;
    font-size: rem(14px);
    flex: 0 0 100%;
  }
}
</style>