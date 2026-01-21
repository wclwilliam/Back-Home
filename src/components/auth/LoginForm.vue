<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'

const emit = defineEmits(['change-mode'])
const userStore = useUserStore()
const authStore = useAuthStore()
const { redirectAfterLogin } = storeToRefs(authStore)
const { loginSuccess } = authStore
const router = useRouter()

const account = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const form = reactive({ remember: false })

onMounted(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
        account.value = savedEmail
        form.remember = true
    }
})

function handleLoginSuccess() {
    if (form.remember) localStorage.setItem('userEmail', account.value)
    else localStorage.removeItem('userEmail')
    loginSuccess()
    if (redirectAfterLogin.value) {
        router.push(redirectAfterLogin.value)
        redirectAfterLogin.value = null
    }
}
</script>

<template>
    <div class="fade-in-content">
        <h2 class="form-title">歡迎回來</h2>
        <p class="subtitle">請登入會員</p>
        <form @submit.prevent="handleLoginSuccess">
            <Input v-model="account" placeholder="請輸入電子郵件">
                <template #icon><span class="material-symbols-outlined">mail</span></template>
            </Input>
            <Input v-model="password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="••••••••">
                <template #icon><span class="material-symbols-outlined">lock</span></template>
                <template #append>
                    <span class="material-symbols-outlined password-toggle"
                        @click.stop="isPasswordVisible = !isPasswordVisible">
                        {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
                    </span>
                </template>
            </Input>
            
            <div class="form-utility">
                <label class="custom-checkbox-wrapper">
                    <input type="checkbox" v-model="form.remember" class="hidden-checkbox" />
                    <span class="material-symbols-outlined checkbox-icon">
                        {{ form.remember ? 'check_box' : 'check_box_outline_blank' }}
                    </span>
                    <span class="checkbox-text">記住密碼</span>
                </label>
                <a class="link-text" @click="$emit('change-mode', 'forgot')">忘記密碼？</a>
            </div>

            <button class="btn btn-solid btn-l">登入</button>

            <div class="register-wrapper">
                <a class="link-text" @click="$emit('change-mode', 'register')">立即註冊</a>
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

.form-utility {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: rem(12px) 0;
}

/* --- 按照組員樣式統一的 Checkbox --- */
.custom-checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    gap: rem(8px); // 對齊捐款頁 gap

    .hidden-checkbox {
        display: none; // 組員寫法是直接隱藏
    }

    .checkbox-icon {
        // 使用組員指定的 font-variation
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        color: #0E6273; // 使用組員定義的 $btn-green 色值
        font-size: 24px;
        line-height: 1;
    }

    .checkbox-text {
        font-size: rem(16px);
        color: #666;
    }

    /* 勾選時圖示變填充感，但不做顏色 hover */
    input:checked + .checkbox-icon {
        font-variation-settings: 'FILL' 1;
    }
}

/* 恢復你原本的按鈕樣式 */
.btn {
    padding-top: rem(14px);
    padding-bottom: rem(14px);
    width: 100%;
    cursor: pointer;
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
        gap: 20px;
        img {
            width: 30px;
        }
    }
}
</style>