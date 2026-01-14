<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  review: {
    type: Object,
    required: true
  }
})

// --- 資料處理 ---
const userName = computed(() => props.review.name || props.review.user || '熱心志工')
const rating = computed(() => props.review.stars || props.review.rating || 5)
const comment = computed(() => props.review.text || props.review.content || '沒有留言內容')

const avatar = computed(() => {
  if (props.review.image) return props.review.image
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=random&color=fff&size=128`
})

// --- 互動邏輯 ---
const isLiked = ref(false)
const likeCount = ref(props.review.likes || 10) 
const isReported = ref(false) 
const isMenuOpen = ref(false) // [新增] 控制選單開關

const toggleLike = () => {
  isLiked.value = !isLiked.value
  if (isLiked.value) likeCount.value++
  else likeCount.value--
}

// [新增] 切換選單顯示
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleReport = () => {
  if (!isReported.value) {
    const confirmReport = confirm('確定要檢舉此則留言嗎？')
    if (confirmReport) {
      isReported.value = true
      alert('已收到您的檢舉，我們會盡快處理。')
    }
  } else {
    isReported.value = false // 取消檢舉 (測試用)
  }
  isMenuOpen.value = false // 點選後關閉選單
}
</script>

<template>
  <div class="review-card-wrapper">
    <div class="review-card">
      <div class="top-accent"></div>

      <div class="card-content">
        <div class="card-header">
          <div class="user-profile">
            <div class="avatar">
              <img :src="avatar" :alt="userName">
            </div>
            <h4 class="user-name">{{ userName }}</h4>
          </div>
          
          <div class="more-menu-container">
            <button class="icon-btn more-btn" @click="toggleMenu">
              <span class="material-symbols-outlined">more_vert</span>
            </button>

            <div v-if="isMenuOpen" class="dropdown-menu">
              <button 
                class="menu-item" 
                :class="{ 'is-active': isReported }"
                @click="handleReport"
              >
                <span class="material-symbols-outlined icon">flag</span>
                {{ isReported ? '取消檢舉' : '檢舉留言' }}
              </button>
            </div>
          </div>
        </div>

        <div class="rating-stars">
          <span 
            v-for="n in 5" 
            :key="n" 
            class="material-symbols-outlined star-icon"
            :class="{ 'filled': n <= rating }"
          >
            kid_star
          </span>
        </div>

        <div class="card-body">
          <p class="content-label">心得內容 :</p>
          <p class="content-text">{{ comment }}</p>
        </div>

        <div class="card-footer">
          <div class="action-group">
            <button 
              class="icon-btn action-btn like-btn" 
              :class="{ 'active': isLiked }"
              @click="toggleLike"
              title="覺得實用"
            >
              <span class="material-symbols-outlined">
                {{ isLiked ? 'thumb_up' : 'thumb_up_off_alt' }}
              </span>
              <span class="count">{{ likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';
@import '@/assets/scss/base/_color.scss';
@import '@/assets/scss/base/_font.scss';


$text-light: #666;

.review-card-wrapper {
  padding: 10px;
  height: 100%;
}

.review-card {
  background-color: $activity-comment-card;
  // overflow: hidden; // [注意] 移除 hidden，避免下拉選單被切掉
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; // 為了讓 top-accent 定位

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  // 頂部裝飾條 (改用絕對定位以兼容圓角)
  .top-accent {
    position: absolute;
    top: 0;
    left: 0;
    height: 8px;
    background-color: $highlight-color3;
    width: 100%;
  }

  .card-content {
    padding: 20px 24px 16px 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 8px; // 避開裝飾條
  }

  // --- Header ---
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;

      .avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .user-name {
        font-size: $size-body-l;
        font-weight: bold;
        color: $text-color;
        margin: 0;
      }
    }

    // --- [新增] 下拉選單樣式 ---
    .more-menu-container {
      position: relative; // 讓下拉選單以此為定位基準

      .more-btn {
        color: $text-color;
        opacity: 0.7;
        transition: opacity 0.2s;
        &:hover { opacity: 1; }
      }

      .dropdown-menu {
        position: absolute;
        top: 100%; // 在按鈕正下方
        right: 0;
        background-color: #fff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 4px 0;
        z-index: 10;
        min-width: 120px;
        border: 1px solid #eee;

        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: $text-color;
          text-align: left;
          transition: background 0.2s;

          .icon {
            font-size: 18px;
            color: #999;
          }

          &:hover {
            background-color: #f5f5f5;
            color: $highlight-color2;
            .icon { color: $highlight-color2; }
          }

          // 已檢舉狀態
          &.is-active {
            color: $highlight-color2;
            .icon { 
              color: $highlight-color2; 
              font-variation-settings: 'FILL' 1;
            }
          }
        }
      }
    }
  }

  // --- Rating ---
  .rating-stars {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    padding-left: 2px;

    .star-icon {
      font-size: 24px;
      color: #E0E0E0;
      font-variation-settings: 'FILL' 1;

      &.filled {
        color: $highlight-color3;
      }
    }
  }

  // --- Body ---
  .card-body {
    flex-grow: 1;
    margin-bottom: 20px;

    .content-label {
      font-size: $size-body;
      font-weight: bold;
      color: $text-color;
      margin-bottom: 8px;
    }

    .content-text {
      font-size: $size-body;
      color: $text-color;
      line-height: 1.6;
      text-align: justify;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  // --- Footer ---
  .card-footer {
    display: flex;
    justify-content: flex-end;
    
    .action-group {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      color: $text-color;
      font-weight: bold;
      font-size: 16px;
      transition: all 0.2s;
      opacity: 0.6;

      .material-symbols-outlined {
        font-size: 24px;
      }

      &:hover {
        opacity: 1;
      }

      &.like-btn.active {
        color: $highlight-color2;
        opacity: 1;
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 1;
        }
      }
    }
  }
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>