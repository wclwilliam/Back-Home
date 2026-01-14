<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
// 引入 Swiper 樣式
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// 引入 Swiper 模組
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

// 引入卡片元件
import ReviewCard from '@/components/activity/ReviewCard.vue'

// 接收來自父層的留言資料
const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 設定要使用的模組
const modules = [Autoplay, Pagination, Navigation]
</script>

<template>
  <div class="review-swiper-wrapper">
    <swiper
      :modules="modules"
      :slides-per-view="1"
      :space-between="20"
      :loop="true" 
      :autoplay="{
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      :pagination="{
        clickable: true,
        dynamicBullets: true
      }"
      :breakpoints="{
        '576': {
          slidesPerView: 1,
          spaceBetween: 20
        },
        '768': {
          slidesPerView: 2,
          spaceBetween: 24
        },
        '1024': {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }"
      class="my-swiper"
    >
      <swiper-slide v-for="(item, index) in messages" :key="index">
        <ReviewCard :review="item" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
// 變數設定 (若無全域變數可直接改色碼)
$secondary-color: #0E6872; 

.review-swiper-wrapper {
  width: 100%;
  position: relative;
  // 下方留白給分頁點 (Pagination Bullets)
  padding-bottom: 40px; 
}

.my-swiper {
  width: 100%;
  // 四周留白，避免卡片陰影 (box-shadow) 被 overflow:hidden 切掉
  padding: 10px; 
}

// --- 自訂 Swiper 分頁點樣式 ---
// 使用 :deep() 來穿透 scoped 樣式
:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  background-color: #ccc;
  opacity: 0.6;
  transition: all 0.3s;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: $secondary-color; // 使用你的主色
  opacity: 1;
  width: 20px; // 讓當前頁的點點變長條形
  border-radius: 5px;
}
</style>