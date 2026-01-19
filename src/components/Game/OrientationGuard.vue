<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

/* 判斷是否為手機裝置 */
const isMobileDevice = () => {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const smallWidth = window.innerWidth <= 820
  return coarse && smallWidth
}

const isLandscape = () => window.innerWidth > window.innerHeight

const mobile = ref(false)
const landscape = ref(true)

const update = () => {
  mobile.value = isMobileDevice()
  landscape.value = isLandscape()
}

onMounted(() => {
  update()
  window.addEventListener('resize', update, { passive: true })
  window.addEventListener('orientationchange', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', update)
  window.removeEventListener('orientationchange', update)
})

/* 手機 + 直向 → 顯示遮罩 */
const showGate = computed(() => mobile.value && !landscape.value)
</script>

<template>
  <div class="orientation-guard">
    <!-- 遊戲內容 -->
    <slot />

    <!-- 手機直向提示畫面 -->
    <div v-if="showGate" class="portrait-gate">
      <div class="bg" />

      <div class="content">
        <div class="phone-icon">
          <div class="phone" />
          <span class="rotate">↻</span>
        </div>

        <h2>請將手機旋轉為橫向</h2>
        <p>本遊戲僅支援橫向模式，轉過來就可以下海冒險囉 🐢🌊</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.orientation-guard {
  position: relative;
  min-height: 100vh;
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
  background: linear-gradient(
    180deg,
    #02283d 0%,
    #011d2d 50%,
    #001523 100%
  );
}

/* 內容 */
.content {
  position: relative;
  padding: 20px 18px;
  width: min(90vw, 420px);
  text-align: center;
  color: rgba(255, 255, 255, 0.92);

  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
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
