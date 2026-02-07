<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Input from '@/components/auth/Input.vue'
import { googleLogin, getLineAuthUrl, lineLoginVerify } from '@/utils/publicApi.js'


const emit = defineEmits(['change-mode'])
const authStore = useAuthStore()
const { redirectAfterLogin } = storeToRefs(authStore)
const { loginSuccess } = authStore
const router = useRouter()

const account = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
    // 清除之前的錯誤訊息
    errorMessage.value = ''

    // 驗證輸入
    if (!account.value || !password.value) {
        errorMessage.value = '請輸入帳號和密碼'
        return
    }

    isLoading.value = true

    try {
        // 呼叫登入 API
        await authStore.login({
            account: account.value,
            password: password.value
        })

        // 登入成功，燈箱會自動關閉
        // 如果有需要導向的頁面則導向
        if (redirectAfterLogin.value) {
            router.push(redirectAfterLogin.value)
            redirectAfterLogin.value = null
        }
    } catch (error) {
        // 處理帳號停用錯誤
        if (error.error === 'account is inactive') {
            errorMessage.value = '此帳號已被停用'
        } else {
            errorMessage.value = error.message || error.error || '登入失敗，請檢查帳號密碼'
        }
    } finally {
        isLoading.value = false
    }
}

// Google 登入 callback
const callback = async (response) => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        // 調用後端 Google 登入 API
        const result = await googleLogin(response.credential)

        if (result.status === 'success' && result.token) {
            // 使用 auth store 的 setToken 方法儲存（會自動存到正確的 key）
            authStore.setToken(result.token)

            // 登入成功後，從後端獲取完整的會員資料
            await authStore.fetchMe()

            // 關閉登入 modal
            authStore.closeLoginModal()

            // 如果有需要導向的頁面則導向
            if (redirectAfterLogin.value) {
                router.push(redirectAfterLogin.value)
                redirectAfterLogin.value = null
            }
        }
    } catch (error) {
        console.error('Google 登入失敗:', error)

        if (error.error === 'Invalid Google token') {
            errorMessage.value = 'Google 登入驗證失敗，請重試'
        } else if (error.error === 'account is inactive') {
            errorMessage.value = '此帳號已被停用'
        } else {
            errorMessage.value = error.error || 'Google 登入失敗，請稍後再試'
        }
    } finally {
        isLoading.value = false
    }
}

// LINE 登入處理
const handleLineLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        // 1. 獲取 LINE 授權 URL
        const result = await getLineAuthUrl()

        if (result.status === 'success' && result.line_auth_url) {
            // 2. 將 state 和 nonce 存到 sessionStorage 用於後續驗證
            sessionStorage.setItem('line_state', result.state)
            sessionStorage.setItem('line_nonce', result.nonce)

            // 3. 跳轉到 LINE 授權頁面
            window.location.href = result.line_auth_url
        } else {
            throw new Error('無法取得 LINE 授權 URL')
        }
    } catch (error) {
        console.error('LINE 登入失敗:', error)
        errorMessage.value = error.message || 'LINE 登入失敗，請稍後再試'
        isLoading.value = false
    }
}
</script>

<template>
    <div class="fade-in-content">
        <h2 class="form-title">歡迎回來</h2>
        <p class="subtitle">請登入會員</p>
        <form @submit.prevent="handleLogin">
            <div v-if="errorMessage" class="error-msg">
                <span class="material-symbols-outlined">error</span>{{ errorMessage }}
            </div>

            <Input v-model="account" type="email" placeholder="請輸入電子郵件" autocomplete="email">
                <template #icon><span class="material-symbols-outlined">person</span></template>
            </Input>
            <Input v-model="password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼"
                autocomplete="current-password">
                <template #icon><span class="material-symbols-outlined">lock</span></template>
                <template #append>
                    <span class="material-symbols-outlined password-toggle"
                        @click.stop="isPasswordVisible = !isPasswordVisible">
                        {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
                    </span>
                </template>
            </Input>

            <div class="form-utility">
                <a class="link-text" @click="$emit('change-mode', 'forgot')">忘記密碼？</a>
            </div>

            <button type="submit" class="btn btn-solid btn-l" :disabled="isLoading">
                {{ isLoading ? '登入中...' : '登入' }}
            </button>

            <div class="register-wrapper">
                <a class="link-text" @click="$emit('change-mode', 'register')">立即註冊</a>
            </div>
        </form>
        <div class="social-login">
            <div class="divider">或</div>
            <div class="social-icons">
                <GoogleLogin :callback="callback" />
                <button type="button" class="line-login-btn" @click="handleLineLogin" :disabled="isLoading">
                    <svg viewBox="0 0 24 24" class="line-icon">
                        <path fill="currentColor"
                            d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    使用 LINE 帳號登入
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

// 修正 Sass 報錯：重新手寫 transform 區域，確保無非法字元
:deep(.input-group) {
    margin-bottom: rem(16px);
    position: relative;

    .input-container {
        border: 1px solid $secondary-color !important;
        background-color: transparent !important;
        display: flex;
        align-items: center;

        .icon-wrap,
        span {
            color: $secondary-color !important;
            flex-shrink: 0;
        }
    }

    .input-field {
        border: none !important;
        box-shadow: none !important;
        padding-right: rem(40px) !important;
    }

    .password-toggle {
        position: absolute;
        right: rem(12px);
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        cursor: pointer;
        color: #999;

        &:hover {
            color: $secondary-color;
        }
    }
}

.fade-in-content {
    width: 100%;
    max-width: rem(400px);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
}

.form-title {
    @include font-secondary;
    color: $primary-color;
    margin-bottom: rem(8px);
}

.subtitle {
    font-size: rem(14px);
    color: #666;
    margin-bottom: rem(24px);
}

form {
    width: 100%;
}

.error-msg {
    @include font-body;
    color: $highlight-color2;
    margin-top: -4px;
    margin-bottom: rem(16px);
    display: flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    text-align: left;
}

.form-utility {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin: rem(12px) 0;
}

/* 恢復你原本的按鈕樣式 */
.btn {
    padding-top: rem(14px);
    padding-bottom: rem(14px);
    width: 100%;
    cursor: pointer;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.register-wrapper {
    margin-top: rem(16px);
    text-align: right;
    font-size: rem(16px);
}

.link-text {
    cursor: pointer;
    color: $secondary-color;
    text-decoration: underline;

    &:hover {
        color: $highlight-color2;
    }
}

.social-login {
    width: 100%;
    margin-top: rem(30px);

    .divider {
        text-align: center;
        margin-bottom: 15px;
        color: #ccc;
    }

    .social-icons {
        display: flex;
        flex-direction: column;
        gap: rem(12px);
        align-items: center;
    }

    .line-login-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: rem(8px);
        height: 40px;
        padding: 0 rem(24px);
        background-color: #06C755;
        color: white;
        border: none;
        border-radius: rem(4px);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover:not(:disabled) {
            background-color: #05B04C;
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .line-icon {
            width: rem(24px);
            height: rem(24px);
        }
    }
}

.material-symbols-outlined {
    font-variation-settings:
        'FILL' 1,
        'wght' 700,
        'GRAD' 0,
        'opsz' 20;
    color: $highlight-color2;
    font-size: 16px;
}
</style>