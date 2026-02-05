<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <button class="close-btn" @click="closeModal">✕</button>
          <div class="auth-content">
            <div class="auth-image">
              <div class="logo-overlay">
                <img src="/BackHomeLogo.png" alt="Logo" />
              </div>
            </div>
            <div class="auth-form-side">
              <LoginForm v-if="mode === 'login'" @change-mode="mode = $event" />
              <RegisterForm v-else-if="mode === 'register' || mode === 'reg-success'" :current-mode="mode"
                @change-mode="mode = $event" />
              <ForgotForm v-else-if="mode === 'forgot' || mode === 'reset' || mode === 'reset-success'"
                :current-mode="mode" @change-mode="mode = $event" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ForgotForm from './ForgotForm.vue'

const authStore = useAuthStore()
const { isModalOpen, resetToken } = storeToRefs(authStore)
const mode = ref('login')

// 監聽 resetToken，如果有值則切換到 reset 模式
watch(resetToken, (newToken) => {
  if (newToken) {
    mode.value = 'reset'
  }
})

function closeModal() {
  authStore.closeLoginModal()
  setTimeout(() => { mode.value = 'login' }, 300)
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

/* 大框架樣式， 1:1  */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-container {
  background: $text-white;
  width: 90%;
  max-width: rem(900px);
  min-height: rem(550px);
  display: flex;
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
    max-height: 90vh;
    overflow-y: auto;
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: $page-number-color;
    z-index: 20;
  }
}

.auth-content {
  display: flex;
  width: 100%;
}

.auth-image {
  flex: 0 0 50%;
  background-image: url('@/assets/image/auth/beach.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  .logo-overlay img {
    width: rem(180px);
  }
}

.auth-form-side {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: rem(50px) rem(40px);

  @media (max-width: 768px) {
    flex: 1;
    width: 100%;
    padding: rem(40px) rem(24px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;

  .modal-container {
    transition: transform 0.3s, opacity 0.3s;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>