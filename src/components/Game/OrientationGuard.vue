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
  const smallScreen = ref(false)

  let mqlPortrait = null
  let mqlMobile = null

  const update = () => {
    mobile.value = isMobileDevice()
    smallScreen.value = mqlMobile ? mqlMobile.matches : window.innerWidth <= 820
    portrait.value = mqlPortrait ? mqlPortrait.matches : window.innerHeight >= window.innerWidth
    updateBodyScroll()
  }

  const updateBodyScroll = () => {
    // 小螢幕直向時隱藏滾動條，其他情況允許滾動
    const shouldHideScroll = smallScreen.value && portrait.value
    document.documentElement.style.overflow = shouldHideScroll ? 'hidden' : 'auto'
    document.body.style.overflow = shouldHideScroll ? 'hidden' : 'auto'
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

  /* 寬度 <= 820px + 直向 → 顯示遮罩（手機） */
  /* 寬度 <= 820px + 桌機 → 顯示遮罩（桌機） */
  const showGate = computed(() => {
    if (smallScreen.value && portrait.value) return true // 小螢幕直向
    if (smallScreen.value && !mobile.value) return true // 桌機小螢幕
    return false
  })

  const isDesktop = computed(() => !mobile.value && smallScreen.value)

  watch(showGate, (v) => console.log('showGate', v, window.innerWidth, window.innerHeight), { immediate: true })
</script>

  <template>
    <div class="orientation-guard">
      <slot />

      <div v-if="showGate" class="portrait-gate">
        <div class="bg" />

        <div class="content">
          <!-- 手機：顯示旋轉提示 -->
          <template v-if="!isDesktop">
            <div class="phone-icon">
              <div class="phone" />
              <span class="rotate">↻</span>
            </div>
            <h2>請將手機旋轉為橫向</h2>
            <p>本遊戲僅支援橫向模式，轉過來就可以開始旅程囉！</p>
          </template>

          <!-- 桌機：顯示解析度提示 -->
          <template v-else>
            <div class="desktop-icon">
              <span class="screen">🖥️</span>
            </div>
            <h2>螢幕寬度不足</h2>
            <p>請將瀏覽器視窗寬度調整為 820px 以上，或使用更大的螢幕來遊玩。</p>
          </template>
        </div>
      </div>
    </div>
  </template>

<style lang="scss" scoped>
.orientation-guard {
  position: relative;
  height: calc(100dvh - clamp(84px, 8vw, 100px)) !important;
  overflow-y: auto;

  /* 手機橫向：填滿整個視窗 */
  @media (max-width: 820px) or (orientation: landscape) {
    height: 100dvh;
  }
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
  background-image: url('/game-img/wave.png');
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
  color: #153450 !important;

  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #153450;
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  @include font-caption;

  h2 {
    color: #153450;
    margin-bottom: 8px;
  }

  p {
    color: #153450;
  }
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
  border: 3px solid #153450;
  transform: rotate(-10deg);
}

.rotate {
  position: absolute;
  right: -10px;
  bottom: 6px;
  font-size: 34px;
  color: #153450;
  animation: pulse 1.4s ease-in-out infinite;
}

.desktop-icon {
  width: 100%;
  height: 120px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen {
  font-size: 64px;
  filter: grayscale(100%) brightness(0.3);
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
