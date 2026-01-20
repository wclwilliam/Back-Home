<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import RescueCard from '../cards/RescueCard.vue';
import { publicApi } from '@/utils/publicApi'
import { ref, onMounted } from 'vue';

import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from 'swiper/modules';


const rescueCases = ref([])

onMounted(() => {
  publicApi.get('data/rescueCases.json').then((response) => {
    rescueCases.value = response.data
  })
})

// 定義變數，這會自動暴露給 template
const modules = [EffectCards];
</script>
<template>
  <swiper
    :effect="'cards'"
    :grab-cursor="true"
    :modules="modules"
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
    @media (width<=550px){
      width: 90%;
    }
    }
</style>