<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router' // 引入路由
import { backHomeApi } from '@/utils/publicApi'
import TabSwitcher from '@/components/TabSwitcher.vue'
import Button from '@/components/auth/Button.vue'
import Pagination from '@/components/Pagination.vue'
import MemberActivityLightbox from '@/components/auth/MemberActivityLightbox.vue'

const router = useRouter()
const route = useRoute()

// 1. 分頁與 Tab 狀態
const currentActivityTab = ref('future')
const currentPage = ref(1)
const pageSize = 5

const activityTabs = [
  { label: '未來活動', value: 'future' },
  { label: '過去活動', value: 'past' },
  { label: '已取消', value: 'canceled' }
]

// 2. 活動資料
const allActivities = ref({
  future: [],
  past: [],
  canceled: []
})

// 累積志工時數
const totalVolunteerHours = ref(0)

// API 串接：讀取我的活動清單
const fetchData = async () => {
  try {
    const token = localStorage.getItem('bh_front_token');
    
    if (!token) {
      console.error('未登入，請先登入');
      router.push('/');
      return;
    }

    const response = await backHomeApi.get('/member/auth_activity_list.php', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 處理後端返回的資料
    let responseData = response.data;
    
    // 處理 {status: 'success', data: {...}} 格式
    if (responseData.status === 'success' && responseData.data) {
      const apiData = responseData.data;
      
      // 儲存累積志工時數
      if (apiData.total_accumulated_hours !== undefined) {
        totalVolunteerHours.value = apiData.total_accumulated_hours;
      }
      
      // 處理活動資料：後端使用 upcoming_events, past_events, cancelled_events
      const upcomingEvents = apiData.upcoming_events || [];
      const pastEvents = apiData.past_events || [];
      const cancelledEvents = apiData.cancelled_events || [];
    
      // 轉換格式
      const formatActivity = (item) => {
        const dateObj = new Date(item.START_DATE);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        return {
          id: item.ACTIVITY_ID,
          month: months[dateObj.getMonth()],
          day: String(dateObj.getDate()).padStart(2, '0'),
          title: item.TITLE,
          time: `${item.START_DATE} ${item.START_TIME || ''}-${item.END_TIME || ''}`,
          location: item.LOCATION,
          hours: item.VOLUNTEER_HOURS || 0
        };
      };

      // 直接使用後端已分類好的資料
      allActivities.value.future = upcomingEvents.map(formatActivity);
      allActivities.value.past = pastEvents.map(formatActivity);
      allActivities.value.canceled = cancelledEvents.map(formatActivity);
    } else {
      console.error('API 返回的資料格式錯誤:', responseData);
      allActivities.value = { future: [], past: [], canceled: [] };
      totalVolunteerHours.value = 0;
    }

  } catch (error) {
    console.error('抓取活動資料失敗:', error);
  }
};

onMounted(fetchData);

// 3. 頁面跳轉邏輯
const goToDetail = (activityId) => {
  // 導向 ActivityIntroduce.vue (路由名為 activityInfo)
  router.push({ 
    name: 'activityInfo', 
    params: { id: activityId } 
  })
}

// 4. 燈箱邏輯 (保持原樣，但需注意事件冒泡)
const isLightboxOpen = ref(false)
const activeType = ref('')
const selectedActivity = ref(null)

const openEditLightbox = (type, activity) => {
  activeType.value = type
  selectedActivity.value = activity
  isLightboxOpen.value = true
}

const confirmCancel = (type, activity) => {
  activeType.value = type
  selectedActivity.value = activity
  isLightboxOpen.value = true
}

const handleLightboxConfirm = async (updatedData) => {
  const token = localStorage.getItem('bh_front_token');

  if (!token) {
    console.error('未登入，請先登入');
    router.push('/');
    return;
  }

  if (activeType.value === 'cancelConfirm') {
    try {
      const res = await backHomeApi.post('/member/auth_activity_cancel.php',
        {
          activityId: selectedActivity.value.id
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const result = res.data;
      
      if (result.status === 'success') {
        isLightboxOpen.value = false;
        await fetchData(); // 重新抽取資料
        setTimeout(() => {
          activeType.value = 'cancelSuccess';
          isLightboxOpen.value = true;
        }, 300);
      }
    } catch (err) { 
      console.error("取消報名失敗", err); 
    }

  } else if (activeType.value === 'editActivity') {
    try {
      const res = await backHomeApi.post('/member/auth_activity_update.php',
        {
          activityId: selectedActivity.value.id,
          ...updatedData // 更新的報名資料
        },
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const result = res.data;
      
      if (result.status === 'success') {
        isLightboxOpen.value = false;
        await fetchData(); // 重新抽取資料
        setTimeout(() => {
          activeType.value = 'editActivitySuccess';
          isLightboxOpen.value = true;
        }, 300);
      }
    } catch (err) { 
      console.error("修改報名資料失敗", err); 
    }
  }
};

// 5. 分頁計算
const totalPages = computed(() => {
  const data = allActivities.value[currentActivityTab.value] || []
  return Math.ceil(data.length / pageSize)
})

const pagedActivities = computed(() => {
  const data = allActivities.value[currentActivityTab.value] || []
  const start = (currentPage.value - 1) * pageSize
  return data.slice(start, start + pageSize)
})

const goToPage = (page) => {
  currentPage.value = page
  router.push({
    query: {
      section: route.query.section || 'activity',
      tab: currentActivityTab.value,
      page: page === 1 ? undefined : page
    }
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(currentActivityTab, () => {
  currentPage.value = 1
  // 只在當前 section 是 activity 時才更新 URL
  if (route.query.section === 'activity') {
    router.push({
      query: {
        section: 'activity',
        tab: currentActivityTab.value,
        page: undefined
      }
    })
  }
})

// 初始化時從 URL 讀取，但不修改 URL
watch(() => route.query, (newQuery) => {
  if (newQuery.tab && newQuery.tab !== currentActivityTab.value) {
    currentActivityTab.value = newQuery.tab
  }
  if (newQuery.page) {
    currentPage.value = parseInt(newQuery.page)
  } else if (!newQuery.tab) {
    // 如果沒有 tab 參數，表示切換到其他主分頁，重置狀態
    currentActivityTab.value = 'future'
    currentPage.value = 1
  }
}, { immediate: true })
</script>

<template>
  <div class="container">
    <TabSwitcher v-model="currentActivityTab" :tabs="activityTabs">
        
        <div v-if="currentActivityTab === 'past'" class="hours-summary">
          <span class="material-symbols-outlined">schedule</span>
          <span class="label">志工時數已累積：</span>
          <span class="hours-count">{{ totalVolunteerHours }}小時</span>
        </div>

        <div class="history-list">
          <div 
            v-for="activity in pagedActivities" 
            :key="activity.id" 
            class="history-item clickable-row"
            @click="goToDetail(activity.id)"
          >
            <div class="item-date">
              <span class="month">{{ activity.month }}</span>
              <span class="day">{{ activity.day }}</span>
            </div>

            <div class="timeline-visual">
              <div class="timeline-line"></div>
              <div class="timeline-dot"></div>
            </div>

            <div class="item-content">
              <div class="item-info">
                <h3 class="activity-title">{{ activity.title }}</h3>
                <p>活動時間：{{ activity.time }}</p>
                <p>活動地點：{{ activity.location }}</p>
              </div>
              
              <div class="item-actions">
                <template v-if="currentActivityTab === 'future'">
                  <Button variant="text-link" @click.stop="openEditLightbox('editActivity', activity)">更改報名資料</Button>
                  <Button variant="text-link" @click.stop="confirmCancel('cancelConfirm', activity)">取消報名</Button>
                </template>

                <template v-else-if="currentActivityTab === 'past'">
                  <div class="item-badge">
                    <span class="amount-tag">志工時數: {{ activity.hours }}小時</span>
                  </div>
                </template>

                <template v-else-if="currentActivityTab === 'canceled'">
                  <span class="status-canceled">已取消</span>
                </template>
              </div>
            </div>
          </div>
        </div>

        <Pagination
          v-if="totalPages > 1"
          class="col-sm-4 pagination-spacing"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="goToPage"
        />

        <MemberActivityLightbox 
  v-model="isLightboxOpen" 
  :type="activeType" 
  :initialData="selectedActivity"
  @confirm="handleLightboxConfirm"
        />
    </TabSwitcher>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.container {
  max-width: rem(1200px);
  margin: 0 auto;
  padding: 0 rem(20px);
}

/* 讓整排看起來可以點擊 */
.history-item.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    // 使用龜途的次要色做極淺的背景，增加互動感
    background-color: rgba($secondary-color, 0.03); 
    
    .activity-title {
      color: $primary-color; // 懸停時標題稍微變色
    }
  }
}

.hours-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: rem(8px);
  margin: rem(24px) 0;
  color: $primary-color;
  .hours-count {
    font-size: $d-size-tertiary;
    font-weight: 900;
  }
}

.history-list {
  width: 100%;
  .history-item {
  background: linear-gradient(to right, rgba(14, 98, 115, 0.1) rem(4px), transparent rem(4px));
  background-position: left center;
  background-size: rem(4px) rem(80px);
  background-repeat: no-repeat;
  padding-left: rem(16px);
  display: flex;
  position: relative;
  padding-bottom: rem(24px);
  align-items: center;  // 垂直置中
}
  .item-date {
    width: rem(60px);
    text-align: center;
    padding-top: rem(10px);
    .month { 
      display: block;
      font-size: $m-size-caption; 
      color: $secondary-color; 
      font-weight: 700;
      line-height: 1;
    }
    .day { 
      font-size: $d-size-tertiary; 
      font-weight: 900; 
      color: $primary-color; 
      line-height: 1.2;
    }
  }
  .timeline-visual {
    position: relative;
    width: rem(40px);
    display: flex;
    justify-content: center;
    .timeline-line { position: absolute; top: 0; bottom: 0; width: 1px; background-color: $secondary-color; }
    
  }
  .item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: rem(13px);
    border-bottom: 1px solid $secondary-color; 
    padding-top: rem(16px);
  }
}

.activity-title {
  font-size: $size-body-l;
  font-weight: 700;
  color: $text-color;
  margin-bottom: rem(8px);
  transition: color 0.3s ease;
}

.item-info p {
  font-size: $size-body;
  color: $text-color;
  margin-bottom: rem(4px);
}

.item-actions {
  display: flex;
  gap: rem(16px);
  padding-bottom: rem(4px);
  // 確保按鈕本身在點擊時有明確範圍
  z-index: 5; 
}

.status-canceled {
  color: $page-number-color;
  font-size: $size-body;
  font-weight: 500;
}

.item-badge .amount-tag {
  background-color: $card-color;
  color: $secondary-color;
  padding: rem(4px) rem(16px);
  border-radius: rem(20px);
  font-size: $d-size-caption;
  font-weight: 500;
}

.pagination-spacing {
  margin-top: rem(40px);
  display: flex;
  justify-content: center;
}
// 手機板 RWD
@media (max-width: 768px) {
  .history-item.clickable-row {
    &:hover {
      background-color: transparent;
    }
  }

  .hours-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: rem(4px);
    margin: rem(16px) 0;
  }

  .history-list {
    .history-item {
      flex-direction: column;
      padding-bottom: rem(16px);
    }

    .item-date {
      width: 100%;
      margin-bottom: rem(12px);
      text-align: left;
    }

    .timeline-visual {
      display: none;
    }

    .item-content {
      flex-direction: column;
      align-items: flex-start;
      border-bottom: 1px solid $secondary-color;
      padding-top: 0;
      padding-bottom: rem(12px);
    }

    .item-info {
      width: 100%;
      margin-bottom: rem(12px);
    }

    .item-actions {
      flex-direction: column;
      width: 100%;
      gap: rem(8px);
    }
  }

  .activity-title {
    font-size: $size-body;
  }

  .item-info p {
    font-size: rem(14px);
  }

  .pagination-spacing {
    margin-top: rem(24px);
  }
}
</style>