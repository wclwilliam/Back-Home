<script setup>
import { onMounted, ref } from 'vue'
import { backHomeApi } from '@/utils/publicApi'
//志工資料
const topVolunteers = ref([])

// 讀取志工排名資料
const url = `activity/leaderboard.php`
// 取得排名圖片
const getRankIcon = (index) => {
  const rank = index + 1
  if (rank <= 10) {
    return new URL(`../../assets/image/activity/ranking/rank-${rank}.png`, import.meta.url).href
  }
  return null
}
const fetchRankingData = async () => {
  try {
    const response = await backHomeApi.get(url)
    if (response.data.status === 'success') {
      topVolunteers.value = response.data.data.map(item => ({
        id: item.MEMBER_ID,
        name: item.DISPLAY_NAME,
        hours: Number(item.TOTAL_HOURS),
      }))
    }
  } catch (err) {
    console.error('無法讀取志工排名資料', err)
  }
}

// 元件載入時取得資料
onMounted(() => {
  fetchRankingData()
})

</script>

<template>
  <div class="col-sm-4 col-md-8 col-lg-7 ranking-section">
    <div class="ranking-card">
      
      <div class="ranking-header-banner">
        <div class="quote-box">
          <h2 class="main-title">海洋守護者群</h2>
          <p class="sub-quote">
            在同一片天空下，誰都無法置身事外。<br>
            感謝這些雙手，為海龜清除了回家的障礙。
          </p>
        </div>
      </div>

      <div class="ranking-table">
        <div class="table-header">
          <div class="col-rank">排名</div>
          <div class="col-member">會員名稱</div>
          <div class="col-hours">服務時數</div>
        </div>

        <div class="table-body">
          <div v-if="topVolunteers.length === 0" class="table-row" style="justify-content: center;">
            載入中或尚無資料...
          </div>

          <div 
            v-for="(user, index) in topVolunteers" 
            :key="user.id" 
            class="table-row"
          >
            <div class="col-rank">
              <div class="turtle-rank">
                <img 
                  v-if="getRankIcon(index)" 
                  :src="getRankIcon(index)" 
                  :alt="`第${index + 1}名`"
                  class="rank-icon"
                >
                <span v-else>{{ index + 1 }}</span>
              </div>
            </div>

            <div class="col-member">
              <span class="name">{{ user.name }}</span>
            </div>

            <div class="col-hours">
              <span class="hours-num">{{ user.hours }}</span> 
              <span class="unit">小時</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.ranking-section {
  margin-top: 40px;
  margin-bottom: 60px;
  margin: 0 auto;
}

.ranking-card {
  overflow: hidden;
}

// --- 上方 Banner ---
.ranking-header-banner {
  
  padding: 32px 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  .quote-box {
    text-align: center;
    color: $primary-color;
    .main-title {
      @include font-secondary;
       // #153450
      margin-bottom: 12px;
      letter-spacing: 2px;
    }

    .sub-quote {
      @include font-tertiary;
      line-height: 1.6;
      margin: 0;
      font-weight: 500;
    }
  }
}

// --- 表格結構樣式 ---
.ranking-table {
  width: 100%;
}

.table-header {
  display: flex;
  align-items: center;
  background-color: $highlight-color1; 
  color: $text-white !important;
  padding: 16px 0;
  @include font-quaternary;
  text-align: center;
}

.table-body {
  .table-row {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid $text-white;
    background-color: $text-white;
    @include font-body-bold;

    // 偶數行變色 (Zebra striping)
    &:nth-child(even) {
      background-color: lighten($highlight-color1, 43);
    }

    &:last-child {
      border-bottom: none;
    }

    // 欄位內容對齊
    .col-rank { 
      flex: 2; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    }
    .col-member { 
      flex: 2; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 16px; 
    }
    .col-hours { 
      flex: 2; 
      text-align: center; 
      color: $text-color;
      font-weight: bold;
    }
  }
}

// --- 內部元素細節 ---

//排名圖片
.turtle-rank {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  
  .rank-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}

//時數
.hours-num {
  @include font-body-l-bold;
  margin-right: 4px;
}

.unit {
  @include font-body;
}

</style>