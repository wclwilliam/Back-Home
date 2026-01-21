<script setup>
// 定義組件可以接收的屬性
defineProps({
    variant: {
        type: String,
        default: 'primary' // 預設為有背景色的深青色按鈕
    }
})
</script>
<template>
    <button :class="['button', variant]" v-bind="$attrs">
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: rem(48px);
    padding: 0 rem(24px);
    font-size: rem(16px);
    border-radius: 0; // 直角
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 700;
    
    // 1. 有背景的按鈕 
    &.primary {
        background-color: $secondary-color; 
        color: white;
        border: 1px solid $secondary-color;
        
        &:hover {
        background-color: $highlight-color2; // Hover 變橘色背景
        border-color: $highlight-color2;
        }
    }

    // 2. 沒有背景的按鈕 
    &.outline {
        background-color: transparent; // 維持沒背景
        border: 2px solid $secondary-color;
        color: $secondary-color;

        &:hover {
        border-color: $highlight-color2; // Hover 只有邊框變橘
        color: $highlight-color2;        // 文字同步變橘
        background-color: transparent;   // 依然沒背景
        }
    }
    // 底線文字樣式 (用於未來活動的 修改/取消)
    &.text-link {
    background: none;
    border: none;
    padding: 0;
    text-decoration: underline;
    color: $secondary-color; 
    font-size: $size-body;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
        color: $highlight-color2; 
        text-decoration: underline;
        }
    }
}
</style>