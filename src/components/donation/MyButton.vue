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
  // 按鈕寬度
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

.btn {
    @include font-body-bold;
    color: #fff;
    padding-left: 0;
    padding-right: 0;
    
}


.btn-xs {
    @include font-caption;
    color: #fff;
}

.btn-s {
    @include font-footer;
    color: #fff;
}

.btn-xxl {
    @include font-tertiary;
    color: #fff;
    
}
.btn-outline {
  color: #0E6273;
  &:hover {
        color: #E04925;
    }
}
.dis {
  background-color: $backstage-bar-line-color;
  border: $backstage-bar-line-color 2px solid;
  cursor: no-drop;
}
</style>