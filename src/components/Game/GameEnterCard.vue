<script setup>
import { ref, computed, watch } from 'vue';
import GameQuestionCard from '@/components/Game/GameQuestionCard.vue'
import StatusPanel from './StatusPanel.vue';
import HealthBar from './HealthBar.vue';
import GameDialogCard from './GameDialogCard.vue';
import KnowledgeCard from './KnowledgeCard.vue';

const props = defineProps({
  roleId: { type: String, required: true },
  currentNode: { type: Object, default: null },
  progressText: { type: String, default: '' },
  health: { type: Number, default: 100 },
})

const base = import.meta.env.BASE_URL
const sceneMap = {
  baby: {
    bg: 'game/turtle-baby-bg.jpg',
    turtle: 'game/turtle-baby.png',
  },
  teen: {
    bg: 'game/turtle-teen-bg.jpg',
    turtle: 'game/turtle-teen-swim.png',
  },
  adult: {
    bg: 'game/turtle-adult-bg.jpg',
    turtle: 'game/turtle-adult-swim.png',
  },
}

const bgStyle = computed (() => {
    const bg = sceneMap[props.roleId]?.bg
    return bg ? {backgroundImage: `url(${base + bg})`} : {}
}) 

const turtleSrc = computed( () => {
    const turtle = sceneMap[props.roleId]?.turtle
    return turtle ? base + turtle : ''
})

const emit = defineEmits(['choose', 'next', 'apply-health'])
const onChoose = (option) => {
    emit('choose', option)
}

const mode = computed(() => {
    const n = props.currentNode
    if (!n) return 'loading'
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

</script>
<template>
    <section class="game-screen" :style="bgStyle">
    <StatusPanel 
    class="status-panel" 
    :text="progressText" 
    :role-id="props.roleId" 
    />
    <div class="health-bar-container">
        <HealthBar class="health-bar" :health="props.health" :maxHealth="100"/>
    </div>
    <img 
    v-if="turtleSrc" 
    class="turtle" 
    :class="`turtle--${props.roleId}`"
    :src="turtleSrc" 
    alt="" />
    <GameDialogCard 
    v-if="mode === 'feedback'"
    class="center-card"
    :text="props.currentNode?.feedback ?? ''"
    :warning-text="props.currentNode?.warningText ?? ''"
    :show-warning="showWarning"
    @next="onFeedbackNext"
    />
    <KnowledgeCard 
    v-else-if="mode === 'knowledge'"
    class="center-card"
    :text="props.currentNode?.knowledge ?? ''"
    :button-text="props.currentNode?.buttonText ?? '我知道了'"
    @next="onKnowledgeNext"
    />
    </section>
    <GameQuestionCard 
    v-if="mode === 'question'"
    :question="props.currentNode?.question ?? ''"
    :options="props.currentNode?.options ?? []"
    @choose="onChoose"
    />
</template>
<style lang="scss" scoped>
    .game-screen {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-size: cover;
        background-position: center;
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        grid-template-columns: repeat(6, 1fr);
        // margin-top: 100px;
    }
    .center-card {
        grid-column: 3 / 6;
        grid-row: 2 / 3;
        align-self: center;
        justify-self: center;
    }
    .turtle {
        width: min(45vw, 360px);
        height: auto;
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }
    .turtle--baby{
        width: min(45vw, 300px);
        grid-column: 2 / 3;
        grid-row: 3 / 4;
        justify-self: start;
        align-self: start;
        margin-top: -100px;    
    }
    .status-panel{
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    justify-self: start;
    align-self: center;
    padding-left: 16px;
    }
    .health-bar-container{
    grid-column: 6 / 7;
    grid-row: 1 / 3;
    display: flex; 
    align-self: center;
    justify-self: end; 
    padding-right: 20px;
    }
</style>