<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { publicApi, base } from '@/utils/publicApi';
import Banner from '@/components/Banner.vue';
import clickBar from '@/components/clickBar.vue';
import SearchBar from '@/components/activity/SearchBar.vue';
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Ranking from '@/components/activity/Ranking.vue';
import Pagination from '@/components/Pagination.vue';

const bgUrl = `${base}image/activity/activity_bg.jpg`

const fetchAct = async () => {
    publicApi.get('data/activityData.json')
    .then(response => {
      let rawData = response.data
    
      const today = new Date();
      today.setHours(0,0,0,0)
      const todayTime = today.getTime()
      // console.log(todayTime)
      rawData = rawData.map(act => {
        const actDate = new Date(act.date)
        actDate.setHours(0,0,0,0)
        const actTime = actDate.getTime()
        // console.log(actTime)

        let status = 'upcoming'
        if (todayTime > actTime){
          status = 'ended'
        }else if(todayTime === actTime){
          status = 'opening'
        }else{
          status = 'upcoming'
        }
        // console.log(rawData)

        const cleanPath = act.image.startsWith('/') ? act.image.slice(1) : act.image
        return {
          ...act,
          status: status,
          image: `${base}${cleanPath}`
        }
      })
    
      activityList.value = rawData
      // console.log("資料處理完成:", activityList.value)
    })
  .catch (error => {
    console.log(error)
  }) 
}


// // 獲取活動資料
onMounted(() => {
  fetchAct()
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
  //重新計算頁面放置卡片數量
})
onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})


const activityTabs = ['目前活動', '活動回顧']
const currentActivityTab = ref("目前活動")

const activityList = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(9)
const searchQuery = ref('')

const activeFilters = ref({
  topics: [],
  locations: [],
  times: [],
  dateRange: null
})

// 關鍵字搜索
const handleSearchInput = (query) => {
  searchQuery.value = query
  currentPage.value = 1 
}
//篩選器
const handleFilterApply = (filters) => {
  activeFilters.value = filters
  currentPage.value = 1 
}

// 地區對照表 
const regionMap = {
  '北部': ['台北', '新北', '基隆', '桃園', '新竹', '宜蘭'],
  '中部': ['苗栗', '台中', '彰化', '南投', '雲林'],
  '南部': ['嘉義', '台南', '高雄', '屏東'],
  '東部': ['花蓮', '台東'],
  '離島': ['澎湖', '金門', '馬祖', '連江', '綠島', '蘭嶼', '小琉球']
}

// 以活動是否結束決定分類
const filteredActivities = computed(() => {
  let results = activityList.value
  if (!activityList.value) return []
  // [第一層] Tab 狀態篩選
  if (currentActivityTab.value === '活動回顧') {
    results = results.filter(act => act.status === 'ended')
  } else {
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

  // [第三層] 篩選器篩選
  const filters = activeFilters.value

  // 主題篩選 (Topic)
  if (filters.topics.length > 0) {
    results = results.filter(act => filters.topics.includes(act.type))
  }

  //地點篩選 (Location) 
  if (filters.locations.length > 0) {
    results = results.filter(act => {
      return filters.locations.some(region => {
        const cities = regionMap[region] || []
        return cities.some(city => act.location.includes(city))
      })
    })
  }

  //時間篩選 (Time & DateRange)
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

// RWD 與 分頁邏輯
const updateItemsPerPage = () => {
  const width = window.innerWidth;
  itemsPerPage.value =width < 1024 ?  6 : 9;
};

 //重新計算頁數
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
watch(currentActivityTab, () => {
  currentPage.value = 1
  searchQuery.value = ''
  activeFilters.value = { 
    topics: [], 
    locations: [], 
    times: [], 
    dateRange: null }
})

</script>
<template>
  <Banner imgName="activity" title="志工活動" />
  <div class="activity-bg-wrapper" :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="container">
      <div class="row cardList">
        <clickBar
        v-model="currentActivityTab"
        :tabs="activityTabs"
        />
  
        <SearchBar @search="handleSearchInput" @filter="handleFilterApply" />
  
        <div class="col-sm-4 col-md-6 col-lg-4" v-for="activity in paginatedActivities" :key="activity.id">
          <ActivityCard :event="activity" />
        </div>
  
        <div v-if="paginatedActivities.length === 0" class="no-data col-sm-4">
          <p>目前沒有符合條件的活動！</p>
        </div>
        
        <Pagination
          class="col-sm-4"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="goToPage"
        />

        
      </div>
      <div class="ranking row">
        <Ranking></Ranking>
      </div>
        
    </div>
  </div>
</template>

<style lang="scss" scoped>
.activity-bg-wrapper {
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
}
.cardList{
  padding-top: 60px;
}

.ranking {
  padding-bottom: 60px;
}
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}
</style>
