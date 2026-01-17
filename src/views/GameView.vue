<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import GameStartCard from '@/components/Game/GameStartCard.vue'
import GameEnterCard from '@/components/Game/GameEnterCard.vue'
import GameActionCard from '@/components/Game/GameActionCard.vue'
import GameBackground from '@/components/Game/GameBackground.vue'
import { useHealthStore } from '@/stores/health'

const healthStore = useHealthStore()  
const applyHealth = (healthChange) => {
  healthStore.applyHealthChange(healthChange)
}

const gameData = ref(null)
const fetchGameData = async () => {
  try {
    const base = import.meta.env.BASE_URL
    const response = await axios.get(base + 'data/game.json')
    gameData.value = response.data
  }catch (error){
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
  roleId.value = pickedRoleId

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

onMounted(() => {
  fetchGameData()
})
</script>
<template>
   <div class="game-page">
  <GameBackground :stage="stage" :role-id="roleId" :node="currentNode" :node-id="currentId" />

  <div class="game-content">
  <p v-if="!gameData">載入中...</p>
  <GameStartCard 
  v-else-if = "step === 1"
  :start-options="gameData.start.options"
  @start="startGame"
  />

  <GameActionCard
  v-else-if="step === 2 && isActionNode"
  :role-id="roleId"
  :node="currentNode"
  @next="goNext"
/>
  
  <GameEnterCard 
  v-else-if="step === 2"
  :role-id="roleId"
  :current-node="currentNode"
  :node-id="currentId" 
  :progress-text="progressText"
  @choose="chooseOption"
  @apply-health="applyHealth"
  @next="goNext"
  />
  </div>
  </div>
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
