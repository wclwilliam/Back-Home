<template>
  <div class="input-group">

    <label v-if="label" class="input-label">{{ label }}</label>

    <div :class="['input-container', { 'is-readonly': readonly }]">

      <div v-if="$slots.icon" class="icon-wrap">
        <slot name="icon"></slot>
      </div>

      <input v-bind="$attrs" :value="modelValue" :readonly="readonly"
        @input="$emit('update:modelValue', $event.target.value)" class="input-field" />

      <div v-if="$slots.append" class="icon-wrap is-append">
        <slot name="append"></slot>
      </div>

    </div>
  </div>
</template>

<script setup>
// 定義組件可以接收的參數（Props）
defineProps({
  modelValue: [String, Number], // 輸入的內容
  label: String,                // 輸入框上方的文字
  readonly: { type: Boolean, default: false }, // 是否為唯讀模式(不可輸入)
})

// 定義要傳回給父組件的事件（更新內容）
defineEmits(['update:modelValue'])

// 讓標籤外層不繼承多餘的 HTML 屬性，保持乾淨
defineOptions({ inheritAttrs: false })
</script>

<style lang="scss" scoped>
/* 引用組員設定好的變數檔 */
@import '@/assets/scss/base/_var.scss';

.input-group {
  width: 100%;
}

.input-label {
  display: block;
  margin-bottom: rem(8px);
  color: $primary-color; // 使用全域變數：深藍色
  font-size: $size-body; // 16px
  font-weight: 500;
  font-family: $font-main; // 使用全域字體
}

.input-container {
  display: flex;
  align-items: center;
  height: rem(48px); // 統一高度 48px
  border: 1px solid $input-line-color1; // 預設黑框
  background-color: $text-white;
  padding: 0 rem(16px);
  transition: all 0.2s ease; // 讓變色效果變平滑

  /* 聚焦效果：當點擊輸入框時，外框變色 */
  &:focus-within {
    border-color: $input-line-color2; // 使用全域變數：深青色
  }

  /* 唯讀狀態樣式 (例如：個人資訊頁不可修改的 Email) */
  &.is-readonly {
    background-color: $bg-color; // 使用全域變數：淺灰色背景
    border-color: $page-number-color; // 框線變淡
    cursor: not-allowed; // 滑鼠變成「禁止點擊」符號

    .input-field {
      color: $page-number-color;
      cursor: not-allowed;
    }
  }

  /* Icon 的包裹容器設定 */
  .icon-wrap {
    display: flex;
    align-items: center;
    color: $primary-color;

    /* 針對裡面引用的 Icon 組件進行大小縮放 */
    :deep(span),
    :deep(i) {
      font-size: $icon-default-size; // 使用組員設定的 24px
    }

    margin-right: rem(12px); // 預設與右邊文字留點距離

    /* 如果是放在後面的 Icon (如顯示密碼的眼睛) */
    &.is-append {
      margin-right: 0;
      margin-left: rem(12px);
    }
  }

  /* 真正的文字輸入區域 */
  .input-field {
    flex: 1; // 佔滿剩餘空間
    border: none; // 拿掉原本醜醜的邊框
    outline: none; // 拿掉點擊時的藍色外框
    background: transparent;
    height: 100%;
    font-size: $size-body; // 使用 16px
    color: $text-color; // 使用全域深灰色文字

    /* 提示文字 placeholder 的顏色 */
    &::placeholder {
      color: $page-number-color; // 使用淡灰色
    }
  }
}
</style>