<script setup>
import Banner from '@/components/Banner.vue';
import TabBtn from '@/components/activity/TabBtn.vue';
import SearchBar from '@/components/activity/SearchBar.vue';
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Ranking from '@/components/activity/Ranking.vue';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'

const activityList = ref([])
const currentTab = ref('current')
const currentPage = ref(1)
const itemsPerPage = ref(9)

// --- 1. 定義接收篩選條件的變數 ---
const searchQuery = ref('')
const activeFilters = ref({
  topics: [],
  locations: [],
  times: [],
  dateRange: null
})

// --- 2. 處理子元件傳來的事件 ---
const handleSearchInput = (query) => {
  searchQuery.value = query
  currentPage.value = 1 // 搜尋時回到第一頁
}

const handleFilterApply = (filters) => {
  activeFilters.value = filters
  currentPage.value = 1 // 篩選時回到第一頁
}

// --- 3. 地區對照表 (因為 JSON 是寫縣市，但篩選器是寫區域) ---
const regionMap = {
  '北部': ['台北', '新北', '基隆', '桃園', '新竹', '宜蘭'],
  '中部': ['苗栗', '台中', '彰化', '南投', '雲林'],
  '南部': ['嘉義', '台南', '高雄', '屏東'],
  '東部': ['花蓮', '台東'],
  '離島': ['澎湖', '金門', '馬祖', '連江', '綠島', '蘭嶼', '小琉球']
}

// --- 4. 核心篩選邏輯 (漏斗) ---
const filteredActivities = computed(() => {
  let results = activityList.value

  // [第一層] Tab 狀態篩選
  if (currentTab.value === 'review') {
    results = results.filter(act => act.status === 'ended')
  } else {
    // 包含 open 和 upcoming
    results = results.filter(act => act.status !== 'ended')
  }

  // [第二層] 關鍵字搜尋 (標題、地點、描述)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(act =>
      act.title.toLowerCase().includes(query) ||
      act.location.toLowerCase().includes(query) ||
      act.description.toLowerCase().includes(query)
    )
  }

  // [第三層] 進階篩選 (從 SearchBar 傳來的物件)
  const filters = activeFilters.value

  // 3-1. 主題篩選 (Topic)
  if (filters.topics.length > 0) {
    results = results.filter(act => filters.topics.includes(act.type))
  }

  // 3-2. 地點篩選 (Location) - 需處理 "北部" 對應到 "台北市" 的邏輯
  if (filters.locations.length > 0) {
    results = results.filter(act => {
      // 只要該活動的地點，符合使用者選取的「任一區域」中的「任一縣市關鍵字」即可
      return filters.locations.some(region => {
        const cities = regionMap[region] || []
        return cities.some(city => act.location.includes(city))
      })
    })
  }

  // 3-3. 時間篩選 (Time & DateRange)
  if (filters.dateRange) {
    // 自訂日期範圍
    const start = new Date(filters.dateRange[0])
    const end = new Date(filters.dateRange[1])
    results = results.filter(act => {
      const actDate = new Date(act.date)
      return actDate >= start && actDate <= end
    })
  } else if (filters.times.length > 0) {
    // 本月 / 下個月
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    results = results.filter(act => {
      const actDate = new Date(act.date)
      const actMonth = actDate.getMonth()
      const actYear = actDate.getFullYear()

      // 檢查是否符合選取的任一時間條件
      return filters.times.some(timeOption => {
        if (timeOption === '本月') {
          return actMonth === currentMonth && actYear === currentYear
        }
        if (timeOption === '下個月') {
          // 處理跨年問題 (12月的下個月是明年1月)
          let targetMonth = currentMonth + 1
          let targetYear = currentYear
          if (targetMonth > 11) {
            targetMonth = 0
            targetYear += 1
          }
          return actMonth === targetMonth && actYear === targetYear
        }
        return false
      })
    })
  }

  return results
})

// RWD 與 分頁邏輯 (維持你原本寫的)
const updateItemsPerPage = () => {
  const width = window.innerWidth;
  itemsPerPage.value = width < 1024 ? 6 : 9;
};

onMounted(() => {
  axios.get('/data/activityData.json')
    .then(res => activityList.value = res.data)
    .catch(err => console.error(err))
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredActivities.value.length / itemsPerPage.value))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActivities.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

//  Tab 切換時，清空搜尋條件
watch(currentTab, () => {
  currentPage.value = 1
  searchQuery.value = ''
  activeFilters.value = { topics: [], locations: [], times: [], dateRange: null }
})

</script>
<template>
  <Banner imgName="activity" title="志工活動" />
  <div class="activity-bg-wrapper">
    <div class="container">
      <div class="row">
        <TabBtn v-model="currentTab" />
  
        <SearchBar @search="handleSearchInput" @filter="handleFilterApply" />
        
        <div class="col-sm-4 col-md-6 col-lg-4 card-gap" v-for="activity in paginatedActivities" :key="activity.id">
          <ActivityCard :event="activity" />
        </div>
  
        <div v-if="paginatedActivities.length === 0" class="no-data col-sm-4">
          <p>目前沒有符合條件的活動喔！</p>
        </div>
  
        <div class="pagination-container col-sm-4" v-if="totalPages > 1">
          <button v-for="page in totalPages" :key="page" class="page-btn number"
            :class="{ 'active': currentPage === page }" @click="goToPage(page)">
            {{ page }}
          </button>
  
        </div>
        <Ranking></Ranking>
  
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activity-bg-wrapper {
  margin-top: 5rem;
  background-image: url('@/assets/image/activity/activityBg.png');
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  margin-bottom: 60px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid $secondary-color;
  background-color: transparent;
  color: $secondary-color;
  border-radius: 4px;
  /* 或 50% 變圓形 */
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover:not(:disabled) {
    background-color: $highlight-color2; // 使用您的 highlight color
    color: white;
    border-color: $highlight-color2;
  }

  &.active {
    background-color: $secondary-color;
    color: white;
  }
}
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}
</style>
