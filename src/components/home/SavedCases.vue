<script setup>
import RescueCard from '@/components/cards/RescueCard.vue'
import { ref, onMounted } from 'vue'
import { publicApi } from '@/utils/publicApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const rescueCases = ref([])
const modules = [Pagination]

onMounted(() => {
  publicApi.get('data/rescueCases.json').then((response) => {
    rescueCases.value = response.data
  })
})
</script>

<template>
  <div class="saved-cases-section">
    <div class="container">
      <h2 class="section-title">最新救援案例</h2>

      <!-- 桌機版：Grid 佈局 -->
      <div class="row desktop-grid">
        <RescueCard
          v-for="rescueCase in rescueCases.slice(0, 3)"
          :key="rescueCase.id"
          v-bind="rescueCase"
        />
      </div>

      <!-- 手機/平板版：Swiper 輪播 -->
      <div class="mobile-swiper">
        <swiper
          :modules="modules"
          :space-between="20"
          :pagination="{ clickable: true }"
          :breakpoints="{
            // 當螢幕 >= 768px (平板)
            '768': { slidesPerView: 2 },
            // 預設 (手機)
            '0': { slidesPerView: 1 },
          }"
        >
          <SwiperSlide v-for="rescueCase in rescueCases" :key="rescueCase.id">
            <RescueCard v-bind="rescueCase" />
          </SwiperSlide>
        </swiper>
      </div>

      <!-- 底部按鈕 -->
      <div class="bottom-action">
        <router-link to="/donation" class="donate-btn btn btn-outline btn-xxl">
          贊助我們，救助更多海龜
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/color';
@import '@/assets/scss/base/font';

.saved-cases-section {
  padding: 60px 0;
  //   background-color: $background-light;

  .section-title {
    @include font-secondary;
    color: $primary-color;
    text-align: center;
    margin-bottom: 40px;
  }

  // 桌機版：Grid 佈局 (預設顯示)
  .desktop-grid {
    display: flex;
    justify-content: center;
    align-items: stretch; // 讓所有卡片等高

    @media (max-width: 1023px) {
      display: none;
    }
  }

  // 手機/平板版：Swiper 輪播 (預設隱藏)
  .mobile-swiper {
    display: none;

    @media (max-width: 1023px) {
      display: block;
    }

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
      height: auto; // 讓 slide 自動計算高度
      display: flex;
      flex-direction: column;

      // 針對 RescueCard 的 col 容器
      .col-sm-4,
      .col-md-6,
      .col-lg-4 {
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
      align-items: stretch; // 讓所有 slide 等高
    }
  }

  // 底部按鈕
  .bottom-action {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
}

@media (max-width: 480px) {
  .btn {
    font-size: $size-quaternary;
  }
}
</style>
