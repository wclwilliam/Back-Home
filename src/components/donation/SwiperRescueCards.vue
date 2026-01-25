<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import RescueCard from '../cards/RescueCard.vue'
import { publicApi } from '@/utils/publicApi'
import { ref, onMounted } from 'vue';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards,Navigation } from 'swiper/modules';


const rescueCases = ref([])

onMounted(() => {
  publicApi.get('data/rescueCases.json').then((response) => {
    rescueCases.value = response.data
  })
})

// 定義變數，這會自動暴露給 template
const modules = [EffectCards,Navigation];
</script>
<template>
  <swiper
    :effect="'cards'"
    :grab-cursor="true"
    :modules="modules"
    :navigation="true"
    class="mySwiper"
  >
    <swiper-slide v-for="rescueCase in rescueCases" :key="rescueCase.id">
        <RescueCard 
            v-bind="rescueCase"
            class="col-sm-12 col-md-12 col-lg-12"></RescueCard>
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
      
      /* 改變大小 */
      // --swiper-navigation-size: 25px; 
      
      /* 垂直位置調整 (預設是 50%) */
      // top: 90%; 
    }

    /* 調整左右水平位置 */
    :deep(.swiper-button-next) {
      right: -30%;
    }
    :deep(.swiper-button-prev) {
      left: -30%;
    }
    @media (width<=768px) {
      :deep(.swiper-button-next::after),
      :deep(.swiper-button-prev::after) {
        display: none; /* 隱藏原本的箭頭圖示字體 */
      }
    }
    @media (width<=550px){
      width: 90%;
    }
    }
</style>