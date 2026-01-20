<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import GameStartCard from '@/components/Game/GameStartCard.vue'
import GameEnterCard from '@/components/Game/GameEnterCard.vue'
import GameActionCard from '@/components/Game/GameActionCard.vue'
import GameBackground from '@/components/Game/GameBackground.vue'
import OrientationGuard from '@/components/Game/OrientationGuard.vue'
import { useHealthStore } from '@/stores/health'
import { publicApi, base } from '@/utils/publicApi.js'
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()

const healthStore = useHealthStore()
const applyHealth = (healthChange) => {
  healthStore.applyHealthChange(healthChange)
}

const gameData = ref(null)
const fetchGameData = async () => {
  try {
    const response = await publicApi.get('data/game.json')
    gameData.value = response.data
  } catch (error) {
    console.log(error)
  }
}

const step = ref(1)
const roleId = ref('') // baby, teen, adult 背景圖和海龜圖用這個決定
const currentId = ref('start') // 目前節點(key)

// 目前節點資料
const currentNode = computed(() => {
  if (!gameData.value) return null
  return gameData.value[currentId.value]
})

// 進度條文字
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

  const picked = gameData.value.start.options.find((option) => option.id === pickedRoleId)
  currentId.value = picked?.nextId ?? 'start'

  step.value = 2 // 進入遊戲
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
    // 不管在哪個 step，都先更新 result 狀態
    progressStore.setResult(node?.type === 'result')

    // 只有在遊戲中(step=2)且不是 result 才推進 q1/q2/q3
    if (step.value === 2 && node?.type !== 'result') {
      progressStore.setStepByNodeId(currentId.value)
    }
  },
  { immediate: true }
)

onMounted(() => {
  fetchGameData()
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
  height: calc(100vh - clamp(84px, 8vw, 100px));
  overflow: hidden;
}

.game-content {
  position: relative;
  z-index: 1;
  height: 100%;
}
</style>
