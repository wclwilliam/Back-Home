<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { backHomeApi, APIBase } from '@/utils/publicApi'
import TabSwitcher from '@/components/TabSwitcher.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Pagination from '@/components/Pagination.vue'
import RemoveFavoriteLightbox from '@/components/auth/RemoveFavoriteLightbox.vue'

const router = useRouter()
const route = useRoute()

// --- 基礎狀態 ---
const currentTab = ref("upcoming")
const favoriteTabs = [
  { label: '未來活動', value: 'upcoming' },
  { label: '過去活動', value: 'completed' }
]

const favoriteList = ref([]) 
const currentPage = ref(1)
const itemsPerPage = ref(9)

// --- 燈箱控制狀態 ---
const isLightboxOpen = ref(false)
const isSuccess = ref(false)
const selectedActivity = ref(null)

// --- API 串接：讀取收藏清單 ---
const fetchFavorites = async () => {
  try {
    const token = localStorage.getItem('bh_front_token');
    
    if (!token) {
      console.error('未登入，請先登入');
      router.push('/');
      return;
    }

    const response = await backHomeApi.get('/member/auth_favorite_list.php', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = response.data;
    
    // 處理不同的回應格式
    let actualData = data;
    if (data.status === 'success' && data.data) {
      actualData = data.data;
    }
    
    favoriteList.value = actualData.map(item => {
      // 使用 VITE_FILE_URL 來拼接圖片路徑
      const fileBase = import.meta.env.VITE_FILE_URL || `${APIBase}uploads/`;
      const finalImage = item.image 
        ? `${fileBase}actCover/${item.image}` 
        : '';

      return {
        id: item.activityId, 
        title: item.title,
        date: item.startDate,
        endDate: item.endDate || item.startDate,
        location: item.location,
        image: finalImage,
        isFavorite: true,
        currentPeople: item.signupCount || 0,
        maxPeople: item.maxPeople || item.maxCapacity || 100,
        type: '活動'
      };
    });
  } catch (error) {
    console.error('抓取失敗:', error);
  }
};

// --- API 串接：執行移除收藏 ---
const handleLightboxConfirm = async () => {
  try {
    const token = localStorage.getItem('bh_front_token');
    
    if (!token) {
      console.error('未登入，請先登入');
      router.push('/');
      return;
    }

    const response = await backHomeApi.post('/member/auth_favorite_delete.php',
      { activityId: selectedActivity.value.id },
      {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const result = response.data;
    
    if (result.status === 'success') {
      // 從前端陣列中移除，達成即時更新
      favoriteList.value = favoriteList.value.filter(act => act.id !== selectedActivity.value.id);
      
      isLightboxOpen.value = false;
      // 顯示成功移除的燈箱
      setTimeout(() => {
        isSuccess.value = true;
        isLightboxOpen.value = true;
      }, 300);
    }
  } catch (error) {
    console.error('移除失敗:', error);
    alert('移除收藏時發生錯誤');
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
  isSuccess.value = false;
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
    return currentTab.value === 'completed' ? actTime < todayTime : actTime >= todayTime
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
  // 只在當前 section 是 favorite 時才更新 URL
  if (route.query.section === 'favorite') {
    router.push({ query: { section: 'favorite', tab: currentTab.value, page: undefined } })
  }
})

watch(() => route.query, (newQuery) => {
  const validTabs = ['upcoming', 'completed'];
  
  if (newQuery.section === 'favorite') {
    // 如果沒有 tab 或 tab 無效，設定預設值
    if (!newQuery.tab || !validTabs.includes(newQuery.tab)) {
      router.replace({
        query: {
          section: 'favorite',
          tab: 'upcoming'
        }
      });
      return;
    }
    
    // tab 有效，同步到內部狀態
    if (newQuery.tab !== currentTab.value) {
      currentTab.value = newQuery.tab
    }
    
    if (newQuery.page) {
      currentPage.value = parseInt(newQuery.page)
    } else {
      currentPage.value = 1
    }
  }
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

    <RemoveFavoriteLightbox 
      v-model="isLightboxOpen" 
      :isSuccess="isSuccess"
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