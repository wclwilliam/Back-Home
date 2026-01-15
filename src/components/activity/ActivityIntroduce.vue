<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

// --- 1. 地區判斷邏輯 (與 ActivityView 一致) ---
const regionMap = {
  '北部': ['台北', '新北', '基隆', '桃園', '新竹', '宜蘭'],
  '中部': ['苗栗', '台中', '彰化', '南投', '雲林'],
  '南部': ['嘉義', '台南', '高雄', '屏東'],
  '東部': ['花蓮', '台東'],
  '離島': ['澎湖', '金門', '馬祖', '連江', '綠島', '蘭嶼', '小琉球']
}

const regionTag = computed(() => {
  const loc = props.activity.location || ''
  for (const [region, cities] of Object.entries(regionMap)) {
    if (cities.some(city => loc.includes(city))) {
      return region
    }
  }
  return '全台'
})

// --- 2. 進度條樣式計算 ---
const progressStyle = computed(() => {
  const { currentPeople, maxPeople } = props.activity
  if (!maxPeople || maxPeople === 0) return { width: '0%' }
  const percent = Math.min((currentPeople / maxPeople) * 100, 100)
  return { width: `${percent}%` }
})

// 收藏功能邏輯 
const isBookmarked = ref(false) // 是否已收藏
const isHovering = ref(false) // 是否正在 hover

// 根據狀態決定要顯示哪個 Icon 名稱
const bookmarkIcon = computed(() => {
  if (isBookmarked.value) {
    return isHovering.value ? 'bookmark' : 'bookmark'
  } else {
    return isHovering.value ? 'bookmark_add' : 'bookmark'
  }
})

const toggleBookmark = (e) => {
  //防止點愛心時觸發卡片跳轉
  e.stopPropagation()
  isBookmarked.value = !isBookmarked.value
}

</script>

<template>
  <div class="intro-container">
  
    <div class="hero-row g-0">
      <div class="col-md-6 hero-image-col">
        <div class="pic">
          <img :src="activity.image" :alt="activity.title">
        </div>
      </div>
  
      <div class="col-md-6 hero-info-col">
        <div class="info-content">
          <div class="info-header">
            <h1 class="title">{{ activity.title }}</h1>
            <span class="material-symbols-outlined bookmark" :class="{ 'is-active': isBookmarked }"
              @click="toggleBookmark" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
              {{ bookmarkIcon }}
            </span>
          </div>
  
          <div class="meta-list">
            <div class="meta-item">
              <span class="material-symbols-outlined icon">calendar_today</span>
              <span class="text">{{ activity.date }}</span>
            </div>
            <div class="meta-item">
              <span class="material-symbols-outlined icon">location_on</span>
              <span class="text">{{ activity.location }}</span>
            </div>
            <div class="meta-item">
              <span class="material-symbols-outlined icon">sell</span>
              <span class="text">{{ activity.type }}</span>
            </div>
          </div>
  
  
  
          <div class="progress-section">
            <span class="material-symbols-outlined icon">group</span>
            <div class="progress-track-container">
              <div class="track-bg"></div>
              <div class="track-fill" :style="progressStyle"></div>
            </div>
            <span class="people-count">{{ activity.currentPeople }}/{{ activity.maxPeople }}</span>
          </div>
        </div>
      </div>
    </div>
  
    <div class="details-row ">
  
      <div class="desc-col">
        <div class="content-box desc-box">
          <h3 class="section-title">活動簡介</h3>
          <p class="section-text">{{ activity.description }}</p>
        </div>
      </div>
  
      <div class="notice-col">
        <div class="content-box notice-box">
          <h3 class="section-title">注意事項：</h3>
          <ul class="notice-list" v-if="activity.notices && activity.notices.length > 0">
            <li v-for="(notice, index) in activity.notices" :key="index">
              {{ notice }}
            </li>
          </ul>
        </div>
      </div>
  
    </div>
  
  </div>
</template>

<style lang="scss" scoped>
.intro-container {
  width: 100%;
  margin-bottom: 24px;
}

// --- 1. Hero 區塊樣式 ---
.hero-row {
  display: flex;
  flex-wrap: wrap;
  // 手機版可能會堆疊，這裡確保 margin 正常
  margin-right: 0;
  margin-left: 0;
}

.hero-image-col {
  padding: 0; // 去除 padding 讓圖片滿版

  .pic {
    width: 100%;
    height: 100%;
    min-height: 320px; // 手機版最小高度

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.hero-info-col {
  padding: 0; 
  background-color: $card-color; 
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-content {
  padding: 24px; 

  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;

    .title {
      // 使用 SCSS 變數定義的字體大小，還原設計圖的大標題
      @include font-secondary;
      color: $primary-color;
      margin: 0;
      line-height: 1.4;
      flex: 1;
      padding-right: 16px;
    }

    .bookmark {
      font-size: 24px;
      color: $text-color;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: auto 0;

      &:hover {
        color: $highlight-color2;
      }

      &.is-active {
        color: $highlight-color2;
        font-variation-settings: 'FILL' 1;
      }
    }
  }

  .meta-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      @include font-body-l; // 18px
      color: $text-color;
      font-weight: 500;

      .icon {
        font-size: 20px;
        color: $text-color;
      }
    }
  }

  .progress-section {
    display: flex;
    align-items: center;
    gap: 12px;
    color: $text-color;

    .icon {
      font-size: 24px;
    }

    // 參考 _card.scss 的進度條邏輯，但樣式微調以符合設計圖
    .progress-track-container {
      flex-grow: 1;
      height: 12px;
      background-color: transparent; // 背景透明
      border: 1px solid $text-color; // 深色邊框
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      max-width: 200px;

      .track-bg {
        // 如果需要底色可在此設定
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .track-fill {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background-color: $primary-color;
        border-radius: 10px;
        transition: width 0.5s ease;
      }
    }

    .people-count {
      @include font-body-l;
      font-weight: bold;
    }
  }
}

// 詳情區塊樣式
.details-row {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}

.content-box{
  padding: 24px;
  min-height: 200px; // 確保高度一致
  height: 100%;
}


// 活動簡介 
.desc-box {
  width: 100%;
  background-color: $card-color;

  .section-text {
    @include font-body;
    line-height: 1.8;
    color: $text-color;
    text-align: justify;
  }
}

//注意事項 
.notice-box {
  width: 100%;
  background-color: none;
  border: 2px solid $card-color;

  .notice-list {
    padding-left: 20px;
    margin: 0;

    li {
      margin-bottom: 4px;
      @include font-body;
      line-height: 1.6;
      color: $text-color;
      list-style-type: disc; // 圓點
    }
  }
}

.section-title {
  @include font-body-l;
  font-weight: bold;
  margin-bottom: 24px;
  color: $primary-color;
}

// --- RWD 調整 ---
@media (min-width: 768px) {

  .info-content,
  .content-box {
    padding: 24px;
  }

  

  .hero-row {
    flex-wrap: nowrap;

  }

  .info-content {
    .info-header {
      .bookmark {
        font-size: 40px;
      }
    }
  }

  .details-row {
    flex-direction: row;
  }

  .hero-image-col .pic {
    flex-direction: row;
    min-height: 250px;
  }

  .desc-col, .notice-col{
  width: 50%;
}
}
</style>