<script setup>
import { ref, watch, onUnmounted } from 'vue'
import gsap from 'gsap'
import { useHealthStore } from '@/stores/health'

const healthStore = useHealthStore()

const barRef = ref(null)
let tween = null

// 只要 health 變動就監聽
watch(
  () => healthStore.health,
  (newVal, oldVal) => {
    // 初始化時 oldVal 可能是 undefined，先擋掉
    if (typeof oldVal !== 'number') return

    // 只有扣血才抖
    if (newVal < oldVal) {
      tween?.kill()

      // 抖動效果：左右小幅晃 + 旋轉一點點
      tween = gsap.to(barRef.value, {
        keyframes: [
          { x: -6, rotate: -2, duration: 0.06 },
          { x: 6, rotate: 2, duration: 0.06 },
          { x: -4, rotate: -1, duration: 0.06 },
          { x: 4, rotate: 1, duration: 0.06 },
          { x: 0, rotate: 0, duration: 0.06 },
        ],
        ease: 'none',
        clearProps: 'x,rotate',
      })
    }
  }
)

onUnmounted(() => {
  tween?.kill()
})
</script>

<template>
  <div ref="barRef" class="health-bar">

    <div class="health-bar__percentage">{{ healthStore.healthPercent }}%</div>

    <div class="health-bar__hearts">
      <span v-for="i in healthStore.totalHearts" :key="i" class="material-symbols-outlined health-bar__icon"
        :class="{ 'health-bar__icon--active': i <= healthStore.activeHeartsCount }">
        favorite
      </span>
    </div>

    <div class="health-bar__label">生存機率</div>
  </div>
</template>

<style lang="scss" scoped>
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
    flex-direction: column-reverse;
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

/* 手機橫向：縮小血量條 */
@media (pointer: coarse) and (orientation: landscape) {
  .health-bar {
    gap: 6px;

    &__percentage {
      font-size: 14px;
    }

    &__hearts {
      gap: 2px;
    }

    &__icon {
      @include icon-style($size: 18px, $color: $highlight-color2);

      &--active {
        @include icon-style($fill: 1, $size: 18px, $color: $highlight-color2);
        filter: drop-shadow(0 0 2px rgba($highlight-color2, 0.4));
      }
    }

    &__label {
      font-size: 10px;
      padding: 2px 6px;
    }
  }
}
</style>