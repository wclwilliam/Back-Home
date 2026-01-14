<script setup>
const { question, options } = defineProps({
  question: { type: String, default: '' },
  options: { type: Array, default: () => [] },
})

const emit = defineEmits(['choose'])

</script>

<template>
  
  <div class="game-question-card">
    <h2 class="question-title">{{ question }}</h2>

    <div class="options-group">
      <button
        v-for="option in options"
        :key="option.id"
        :class="['btn btn-outline-game btn-xl', { 'is-active': selectedId === option.id }]"
        @click="emit('choose', option)"
      >
        {{ option.text }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.game-question-card {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px 60px;
  background: linear-gradient(
    0deg, rgba(227, 213, 202, 1) 0%, rgba(227, 213, 202, 0.9) 20%, rgba(227, 213, 202, 0.8) 40%, rgba(227, 213, 202, 0.7) 60%,rgba(227, 213, 202, 0.6) 70%, rgba(227, 213, 202, 0.5) 80%, rgba(227, 213, 202, 0) 100%
  );

  z-index: 100;
}

.question-title {
  @include font-tertiary; 
  flex: 1;
  min-width: 0;
}

.options-group {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}
</style>
