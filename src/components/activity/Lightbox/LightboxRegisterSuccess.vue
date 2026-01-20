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
            <h2 class="title">恭喜您報名完成！</h2>

            <p class="message">
              您可前往<router-link to="/member/:id" class="link">會員中心</router-link
              >查看報名詳情，或是點選<router-link to="/activity" class="link">此處</router-link
              >報名更多其他活動
            </p>

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
  padding: rem(50px) rem(40px);
  position: relative;
  text-align: center;
}

.title {
  font-size: rem(26px);
  color: $primary-color;
  font-weight: bold;
  margin-bottom: rem(68px);
}

.message {
  @include font-body-l;
  color: $text-color;
  line-height: 1.8;
  margin-bottom: rem(50px);
  padding: 0 rem(20px);

  .link {
    color: $text-color;
    font-weight: 700;
    text-decoration: underline;
    transition: color 0.3s;

    &:hover {
      color: $highlight-color2;
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
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
}
</style>
