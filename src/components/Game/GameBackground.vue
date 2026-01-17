<script setup>
import { computed } from 'vue'

const props = defineProps({
  stage: { type: String, default: 'start' }, // start | enter | action
  roleId: { type: String, default: '' }, // baby | teen | adult
  node: { type: Object, default: () => ({}) },// 目前遊戲節點的完整資料物件
  nodeId: { type: String, default: '' }, // 目前正在跑的節點 id
})

const base = import.meta.env.BASE_URL

const nodeBgGroupMap = [
  {
    match: /^baby_q2(_good)?(_knowledge)?$/,
    bg: 'game/baby_q2_bg.png',
  },
  {
    match: /^baby_q2_bad(_knowledge)?$/,
    bg: 'game/baby_q2_bad_bg.png',
  },
  {
    match: /^baby_q3(_good)?(_knowledge)?$/,
    bg: 'game/baby_q3_bg.png',
  },
  {
    match: /^baby_q3_bad(_knowledge)?$/,
    bg: 'game/baby_q3_bad_bg.png',
  },
  {
    match: /^teen_q2/,
    bg: 'game/teen_q2_bg.png',
  },
  {
    match: /^teen_q3$/,
    bg: 'game/teen_q3_bg.png',
  },
]

const bgMap = {
  start: 'game/wave.jpg',
  action: 'game/wave.jpg', // CTA 專用圖
  enter: {
    baby: 'game/turtle-baby-bg.jpg',
    teen: 'game/turtle-teen-bg.jpg',
    adult: 'game/turtle-adult-bg.jpg',
  },
}

const bgSrc = computed(() => {
  const nodeId = props.nodeId

  // 節點群組 override（優先權最高）
  const group = nodeBgGroupMap.find((item) =>
    item.match.test(nodeId)
  )
  if (group) return base + group.bg

  // node 本身有指定 bg
  if (props.node?.bg) {
    return base + props.node.bg
  }

  // 角色進場
  if (props.stage === 'enter') {
    return base + (bgMap.enter[props.roleId] ?? bgMap.start)
  }

  // 預設背景
  return base + bgMap[props.stage]
})

const bgStyle = computed(() => ({
  backgroundImage: `url(${bgSrc.value})`,
}))

const enableAnim = computed(() => {
  return !props.nodeId?.startsWith('baby_q2_bad')
})
</script>

<template>
  <div class="bg-game" :style="bgStyle" :class="{ 'is-anim': enableAnim }"></div>
</template>

<style lang="scss" scoped>
    .bg-game {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* 波浪變形層 */
  &::after {
    content: '';
    position: absolute;
    inset: -10%;
    background: inherit;
    opacity: 0.35;
    filter: blur(6px);
    pointer-events: none;
  }
}

/* 整體微移 */
@keyframes waveMove {
  0% {
    transform: scale(1.05) translateY(0);
  }
  50% {
    transform: scale(1.07) translateY(-8px);
  }
  100% {
    transform: scale(1.05) translateY(0);
  }
}

/* 波浪扭曲 */
@keyframes waveDistort {
  0% {
    transform: skewX(0deg) translateX(0);
  }
  50% {
    transform: skewX(2deg) translateX(-30px);
  }
  100% {
    transform: skewX(0deg) translateX(0);
  }
}
.bg-game.is-anim{
    animation: waveMove 6s ease-in-out infinite;
  will-change: transform;
}
.bg-game.is-anim::after {
  animation: waveDistort 6s ease-in-out infinite;
  will-change: transform;
}
</style>
