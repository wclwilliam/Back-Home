<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import TabSwitcher from '@/components/TabSwitcher.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Pagination from '@/components/Pagination.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue'

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

// --- RWD 邏輯 ---
const updateItemsPerPage = () => {
  const width = window.innerWidth;
  itemsPerPage.value = width < 1024 ? 6 : 9;
};

onMounted(() => {
  favoriteList.value = Array.from({ length: 27 }, (_, i) => ({
    id: i + 1,
    title: `收藏活動 - ${i + 1}`,
    date: i < 15 ? '2026-05-20' : '2025-01-01',
    location: '新北市萬里區',
    currentPeople: 50,
    maxPeople: 100,
    type: '淨灘',
    image: 'https://picsum.photos/400/300',
    isFavorite: true // 模擬已收藏
  }))
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

// --- 燈箱邏輯 ---

const openRemoveConfirm = (activity) => {
  selectedActivity.value = activity;
  activeType.value = 'removeFavorite';
  isLightboxOpen.value = true;
};

// 使用捕獲模式攔截愛心點擊
const handleWrapperClick = (e, activity) => {
  // 向上尋找是否有 .bookmark 類別的元素
  const bookmarkEl = e.target.closest('.bookmark');
  if (bookmarkEl) {
    e.preventDefault();
    e.stopPropagation(); // 阻止卡片跳轉
    console.log('✅ 攔截到愛心點擊');
    openRemoveConfirm(activity);
  }
};

const handleLightboxConfirm = () => {
  if (activeType.value === 'removeFavorite') {
    console.log('移出收藏夾，ID:', selectedActivity.value?.id);
    
    isLightboxOpen.value = false;
    setTimeout(() => {
      activeType.value = 'removeFavoriteSuccess';
      isLightboxOpen.value = true;
    }, 300);
  }
};

// --- 分頁邏輯 ---
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

watch(currentTab, () => (currentPage.value = 1))
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