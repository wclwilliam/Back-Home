<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { backHomeApi, base } from '@/utils/publicApi'
import { useRouter, useRoute } from 'vue-router'
import Banner from '@/components/Banner.vue'
import clickBar from '@/components/clickBar.vue'
import SearchBar from '@/components/activity/SearchBar.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import Ranking from '@/components/activity/Ranking.vue'
import Pagination from '@/components/Pagination.vue'

const bgUrl = `${base}image/activity/activity_bg.jpg`
const router = useRouter()
const route = useRoute() //當前網址

const createDefaultFilters = () => ({
  topics: [],
  locations: [],
  times: [],
  dateRange: null,
})

const activeFilters = ref(createDefaultFilters())
const allActivities = ref([]) //所有活動資料
const url = 'activity/activity_list.php';

const currentQueryParams = computed(() => {
  return {
    formCategory: currentActivityTab.value,
    formPage: currentPage.value,
    formSearch: searchQuery.value || undefined,
    formFilter: JSON.stringify(activeFilters.value) // 確保這裡傳送的是最新的 activeFilters
  }
})

//更改網址
const updateUrl = (shouldScroll = false) => {
  const filterString = JSON.stringify(activeFilters.value) //把篩選器轉成字串

  router.replace({
    name: 'activity',
    query: {
      category: currentActivityTab.value, // 紀錄目前的 Tab
      search: searchQuery.value || undefined, // 紀錄目前的搜尋關鍵字
      page: currentPage.value, // 紀錄目前的頁數
      filter: filterString, //紀錄篩選器
    },
  })

  // 只有在需要的時候 (例如換頁) 才手動滾動到頂部
  if (shouldScroll) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const activityList = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(9)

const fetchAct = async () => {
  try {
    // 發送請求
    const response = await backHomeApi.get(url);
    const dbData = response.data.data;

    if (!Array.isArray(dbData)) {
      allActivities.value = [];
      return;
    }

    const todayTime = new Date().setHours(0, 0, 0, 0);
    activityList.value = dbData.map((act) => {
      
      const actDate = new Date(act.ACTIVITY_START_DATETIME);
      const actTime = actDate.getTime();

      const endDateObj = new Date(act.ACTIVITY_END_DATETIME);
      const endTime = endDateObj.setHours(0,0,0,0);

      // 取得報名截止時間
      const signupEndTime = new Date(act.ACTIVITY_SIGNUP_END_DATETIME).getTime();
      const nowTime = new Date().getTime(); // 取得包含時分秒的當下時間

      // 狀態判斷邏輯
      let status = 'upcoming';
      if (todayTime > endTime) {
        status = 'ended';
      } else if (todayTime >= actTime && todayTime <= endTime) {
        status = 'opening';
      } else if (nowTime > signupEndTime) { 
        // 如果現在時間超過報名截止時間
        status = 'deadline';
      }

      return {
        id: act.ACTIVITY_ID,                    
        title: act.ACTIVITY_TITLE,              
        description: act.ACTIVITY_DESCRIPTION,  
        image: act.ACTIVITY_COVER_IMAGE,        
        date: act.ACTIVITY_START_DATETIME,      
        endDate: act.ACTIVITY_END_DATETIME,    
        signupEndDate: act.ACTIVITY_SIGNUP_END_DATETIME, 
        location: act.ACTIVITY_LOCATION,        
        category: act.CATEGORY_VALUE, // 這是 JOIN 出來的欄位       
        type: act.CATEGORY_VALUE,   
        status: status,
        maxPeople: act.ACTIVITY_MAX_PEOPLE,
        currentPeople: act.ACTIVITY_SIGNUP_PEOPLE
      };
    });

  } catch (error) {
    console.error('連線發生錯誤:', error);
  }
};


const activityTabs = ['目前活動', '活動回顧']
const currentActivityTab = ref('目前活動')
const searchQuery = ref('')
const activeSearchKeyword = ref('')
let timer = null


// 關鍵字搜索
const handleSearchInput = (query) => {
  searchQuery.value = query

  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    activeSearchKeyword.value = query
    currentPage.value = 1
    // 搜尋時不滾動 (false)
    updateUrl(false) 
  }, 800)
}
//篩選器
const handleFilterApply = (filters) => {
  activeFilters.value = { ...createDefaultFilters(), ...filters }
  currentPage.value = 1
  updateUrl(false) // 篩選時不滾動 (false)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    updateUrl(true) // 換頁時滾動 (true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

//  Tab 切換時，清空搜尋條件
watch(currentActivityTab, (newVal) => {
  currentPage.value = 1
  searchQuery.value = ''
  activeSearchKeyword.value = ''
  activeFilters.value = { ...createDefaultFilters() }
  updateUrl(false) // 切換 Tab 時不滾動 (false)
})


// 地區對照表
const regionMap = {
  北部: ['台北', '新北', '基隆', '桃園', '新竹', '宜蘭'],
  中部: ['苗栗', '台中', '彰化', '南投', '雲林'],
  南部: ['嘉義', '台南', '高雄', '屏東'],
  東部: ['花蓮', '台東'],
  離島: ['澎湖', '金門', '馬祖', '連江', '綠島', '蘭嶼', '小琉球'],
}

// 以活動是否結束決定分類
const filteredActivities = computed(() => {
  let results = activityList.value
  if (!activityList.value) return []
  // [第一層] Tab 狀態篩選
  if (currentActivityTab.value === '活動回顧') {
    results = results
    .filter((act) => act.status === 'ended')
    .sort((a, b ) => new Date(b.endDate) - new Date(a.endDate)) // 活動回顧以結束日期排序，最近的在前
  } else {
    results = results
    .filter((act) => act.status !== 'ended')
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // 目前活動以開始日期排序，最近的在前
  }

  // [第二層] 關鍵字搜尋 (標題、地點、描述)
  if (activeSearchKeyword.value.trim() !== '') {
    const query = activeSearchKeyword.value.toLowerCase().trim()
    results = results.filter(
      (act) =>
        act.title.toLowerCase().includes(query) ||
        act.location.toLowerCase().includes(query) ||
        act.description.toLowerCase().includes(query),
    )
  }

  // [第三層] 篩選器篩選
  const filters = activeFilters.value

  // 主題篩選 (Topic)
  if (filters.topics.length > 0) {
    results = results.filter((act) => filters.topics.includes(act.type))
  }

  //地點篩選 (Location)
  if (filters.locations.length > 0) {
    results = results.filter((act) => {
      return filters.locations.some((region) => {
        const cities = regionMap[region] || []
        return cities.some((city) => act.location.includes(city))
      })
    })
  }

  //時間篩選 (Time & DateRange)
  if (filters.dateRange) {
    // 自訂日期範圍
    const start = new Date(filters.dateRange[0])
    const end = new Date(filters.dateRange[1])
    results = results.filter((act) => {
      const actDate = new Date(act.date)
      return actDate >= start && actDate <= end
    })
  } else if (filters.times.length > 0) {
    // 本月 / 下個月 / 上個月
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    results = results.filter((act) => {
      const actDate = new Date(act.date)
      const actMonth = actDate.getMonth()
      const actYear = actDate.getFullYear()

      // 檢查是否符合選取的任一時間條件
      return filters.times.some((timeOption) => {
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
        if (timeOption === '上個月') {
          // 處理跨年問題 (12月的下個月是明年1月)
          let targetMonth = currentMonth - 1
          let targetYear = currentYear
          if (targetMonth < 0) {
            targetMonth = 11
            targetYear -= 1
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
  const width = window.innerWidth
  itemsPerPage.value = width < 1024 ? 6 : 9
}

//重新計算頁數
const totalPages = computed(() => Math.ceil(filteredActivities.value.length / itemsPerPage.value))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredActivities.value.slice(start, end)
})



// // 獲取活動資料
onMounted(() => {
  fetchAct()
  updateItemsPerPage()
  window.addEventListener('resize', updateItemsPerPage) //重新計算頁面放置卡片數量

  // console.log(route.query)
  if (route.query.category) {
    currentActivityTab.value = route.query.category
  }
  if (route.query.search) {
    searchQuery.value = route.query.search
    activeSearchKeyword.value = route.query.search
  }
  if (route.query.filter) {
    try {
      const parsedFilters = JSON.parse(route.query.filter)
      // 確保篩選器結構正確
      activeFilters.value = {
        ...createDefaultFilters(),
        ...parsedFilters,
        // 如果需要確保 dateRange 是陣列
        dateRange: parsedFilters.dateRange || null,
      }
    } catch (error) {
      console.log(error)
    }
  }
  if (route.query.page) {
    currentPage.value = Number(route.query.page)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage)
})

watch(
  activeFilters,
  () => {
    currentPage.value = 1
    updateUrl()
  },
  { deep: true },
)
watch(currentPage, () => {
  updateUrl()
})
</script>
<template>
  <Banner imgName="activity" title="志工活動" />
  <div class="activity-bg-wrapper" :style="{ backgroundImage: `url(${bgUrl})` }">
    <div class="container">
      <div class="row cardList">
        <clickBar v-model="currentActivityTab" :tabs="activityTabs" />

        <SearchBar
          :init-filters="activeFilters"
          :current-tab="currentActivityTab"
          @search="handleSearchInput"
          @filter="handleFilterApply"
        />

        <div
          class="col-sm-4 col-md-6 col-lg-4"
          v-for="activity in paginatedActivities"
          :key="activity.id"
        >
          <ActivityCard :event="activity" 
            :query-params="currentQueryParams"/>
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
.bar {
  margin: 50px 10px 48px;
}  
.activity-bg-wrapper {
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
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
