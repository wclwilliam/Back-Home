<template>
    <div class="reset-password-view">
        <h2>重設密碼</h2>
        <form @submit.prevent="handleResetPassword">
            <div class="input-group">
                <input v-model="newPassword" :type="isNewPasswordVisible ? 'text' : 'password'" placeholder="請輸入新密碼"
                    autocomplete="new-password" />
                <span class="material-symbols-outlined password-toggle"
                    @click="isNewPasswordVisible = !isNewPasswordVisible">
                    {{ isNewPasswordVisible ? 'visibility' : 'visibility_off' }}
                </span>
            </div>
            <div class="input-group">
                <input v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    placeholder="請再次輸入新密碼" autocomplete="new-password" />
                <span class="material-symbols-outlined password-toggle"
                    @click="isConfirmPasswordVisible = !isConfirmPasswordVisible">
                    {{ isConfirmPasswordVisible ? 'visibility' : 'visibility_off' }}
                </span>
            </div>
            <button type="submit">送出</button>
            <div v-if="errorMessage" class="error-msg">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-msg">{{ successMessage }}</div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { resetPassword } from '@/utils/publicApi'

const route = useRoute()
const token = ref(route.query.token || '')
const newPassword = ref('')
const confirmPassword = ref('')
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleResetPassword() {
    errorMessage.value = ''
    successMessage.value = ''

    // 檢查 token 是否存在
    if (!token.value) {
        errorMessage.value = '無效的重設連結，請重新發送忘記密碼郵件'
        return
    }

    if (!newPassword.value || !confirmPassword.value) {
        errorMessage.value = '請輸入新密碼與確認密碼'
        return
    }
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = '兩次密碼輸入不一致'
        return
    }
    if (newPassword.value.length < 8) {
        errorMessage.value = '密碼長度需至少8碼'
        return
    }
    try {
        console.log('發送重設密碼請求，token:', token.value)
        await resetPassword(token.value, newPassword.value)
        successMessage.value = '密碼重設成功，請重新登入'
    } catch (e) {
        console.error('重設密碼失敗:', e)
        errorMessage.value = e.error || e.message || '密碼重設失敗，請稍後再試'
    }
}
</script>

<style scoped>
.reset-password-view {
    max-width: 400px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.input-group {
    position: relative;
    margin-bottom: 20px;
}

input {
    width: 100%;
    padding: 12px 40px 12px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #999;
}

.error-msg {
    color: #d32f2f;
    margin-top: 10px;
}

.success-msg {
    color: #388e3c;
    margin-top: 10px;
}
</style>
