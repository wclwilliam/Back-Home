<script setup>
import Button from './auth/Button.vue';
defineProps(['modelValue']); // 控制顯示隱藏
defineEmits(['update:modelValue', 'confirm']);
</script>

<template>
    <Teleport to="body"> <!--確保燈箱位置在上層-->
        <Transition name="fade"> <!--淡入淡出-->
        <div v-if="modelValue" class="lightbox-overlay" @click.self="$emit('update:modelValue', false)">
            <div class="lightbox-content">
            <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>
            
            <div class="lightbox-main">
                <h3 class="title"><slot name="title">標題文字</slot></h3>
                
                <div class="actions">
                <Button variant="primary" @click="$emit('confirm')">確定</Button>
                <Button variant="outline" @click="$emit('update:modelValue', false)">取消</Button>
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
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex; justify-content: center; align-items: center;
    z-index: 2000;
}

.lightbox-content {
    background-color: #f0f2f5; // 灰底
    border: 1px solid $primary-color; // 外層深色邊框
    width: rem(420px);
    padding: rem(50px) rem(20px);
    position: relative;
}

.title {
    font-size: rem(26px);
    color: $primary-color;
    font-weight: bold;
    margin-bottom: rem(35px);
    text-align: center;
}

.actions {
    display: flex;
    justify-content: center;
    gap: rem(20px);
}

.close-btn {
    position: absolute;
    top: 5px; right: 8px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: $primary-color;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>