<script setup>
const { text, warningText, showWarning } = defineProps({
  text: { type: String, default: '' },           // feedback 文字
  warningText: { type: String, default: '' },    // warningText 文字
  showWarning: { type: Boolean, default: false } // 是否顯示 warning
})

const emit = defineEmits(['next'])
</script>
<template>
  <div class="dialog-card-container">
    <div class="dialog-card">
      <div class="dialog-card__content">
        <div class="slanted-shape"></div>
        <p class="dialog-text">
          {{ text }}
        </p>
        <p v-if="showWarning && warningText" class="warning-text">
          {{ warningText }}
        </p>
        <button class="next-btn" type="button" @click="emit('next')">
          <span class="material-symbols-outlined icon-arrow">
            arrow_drop_down
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dialog-card__content {
  position: relative;
  background-color: $card-color;
  opacity: 0.9;
  width: 100%;
  height: 100%;
  padding: 40px;
}

.dialog-text {
  @include font-body-l-bold;
  margin: 0;
}

.warning-text {
  margin-top: 12px;
  @include font-body-l-bold;
  color: $highlight-color2;
}

.next-btn {
  position: absolute;
  right: 16px;
  bottom: 12px;
}

.icon-arrow {
  @include icon-style($size: 40px);
}

/* 手機橫向：縮小文字大小 */
@media (pointer: coarse) and (orientation: landscape) {
  .dialog-text {
    font-size: 0.9rem;
  }

  .warning-text {
    font-size: 0.9rem;
  }

  .icon-arrow {
    @include icon-style($size: 28px);
  }

  .dialog-card__content {
    padding: 28px;
  }
}

.dialog-card__content:after {
  content: '';
  position: absolute;
  top: -10px;
  bottom: 10px;
  right: -10px;
  left: 10px;
  border: 3px dashed $game-line-color;
  pointer-events: none;
}

.slanted-shape {
  position: absolute;
  left: -71px;
  top: 50%;
  transform: translateY(-50%);
  width: 72px;
  height: 77px;
  background-color: $card-color;
  opacity: 0.9;
  clip-path: polygon(0% 100%, // 左下尖角
      60% 40%, // 左上角
      100% 0%, // 右上角
      100% 40% // 右下角
    );
}
</style>