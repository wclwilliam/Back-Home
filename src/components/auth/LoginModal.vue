<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Input from '@/components/auth/Input.vue' 

const authStore = useAuthStore()
const { isModalOpen, redirectAfterLogin } = storeToRefs(authStore)
const { loginSuccess } = authStore
const router = useRouter()

/**
 * 模式切換邏輯
 * login: 登入 | register: 註冊 | forgot: 忘記密碼
 * reg-success: 註冊成功頁 | set-success: 密碼重設成功頁
 */
const mode = ref('login')
const isPasswordVisible = ref(false) 
const isConfirmPasswordVisible = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  remember: false,
})

onMounted(() => {
  const savedEmail = localStorage.getItem('userEmail')
  if (savedEmail) {
    form.email = savedEmail
    form.remember = true 
  }
})

function closeModal() {
  isModalOpen.value = false
  setTimeout(() => { mode.value = 'login' }, 300)
}

function handleLoginSuccess() {
  if (form.remember) localStorage.setItem('userEmail', form.email)
  else localStorage.removeItem('userEmail')
  
  loginSuccess()
  if (redirectAfterLogin.value) {
    router.push(redirectAfterLogin.value)
    redirectAfterLogin.value = null
  }
  closeModal()
}
isModalOpen.value = true //測試用 強制打開燈箱
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
                <img src="/BackHomeLogo.png" alt="Logo" />
              </div>
            </div>

            <div class="auth-form-side">
              
              <div v-if="mode === 'login'" class="fade-in-content">
                <h2 class="form-title">歡迎回來</h2>
                <p class="subtitle">請登入會員</p>
                <form @submit.prevent="handleLoginSuccess">
                  <Input v-model="form.email" placeholder="請輸入電子郵件">
                    <template #icon><span class="material-symbols-outlined">mail</span></template>
                  </Input>
                  <Input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="••••••••">
                    <template #icon><span class="material-symbols-outlined">lock</span></template>
                    <template #append>
                      <span class="material-symbols-outlined password-toggle" @click.stop="isPasswordVisible = !isPasswordVisible">
                        {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
                      </span>
                    </template>
                  </Input>

                  <div class="form-utility">
                    <label class="custom-checkbox-wrapper">
                      <input type="checkbox" v-model="form.remember" class="hidden-checkbox" />
                      <span class="styled-box"></span>
                      <span class="checkbox-text">記住密碼</span>
                    </label>
                    <a class="link-text" @click="mode = 'forgot'">忘記密碼？</a>
                  </div>

                  <button type="submit" class="login-submit-btn">登入</button>
                  <div class="register-wrapper">
                    <a class="link-text" @click="mode = 'register'">立即註冊</a>
                  </div>
                </form>

                <div class="social-login">
                  <div class="divider">或</div>
                  <div class="social-icons">
                    <img src="@/assets/image/auth/line.png" alt="Line" />
                    <img src="@/assets/image/auth/google.png" alt="Google" />
                    <img src="@/assets/image/auth/fb.png" alt="FB" />
                  </div>
                </div>
              </div>

              <div v-else-if="mode === 'register' || mode === 'forgot'" class="fade-in-content">
                <h2 class="form-title">{{ mode === 'register' ? '歡迎加入' : '忘記密碼？' }}</h2>
                <p class="subtitle">請先完成郵件驗證，再設定密碼</p>
                <form @submit.prevent="mode === 'register' ? mode = 'reg-success' : mode = 'set-success'">
                  <Input v-model="form.email" placeholder="請輸入電子郵件">
                    <template #icon><span class="material-symbols-outlined">mail</span></template>
                  </Input>
                  <div class="verify-group">
                    <Input v-model="form.code" placeholder="請輸入驗證碼" class="flex-1">
                      <template #icon><span class="material-symbols-outlined">key</span></template>
                    </Input>
                    <button type="button" class="get-code-btn">獲取驗證碼</button>
                  </div>
                  <Input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼">
                    <template #icon><span class="material-symbols-outlined">lock</span></template>
                    <template #append>
                      <span class="material-symbols-outlined password-toggle" @click.stop="isPasswordVisible = !isPasswordVisible">
                        {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
                      </span>
                    </template>
                  </Input>
                  <p class="hint-text"><span class="material-symbols-outlined">info</span> 密碼需 8 個字元以上，且包含英文大小寫、數字</p>
                  <Input v-model="form.confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'" placeholder="請再次輸入密碼">
                    <template #icon><span class="material-symbols-outlined">lock</span></template>
                    <template #append>
                      <span class="material-symbols-outlined password-toggle" @click.stop="isConfirmPasswordVisible = !isConfirmPasswordVisible">
                        {{ isConfirmPasswordVisible ? 'visibility' : 'visibility_off' }}
                      </span>
                    </template>
                  </Input>
                  <button type="submit" class="login-submit-btn">{{ mode === 'register' ? '確認註冊' : '確認設定' }}</button>
                  <div class="register-wrapper">
                    <span v-if="mode === 'register'" style="color: #666; margin-right: 8px;">已加入會員</span>
                    <a class="link-text" @click="mode = 'login'">{{ mode === 'register' ? '立即登入' : '返回上一步' }}</a>
                  </div>
                </form>
              </div>

              <div v-else-if="mode === 'reg-success' || mode === 'set-success'" class="fade-in-content success-page">
                <h2 class="form-title">{{ mode === 'reg-success' ? '註冊成功' : '設定成功' }}</h2>
                <p class="subtitle">請前往 <a class="link-text" @click="mode = 'login'" style="text-decoration: none;">登入會員</a></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

/* --- Input框 --- */
:deep(.input-group) {
  margin-bottom: rem(16px);

  /* 1. 針對外層容器：改為綠色邊框，並取消內部的黑框 */
  .input-container {
    border: 1px solid $secondary-color !important;
    background-color: transparent !important; // 配合燈箱背景
    
    // 確保 Icon 顏色也變綠
    .icon-wrap {
      color: $secondary-color !important;
      span { color: $secondary-color !important; }
    }
  }

  /* 2. 針對真正的輸入欄位：確保它沒有多餘邊框 */
  .input-field {
    border: none !important;
    box-shadow: none !important;
  }

  /* 3. 密碼眼睛圖標 */
  .password-toggle {
    cursor: pointer;
    color: #999;
    &:hover { color: $secondary-color; }
  }
}

/* --- 燈箱基礎樣式 --- */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 999; }
.modal-container { background: $text-white; width: 90%; max-width: rem(800px); min-height: rem(520px); display: flex; position: relative; border-radius: 4px; overflow: hidden;
  .close-btn { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer; color: $page-number-color; z-index: 10; }
}
.auth-content { display: flex; width: 100%; }
.auth-image { flex: 1; background-image: url('@/assets/image/auth/beach.png'); background-size: cover; background-position: center; display: flex; justify-content: center; align-items: center; @media (max-width: 390px) { display: none; } }
.auth-form-side { flex: 1; padding: rem(40px) rem(60px); display: flex; flex-direction: column; justify-content: center;
  .form-title { @include font-secondary; color: $primary-color; margin-bottom: rem(8px); text-align: center; font-weight: bold; }
  .subtitle { margin-bottom: rem(32px); color: $page-number-color; text-align: center; font-size: rem(16px); }
}

/* --- 自定義 Checkbox 與 Hover 橘色 --- */
.custom-checkbox-wrapper {
  display: flex; align-items: center; cursor: pointer; gap: 8px; position: relative;
  .hidden-checkbox { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
  .styled-box {
    width: 16px; height: 16px; border: 1px solid $secondary-color; background-color: transparent; border-radius: 2px;
    display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
    &::after { content: '✔'; font-size: 10px; color: white; display: none; }
  }
  .checkbox-text { font-size: rem(14px); color: $primary-color; transition: color 0.2s ease; }
  .hidden-checkbox:checked + .styled-box { background-color: $secondary-color; border-color: $secondary-color; &::after { display: block; } }
  &:hover { .styled-box { border-color: $highlight-color2; } .checkbox-text { color: $highlight-color2; } }
}

/* --- 按鈕與連結 --- */
.login-submit-btn {
  width: 100%; height: rem(48px); background-color: $secondary-color; color: $text-white; border: none; border-radius: 4px;
  cursor: pointer; font-size: rem(18px); transition: all 0.3s ease;
  &:hover { background-color: $highlight-color2; }
}
.form-utility { display: flex; justify-content: space-between; align-items: center; margin-top: rem(8px); margin-bottom: rem(32px); }
.register-wrapper { margin-top: rem(12px); display: flex; justify-content: flex-end; }
.link-text { color: $primary-color; cursor: pointer; font-size: rem(14px); text-decoration: underline; &:hover { color: $highlight-color2; } }

/* --- 註冊/重設密碼專用 --- */
.verify-group { display: flex; gap: 8px; margin-bottom: rem(16px); .flex-1 { flex: 1; margin-bottom: 0; } }
.get-code-btn { height: rem(48px); padding: 0 rem(12px); border: 1px solid $secondary-color; background: transparent; color: $secondary-color; border-radius: 4px; cursor: pointer; font-size: rem(14px); white-space: nowrap; &:hover { border-color: $highlight-color2; color: $highlight-color2; } }
.hint-text { font-size: rem(12px); color: $page-number-color; margin: rem(-8px) 0 rem(16px) 0; display: flex; align-items: center; gap: 4px; .material-symbols-outlined { font-size: 16px; } }
.success-page { text-align: center; .form-title { margin-top: rem(20px); } }

/* --- 社群登入 --- */
.social-login {
  text-align: center; margin-top: rem(40px);
  .divider { display: flex; align-items: center; color: $page-number-color; margin-bottom: rem(20px); font-size: rem(14px); &::before, &::after { content: ""; flex: 1; height: 1px; background: #eee; margin: 0 10px; } }
  .social-icons { display: flex; justify-content: center; gap: rem(30px); img { width: rem(28px); cursor: pointer; transition: transform 0.2s; &:hover { transform: scale(1.1); } } }
}

/* --- 動畫 --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-in-content { animation: fadeIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>