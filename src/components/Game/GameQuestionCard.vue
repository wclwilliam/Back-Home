<script setup>
import { ref } from 'vue'

// 定義選項資料
const options = [
  { id: 1, text: '幼龜' },
  { id: 2, text: '少年海龜' },
  { id: 3, text: '成年母龜' },
]

// 儲存目前選中的 ID
const selectedId = ref(null)

// 點擊按鈕的動態反應函式
const handleSelect = (option) => {
  selectedId.value = option.id
  console.log('玩家選擇了:', option.text)

  // 這裡可以觸發額外的動態，例如音效或震動
}
</script>

<template>
  <div class="game-question-card">
    <h2 class="question-title">你的旅程將從哪裡開始？</h2>

    <div class="options-group">
      <button
        v-for="option in options"
        :key="option.id"
        :class="['btn btn-outline-game btn-xl', { 'is-active': selectedId === option.id }]"
        @click="handleSelect(option)"
      >
        {{ option.text }}
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .game-question-card {
display: flex;
align-items: center;
justify-content: center;
gap: 40px;
padding: 60px;
background: #E3D5CA;
background: linear-gradient(0deg,rgba(227, 213, 202, 1) 25%, rgba(227, 213, 202, 0.8) 33%, rgba(227, 213, 202, 0.9) 68%, rgba(227, 213, 202, 0) 100%);
}
.question-title {
  @include font-tertiary; 
}

.options-group {
  display: flex;
  gap: 20px;
}
</style>
