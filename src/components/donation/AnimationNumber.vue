<script setup>
// 從 vue 核心庫導入需要的 Composition API 函式
import { reactive, onMounted, watch, computed } from 'vue';
// 導入 GSAP 動畫庫
import gsap from 'gsap';

// 定義元件的外部屬性 (Props)，讓父元件可以傳入目標數值與動畫時間
const props = defineProps({
  value: { type: Number, default: 0 },    // 目標數字，預設為 0
  duration: { type: Number, default: 2 }  // 動畫持續秒數，預設為 2 秒
});

// 建立一個響應式物件 state，display 屬性用來存放「當前畫面上顯示的數字」
const state = reactive({ display: 0 });

// 【新增】使用計算屬性來格式化數字
// Intl.NumberFormat 是瀏覽器內建最效能且準確的格式化方式
const formattedNumber = computed(() => {
  return new Intl.NumberFormat('en-US').format(state.display);
});

// 定義執行動畫的函式
const playAnimation = () => {
  // 使用 GSAP 對 state 物件進行動畫處理
  gsap.to(state, {
    duration: props.duration, // 動畫執行的總長度
    display: props.value,     // state.display 會從當前值變動到 props.value (目標值)
    
    // snap 是關鍵：它會強制讓數值在跳動時「對齊」到整數 (1 的倍數)
    // 如果不加這行，畫面上會出現大量的小數點（例如 1.2345...）
    snap: { display: 1 },
    
    // 設定緩動效果，power2.out 會讓動畫「開頭快、結尾慢」，看起來比較自然流暢
    ease: "power2.out"
  });
};

// 生命週期鉤子：當元件掛載到 DOM 完畢後，立即執行一次動畫
onMounted(playAnimation);

// 監聽器：如果父元件傳進來的 value 發生變化（例如數字從 100 變成 200）
// 就再次觸發 playAnimation，讓數字從當前位置捲動到新位置
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
        }
    }
</style>