<script setup>
import { reactive, onMounted, watch, computed } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  value: { type: Number, default: 0 },
  duration: { type: Number, default: 1 }
});

// 建立一個響應式物件 state，display 屬性用來存放「當前畫面上顯示的數字」
const state = reactive({ display: 0 });

// 使用計算屬性來格式化數字
const formattedNumber = computed(() => {
  return new Intl.NumberFormat('en-US').format(state.display);
});

// 定義執行動畫的函式
const playAnimation = () => {
  // 使用 GSAP 對 state 物件進行動畫處理
  gsap.to(state, {
    duration: props.duration,
    display: props.value,     // state.display 會從當前值變動到 props.value (目標值)
    
    // snap它會強制讓數值在跳動時「對齊」到整數 (1 的倍數)
    snap: { display: 1 },
    ease: "power2.out"
  });
};

// 當掛載完畢後，立即執行一次動畫
onMounted(playAnimation);


watch(() => props.value, playAnimation);
</script>

<template>
  <span>
    {{ formattedNumber }}
    <small><slot></slot></small>
</span>
</template>

<style scoped lang="scss">
    span {
        small {
            @include font-body-l;
            flex-shrink: 0;
            color: #fff
        }
    }
</style>