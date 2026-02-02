<script setup>
const { question, options } = defineProps({
  question: { type: String, default: '' },
  options: { type: Array, default: () => [] },
})

const emit = defineEmits(['choose'])

</script>

<template>

  <div class="game-question-card">
    <div class="question-container">
      <h2 class="question-title">{{ question }}</h2>

      <div class="options-group">
        <button v-for="option in options" :key="option.id" class="btn btn-outline-game btn-xl"
          @click="emit('choose', option)">
          {{ option.text }}
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.game-question-card {
  width: 100%;
  background: linear-gradient(0deg, rgba(227, 213, 202, 1) 0%, rgba(227, 213, 202, 0.9) 20%, rgba(227, 213, 202, 0.8) 40%, rgba(227, 213, 202, 0.7) 60%, rgba(227, 213, 202, 0.6) 70%, rgba(227, 213, 202, 0.5) 80%, rgba(227, 213, 202, 0.02) 100%);
}

.question-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 24px 24px;
  max-width: 952px;
  margin: 0 auto;
  z-index: 100;
}

.question-title {
  @include font-body-l-bold;
  flex: 1;
  min-width: 0;
}

.options-group {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}
</style>
