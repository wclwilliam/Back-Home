<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 只負責：
 * - 判斷手機 / 直橫向
 * - 嘗試進出 Fullscreen
 * - 在 console 印狀態（重點）
 */

const MOBILE_BREAKPOINT = 820

const mobile = ref(false)
const portrait = ref(false)
const fullscreen = ref(false)

let mqlPortrait = null
let mqlMobile = null
let fullscreenLock = false

const getRootEl = () => document.querySelector('.orientation-guard')

/* 判斷是否手機 */
const isMobileDevice = () => {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const smallWidth =
    window.matchMedia?.(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches ??
    window.innerWidth <= MOBILE_BREAKPOINT
  return coarse && smallWidth
}

/* 同步方向 & 裝置 */
const syncOrientation = () => {
  mobile.value = isMobileDevice()
  portrait.value = mqlPortrait
    ? mqlPortrait.matches
    : window.innerHeight >= window.innerWidth
}

/* 同步 fullscreen 狀態 */
const syncFullscreen = () => {
  fullscreen.value = !!document.fullscreenElement
}

/* 嘗試進入全螢幕（手機橫向） */
const enterFullscreen = async () => {
  if (!mobile.value || portrait.value || fullscreen.value || fullscreenLock) return

  const root = getRootEl()
  if (!root?.requestFullscreen || !document.fullscreenEnabled) {
    console.warn('[Fullscreen] ❌ 瀏覽器不支援 Fullscreen API')
    return
  }

  fullscreenLock = true
  try {
    await root.requestFullscreen()
    syncFullscreen()
  } catch (err) {
    console.warn('[Fullscreen] ❌ requestFullscreen 失敗', err)
  } finally {
    setTimeout(() => (fullscreenLock = false), 200)
  }
}

/* 嘗試離開全螢幕（手機直向） */
const exitFullscreen = async () => {
  if (!fullscreen.value || fullscreenLock) return

  fullscreenLock = true
  try {
    await document.exitFullscreen()
    syncFullscreen()
  } catch (err) {
    console.warn('[Fullscreen] ❌ exitFullscreen 失敗', err)
  } finally {
    setTimeout(() => (fullscreenLock = false), 200)
  }
}

/* ===== Console Debug 核心 ===== */
const logState = (from = '') => {
  console.log(
    `%c[OrientationGuard${from ? ' - ' + from : ''}]`,
    'color:#4fc3f7;font-weight:bold;',
    {
      mobile: mobile.value,
      portrait: portrait.value,
      fullscreen: fullscreen.value,
      landscapeFullscreen:
        mobile.value && !portrait.value && fullscreen.value,
      fullscreenElement: document.fullscreenElement,
    }
  )
}

onMounted(() => {
  mqlPortrait = window.matchMedia('(orientation: portrait)')
  mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)

  syncOrientation()
  syncFullscreen()
  logState('mounted')

  mqlPortrait.addEventListener('change', () => {
    syncOrientation()
    logState('orientation-change')
  })

  mqlMobile.addEventListener('change', () => {
    syncOrientation()
    logState('width-change')
  })

  document.addEventListener('fullscreenchange', () => {
    syncFullscreen()
    logState('fullscreen-change')
  })
})

onBeforeUnmount(() => {
  mqlPortrait?.removeEventListener('change', syncOrientation)
  mqlMobile?.removeEventListener('change', syncOrientation)
})

/* 只在狀態「真的變了」時處理 fullscreen */
watch([mobile, portrait], async ([m, p]) => {
  logState('watch')

  if (!m) return
  if (!p) {
    await enterFullscreen()
  } else {
    await exitFullscreen()
  }
})

/* 手機直向遮罩 */
const showGate = computed(() => mobile.value && portrait.value)
</script>

<template>
  <div class="orientation-guard">
    <slot />

    <div v-if="showGate" class="portrait-gate">
      <div class="bg" />
      <div class="content">
        <h2>請將手機旋轉為橫向</h2>
        <p>本遊戲僅支援橫向模式</p>
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

.portrait-gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
}

.bg {
  position: absolute;
  inset: 0;
  background: #001f2d;
}

.content {
  position: relative;
  padding: 20px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}
</style>
