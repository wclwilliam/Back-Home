<script setup>
import Button from '../../auth/Button.vue'

defineProps({
  modelValue: Boolean, // 控制顯示隱藏
})

defineEmits(['update:modelValue'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="lightbox-overlay"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="lightbox-content">
          <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>

          <div class="lightbox-main">
            <h2 class="title">您已經檢舉過此留言囉！</h2>

            <div class="actions">
              <Button variant="primary" @click="$emit('update:modelValue', false)">關閉</Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

// ... (樣式部分完全複製 LightboxReportSuccess.vue 即可，這裡省略以節省篇幅) ...
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
  width: rem(800px);
  max-width: 90vw;
  padding: rem(50px) rem(60px);
  position: relative;
  text-align: center;
}

.title {
  font-size: rem(26px);
  color: $primary-color;
  font-weight: bold;
  margin-bottom: rem(48px);
}

.actions {
  display: flex;
  justify-content: center;
  gap: rem(20px);
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: $primary-color;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media screen and (max-width: 767px) {
  .lightbox-content {
    width: 90vw;
    padding: rem(50px) rem(20px);
    max-height: 70vh;
    overflow-y: auto;
  }
}
</style>