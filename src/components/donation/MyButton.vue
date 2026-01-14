<template>
  <button 
    class="btn btn-solid" 
    :style="buttonStyle"
  >
    <slot>{{ content }}</slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 按鈕文字
  content: {
    type: String,
    default: '按鈕'
  },
  // 按鈕寬度，預設 100%
  width: {
    type: String,
    default: null
  },
  // 按鈕高度
  height: {
    type: String,
    default: null
  },
  // 按鈕邊框
  height: {
    type: String,
    default: null
  },
  borderWidth: {
    type: String,
    default: null
  }
});

// 動態計算樣式
const buttonStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderWidth: props.borderWidth
}));
</script>

<style scoped lang="scss">

</style>