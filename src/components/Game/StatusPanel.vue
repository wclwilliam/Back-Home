<script setup>
import { onMounted, ref, computed } from 'vue'
import { gsap } from 'gsap'

const circleRef = ref(null)
const wave1Ref = ref(null)
const wave2Ref = ref(null)
const wave3Ref = ref(null)
const base = import.meta.env.BASE_URL

const { text, roleId } = defineProps({
  text: { type: String, default: '' },
  roleId: { type: String, default: '' },
})

const roleTurtleMap = {
  baby: 'game/turtle-baby.png',
  teen: 'game/turtle-teen-swim.png',
  adult: 'game/turtle-adult-swim.png',
}

const turtleSrc = computed(() => {
  const p = roleTurtleMap[roleId]
  return p ? base + p : ''
})

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
  <div class="turtle-progress">
  <div class="progress-circle" ref="circleRef">
    <div class="wave-wrapper">
      <div class="wave wave-1" ref="wave1Ref"></div>
      <div class="wave wave-2" ref="wave2Ref"></div>
      <div class="wave wave-3" ref="wave3Ref"></div>
    </div>

    <img
      v-if="turtleSrc"
      class="turtle-img"
      :class="`turtle-img--${roleId}`"
      :src="turtleSrc"
      alt=""
    />

    <div class="dash-line line-top"></div>
    <div class="dash-line line-bottom"></div>
    
  </div>
  <p>{{ text }}</p>
  </div>
</template>

<style lang="scss" scoped>
// 定義變數
$size: 120px;
$wave-1: #92cfeb;
$wave-2: #5ebae3;
$wave-3: #2aa2d6;

.progress-circle {
  position: relative;
  width: $size;
  height: $size;

  border: 5px solid $primary-color;
  border-radius: 50%;
  background-color: white;
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
    top: 70%; 
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
p{
  @include font-caption;
  display: inline-block; 
  background-color: $primary-color;
  color: $text-white;
  padding: 4px 8px;
  border-radius: 50px;
}
.turtle-progress{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.turtle-img {
  position: absolute;
  z-index: 20;
  width: 75%;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.18));
  bottom: -6%;
}
</style>
