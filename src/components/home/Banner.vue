<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 註冊 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger)

// 圖片路徑
const plasticBag = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 05_27_11 PM.png',
  import.meta.url,
).href
const fishingNet = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 05_33_05 PM.png',
  import.meta.url,
).href
const brick = new URL(
  '@/assets/image/home/banner/ChatGPT Image Jan 20, 2026, 08_25_38 PM.png',
  import.meta.url,
).href
const turtle = new URL(
  '@/assets/image/home/banner/u9296394725_A_detailed_photograph_of_a_green_sea_turtle_swimm_154b75b3-b51a-441a-bc29-812c6c3e99fc_1-removebg-preview.png',
  import.meta.url,
).href
const oceanBg = new URL(
  '@/assets/image/home/banner/u9296394725_Prompt_Vertical_scrollytelling_background._A_tiny_s_aca6ac48-c9e3-4260-b767-a41c78175a9d_waifu2x_noise0_scale4x.png',
  import.meta.url,
).href

const containerRef = ref(null)
const bgImageElRef = ref(null)
const isLoading = ref(true)

onMounted(() => {
  // 等待背景圖片加載完成後設置容器高度
  const bgImg = bgImageElRef.value
  if (bgImg) {
    if (bgImg.complete) {
      onImageLoaded()
    } else {
      bgImg.addEventListener('load', onImageLoaded)
    }
  } else {
    onImageLoaded()
  }
})

const onImageLoaded = () => {
  isLoading.value = false
  // 稍微延遲以確保 DOM 更新
  setTimeout(() => {
    initAnimation()
  }, 100)
}

const initAnimation = () => {
  // ==================== 1. 設定初始狀態 (重點修改) ====================

  // 海龜初始位置
  gsap.set('.turtle-wrapper', {
    y: '10vh',
    x: '-60vw', // 讓海龜離邊緣近一點，這樣一開始游動就會馬上出現
    scale: 0.7,
    scaleX: 0.7,
    opacity: 1,
    rotationY: 0, // 確保一開始是正面
  })

  // 垃圾預設隱藏
  gsap.set('.trash-item', { opacity: 0 })

  // 【修改點 A】文字一：直接設為顯示，不用等滾動才淡入
  // 這樣使用者一進來就看得到，且不會有 "太晚出現" 的感覺
  gsap.set('.text-stage-1', { opacity: 1, y: 0 })

  // 文字二、三：預設隱藏，往下移一點點準備浮上來
  gsap.set('.text-stage-2, .text-stage-3', { opacity: 0, y: 50 })

  // ==================== 2. 獨立的海龜游動動畫 (大幅修改) ====================
  // 縮小游動範圍 (70vw) 並加快速度 (9s)，減少畫面外的等待時間
  const turtleSwim = gsap.timeline({ repeat: -1 })

  turtleSwim
    // --- 往右游 ---
    .to('.turtle-wrapper', {
      x: '60vw', // 剛好游出畫面右側即可，不用游太遠
      rotation: 5, // 身體微傾
      duration: 11, // 加快速度 (原本12s)
      ease: 'sine.inOut',
    })
    // --- 瞬間轉身 (鏡像翻轉) ---
    // 使用 rotationY: 180 來翻轉，才不會跟 ScrollTrigger 的 scale 衝突
    .set('.turtle-wrapper', { rotationY: 180 })
    // --- 往左游 (游回來) ---
    .to('.turtle-wrapper', {
      x: '-60vw', // 游回左側起始點
      rotation: -5,
      duration: 9, // 速度一致
      ease: 'sine.inOut',
    })
    // --- 瞬間轉身 (轉回正面) ---
    .set('.turtle-wrapper', { rotationY: 0 })

  gsap.to('.turtle-wrapper', {
    y: '+=15vh',
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })

  // ==================== 3. 主滾動時間軸 (重點修改) ====================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.ocean-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2, // 增加到 2，創造「水阻感」，讓動畫更滑順不抖動
    },
  })

  // 海龜變慢 (保持不變)
  gsap.to(turtleSwim, {
    timeScale: 0.5,
    scrollTrigger: {
      trigger: '.ocean-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 2,
    },
  })

  // ==================== 定義時間軸節點 (關鍵修改) ====================
  // 把總時長拉得更長 (30單位)，讓每個階段的過渡更從容

  tl.addLabel('start', 0)
    .addLabel('text1_fade', 3) // 讓第一段字停留久一點再消失
    .addLabel('stage2_enter', 6) // 垃圾進場
    .addLabel('text2_in', 9) // 第二段字出現
    .addLabel('text2_out', 13) // 第二段字消失 (停留時間加長)
    .addLabel('deep_sea', 16) // 進入深海
    .addLabel('text3_in', 22) // 最終文字出現
    .addLabel('end', 30)

  // ---------------- [階段一：美好瞬間] ----------------
  tl.to(
    '.text-stage-1',
    {
      opacity: 0,
      y: -50, // 往上飄走，視覺引導更好
      duration: 2, // 持續時間加長
      ease: 'power1.out',
    },
    'text1_fade',
  )

  // ---------------- [階段二：危機入侵] ----------------
  // 背景變暗
  tl.to('.bg-gradient', { opacity: 0.8, duration: 4 }, 'stage2_enter')

  // 垃圾漂入 (使用 ease: 'power1.out' 讓垃圾有「被水流推過來然後慢慢減速」的自然感)
  tl.to('#trash-1', { opacity: 0.8, x: '10vw', duration: 4, ease: 'power1.out' }, 'stage2_enter')
    .to(
      '#trash-2',
      { opacity: 0.7, x: '-15vw', duration: 4, ease: 'power1.out' },
      'stage2_enter+=1',
    )
    .to(
      '#trash-3',
      { opacity: 0.75, x: '8vw', y: '-10vh', duration: 4, ease: 'power1.out' },
      'stage2_enter+=2',
    )

  // 第二段文字：進場 -> 停留 -> 離場
  tl.to(
    '.text-stage-2',
    {
      opacity: 1,
      y: 0,
      duration: 1.5,
    },
    'text2_in',
  )

  tl.to(
    '.text-stage-2',
    {
      opacity: 0,
      y: -30,
      duration: 1.5,
    },
    'text2_out',
  )

  // ---------------- [階段三：深海與絕望] ----------------
  // 更多垃圾
  tl.to(
    '#trash-4',
    { opacity: 0.8, x: '-12vw', y: '-8vh', duration: 4, ease: 'power1.out' },
    'deep_sea',
  )
    .to(
      '#trash-5',
      { opacity: 0.7, x: '-18vw', y: '12vh', duration: 4, ease: 'power1.out' },
      'deep_sea+=1',
    )
    .to(
      '#trash-6',
      { opacity: 0.75, x: '15vw', y: '15vh', duration: 4, ease: 'power1.out' },
      'deep_sea+=2',
    )

  // 環境變更暗
  tl.to('.bg-gradient', { opacity: 0.95, duration: 5 }, 'deep_sea').to(
    '.ocean-overlay',
    { opacity: 0.6, duration: 5 },
    'deep_sea',
  )

  // 【關鍵修正】海龜變暗但保持細節
  // 移除 contrast(0.7)，改用 brightness(0.6) contrast(1.1) sepia(0.2)
  // 這樣海龜會變暗融入深海，但保留龜殼紋路細節，不會變成灰色剪影
  tl.to(
    '.turtle-wrapper',
    {
      filter: 'brightness(0.6) contrast(1.1) sepia(0.2)',
      duration: 5,
    },
    'deep_sea',
  )

  // 第三段文字 (最終警語)
  tl.to(
    '.text-stage-3',
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 3,
      ease: 'back.out(1.2)', // 彈跳效果稍微減輕，更優雅
    },
    'text3_in',
  )

  // 額外效果：海龜隨深度壓迫感 (ScrollTrigger 單獨控制)
  // 只保留縮放效果，filter 交給主時間軸控制，避免動畫衝突
  gsap.to('.turtle-wrapper', {
    scale: '-=0.1', // 縮小幅度稍微加大，更有深淵感
    scrollTrigger: {
      trigger: '.ocean-container',
      start: '60% top',
      end: 'bottom bottom',
      scrub: 2,
    },
  })
}

onUnmounted(() => {
  // 清理 ScrollTrigger 實例
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div class="ocean-container" ref="containerRef">
    <!-- 載入中的 Loading 動畫 -->
    <div class="loading-screen" :class="{ 'fade-out': !isLoading }">
      <div class="loading-content">
        <div class="loading-turtle">
          <img :src="turtle" alt="載入中" />
        </div>
        <div class="loading-waves">
          <div class="wave wave1"></div>
          <div class="wave wave2"></div>
          <div class="wave wave3"></div>
        </div>
        <p class="loading-text">海洋正在等待你...</p>
      </div>
    </div>

    <!-- 背景漸變層 -->
    <div class="bg-gradient"></div>
    <div class="ocean-overlay"></div>

    <!-- 背景圖片 -->
    <div class="bg-image" :class="{ loaded: !isLoading }">
      <img :src="oceanBg" alt="ocean background" ref="bgImageElRef" />
    </div>

    <!-- Sticky 視窗層 - 在 banner 區域內固定，離開時跟隨滾動 -->
    <div class="sticky-viewport">
      <!-- 海龜主體層 -->
      <div class="turtle-wrapper">
        <img :src="turtle" alt="海龜" class="turtle" />
      </div>

      <!-- 垃圾層 -->
      <div class="trash-layer">
        <!-- 階段二的垃圾 -->
        <img :src="plasticBag" alt="塑膠袋" class="trash-item" id="trash-1" />
        <img :src="fishingNet" alt="漁網" class="trash-item" id="trash-2" />

        <!-- 階段三的垃圾 -->
        <img :src="brick" alt="磚塊" class="trash-item" id="trash-3" />
        <img :src="plasticBag" alt="塑膠袋" class="trash-item" id="trash-4" />
        <img :src="fishingNet" alt="漁網" class="trash-item" id="trash-5" />
        <img :src="brick" alt="磚塊" class="trash-item" id="trash-6" />
      </div>

      <!-- 文字敘事層 -->
      <div class="text-layer">
        <div class="text-stage-1">
          <h2>海洋是牠們的家...</h2>
          <p>蔚藍的世界，寧靜而廣闊</p>
        </div>

        <div class="text-stage-2">
          <h2>但危機正在靠近</h2>
          <p>人類的垃圾開始出現在海洋中</p>
        </div>

        <div class="text-stage-3">
          <h2>卻成了最危險的地方</h2>
          <p>我們還給大海的，只有傷害</p>
        </div>
      </div>

      <!-- 氣泡裝飾 -->
      <div class="bubbles">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </div>
    </div>
    <!-- /Sticky 視窗層 -->
  </div>
</template>

<style lang="scss" scoped>
.ocean-container {
  position: relative;
  width: 100%;
  height: 600vh; // 增加高度讓滾動節奏更優雅，使用者有更多時間體驗動畫
  min-height: 100vh; // 確保至少有一個視窗高度
  overflow: visible;
  isolation: isolate; // 創建新的層疊上下文，不影響外部
}

// 載入中的 Loading 動畫
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    180deg,
    rgba(79, 179, 212, 0.95) 0%,
    rgba(42, 122, 158, 0.95) 50%,
    rgba(26, 77, 92, 0.95) 100%
  );
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s ease;

  &.fade-out {
    opacity: 0;
    pointer-events: none;
  }
}

.loading-content {
  text-align: center;
  position: relative;
}

.loading-turtle {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  animation: turtle-swim 2s ease-in-out infinite;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3));
  }
}

@keyframes turtle-swim {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(-3deg);
  }
  75% {
    transform: translateY(-10px) rotate(3deg);
  }
}

.loading-waves {
  position: relative;
  width: 200px;
  height: 40px;
  margin: 0 auto 1.5rem;
}

.wave {
  position: absolute;
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: wave-pulse 1.5s ease-in-out infinite;

  &.wave1 {
    animation-delay: 0s;
  }

  &.wave2 {
    animation-delay: 0.3s;
    opacity: 0.7;
  }

  &.wave3 {
    animation-delay: 0.6s;
    opacity: 0.5;
  }
}

@keyframes wave-pulse {
  0%,
  100% {
    transform: scaleX(0.8);
    opacity: 0.3;
  }
  50% {
    transform: scaleX(1.2);
    opacity: 0.8;
  }
}

.loading-text {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  animation: text-fade 2s ease-in-out infinite;
}

@keyframes text-fade {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

// Sticky 視窗層 - 在 banner 區域內保持固定
.sticky-viewport {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;
  pointer-events: none;
  overflow: hidden; // 隱藏超出範圍的元素，防止橫向捲動條
}

// 背景圖片層（主要底圖）
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.8s ease;

  &.loaded {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

// 背景漸變層（覆蓋在背景圖上，用於顏色變化）
.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(79, 179, 212, 0.3) 0%,
    rgba(42, 122, 158, 0.5) 50%,
    rgba(26, 77, 92, 0.7) 100%
  );
  z-index: 2;
  transition:
    opacity 0.8s ease,
    background 0.8s ease;
}

// 海洋混濁覆蓋層
.ocean-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 20%, rgba(13, 38, 48, 0.6) 100%);
  opacity: 0;
  z-index: 3;
  pointer-events: none;
}

// 海龜主體
.turtle-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: clamp(200px, 25vw, 400px);
  height: auto;
  will-change: transform, filter;
  pointer-events: auto;
  transition: filter 0.3s ease;

  .turtle {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
    transition: filter 0.3s ease;
  }
}

// 垃圾層
.trash-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 15;
  pointer-events: none;

  .trash-item {
    position: absolute;
    width: clamp(80px, 15vw, 200px);
    height: auto;
    opacity: 0;
    will-change: transform, opacity;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
    animation: float-gentle 6s ease-in-out infinite;

    // 初始位置（從左右兩邊）
    &#trash-1 {
      bottom: 15%;
      right: 4%;
    }

    &#trash-2 {
      top: 10%;
      right: 30%;
    }

    &#trash-3 {
      bottom: 10%;
      left: 20%;
    }

    &#trash-4 {
      top: 20%;
      left: 15%;
    }

    &#trash-5 {
      bottom: 30%;
      left: 5%;
    }

    &#trash-6 {
      top: 30%;
      right: 10%;
    }
  }
}

// 文字敘事層
.text-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  pointer-events: none;

  [class^='text-stage-'] {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0;
    width: 90%;
    max-width: 800px;

    h2 {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 700;
      color: #ffffff;
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.5),
        0 0 30px rgba(79, 179, 212, 0.3);
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }

    p {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      color: rgba(255, 255, 255, 0.9);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      line-height: 1.6;
    }
  }

  .text-stage-1 {
    top: 45%;
  }

  .text-stage-2 {
    top: 50%;
  }

  .text-stage-3 {
    top: 55%;

    h2 {
      text-shadow:
        0 2px 10px rgba(0, 0, 0, 0.7),
        0 0 40px rgba(255, 107, 107, 0.4);
    }
  }
}

// 氣泡裝飾
.bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;

  .bubble {
    position: absolute;
    bottom: -100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
    border-radius: 50%;
    animation: float-up 8s infinite ease-in;

    &:nth-child(1) {
      left: 10%;
      width: 30px;
      height: 30px;
      animation-delay: 0s;
      animation-duration: 8s;
    }

    &:nth-child(2) {
      left: 25%;
      width: 20px;
      height: 20px;
      animation-delay: 2s;
      animation-duration: 10s;
    }

    &:nth-child(3) {
      left: 50%;
      width: 40px;
      height: 40px;
      animation-delay: 4s;
      animation-duration: 12s;
    }

    &:nth-child(4) {
      left: 70%;
      width: 25px;
      height: 25px;
      animation-delay: 1s;
      animation-duration: 9s;
    }

    &:nth-child(5) {
      left: 85%;
      width: 35px;
      height: 35px;
      animation-delay: 3s;
      animation-duration: 11s;
    }
  }
}

@keyframes float-up {
  0% {
    bottom: -100px;
    opacity: 0;
  }

  10% {
    opacity: 0.6;
  }

  90% {
    opacity: 0.6;
  }

  100% {
    bottom: 110vh;
    opacity: 0;
  }
}

@keyframes float-gentle {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  25% {
    transform: translateY(-10px) rotate(2deg);
  }

  50% {
    transform: translateY(-5px) rotate(-2deg);
  }

  75% {
    transform: translateY(-15px) rotate(1deg);
  }
}

// 響應式優化
@media (max-width: 768px) {
  .ocean-container {
    height: 400vh; // 移動端有足夠的滾動路徑體驗動畫
  }

  .turtle-wrapper {
    width: 60vw;
    max-width: 400px;
  }

  .trash-layer .trash-item {
    width: clamp(60px, 20vw, 150px);
  }

  .text-layer [class^='text-stage-'] {
    width: 85%;

    h2 {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
    }

    p {
      font-size: clamp(0.875rem, 3.5vw, 1.125rem);
    }
  }
}

// 性能優化
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
