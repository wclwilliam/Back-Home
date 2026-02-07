<script setup>
import Button from './auth/Button.vue';

// 增加 width 屬性，讓外層可以控制寬度（預設 420px）
const props = defineProps({
    modelValue: Boolean,
    width: {
        type: String,
        default: '420px'
    }
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue" class="lightbox-overlay" @click.self="$emit('update:modelValue', false)">
                <div class="lightbox-content" :style="{ width: props.width }">
                    <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>

                    <div class="lightbox-main">
                        <h3 class="title">
                            <slot name="title">提示訊息</slot>
                        </h3>

                        <div class="content-body">
                            <slot />
                        </div>

                        <div class="actions">
                            <slot name="footer">
                                <Button variant="primary" @click="$emit('confirm')">確定</Button>
                                <Button variant="outline" @click="$emit('update:modelValue', false)">取消</Button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.lightbox-content {
    background-color: #f0f2f5;
    border: 1px solid $primary-color;
    min-height: rem(200px);
    padding: rem(40px) rem(30px);
    position: relative;
    text-align: center;
}

.title {
    font-size: rem(26px);
    color: $primary-color;
    font-weight: bold;
    margin-bottom: rem(25px);
    text-align: center;
}

.content-body {
    margin-bottom: rem(30px);
    color: $text-color;
    line-height: 1.6;
}

.actions {
    display: flex;
    justify-content: center;
    gap: rem(20px);
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: $primary-color;

    &:hover {
        opacity: 0.7;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>