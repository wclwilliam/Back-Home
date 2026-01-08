<template>
    <div class="gt-input-group">
        <label v-if="label" class="gt-label">{{ label }}</label>
        
        <div :class="['gt-input-container', { 'is-readonly': readonly }]">
        <div v-if="$slots.icon" class="gt-icon-wrap">
            <slot name="icon"></slot>
        </div>

        <input
            v-bind="$attrs"
            :value="modelValue"
            :readonly="readonly"
            @input="$emit('update:modelValue', $event.target.value)"
            class="gt-input-field"
        />

        <div v-if="$slots.append" class="gt-icon-wrap is-append">
            <slot name="append"></slot>
        </div>
        </div>
    </div>
    </template>

    <script setup>
    defineProps({
    modelValue: [String, Number],
    label: String,
    readonly: { type: Boolean, default: false }
    });
    defineEmits(['update:modelValue']);
    defineOptions({ inheritAttrs: false });
    </script>

    <style lang="scss" scoped>
    // 引用團隊的變數檔
    @import "@/assets/scss/base/_var.scss";

    .gt-input-group {
    margin-bottom: rem(20px);
    width: 100%;
    }

    .gt-label {
    display: block;
    margin-bottom: rem(8px);
    color: $primary-color; // 使用團隊主色 $primary-color
    font-size: $size-body;
    font-weight: 500;
    font-family: $font-main;
    }

    .gt-input-container {
    display: flex;
    align-items: center;
    height: rem(48px); // 統一高度 48px 換算為 rem
    border: 1px solid $input-line-color1; // 預設黑框
    background-color: $text-white;
    padding: 0 rem(16px);
    transition: all 0.2s ease;

    // 聚焦效果：使用 $input-line-color2 (深青色)
    &:focus-within {
        border-color: $input-line-color2;
        box-shadow: 0 0 4px rgba($secondary-color, 0.1);
    }

    // 唯讀狀態 (對應個人資訊頁不可改的 Email)
    &.is-readonly {
        background-color: #E9E9E9; // 或使用 $bg-color
        border-color: $page-number-color;
        cursor: not-allowed;
        .gt-input-field {
        color: $page-number-color;
        cursor: not-allowed;
        }
    }

    .gt-icon-wrap {
        display: flex;
        align-items: center;
        color: $primary-color;
        // 這裡可以根據團隊 Icon 的大小微調
        :deep(span), :deep(i) {
        font-size: $icon-default-size;
        }
        
        margin-right: rem(12px);
        &.is-append {
        margin-right: 0;
        margin-left: rem(12px);
        }
    }

    .gt-input-field {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        height: 100%;
        font-size: $size-body; // 16px
        font-family: $font-main;
        color: $text-color;

        &::placeholder {
        color: $page-number-color; // 提示文字使用較淡的灰色
        }
    }
}
</style>