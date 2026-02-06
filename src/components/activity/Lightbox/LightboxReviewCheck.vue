<script setup>
import Button from '../../auth/Button.vue'

defineProps({
  modelValue: {
    type: Boolean, // 控制顯示隱藏
    required: true,
  },
  // 其他 props 可以在這裡定義，例如留言內容等
  data: {
    type: Object,
    default: () => ({star: 0, comment: '' }),
  }
})


defineEmits(['update:modelValue', 'confirm'])
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
            <h2 class="title">確認送出留言？</h2>

            <div class="actions">
              <Button variant="primary" @click="$emit('confirm')">確認送出</Button>
              <Button variant="outline" @click="$emit('update:modelValue', false)">返回修改</Button>
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
  background-color: #f0f2f5; // 灰底
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

// 手機版 RWD
@media screen and (max-width: 767px) {
  .lightbox-content {
    width: 90vw;
    padding: rem(50px) rem(20px);
    max-height: 70vh;
    overflow-y: auto;
  }

  .actions {
    gap: rem(12px);
  }
}
</style>
