<script setup>
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const expertList = ref([])

onMounted(() => {
  axios.get('/data/experts.json').then((response) => {
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
        :space-between="20"
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
.swiper {
  padding-bottom: 30px;
}
</style>
