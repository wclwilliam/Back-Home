<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import GameStartCard from '@/components/Game/GameStartCard.vue'
import GameEnterCard from '@/components/Game/GameEnterCard.vue'
import GameActionCard from '@/components/Game/GameActionCard.vue'
import GameBackground from '@/components/Game/GameBackground.vue'
import OrientationGuard from '@/components/Game/OrientationGuard.vue'
import { useHealthStore } from '@/stores/health'
import { publicApi } from '@/utils/publicApi.js'
import { useProgressStore } from '@/stores/progress'
import { useUiStore } from '@/stores/ui'

let cachedGameData = null
let cachedPromise = null

const progressStore = useProgressStore()
const uiStore = useUiStore()
const healthStore = useHealthStore()

const applyHealth = (healthChange) => {
  healthStore.applyHealthChange(healthChange)
}

const gameData = ref(null)
const fetchGameData = async () => {
  if (cachedGameData) {
    gameData.value = cachedGameData
    return
  }

  if (!cachedPromise) cachedPromise = publicApi.get('data/game.json')

  try {
    const response = await cachedPromise
    cachedGameData = response.data
    gameData.value = cachedGameData
  } catch (error) {
    console.log(error)
    cachedPromise = null
  }
}

const step = ref(1)
const roleId = ref('')
const currentId = ref('start')

const currentNode = computed(() => {
  if (!gameData.value) return null
  return gameData.value[currentId.value]
})

const progressText = computed(() => {
  const map = {
    baby: '幼龜：探索中',
    teen: '少年海龜：遷徙中',
    adult: '成年母龜：回游產卵中',
  }
  return map[roleId.value] ?? ''
})

const startGame = (pickedRoleId) => {
  if (!gameData.value?.start?.options) return

  roleId.value = pickedRoleId
  progressStore.setRole(pickedRoleId)

  const picked = gameData.value.start.options.find((o) => o.id === pickedRoleId)
  currentId.value = picked?.nextId ?? 'start'
  step.value = 2
}

const chooseOption = (option) => {
  currentId.value = option.nextId
}

const goNext = (nextId) => {
  if (!nextId) return

  if (nextId === 'start') {
    step.value = 1
    roleId.value = ''
    currentId.value = 'start'
    healthStore.reset()
    progressStore.reset()
    return
  }

  currentId.value = nextId
}

const isActionNode = computed(() => currentNode.value?.type === 'action')

const stage = computed(() => {
  if (step.value === 1) return 'start'
  if (currentNode.value?.type === 'action') return 'action'
  return 'enter'
})

watch(
  () => currentNode.value,
  (node) => {
    progressStore.setResult(node?.type === 'result')
    if (step.value === 2 && node?.type !== 'result') {
      progressStore.setStepByNodeId(currentId.value)
    }
  },
  { immediate: true }
)



/** ===== 手機橫向自動隱藏 Header ===== */
let mql = null

const updateHideHeader = () => {
  if (!mql) return
  uiStore.setHideHeader(mql.matches)
}

onMounted(() => {
  fetchGameData()

  // 隱藏滾動條
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  mql = window.matchMedia('(orientation: landscape) and (max-height: 500px)')
  updateHideHeader()
  requestAnimationFrame(updateHideHeader)
  mql.addEventListener('change', updateHideHeader)
})

onBeforeUnmount(() => {
  // 恢復滾動條
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''

  if (mql) {
    mql.removeEventListener('change', updateHideHeader)
    mql = null
  }
  uiStore.setHideHeader(false)
})
</script>

<template>
  <OrientationGuard>
    <div class="game-page">
      <GameBackground :stage="stage" :role-id="roleId" :node="currentNode" :node-id="currentId" />

      <div class="game-content">
        <p v-if="!gameData">載入中...</p>

        <GameStartCard v-else-if="step === 1" :start-options="gameData.start.options" @start="startGame" />

        <GameActionCard v-else-if="step === 2 && isActionNode" :role-id="roleId" :node="currentNode" @next="goNext" />

        <GameEnterCard v-else-if="step === 2" :role-id="roleId" :current-node="currentNode" :node-id="currentId"
          :progress-text="progressText" @choose="chooseOption" @apply-health="applyHealth" @next="goNext" />
      </div>
    </div>
  </OrientationGuard>
</template>

<style lang="scss" scoped>
.game-page {
  position: relative;
  width: 100%;
  height: calc(100dvh - clamp(84px, 8vw, 100px));
  overflow: hidden;

  /* 手機橫向：恢復為 100% 因為 header 會隱藏 */
  @media (pointer: coarse) and (orientation: landscape) {
    height: 100%;
  }
}

.game-content {
  position: relative;
  z-index: 1;
  height: 100%;
}

/* 手機橫向：縮小字體 */
@media (pointer: coarse) and (orientation: landscape) {
  .game-content {
    font-size: 0.75rem;

    /* 調整所有相關尺寸 */
    :deep(h2) {
      font-size: 0.9rem;
    }

    :deep(button) {
      font-size: 0.8rem;
    }

    :deep(.btn) {
      padding: 12px 24px;
      font-size: 0.75rem;
    }
  }
}
</style>
