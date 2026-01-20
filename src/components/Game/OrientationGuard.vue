<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 判斷是否為手機裝置
 * - pointer: coarse：觸控裝置
 * - max-width: 820：你專案的手機/小平板門檻
 */
const isMobileDevice = () => {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const smallWidth = window.matchMedia?.('(max-width: 820px)').matches ?? window.innerWidth <= 820
  return coarse && smallWidth
}

const mobile = ref(false)
const portrait = ref(false)

let mqlPortrait = null
let mqlMobile = null

const update = () => {
  mobile.value = isMobileDevice()
  portrait.value = mqlPortrait ? mqlPortrait.matches : window.innerHeight >= window.innerWidth
  updateBodyScroll()
}

const updateBodyScroll = () => {
  // 手機直向時隱藏滾動條
  if (mobile.value && portrait.value) {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
}

onMounted(() => {
  mqlPortrait = window.matchMedia('(orientation: portrait)')
  mqlMobile = window.matchMedia('(max-width: 820px)')

  update()

  // 只監聽真正會變的狀態
  mqlPortrait.addEventListener('change', update)
  mqlMobile.addEventListener('change', update)
})

onBeforeUnmount(() => {
  if (mqlPortrait) mqlPortrait.removeEventListener('change', update)
  if (mqlMobile) mqlMobile.removeEventListener('change', update)
  mqlPortrait = null
  mqlMobile = null

  // 卸載時恢復滾動
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

/* 手機 + 直向 → 顯示遮罩 */
const showGate = computed(() => mobile.value && portrait.value)

watch(showGate, (v) => console.log('showGate', v, window.innerWidth, window.innerHeight), { immediate: true })
</script>

<template>
  <div class="orientation-guard">
    <slot />

    <div v-if="showGate" class="portrait-gate">
      <div class="bg" />

      <div class="content">
        <div class="phone-icon">
          <div class="phone" />
          <span class="rotate">↻</span>
        </div>

        <h2>請將手機旋轉為橫向</h2>
        <p>本遊戲僅支援橫向模式，轉過來就可以開始旅程囉！</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orientation-guard {
  position: relative;
  height: 100dvh;
  overflow: hidden;
}

/* 遮罩 */
.portrait-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  overflow: hidden;
}

/* 海底背景（可換成圖片） */
.bg {
  position: absolute;
  inset: 0;
  background-image: url('/game-img/wave.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 內容 */
.content {
  position: relative;
  padding: 20px 18px;
  width: min(90vw, 420px);
  text-align: center;
  color: rgba(255, 255, 255, 0.92) !important;

  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  @include font-caption;
}

.phone-icon {
  position: relative;
  width: 90px;
  height: 150px;
  margin: 0 auto 12px;
}

.phone {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transform: rotate(-10deg);
}

.rotate {
  position: absolute;
  right: -10px;
  bottom: 6px;
  font-size: 34px;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}
</style>
