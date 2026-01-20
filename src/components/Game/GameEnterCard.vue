<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import GameQuestionCard from '@/components/Game/GameQuestionCard.vue'
import StatusPanel from './StatusPanel.vue';
import HealthBar from './HealthBar.vue';
import GameDialogCard from './GameDialogCard.vue';
import GameKnowledgeCard from './GameKnowledgeCard.vue';
import GameResultCard from '@/components/Game/GameResultCard.vue'
import { useHealthStore } from '@/stores/health'
import { parsePublicFile } from '@/utils/parseFile'

const healthStore = useHealthStore()

const props = defineProps({
  roleId: { type: String, required: true },
  currentNode: { type: Object, default: null },
  nodeId: { type: String, default: '' },
  progressText: { type: String, default: '' },
})

const sceneMap = {
  baby: {
    bg: 'game-img/turtle-baby-bg.jpg',
    turtle: 'game-img/turtle-baby.png',
  },
  teen: {
    bg: 'game-img/turtle-teen-bg.jpg',
    turtle: 'game-img/turtle-teen-swim.png',
  },
  adult: {
    bg: 'game-img/turtle-adult-bg.jpg',
    turtle: 'game-img/turtle-adult-swim.png',
  },
}

const isBabyQ3Group = computed(() => {
  return props.nodeId.startsWith('baby_q3')
})

const isTeenQ1BadGroup = computed(() =>
  props.nodeId.startsWith('teen_q1_bad')
)

const isTeenQ2BadGroup = computed(() =>
  props.nodeId.startsWith('teen_q2_bad')
)

const isTeenQ2GoodGroup = computed(() =>
  props.nodeId.startsWith('teen_q2_good')
)

const isTeenQ3BadGroup = computed(() =>
  props.nodeId.startsWith('teen_q3_bad')
)

const turtleSrc = computed(() => {
  if (props.roleId === 'teen' && isTeenQ1BadGroup.value) {
    return parsePublicFile('game-img/turtle-teen-bind.png')
  }

  if (props.roleId === 'teen' && isTeenQ2BadGroup.value) {
    return parsePublicFile('game-img/turtle-teen-plasticbag.png')
  }

  if (props.roleId === 'teen' && isTeenQ2GoodGroup.value) {
    return parsePublicFile('game-img/turtle-teen-seaweed.png')
  }

  if (props.roleId === 'teen' && isTeenQ3BadGroup.value) {
    return parsePublicFile('game-img/turtle-teen-injured.png')
  }

  if (props.roleId === 'baby' && isBabyQ3Group.value) {
    return parsePublicFile('game-img/turtle-baby-swim.png')
  }
  const turtle = sceneMap[props.roleId]?.turtle
  return turtle ? parsePublicFile(turtle) : ''
})

const emit = defineEmits(['choose', 'next', 'apply-health'])
const onChoose = (option) => {
  emit('choose', option)
}

const mode = computed(() => {
  const n = props.currentNode
  if (!n) return 'loading'
  if (n.type === 'result') return 'result'
  if (n.knowledge) return 'knowledge'
  if (n.feedback) return 'feedback'
  if (n.question) return 'question'
  return 'unknown'
})

const showWarning = ref(false)

watch(
  () => props.currentNode,
  () => {
    showWarning.value = false
  }
)

const onFeedbackNext = () => {
  const n = props.currentNode
  if (!n) return

  // 沒有 warningText 的話，直接下一步
  if (!n.warningText) {
    emit('next', n.nextId)
    return
  }

  // 第一次按：只顯示 warning + 扣血一次
  if (!showWarning.value) {
    showWarning.value = true
    emit('apply-health', n.healthChange ?? 0) // 例如 -1
    return
  }

  // 第二次按：跳到 knowledge
  emit('next', n.nextId)
}

const onKnowledgeNext = () => {
  const n = props.currentNode
  if (!n) return
  emit('next', n.nextId)
}

const nodeMedia = computed(() => props.currentNode?.media ?? null)

const mediaSrc = computed(() => {
  const img = nodeMedia.value?.image
  return img ? parsePublicFile(img) : ''
})

const mediaPos = computed(() => nodeMedia.value?.pos ?? 'rt')
const mediaSize = computed(() => nodeMedia.value?.size ?? 'md')
const mediaAnim = computed(() => nodeMedia.value?.anim ?? '')

const mediaOffsetStyle = computed(() => {
  const off = nodeMedia.value?.offset ?? {}
  const x = Number(off.x ?? 0)
  const y = Number(off.y ?? 0)
  return {
    '--mx': `${x}px`,
    '--my': `${y}px`,
  }
})

const maskEl = ref(null)

const showDarkMask = computed(() => props.nodeId === 'baby_q2')
const showFishingNet = computed(() => props.nodeId === 'teen_q1')
const showWaveSweep = computed(() => props.nodeId === 'teen_q3')

const onMouseMove = (e) => {
  if (!maskEl.value) return
  maskEl.value.style.setProperty('--mouse-x', `${e.clientX}px`)
  maskEl.value.style.setProperty('--mouse-y', `${e.clientY}px`)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})

</script>
<template>
  <section class="game-screen" :class="{ 'has-wave-sweep': showWaveSweep }">
    <div v-if="showDarkMask" ref="maskEl" class="dark-mask"></div>
    <div v-if="showFishingNet" class="fishing-net" aria-hidden="true"></div>
    <StatusPanel class="status-panel" :text="progressText" :role-id="props.roleId" />
    <div class="health-bar-container">
      <HealthBar class="health-bar" />
    </div>
    <img v-if="mediaSrc" :key="mediaSrc" class="node-media anim-hand-in" :class="[
      `node-media--${mediaPos}`,
      `node-media--${mediaSize}`,
      mediaAnim ? `anim-${mediaAnim}` : ''
    ]" :style="mediaOffsetStyle" :src="mediaSrc" alt="" />
    <div class="turtle-wrapper" v-if="turtleSrc && mode !== 'result'">
      <img class="turtle" :class="`turtle--${props.roleId}`" :src="turtleSrc" alt="" />
    </div>
    <GameResultCard v-if="mode === 'result'" class="game-result-card" :role-id="props.roleId" :node="props.currentNode"
      :health="healthStore.health" :max-health="healthStore.maxHealth"
      @next="emit('next', props.currentNode?.nextId)" />
    <GameDialogCard v-else-if="mode === 'feedback'" class="center-card" :text="props.currentNode?.feedback ?? ''"
      :warning-text="props.currentNode?.warningText ?? ''" :show-warning="showWarning" @next="onFeedbackNext" />
    <GameKnowledgeCard v-else-if="mode === 'knowledge'" class="center-card" :text="props.currentNode?.knowledge ?? ''"
      :button-text="props.currentNode?.buttonText ?? '我知道了'" @next="onKnowledgeNext" />
    <GameQuestionCard v-else-if="mode === 'question'" class="game-question-card"
      :question="props.currentNode?.question ?? ''" :options="props.currentNode?.options ?? []" @choose="onChoose" />
  </section>
</template>
<style lang="scss" scoped>
.game-screen {
  width: 100vw;
  height: 100%;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  grid-template-columns: repeat(6, 1fr);
  position: relative;
}

.game-question-card {
  grid-column: 1 / 7;
  grid-row: 3 / 4;
  justify-self: center;
  align-self: end;
}

.game-result-card {
  grid-column: 2 / 6;
  grid-row: 2 / 3;
  justify-self: center;
  align-self: center;
}

.center-card {
  grid-column: 3 / 6;
  grid-row: 1 / 3;
  align-self: center;
  justify-self: center;
  position: relative;
}

.turtle {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  transform: translate(20%, -10%);
}

.turtle-wrapper {
  grid-column: 1 / 3;
  grid-row: 2 / 4;
}

// .turtle--baby {
//   width: min(45vw, 300px);
//   grid-column: 2 / 3;
//   grid-row: 3 / 4;
//   justify-self: start;
//   align-self: start;
//   margin-top: -100px;
// }

.status-panel {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  justify-self: center;
  align-self: center;
  padding-left: 4px;
}

.health-bar-container {
  grid-column: 6 / 7;
  grid-row: 1 / 3;
  display: flex;
  align-self: center;
  justify-self: center;
}

.node-media {
  position: absolute;
  z-index: 2;
  pointer-events: none;
  height: auto;

  // 用 clamp 控制尺寸：手機不會爆、桌機不會太小
  &--sm {
    width: clamp(90px, 14vw, 160px);
  }

  &--md {
    width: clamp(120px, 18vw, 240px);
  }

  &--lg {
    width: clamp(160px, 24vw, 340px);
  }

  // offset（讓你每題微調不用開新 class）
  transform: translate(var(--mx, 0px), var(--my, 0px));
}

/* ✅ 錨點：用 %，避免 px 跑掉 */
.node-media--rt {
  top: 10%;
  right: -2%;
}

.node-media--lt {
  top: 10%;
  left: 6%;
}

.node-media--rb {
  bottom: 6%;
  right: 0%;
}

.node-media--lb {
  bottom: 12%;
  left: 6%;
}

.node-media--ct {
  top: 8%;
  left: 50%;
  transform: translate(-50%, 0) translate(var(--mx, 0px), var(--my, 0px));
}

.node-media--cb {
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 0) translate(var(--mx, 0px), var(--my, 0px));
}

.node-media--cc {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translate(var(--mx, 0px), var(--my, 0px));
}

/* ===== 手伸出來動畫 ===== */
.anim-hand-in {
  will-change: transform, opacity;
  animation:
    handInFromRight 0.8s cubic-bezier(.22, 1, .36, 1) both,
    handWobble 1.6s ease-in-out infinite;
  animation-delay: 0s, 0.9s; // 晃動等進場完成再開始
}

@keyframes handInFromRight {
  from {
    transform: translateX(120%) translate(var(--mx, 0px), var(--my, 0px));
  }

  to {
    transform: translateX(0%) translate(var(--mx, 0px), var(--my, 0px));
  }
}

@keyframes handWobble {
  0% {
    transform: translateX(0) translate(var(--mx, 0px), var(--my, 0px));
  }

  25% {
    transform: translateX(-6px) translate(var(--mx, 0px), var(--my, 0px));
  }

  50% {
    transform: translateX(0) translate(var(--mx, 0px), var(--my, 0px));
  }

  75% {
    transform: translateX(6px) translate(var(--mx, 0px), var(--my, 0px));
  }

  100% {
    transform: translateX(0) translate(var(--mx, 0px), var(--my, 0px));
  }
}

.dark-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(3, 3, 3, 0.7);
  z-index: 50;
  pointer-events: none;

  --mouse-x: 50%;
  --mouse-y: 50%;

  mask-image: radial-gradient(circle 140px at var(--mouse-x) var(--mouse-y),
      transparent 0%,
      rgba(0, 0, 0, 0.3) 45%,
      black 100%);

  -webkit-mask-image: radial-gradient(circle 320px at var(--mouse-x) var(--mouse-y),
      transparent 0%,
      rgba(0, 0, 0, 0.3) 45%,
      black 100%);
}

.fishing-net {
  position: absolute;
  inset: -10%;
  z-index: 1;
  pointer-events: none;

  --net-size: 26px;
  --net-thickness: 2px;
  --net-color: rgba(255, 255, 255, 0.22);

  background:
    repeating-linear-gradient(45deg,
      transparent,
      transparent calc(var(--net-size) - var(--net-thickness)),
      var(--net-color) calc(var(--net-size) - var(--net-thickness)),
      var(--net-color) var(--net-size)),
    repeating-linear-gradient(-45deg,
      transparent,
      transparent calc(var(--net-size) - var(--net-thickness)),
      var(--net-color) calc(var(--net-size) - var(--net-thickness)),
      var(--net-color) var(--net-size));

  mix-blend-mode: soft-light;
  opacity: 0.9;

  animation: netFloat 8s infinite alternate ease-in-out;
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

/* 漁網漂浮：模擬水流 */
@keyframes netFloat {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  100% {
    transform: translate3d(20px, 15px, 0) scale(1.02);
  }
}

.game-screen.has-wave-sweep::before {
  content: '';
  position: absolute;
  inset: -30%;
  z-index: 1;
  pointer-events: none;

  background: linear-gradient(70deg,
      transparent 45%,
      rgba(255, 255, 255, 0) 48%,
      rgba(255, 255, 255, 0.55) 50%,
      rgba(255, 255, 255, 0) 52%,
      transparent 55%);

  opacity: 0;
  transform: translate3d(45%, 45%, 0);
  animation: waveSweep 3.2s ease-in-out infinite;
}

@keyframes waveSweep {
  0% {
    opacity: 0;
    transform: translate3d(50%, 50%, 0);
  }

  10% {
    opacity: 0.9;
  }

  55% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>