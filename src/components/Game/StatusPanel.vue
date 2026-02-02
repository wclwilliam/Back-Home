<script setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { gsap } from 'gsap'
import { useProgressStore } from '@/stores/progress'
import { parsePublicFile } from '@/utils/parseFile'

const progressStore = useProgressStore()

const circleRef = ref(null)
const wave1Ref = ref(null)
const wave2Ref = ref(null)
const wave3Ref = ref(null)
let tween = null

const { text, roleId } = defineProps({
  text: { type: String, default: '' },
  roleId: { type: String, default: '' },
})

const roleTurtleMap = {
  baby: 'game-img/turtle-baby.png',
  teen: 'game-img/turtle-teen-swim.png',
  adult: 'game-img/turtle-adult-swim.png',
}

const turtleSrc = computed(() => {
  const p = roleTurtleMap[progressStore.roleId]
  return p ? parsePublicFile(p) : ''
})

const fill = computed(() => progressStore.fillTarget)
const turtle = computed(() => progressStore.turtleTarget)

watch(
  [fill, turtle],
  ([toFill, toTurtle]) => {
    if (!circleRef.value) return
    tween?.kill()

    const waveY = -(toFill * 58) // 單位：%
    const turtleY = -(toTurtle * 205) + 30 // 單位：%

    tween = gsap.to(circleRef.value, {
      duration: 0.45,
      ease: 'power2.out',
      '--waveY': `${waveY}%`,
      '--turtleY': `${turtleY}%`,
      overwrite: true,
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  tween?.kill()
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

      <img v-if="turtleSrc" class="turtle-img" :class="`turtle-img--${progressStore.roleId}`" :src="turtleSrc" alt="" />

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
  --fill: 0;
  --turtle: 0.25; // 0~1
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
    width: 100%;
    height: 100%;
    bottom: 0;
    transform: translateY(var(--waveY, 0%));
    will-change: transform;
  }

  .wave {
    position: absolute;
    width: 300%;
    height: 300%;
    top: 71%;
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

p {
  @include font-caption;
  display: inline-block;
  background-color: $primary-color;
  color: $text-white;
  padding: 4px 8px;
  border-radius: 50px;
}

.turtle-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* 手機橫向：縮小進度條 */
@media (pointer: coarse) and (orientation: landscape) {
  $size-landscape: 80px;

  .progress-circle {
    width: $size-landscape;
    height: $size-landscape;
    border-width: 3px;
  }

  .dash-line {
    height: 2px;
    background-size: 7px 100%;
  }

  .turtle-img {
    width: 70%;
  }

  p {
    font-size: 11px;
    padding: 2px 6px;
  }
}


.turtle-img {
  position: absolute;
  left: 50%;
  top: 57%;
  z-index: 20;
  width: 75%;
  height: auto;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.18));
  transform: translate(-50%, var(--turtleY, 0%));
}
</style>
