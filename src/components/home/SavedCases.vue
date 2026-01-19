<script setup>
import RescueCard from '@/components/cards/RescueCard.vue'
import { ref, onMounted } from 'vue'
import { publicApi } from '@/utils/publicApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const rescueCases = ref([])

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
          :space-between="20"
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
        <button class="donate-btn">贊助我們，救助更多海龜</button>
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
      padding-bottom: 30px;
    }
  }

  // 底部按鈕
  .bottom-action {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .donate-btn {
      @include font-body-l-bold;
      background-color: transparent;
      color: $primary-color;
      border: 2px solid $primary-color;
      padding: 12px 32px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: $primary-color;
        color: $text-white;
      }
    }
  }
}
</style>
