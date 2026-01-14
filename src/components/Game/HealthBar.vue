<script setup>
import { computed } from 'vue';

// 定義 Props，讓父組件可以傳入目前的生存機率
const { health, maxHealth } = defineProps({
  health: {
    type: Number,
    default: 100
  },
  maxHealth: {
    type: Number,
    default: 100
  }
});

// const chooseOption = (opt) => {
//   currentId.value = opt.nextId

//   const nextNode = gameData.value[opt.nextId]
//   const change = nextNode?.healthChange ?? 0 // -1 / 0

//   health.value = Math.max(0, health.value + change * 20)
// }

// 計算屬性：將百分比轉換為 5 顆愛心的顯示狀態
const totalHearts = 5;
const activeHeartsCount = computed(() => {
  // 每 20% 代表一顆實心愛心
  return Math.ceil((health / maxHealth) * totalHearts);
});
</script>

<template>
  <div class="health-bar">
    
    <div class="health-bar__percentage">{{ health }}%</div>

    <div class="health-bar__hearts">
      <span 
        v-for="i in totalHearts" 
        :key="i"
        class="material-symbols-outlined health-bar__icon"
        :class="{ 'health-bar__icon--active': i <= activeHeartsCount }"
      >
        favorite
      </span>
    </div>

    <div class="health-bar__label">生存機率</div>
  </div>
</template>

<style lang="scss" scoped>
// 建議將顏色定義為變數，方便統一管理
$color-inactive: #e0e0e0; // 未達成時的灰色

.health-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  user-select: none; // 防止使用者選取

  &__percentage {
    @include font-body-bold;
    color: $highlight-color2;
  }

  &__hearts {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__icon {
    @include icon-style($color: $highlight-color2);
    transition: transform 0.3s ease, color 0.3s ease;
    cursor: default; // user-select: none會搭配使用

    // Modifier: 啟動狀態 (有血量時)
    &--active {
      @include icon-style($fill: 1, $color: $highlight-color2);
      // 增加一點發光感或縮放效果
      filter: drop-shadow(0 0 2px rgba($highlight-color2, 0.4));
    }
  }

  &__label {
    @include font-caption;
    color: $text-white;
    background-color: $primary-color;
    padding: 4px 8px;
    border-radius: 100px;
  }
}
</style>