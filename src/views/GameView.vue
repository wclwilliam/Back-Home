<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import GameStartCard from '@/components/Game/GameStartCard.vue'
import GameEnterCard from '@/components/Game/GameEnterCard.vue'
import GameDialogCard from '@/components/Game/GameDialogCard.vue'
import KnowledgeCard from '@/components/Game/KnowledgeCard.vue'

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

// 進度條文字（先寫死）
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

const health = ref(100)
const applyHealth = (healthChange) => {
  health.value = Math.max(0, health.value + (healthChange ?? 0) * 20)
}

const goNext = (nextId) => {
  if (!nextId) return
  currentId.value = nextId
}

onMounted(() => {
  fetchGameData()
})
</script>
<template>
  <div class="bg-game">
    
  <p v-if="!gameData">載入中...</p>
  <GameStartCard 
  v-else-if = "step === 1"
  :start-options="gameData.start.options"
  @start="startGame"
  />
  
  <GameEnterCard 
  v-else-if="step === 2"
  :role-id="roleId"
  :current-node="currentNode"
  :progress-text="progressText"
  :health="health"
  @choose="chooseOption"
  @apply-health="applyHealth"
  @next="goNext"
  />
  <!-- <GameDialogCard /> -->
  <!-- <KnowledgeCard /> -->
  <!-- <div class="bg-game">
    <div
      class="bg-image"
      :style="{ backgroundImage: `url(${bgSrc})` }"
    />
  </div> -->
  </div>
</template>
<style lang="scss" scoped>
.bg-game {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
}

</style>
