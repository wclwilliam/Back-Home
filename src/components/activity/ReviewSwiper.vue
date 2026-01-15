<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import ReviewCard from '@/components/activity/ReviewCard.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => []
  }
})

// --- 資料處理 ---
const topMessages = computed(() => {
  const half = Math.ceil(props.messages.length / 2)
  return props.messages.slice(0, half)
})

const bottomMessages = computed(() => {
  const half = Math.ceil(props.messages.length / 2)
  return props.messages.slice(half)
})

// --- Swiper 實體控制 ---
const topSwiperRef = ref(null)
const btmSwiperRef = ref(null)
const timer = ref(null)

// 當 Swiper 初始化完成，把實體存起來
const onTopSwiper = (swiper) => {
  topSwiperRef.value = swiper
}
const onBtmSwiper = (swiper) => {
  btmSwiperRef.value = swiper
}

// --- 手動計時器邏輯 ---
const startPlay = () => {
  // 避免重複啟動
  if (timer.value) return
  
  // 設定每 3000ms 執行一次
  timer.value = setInterval(() => {
    // 命令上層切換下一張
    if (topSwiperRef.value) {
      topSwiperRef.value.slideNext()
    }
    // 命令下層切換下一張 (因為設定了反向，所以視覺上是往反方向跳)
    if (btmSwiperRef.value) {
      btmSwiperRef.value.slideNext()
    }
  }, 3000)
}

const stopPlay = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 生命週期：掛載時開始跑，卸載時清除計時器
onMounted(() => {
  startPlay()
})

onUnmounted(() => {
  stopPlay()
})

// --- RWD 設定 ---
const breakpointsConfig = {
  '576': { slidesPerView: 2.3, spaceBetween: 16 },
  '1024': { slidesPerView: 3.5, spaceBetween: 24 }
}
</script>

<template>
  <div 
    class="review-swiper-wrapper"
    @mouseenter="stopPlay"
    @mouseleave="startPlay"
  >
    
    <swiper
      class="swiper-row mb-4"
      :slides-per-view="1.2"
      :space-between="16"
      :loop="true"
      :speed="800"
      :breakpoints="breakpointsConfig"
      @swiper="onTopSwiper"
    >
      <swiper-slide v-for="(item, index) in topMessages" :key="`top-${index}`">
        <ReviewCard :review="item" />
      </swiper-slide>
    </swiper>

    <swiper
      class="swiper-row"
      :slides-per-view="1.2"
      :space-between="16"
      :loop="true"
      :speed="800"
      :reverseDirection="true"
      :breakpoints="breakpointsConfig"
      @swiper="onBtmSwiper"
    >
      <swiper-slide v-for="(item, index) in bottomMessages" :key="`btm-${index}`">
        <ReviewCard :review="item" />
      </swiper-slide>
    </swiper>

  </div>
</template>

<style lang="scss" scoped>
.review-swiper-wrapper {
  width: 100%;
  padding: 20px 0;
  overflow: hidden;
}

.swiper-row {
  width: 100%;
  padding: 10px 0; 
  // 保持 ease-out 效果，不要 linear
}

.mb-4 {
  margin-bottom: 24px;
}
</style>