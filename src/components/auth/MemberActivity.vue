<script setup>
import { ref, computed, watch } from 'vue'
import TabSwitcher from '@/components/TabSwitcher.vue'
import Button from '@/components/auth/Button.vue'
import Pagination from '@/components/Pagination.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue'
// 引入燈箱組件

// 5. 燈箱狀態控制
const isLightboxOpen = ref(false)
const activeType = ref('') // 'editActivity', 'cancelConfirm', 'editAmountSuccess' 等
const selectedActivity = ref(null)

// 6. 燈箱觸發函式
const openEditLightbox = (type, activity) => {
  activeType.value = type
  selectedActivity.value = activity
  isLightboxOpen.value = true
}

// 專門處理「取消報名」的觸發
const confirmCancel = (type, activity) => {
  activeType.value = type
  selectedActivity.value = activity
  isLightboxOpen.value = true
}

// 7. 核心邏輯：處理燈箱按下「確定」後的行為
const handleLightboxConfirm = () => {
  if (activeType.value === 'cancelConfirm') {
    console.log('取消報名，活動ID:', selectedActivity.value?.id);
    
    isLightboxOpen.value = false;
    setTimeout(() => {
      activeType.value = 'cancelSuccess';
      isLightboxOpen.value = true;
    }, 300);
  } else if (activeType.value === 'editActivity') {
    console.log('更新報名資料:', selectedActivity.value);
    
    isLightboxOpen.value = false;
    setTimeout(() => {
      activeType.value = 'editActivitySuccess';  // 改成這個
      isLightboxOpen.value = true;
    }, 300);
  }
};
    
    // 模擬：將該活動移至「已取消」分頁 (實際應重新接 API)
    // activity.status = 'canceled' ...

// 1. 分頁與 Tab 狀態
const currentActivityTab = ref('future')
const currentPage = ref(1)
const pageSize = 5

const activityTabs = [
  { label: '未來活動', value: 'future' },
  { label: '過去活動', value: 'past' },
  { label: '已取消', value: 'canceled' }
]

// 2. 模擬資料 (實際開發時替換為 API Data)
const allActivities = ref({
  future: Array.from({ length: 8 }, (_, i) => ({
    id: i, 
    month: 'DEC', 
    day: '29', 
    title: '萬里翡翠灣淨灘活動', 
    time: '2025.12.29 10:00-16:00', 
    location: '萬里翡翠灣'
  })),
  past: Array.from({ length: 8 }, (_, i) => ({
    id: i + 10, 
    month: 'NOV', 
    day: '15', 
    title: '海洋講座', 
    time: '2025.11.15 14:00-17:00', 
    location: '桃園圖書館', 
    hours: 3
  })),
  canceled: Array.from({ length: 8 }, (_, i) => ({  // 加上已取消的資料
    id: i + 20, 
    month: 'OCT', 
    day: '10', 
    title: '山林生態講座', 
    time: '2025.10.10 09:00-12:00', 
    location: '陽明山'
  }))
})

// 3. 分頁邏輯計算
const totalPages = computed(() => {
  const data = allActivities.value[currentActivityTab.value] || []
  return Math.ceil(data.length / pageSize)
})

const pagedActivities = computed(() => {
  const data = allActivities.value[currentActivityTab.value] || []
  const start = (currentPage.value - 1) * pageSize
  return data.slice(start, start + pageSize)
})

// 4. 事件處理
const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 切換 Tab 重置頁碼
watch(currentActivityTab, () => {
  currentPage.value = 1
})

</script>

<template>
  <div class="container">
    <TabSwitcher v-model="currentActivityTab" :tabs="activityTabs">
      <div class="activity-container">
        
        <div v-if="currentActivityTab === 'past'" class="hours-summary">
          <span class="material-symbols-outlined">schedule</span>
          <span class="label">志工時數已累積：</span>
          <span class="hours-count">36小時</span>
        </div>

        <div class="history-list">
          <div v-for="activity in pagedActivities" :key="activity.id" class="history-item">
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
                  <Button variant="text-link" @click="openEditLightbox('editActivity', activity)">更改報名資料</Button>
                  <Button variant="text-link" @click="confirmCancel('cancelConfirm', activity)">取消報名</Button>
                </template>

                <template v-else-if="currentActivityTab === 'past'">
                  <div class="item-badge">
                    <span class="amount-tag">志工時數: {{ activity.hours }}小時</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <Pagination
          v-if="totalPages > 1"
          class="col-sm-4"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="goToPage"
        />
        <MemberLightbox 
          v-model="isLightboxOpen" 
          :type="activeType" 
          :initialData="selectedActivity"
          @confirm="handleLightboxConfirm"
        />
      </div>
    </TabSwitcher>
    
    
  </div>
</template>


<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.activity-container {
  max-width: rem(1000px);
  margin: 0 auto;
}

/* 志工時數區塊 */
.hours-summary {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: rem(8px);
  margin: rem(24px) 0;
  color: $primary-color;
  .hours-count {
    font-size: $d-size-tertiary; // 24px
    font-weight: 900;
  }
}

.history-list {
  width: 100%;
  .history-item {
    display: flex;
    position: relative;
    padding-bottom: rem(24px); 
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
    .timeline-dot { position: absolute; top: rem(50px); width: rem(8px); height: rem(8px); background-color: $secondary-color; border-radius: 50%; z-index: 2; }
  }
  .item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: rem(16px);
    border-bottom: 1px solid $secondary-color; 
    padding-top: rem(10px);
  }
}

.activity-title {
  font-size: $size-body-l; // 18px
  font-weight: 700;
  color: $text-color;
  margin-bottom: rem(8px);
}

.item-info p {
  font-size: $size-body; // 16px
  color: $text-color;
  margin-bottom: rem(4px);
}

.item-actions {
  display: flex;
  gap: rem(16px);
  padding-bottom: rem(4px);
}

.status-canceled {
  color: $page-number-color;
  font-size: $size-body;
}

/* 金額標籤/時數標籤 */
.item-badge .amount-tag {
  background-color: $card-color; // 淺灰色背景
  color: $secondary-color;
  padding: rem(4px) rem(16px);
  border-radius: rem(20px);
  font-size: $d-size-caption;
  font-weight: 500;
}
</style>