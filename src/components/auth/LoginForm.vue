<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Input from '@/components/auth/Input.vue'
import { googleLogin } from '@/utils/publicApi.js'


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
        errorMessage.value = error.message || '登入失敗，請檢查帳號密碼'
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
</script>

<template>
    <div class="fade-in-content">
        <h2 class="form-title">歡迎回來</h2>
        <p class="subtitle">請登入會員</p>
        <form @submit.prevent="handleLogin">
            <div v-if="errorMessage" class="error-msg">
                <span class="material-symbols-outlined">error</span>{{ errorMessage }}
            </div>

            <Input v-model="account" placeholder="請輸入電子郵件" autocomplete="email">
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
        justify-content: center;
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