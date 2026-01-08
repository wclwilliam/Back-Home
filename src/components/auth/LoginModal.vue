<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'


const authStore = useAuthStore();
// 使用 storeToRefs 保持響應式
// 1. 只有 State (資料) 使用 storeToRefs
const { isModalOpen , redirectAfterLogin } = storeToRefs(authStore);
// 2. Actions (方法) 直接從 store 解構，不需要 storeToRefs
const { loginSuccess } = authStore;

const router = useRouter()

// 登入成功
function onLoginSuccess() {
  loginSuccess()

  if (redirectAfterLogin.value) {
    router.push(redirectAfterLogin.value)
    redirectAfterLogin.value = null
  }
}

// 控制目前顯示：login (登入), register (註冊), forgot (忘記密碼)
const mode = ref('login'); 

function closeModal() {
    isModalOpen.value= false
}

</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <button class="close-btn" @click="closeModal">✕</button>

          <div class="auth-content">
            <div class="auth-image">
              <div class="logo-overlay">
                <img src="../../../public/BackHomeLogo.png" alt="Logo">
              </div>
            </div>

            <div class="auth-form-side">
              <div v-if="mode === 'login'">
                <h2>歡迎回來</h2>
                <p class="subtitle">請登入會員</p>
                <form @submit.prevent>
                  <div class="input-group">
                    <i class="icon-email"></i>
                    <input type="email" placeholder="請輸入電子郵件">
                  </div>
                  <div class="input-group">
                    <i class="icon-lock"></i>
                    <input type="password" placeholder="••••••••">
                  </div>
                  <div class="form-footer">
                    <label><input type="checkbox"> 記住密碼</label>
                    <a @click="mode = 'forgot'">忘記密碼？</a>
                  </div>
                  <button class="btn-primary" @click="onLoginSuccess">登入</button>
                </form>
                <div class="switch-mode">
                  <a @click="mode = 'register'">立即註冊</a>
                </div>
                <div class="social-login">
                  <span>或</span>
                  <div class="social-icons">
                    <img src="@/assets/image/auth/line.png"> <img src="@/assets/image/auth/google.png"> <img src="@/assets/image/auth/fb.png">
                  </div>
                </div>
              </div>

              <div v-if="mode === 'register'">
                 <h2>歡迎加入</h2>
                 <a @click="mode = 'login'">立即登入</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
/* 燈箱背景 */
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

/* 容器設計 */
.modal-container {
  background: white;
  width: 800px; /* 根據你的設計圖調整寬度 */
  height: 500px;
  display: flex;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .close-btn {
    position: absolute;
    right: 0;
  }
}
.auth-content {
    display: flex;
    width: 100%;
}

/* 左側圖片區 */
.auth-image {
  flex: 1;
  background-image: url('@/assets/image/auth/beach.png');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 右側表單區 */
.auth-form-side {
  flex: 1;
  padding: 40px;
  text-align: center;
}

/* 過渡動畫 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 輸入框、按鈕等樣式依圖實作... */
.btn-primary {
  background: #116069; /* 參考你圖中的深青色 */
  color: white;
  width: 100%;
  padding: 10px;
  border: none;
  cursor: pointer;
}
</style>