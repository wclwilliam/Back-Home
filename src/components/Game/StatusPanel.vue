<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const circleRef = ref(null)
const wave1Ref = ref(null)
const wave2Ref = ref(null)
const wave3Ref = ref(null)

onMounted(() => {
  // GSAP 海浪左右無限循環動畫
  // 使用不同的 duration (持續時間) 產生交錯感
  gsap.to(wave1Ref.value, {
    x: '-50%',
    duration: 3,
    repeat: -1,
    ease: 'linear',
  })

  gsap.to(wave2Ref.value, {
    x: '-30%',
    duration: 5,
    repeat: -1,
    ease: 'power1.inOut', // 稍微有點波盪感
    yoyo: true, // 來回擺動
  })

  gsap.to(wave3Ref.value, {
    x: '-40%',
    duration: 4,
    repeat: -1,
    ease: 'linear',
  })
})
</script>

<template>
  <div class="progress-circle" ref="circleRef">
    <div class="wave-wrapper">
      <div class="wave wave-1" ref="wave1Ref"></div>
      <div class="wave wave-2" ref="wave2Ref"></div>
      <div class="wave wave-3" ref="wave3Ref"></div>
    </div>

    <div class="dash-line line-top"></div>
    <div class="dash-line line-bottom"></div>
  </div>
</template>

<style lang="scss" scoped>
// 定義變數
$size: 180px;
$wave-1: #92cfeb;
$wave-2: #5ebae3;
$wave-3: #2aa2d6;

.progress-circle {
  margin-bottom: 300px;
  position: relative;
  width: $size;
  height: $size;
  // RWD 處理：使用 min() 確保在小螢幕也能縮放
  max-width: 90vw;
  max-height: 90vw;

  border: 8px solid $primary-color;
  border-radius: 50%;
  background-color: white; // 預設背景
  overflow: hidden; // 關鍵：裁切掉圓圈外的海浪
  display: flex;
  align-items: center;
  justify-content: center;

  .wave-wrapper {
    position: absolute;
    bottom: 0; // 海浪從底部開始
    width: 100%;
    height: 100%;
  }

  .wave {
    position: absolute;
    width: 300%;
    height: 300%;
    top: 50%; 
    left: -100%;
    border-radius: 40%;
    opacity: 0.8;
  }

  .wave-1 {
    background-color: $wave-1;
    z-index: 1;
  }
  .wave-2 {
    background-color: $wave-2;
    z-index: 2;
    border-radius: 38%;
  }
  .wave-3 {
    background-color: $wave-3;
    z-index: 3;
    border-radius: 43%;
  }

  // 虛線進度條
  .dash-line {
    position: absolute;
    width: 100%;
    height: 3px;
    background-image: linear-gradient(to right, $primary-color 50%, transparent 50%);
    background-size: 10px 100%; // 這裡控制虛線的密度
    z-index: 10;

    &.line-top {
      top: 33%;
    }
    &.line-bottom {
      top: 66%;
    }
  }
}

// 旋轉動畫讓海浪動起來
.wave {
  animation: rotateWaves 10s infinite linear;
}

@keyframes rotateWaves {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
