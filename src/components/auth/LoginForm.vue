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
                    <span class="styled-box"></span>
                    <span class="checkbox-text">記住密碼</span>
                </label>
                <a class="link-text" @click="$emit('change-mode', 'forgot')">忘記密碼？</a>
            </div>
            <!--{{ userStore.isLogin ? 1 : 0 }}-->
            <!-- 測試代碼 -->
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

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

:deep(.button) {
    width: 100%;
}

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
        flex-shrink: 0;
       

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
    text-align: center;
}

.subtitle {
    font-size: rem(14px);
    color: #666;
    margin-bottom: rem(24px);
    text-align: center;
}

form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.form-utility {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: rem(12px) 0;
    font-size: rem(14px);
}

.custom-checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: rem(16px);
    user-select: none;

    &:hover {
        .styled-box {
            border-color: $highlight-color2;
            background-color: rgba($highlight-color2, 0.05);
        }

        .checkbox-text {
            color: $highlight-color2;
        }
    }

    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        width: 16px;
        height: 16px;
    }

    .styled-box {
        border-color: $secondary-color; // 懸停時邊框變色
        background-color: rgba($secondary-color, 0.05); // 淡淡的背景色
    }

    .checkbox-text {
        color: $secondary-color; // 文字也跟著變色
    }
}

.hidden-checkbox {
    position: absolute; // 改成 absolute
    opacity: 0; // 改成 opacity: 0
    cursor: pointer;
    width: 16px;
    height: 16px;
}

.styled-box {
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s ease;
}

// checkbox 被勾選時的樣式
input:checked~.styled-box {
    background-color: $secondary-color;
    border-color: $secondary-color;

    // 打勾符號，加偽元素
    &::after {
        content: '✓';
        color: white;
        font-size: 12px;
    }
}

.checkbox-text {
    font-size: rem(16px);
    color: #666;
    transition: color 0.2s ease;
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
    font-size: rem(16px);
    transition: color 0.2s ease;

    &:hover {
        color: $highlight-color2; // 加入 hover 橘色
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

.btn{
    padding-top: rem(14px);
    padding-bottom: rem(14px);
}
</style>