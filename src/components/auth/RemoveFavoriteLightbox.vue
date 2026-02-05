<script setup>
import Button from '@/components/auth/Button.vue';

const props = defineProps({
  modelValue: Boolean,
  isSuccess: Boolean
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => {
  emit('update:modelValue', false);
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="remove-favorite-overlay" @click.self="close">
        <div class="remove-favorite-content">
          <button class="close-btn" @click="close">✕</button>
          
          <div class="lightbox-main">
            <h3 class="title">
              {{ isSuccess ? '已移出收藏' : '是否移出收藏夾？' }}
            </h3>
            
            <div class="content-body">
              <p v-if="isSuccess">該項目已從您的收藏清單中移除。</p>
              <p v-else>確定要移出收藏夾嗎？</p>
            </div>
            
            <div class="actions">
              <template v-if="isSuccess">
                <Button variant="primary" @click="close">確定</Button>
              </template>
              <template v-else>
                <Button variant="primary" @click="handleConfirm">確定</Button>
                <Button variant="outline" @click="close">取消</Button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.remove-favorite-overlay {
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

.remove-favorite-content {
  background-color: #f0f2f5;
  border: 1px solid $primary-color;
  width: 420px;
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
  font-size: rem(18px);
  padding: rem(10px) 0;
  
  p {
    margin: rem(10px) 0;
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: rem(16px);
  margin-top: rem(32px);
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

@media (max-width: 768px) {
  .remove-favorite-content {
    width: 90vw;
    max-width: 420px;
  }
}
</style>
