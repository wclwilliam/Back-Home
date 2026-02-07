<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { parsePublicFile } from '@/utils/parseFile'

const router = useRouter()

const { startOptions } = defineProps({
  startOptions: { type: Array, required: true },
})

const images = ['turtle-baby.png', 'turtle-teen.png', 'turtle-adult.png']

const swiperIns = ref(null)
const onSwiper = (swiper) => {
  swiperIns.value = swiper
}

const onSlideChange = (swiper) => {
  const index = swiper.activeIndex
  const opt = startOptions[index]

  if (opt) {
    selectedId.value = opt.id
  }
}

// 如果 startOptions 有第一個選項，就把 selectedId 設為它的 id 如果沒有，就先設成空字串 ''
const selectedId = ref(startOptions[0]?.id ?? '') // baby/teen/adult

const handleSelect = (opt) => {
  selectedId.value = opt.id

  const index = startOptions.findIndex((o) => o.id === opt.id) // baby=0, teen=1, adult=2
  if (index !== -1 && swiperIns.value) {
    //findIndex 的規則是找不到 → 回傳 -1
    swiperIns.value.slideTo(index)
  }
}

const emit = defineEmits(['start'])
const start = () => {
  emit('start', selectedId.value)
}

const goHome = () => {
  router.push({ name: 'home' })
}
</script>
<template>
  <div class="game-screen">
    <!-- 返回首頁按鈕 (僅手機橫向顯示) -->
    <button type="button" class="home-btn" @click="goHome">
      <span class="material-symbols-outlined icon-home"> home </span>
      <p>返回首頁</p>
    </button>

    <div class="turtle-pic">
      <Swiper :modules="[Navigation]" navigation class="photoSwiper" @swiper="onSwiper" @slideChange="onSlideChange">
        <SwiperSlide v-for="(img, i) in images" :key="i">
          <img :src="parsePublicFile(`game-img/${img}`)" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
    <button class="btn btn-solid btn-xxl start-btn" @click="start">開始旅程</button>

    <div class="game-question-card">
      <h2 class="question-title">你的旅程將從哪裡開始？</h2>
      <div class="options-group">
        <button v-for="option in startOptions" :key="option.id"
          :class="['btn btn-outline-game btn-xl', { 'is-active': selectedId === option.id }]"
          @click="handleSelect(option)">
          {{ option.text }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.game-screen {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 25%;
  margin: 0 auto;
}

.turtle-pic {
  width: clamp(140px, 35vw, 450px);
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  justify-self: center;
  align-self: self-end;
  transform: translateY(20%);
}

.photoSwiper img {
  width: 100%;
  height: auto;
  display: block;
  animation: breathing 3s ease-in-out infinite;
}

@keyframes breathing {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

:deep(.photoSwiper) {

  .swiper-button-next,
  .swiper-button-prev {
    width: 32px;
    height: 32px;
    color: white;
  }
}

.start-btn {
  align-self: end;
  justify-self: center;
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  z-index: 20;
  transform: translateY(100%);
}

p {
  @include font-body-bold;
  color: $text-white;
}

.game-question-card {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
  width: 100%;

  justify-self: start;
  align-self: end;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 10px 60px;

  background: linear-gradient(0deg,
      rgba(227, 213, 202, 1) 0%,
      rgba(227, 213, 202, 0.9) 20%,
      rgba(227, 213, 202, 0.8) 40%,
      rgba(227, 213, 202, 0.7) 60%,
      rgba(227, 213, 202, 0.6) 70%,
      rgba(227, 213, 202, 0.5) 80%,
      rgba(227, 213, 202, 0) 100%);

  z-index: 10;
  pointer-events: none;
}

.question-title {
  @include font-body-l-bold;
}

/* 返回首頁按鈕 - 預設隱藏 */
.home-btn {
  display: none;
  color: $text-color;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
}

p {
  @include font-body-l-bold;
}

.icon-home {
  @include icon-style($size: 40px);
}

/* 手機橫向：顯示返回首頁按鈕並縮小文字大小 (僅 767px 以下) */
@media (pointer: coarse) and (orientation: landscape) and (max-width: 767px) {
  .home-btn {
    display: block;
  }

  p {
    font-size: 14px;
    margin: 0;
  }

  .icon-home {
    @include icon-style($size: 28px);
  }

  .question-title {
    font-size: 14px;
  }

  .options-group {
    gap: 16px;

    .btn {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
}

.options-group {
  display: flex;
  gap: 32px;
  pointer-events: auto;
}

.options-group {
  .btn {
    white-space: nowrap;
  }

  .btn.is-active {
    border-color: $highlight-color2;
    color: $highlight-color2;
  }
}
</style>
