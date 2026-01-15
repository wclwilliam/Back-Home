<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const bgSrc = '/game/wave.jpg'
const base = import.meta.env.BASE_URL

const { startOptions } = defineProps({
  startOptions:{type: Array, required: true},
})

const images = ['game/turtle-baby.png', 'game/turtle-teen.png', 'game/turtle-adult.png']

const swiperIns = ref(null)
const onSwiper = (swiper) => {
  swiperIns.value = swiper
}

// 如果 startOptions 有第一個選項，就把 selectedId 設為它的 id 如果沒有，就先設成空字串 ''
const selectedId = ref(startOptions[0]?.id ?? '') // baby/teen/adult

const handleSelect = (opt) => {
  selectedId.value = opt.id

  const index = startOptions.findIndex((o) => o.id === opt.id) // baby=0, teen=1, adult=2
  if (index !== -1 && swiperIns.value) { //findIndex 的規則是找不到 → 回傳 -1
    swiperIns.value.slideTo(index)
  }
}

const emit = defineEmits(['start'])
const start = () => {
  emit('start', selectedId.value)
}
</script>
<template>
  <div
      class="bg-image"
      :style="{ backgroundImage: `url(${bgSrc})` }"
    />
  <div class="game-screen">
    <div class="turtle-pic">
    <Swiper 
    :modules="[Navigation]" 
    navigation 
    class="photoSwiper"
    @swiper="onSwiper">
      <SwiperSlide v-for="(img, i) in images" :key="i">
        <img :src="base + img" alt="" />
      </SwiperSlide>
    </Swiper>
  </div>
  <button class="btn btn-solid btn-xl" @click="start">開始旅程</button>
</div>
<div class="game-question-card">
    <h2 class="question-title">你的旅程將從哪裡開始？</h2>

    <div class="options-group">
      <button
        v-for="option in startOptions"
        :key="option.id"
        :class="['btn btn-outline-game btn-xl', { 'is-active': selectedId === option.id }]"
        @click="handleSelect(option)"
      >
        {{ option.text }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.bg-image {
  position: absolute;
  inset: -5%; // 四周外擴 5%，讓背景有「緩衝區」
  background-size: cover;
  background-position: center;
  animation: waveMove 6s ease-in-out infinite;
  z-index: -1;

  /* 波浪變形層 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    opacity: 0.35;
    filter: blur(6px);
    animation: waveDistort 6s ease-in-out infinite;
  }
}

/* 整體微移 */
@keyframes waveMove {
  0% {
    transform: scale(1.05) translateY(0);
  }
  50% {
    transform: scale(1.07) translateY(-8px);
  }
  100% {
    transform: scale(1.05) translateY(0);
  }
}

/* 波浪扭曲 */
@keyframes waveDistort {
  0% {
    transform: skewX(0deg) translateX(0);
  }
  50% {
    transform: skewX(2deg) translateX(-30px);
  }
  100% {
    transform: skewX(0deg) translateX(0);
  }
}
.game-screen {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  margin: 0 auto;
  border: 1px solid $primary-color;
}
.turtle-pic {
  width: 300px;
  height: auto;
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  justify-self: center;
}
.photoSwiper img {
  width: 100%;
  height: auto;
  display: block;
}
:deep(.photoSwiper) {
  .swiper-button-next,
  .swiper-button-prev {
    width: 32px;
    height: 32px;
    color: white;
  }
}
  button{
    align-self: center;
    justify-self: start;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
  }
  p{
    @include font-body-bold;
    background-color: $primary-color;
    color: $text-white;
  }
  .game-question-card {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;

  padding: 40px 60px;

  background: linear-gradient(
    0deg, rgba(227, 213, 202, 1) 0%, rgba(227, 213, 202, 0.9) 20%, rgba(227, 213, 202, 0.8) 40%, rgba(227, 213, 202, 0.7) 60%,rgba(227, 213, 202, 0.6) 70%, rgba(227, 213, 202, 0.5) 80%, rgba(227, 213, 202, 0) 100%
  );

  z-index: 100;
}

.question-title {
  @include font-tertiary; 
}

.options-group {
  display: flex;
  gap: 32px;
}
</style>
