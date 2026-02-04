<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import RescueCard from '../cards/RescueCard.vue'
import { publicApi, backHomeApi } from '@/utils/publicApi'
import { ref, onMounted } from 'vue'

import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation';

import { EffectCards,Navigation } from 'swiper/modules'

const rescueCases = ref([])

// 連資料庫
onMounted(async () => {
  await backHomeApi.get('./savedcases/rescue_get.php').then((response) => {
    rescueCases.value = response.data
  })
})

// 連json
// onMounted(() => {
//   publicApi.get('data/rescueCases.json').then((response) => {
//     rescueCases.value = response.data
//   })
// })

// 定義變數，這會自動暴露給 template
const modules = [EffectCards,Navigation]
</script>
<template>
  <swiper :navigation="true" :effect="'cards'" :grab-cursor="true" :modules="modules" class="mySwiper">
    <swiper-slide v-for="rescueCase in rescueCases" :key="rescueCase.id">
      <RescueCard v-bind="rescueCase" class="col-sm-12 col-md-12 col-lg-12"></RescueCard>
    </swiper-slide>
  </swiper>
</template>

<style scoped lang="scss">
.mySwiper {
  width: 60%;
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    /* 改變顏色 */
    color: $secondary-color; 
    
    
  }

  /* 調整左右水平位置 */
  :deep(.swiper-button-next) {
    right: -30%;
  }
  :deep(.swiper-button-prev) {
    left: -30%;
  }
  @media (width<=550px) {
    width: 90%;
    :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none;
  }
  }
}
</style>
