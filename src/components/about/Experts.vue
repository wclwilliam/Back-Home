<script setup>
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue'
import { ref, onMounted } from 'vue'
import { publicApi } from '@/utils/publicApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const expertList = ref([])
const modules = [Pagination]

onMounted(() => {
  publicApi.get('data/experts.json').then((response) => {
    expertList.value = response.data
  })
})
</script>
<template>
  <div class="container">
    <div class="row desktop-grid">
      <div class="col-lg-4 col-md-4" v-for="expert in expertList.slice(0, 3)" :key="expert.id">
        <TeamMemberCard v-bind="expert" />
      </div>
    </div>

    <div class="mobile-swiper">
      <swiper
        :modules="modules"
        :space-between="20"
        :pagination="{ clickable: true }"
        :breakpoints="{
          // 當螢幕 >= 576px (你的平板斷點)
          '576': { slidesPerView: 2 },
          // 預設 (手機)
          '0': { slidesPerView: 1 },
        }"
      >
        <SwiperSlide v-for="expert in expertList" :key="expert.id">
          <TeamMemberCard v-bind="expert" />
        </SwiperSlide>
      </swiper>
    </div>
  </div>

  <!-- <swiper :slides-per-view="1" :space-between="50" @swiper="onSwiper" @slideChange="onSlideChange">
    <SwiperSlide v-for="expert in expertList" :key="expert.id">
      <TeamMemberCard
        :image="expert.image"
        :title="expert.title"
        :jobTitle="expert.jobTitle"
        :expertise="expert.expertise"
        :description="expert.description"
      >
      </TeamMemberCard
    ></SwiperSlide>
  </swiper> -->
</template>
<style lang="scss" scoped>
// --- Desktop-First 邏輯 ---

// 1. 桌機網格 (預設顯示)
.desktop-grid {
  display: flex;

  @media (max-width: 1023px) {
    display: none;
  }
}

// 2. Swiper 輪播 (預設隱藏)
.mobile-swiper {
  display: none;

  @media (max-width: 1023px) {
    display: block;
  }
}

// 針對 Swiper 的樣式微調
.mobile-swiper {
  .swiper {
    padding-bottom: 50px; // 給分頁器留空間
  }

  // 分頁器樣式
  :deep(.swiper-pagination-bullet) {
    background: $primary-color;
    opacity: 0.5;
  }

  :deep(.swiper-pagination-bullet-active) {
    background: $secondary-color;
    opacity: 1;
  }

  // 強制 SwiperSlide 和內部卡片等高並充滿容器
  :deep(.swiper-slide) {
    height: auto;
    display: flex;
    flex-direction: column;

    // 針對 TeamMemberCard 的 col 容器
    .col-lg-4,
    .col-md-4 {
      width: 100% !important;
      max-width: 100% !important;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    // 針對 cardContainer
    .cardContainer {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    // 針對 cardInfo
    .cardInfo {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    // 針對 description 區域
    .description {
      flex: 1;
    }
  }

  // 讓 Swiper wrapper 也使用 flexbox
  :deep(.swiper-wrapper) {
    align-items: stretch;
  }
}
</style>
