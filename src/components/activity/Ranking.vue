<script setup>
import { ref } from 'vue'

// 模擬的前 10 名志工資料
const topVolunteers = ref([
  { id: 1, name: '周*輪', hours: 156, avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 2, name: 'Julie', hours: 150, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: '林*豪', hours: 142, avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 4, name: '陳*美', hours: 138, avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 5, name: 'Alex', hours: 125, avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 6, name: '王*明', hours: 110, avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 7, name: 'Sophie', hours: 98, avatar: 'https://i.pravatar.cc/150?img=24' },
  { id: 8, name: '張*山', hours: 95, avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 9, name: '李*華', hours: 88, avatar: 'https://i.pravatar.cc/150?img=35' },
  { id: 10, name: 'Kevin', hours: 82, avatar: 'https://i.pravatar.cc/150?img=53' },
])
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
              <span v-if="index === 0" class="material-symbols-outlined medal gold">military_tech</span>
              <span v-else-if="index === 1" class="material-symbols-outlined medal silver">military_tech</span>
              <span v-else-if="index === 2" class="material-symbols-outlined medal bronze">military_tech</span>
              <span v-else class="rank-num">{{ index + 1 }}</span>
            </div>

            <div class="col-member">
              <div class="avatar">
                <img :src="user.avatar" :alt="user.name">
              </div>
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
// 引入您的 SCSS 變數檔案
@import '@/assets/scss/base/_var.scss';
@import '@/assets/scss/base/_color.scss';
@import '@/assets/scss/base/_font.scss';
// 若需要引用 grid mixin 也可以在這引用，但這邊直接使用 class 即可

.ranking-section {
  margin-top: 40px;
  margin-bottom: 60px;
}

.ranking-card {
  // 外框使用 highlight-color1 (接近截圖的亮藍色 #4FA8C3)
  border: 2px solid $highlight-color1; 
  border-radius: 4px;
  overflow: hidden;
  background-color: $text-white;
}

// --- 上方 Banner ---
.ranking-header-banner {
  // 淺藍底色，可使用 highlight-color1 的淺色版，或直接指定
  background-color: #ECF6F8; 
  padding: 32px 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  .quote-box {
    // 虛線邊框設計
    border: 2px dashed $highlight-color1; 
    padding: 24px 40px;
    text-align: center;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.6);
    max-width: 600px;
    width: 100%;

    .main-title {
      // 字體設定
      font-size: $m-size-primary;
      @media (min-width: 768px) {
        font-size: $d-size-primary;
      }
      font-weight: bold;
      color: $primary-color; // #153450
      margin-bottom: 12px;
      letter-spacing: 2px;
    }

    .sub-quote {
      font-size: $size-body;
      color: $text-color;
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

  // 定義欄位寬度比例 (Flex)
  .col-rank { flex: 1.5; text-align: center; }
  .col-member { flex: 4; text-align: center; } 
  .col-hours { flex: 2; text-align: center; }
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
      background-color: #F8FBFC;
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

// 1. 排名與獎牌
.rank-num {
  font-size: $size-body-l;
  font-weight: bold;
  color: $text-color;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
}

.medal {
  font-size: 32px;
  // 金銀銅色碼
  &.gold { color: #FFD700; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)); }
  &.silver { color: #C0C0C0; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)); }
  &.bronze { color: #CD7F32; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)); }
}

// 2. 頭像與名字
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid $text-white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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