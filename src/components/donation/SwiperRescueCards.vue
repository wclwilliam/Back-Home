<script setup>
// 1. 直接導入組件，在 <script setup> 中導入後即可在 template 直接使用
import { Swiper, SwiperSlide } from 'swiper/vue';
import RescueCard from '../cards/RescueCard.vue';

// 2. 導入樣式
import 'swiper/css';
import 'swiper/css/effect-cards';

// 3. 導入模組
import { EffectCards } from 'swiper/modules';

// 4. 定義變數，這會自動暴露給 template
const modules = [EffectCards];
</script>
<template>
  <swiper
    :effect="'cards'"
    :grab-cursor="true"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide v-for="item in 9">
        <RescueCard v-bind="{
            id: 1,
            image: 'https://picsum.photos/300/200',
            name: '阿福',
            species:'(綠蠵龜)',
            description: '2025年10月發現於澎湖龍門沙灘，遭廢棄漁網纏繞導致左前肢壞死。阿福剛來時極度虛弱，經過截肢手術後，目前正在練習用三隻鰭狀肢游泳，每天的餐費與藥費是牠最大的支柱。',
            stage: 2 //階段：1~5
            }"
            class="col-sm-12 col-md-12 col-lg-12"></RescueCard>
    </swiper-slide>
  </swiper>
</template>



<style scoped lang="scss">
/* 如果有需要針對此組件調整 Swiper 容器大小，可以在這裡寫 CSS */
.mySwiper {
    width: 60%;
    }
</style>