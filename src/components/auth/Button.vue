<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 樣式：solid (實心), outline (邊框), outline-white (白邊框), outline-game (白底邊框)
  variant: {
    type: String,
    default: 'solid'
  },
  // 尺寸：xs, s, m, l, xl, xxl
  size: {
    type: String,
    default: 'm'
  }
});

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    props.size !== 'm' ? `btn-${props.size}` : ''
  ];
});
</script>

<template>
  <button :class="buttonClasses" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

// 重新對接變數：確保實心綠與 Hover 橘正確
// $secondary-color: #0E6273 (深青/綠)
// $highlight-color2: #E04925 (橘)

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    font-size: $size-body;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    border-style: solid;
    border-width: 2px;
    text-decoration: none;
    line-height: 1.2;
    height: rem(48px); 
}

// 1. 實心按鈕 (綠色底 -> 橘色 Hover)
.btn-solid {
    background-color: $secondary-color; 
    color: #ffffff;
    border-color: $secondary-color;

    &:hover {
        background-color: $highlight-color2; 
        border-color: $highlight-color2;
    }
}

// 2. 邊框按鈕 (綠邊綠字 -> 橘邊橘字)
.btn-outline {
    background-color: transparent;
    color: $secondary-color;
    border-color: $secondary-color;

    &:hover {
        background-color: transparent;
        color: $highlight-color2;
        border-color: $highlight-color2;
    }
}

// 3. 白邊框按鈕 (白邊白字 -> 橘邊橘字)
.btn-outline-white {
    background-color: transparent;
    color: #ffffff;
    border-color: #ffffff;

    &:hover {
        background-color: transparent;
        color: $highlight-color2;
        border-color: $highlight-color2;
    }
}

// 4. 白底邊框按鈕 (白底綠邊 -> 白底橘邊)
.btn-outline-game {
    background-color: #ffffff;
    color: $secondary-color;
    border-color: $secondary-color;

    &:hover {
        background-color: #ffffff;
        color: $highlight-color2;
        border-color: $highlight-color2;
    }
}

// --- 尺寸設定 ---
.btn-xs  { padding: 10px 8px; font-size: $m-size-caption; }
.btn-s   { padding: 10px 16px; font-size: $d-size-caption; }
.btn-l   { padding: 12px 24px; }
.btn-xl  { padding: 16px 32px; }
.btn-xxl { padding: 20px 40px; font-size: $d-size-tertiary; }
</style>