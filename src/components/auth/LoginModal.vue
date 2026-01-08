<script setup>
<<<<<<< HEAD
    import { ref } from "vue";
    let isShow = ref(false)
</script>

<template>
    <div v-show="isShow">
        <h1>登入燈箱</h1>
    </div>
</template>
    
    
<style scoped lang="scss">
    
=======
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

/**
 * 【組件引入位置註解】
 * 請根據你專案實際的資料夾層級調整路徑。
 * 這裡假設所有共用零件都放在 src/components 下。
 */
import GtInput from '@/components/auth/GtInput.vue';  // 你剛寫好的輸入框組件
//import GtButton from '@/assets/scss/component/_btn.scss'; // 組員寫的按鈕組件 (請確認路徑)
//import GtIcon from '@/assets/scss/component/_icons.scss';     // 組員寫的圖示組件 (請確認路徑)

// 初始化 Store 與 路由管理
const authStore = useAuthStore();
// isModalOpen: 控制燈箱顯示/隱藏；redirectAfterLogin: 登入後要跳轉的頁面
const { isModalOpen, redirectAfterLogin } = storeToRefs(authStore);
const { loginSuccess } = authStore;
const router = useRouter();

/**
 * 狀態管理
 * mode: 控制目前顯示哪一頁 (login:登入, register:註冊, forgot:忘記密碼, reg-success:註冊成功)
 */
const mode = ref('login'); 

// 使用 reactive 收集表單資料，方便後續整包傳送給 API
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});

// 關閉燈箱的方法
function closeModal() {
  isModalOpen.value = false;
}

// 登入成功的處理邏輯
function onLoginSuccess() {
  loginSuccess(); // 更改 Pinia 中的登入狀態
  // 如果先前有被攔截的頁面，登入後自動跳轉過去
  if (redirectAfterLogin.value) {
    router.push(redirectAfterLogin.value);
    redirectAfterLogin.value = null; // 跳轉後清空記錄
  }
}
// 強制開啟燈箱，這能讓你立刻看到 GtInput 的成果
isModalOpen.value = true;
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        
        <div class="modal-container">
          
          <button class="close-btn" @click="closeModal" title="關閉">✕</button>

          <div class="auth-content">
            
            <div class="auth-image">
              <div class="logo-overlay">
                <img src="../../../public/BackHomeLogo.png" alt="Nectar & Co. Logo">
              </div>
            </div>

            <div class="auth-form-side">
              
              <div v-if="mode === 'login'" class="fade-in-content">
                <h2 class="form-title">歡迎回來</h2>
                <p class="subtitle">請登入會員</p>
                
                <form @submit.prevent>
                  <GtInput 
                    v-model="loginForm.email" 
                    placeholder="請輸入電子郵件"
                  >
                    <template #icon><GtIcon name="mail" /></template>
                  </GtInput>

                  <GtInput 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="••••••••"
                  >
                    <template #icon><GtIcon name="lock" /></template>
                    <template #append><GtIcon name="visibility_off" /></template>
                  </GtInput>

                  <div class="form-footer">
                    <label class="remember-me">
                      <input type="checkbox" v-model="loginForm.remember"> 記住密碼
                    </label>
                    <a class="link-text" @click="mode = 'forgot'">忘記密碼？</a>
                  </div>

                  <GtButton label="登入" @click="onLoginSuccess" primary />
                </form>

                <div class="switch-mode">
                  <p>還沒加入？ <a @click="mode = 'register'">立即註冊</a></p>
                </div>

                <div class="social-login">
                  <span class="divider">或</span>
                  <div class="social-icons">
                    <img src="@/assets/image/auth/line.png" alt="Line Login"> 
                    <img src="@/assets/image/auth/google.png" alt="Google Login"> 
                    <img src="@/assets/image/auth/fb.png" alt="Facebook Login">
                  </div>
                </div>
              </div>

              <div v-else-if="mode === 'register'" class="fade-in-content">
                  <h2 class="form-title">歡迎加入</h2>
                  <p class="subtitle">請完成註冊</p>
                  <GtButton label="返回登入" @click="mode = 'login'" outline />
              </div>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
/* 引用團隊開發的變數檔案，確保顏色、字體統一 */
@import "@/assets/scss/base/_var.scss";

/* 遮罩樣式：固定定位並佔滿全螢幕 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center; // 水平置中
  align-items: center;     // 垂直置中
  z-index: 999;
}

/* 燈箱容器樣式 */
.modal-container {
  background: $text-white;
  width: rem(800px);      // 使用團隊 rem 函式
  min-height: rem(500px); // 最小高度，確保內容多時不會切到
  display: flex;
  position: relative;
  border-radius: 4px;
  overflow: hidden;       // 確保內部圖片不會超出圓角

  .close-btn {
    position: absolute;
    top: 10px; right: 10px;
    background: none; border: none;
    font-size: 24px; cursor: pointer;
    color: $page-number-color;
    z-index: 10;
    &:hover { color: $primary-color; }
  }
}

.auth-content {
  display: flex; 
  width: 100%;
}

/* 左側圖片區佈局 */
.auth-image {
  flex: 1;
  background-image: url('@/assets/image/auth/beach.png'); // 這裡確認海龜圖片路徑
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;

  /* RWD 設定：當螢幕小於 390px (手機) 時隱藏左圖 */
  @media (max-width: $design-mobile) { 
    display: none; 
  }
}

/* 右側表單區佈局 */
.auth-form-side {
  flex: 1;
  padding: rem(40px);
  display: flex;
  flex-direction: column;
  justify-content: center; // 讓表單內容垂直置中
  text-align: center;

  .form-title {
    font-size: $d-size-secondary; // 使用團隊 32px 變數
    color: $primary-color;        // 使用團隊主色 #153450
    margin-bottom: rem(8px);
  }
  
  .subtitle {
    margin-bottom: rem(24px);
    color: $page-number-color;    // 使用團隊灰色變數
  }
}

/* 表單底部功能區 (記住密碼、忘記密碼) */
.form-footer {
  display: flex;
  justify-content: space-between;
  margin-bottom: rem(20px);
  font-size: $size-body;
}

/* 連結文字樣式 */
.link-text {
  color: $primary-color;
  cursor: pointer;
  text-decoration: underline; // 加上底線符合 Mockup
}

/* 社群登入區樣式 */
.social-login {
  margin-top: rem(20px);
  .divider {
    display: block;
    margin-bottom: 15px;
    color: $page-number-color;
  }
  .social-icons img {
    width: 32px;
    margin: 0 10px;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover { transform: scale(1.1); } // 滑過稍微放大效果
  }
}

/* 動畫設定 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
>>>>>>> dev
</style>