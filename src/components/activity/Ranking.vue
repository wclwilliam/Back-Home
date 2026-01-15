<script setup>
import { ref } from 'vue'

// 模擬的前 10 名志工資料
const topVolunteers = ref([
  { id: 1, name: '周*輪', hours: 156 },
  { id: 2, name: 'Julie', hours: 150 },
  { id: 3, name: '林*豪', hours: 142 },
  { id: 4, name: '陳*美', hours: 138 },
  { id: 5, name: 'Alex', hours: 125 },
  { id: 6, name: '王*明', hours: 110 },
  { id: 7, name: 'Sophie', hours: 98 },
  { id: 8, name: '張*山', hours: 95 },
  { id: 9, name: '李*華', hours: 88 },
  { id: 10, name: 'Kevin', hours: 82 },
])

// 取得排名圖片
const getRankIcon = (index) => {
  const rank = index + 1
  if (rank <= 10) {
    return new URL(`../../assets/image/activity/ranking/rank-${rank}.png`, import.meta.url).href
  }
  return null
}
</script>

<template>
  <div class="col-sm-4 col-md-12 col-lg-12 ranking-section">
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
                <span v-else class="rank-num">{{ index + 1 }}</span>
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
  // 表頭背景色使用 $highlight-color1 (#4FA8C3)
  background-color: $highlight-color1; 
  color: $text-white;
  padding: 16px 0;
  font-weight: bold;
  font-size: $size-body-l;
  letter-spacing: 1px;
}

.table-body {
  .table-row {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eee;
    background-color: $text-white;
    transition: background-color 0.2s;

    &:hover {
      background-color: $backstage-swipe-color; // #F6F6F6
    }

    // 偶數行變色 (Zebra striping)
    &:nth-child(even) {
      background-color: lighten($highlight-color1, 43);
    }

    &:last-child {
      border-bottom: none;
    }

    // 欄位內容對齊
    .col-rank { 
      flex: 1.5; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    }
    .col-member { 
      flex: 4; 
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

// 1. 排名圖片
.turtle-rank {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  
  .rank-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  
  .rank-num {
    font-size: $size-body-l;
    font-weight: bold;
    color: $text-color;
  }
}
.name {
  font-size: $size-body;
  font-weight: 500;
  color: $text-color;
  min-width: 60px;
  text-align: left;
}

// 3. 時數
.hours-num {
  font-size: $size-body-l;
  color: $primary-color; // 使用主色
  margin-right: 4px;
}

.unit {
  font-size: $size-body;
  font-weight: normal;
}

// --- RWD 手機版調整 ---
@media (max-width: 576px) {
  .ranking-header-banner {
    padding: 20px 16px;
    
    .quote-box {
      padding: 16px;
    }
    
    .main-title {
      font-size: $m-size-tertiary;
    }
    
    .sub-quote {
      font-size: $m-size-caption;
    }
  }

  .table-header {
    font-size: $size-body;
  }

  // 手機版調整欄位比例
  .table-header, .table-body .table-row {
    .col-rank { flex: 1; }
    .col-member { flex: 3.5; justify-content: flex-start; padding-left: 10px; } 
    .col-hours { flex: 1.5; }
  }

  .avatar {
    width: 36px;
    height: 36px;
  }
  
  .name {
    font-size: $size-body;
  }
}
</style>