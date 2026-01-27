<template>
  <div class="fade-in-content">
    <div v-if="currentMode === 'reg-success'" class="success-page">
      <h2 class="form-title">註冊成功</h2>
      <p class="subtitle">
        請前往 <a class="link-text" @click="$emit('change-mode', 'login')">登入會員</a>
      </p>
    </div>

    <template v-else>
      <h2 class="form-title">歡迎加入</h2>
      <p class="subtitle">請先完成郵件驗證，再設定密碼</p>

      <p v-if="errorMessage" class="error-msg">
        <span class="material-symbols-outlined">error</span>{{ errorMessage }}
      </p>

      <form @submit.prevent="handleRegister">
        <Input v-model="form.name" placeholder="請輸入姓名" autocomplete="name">
          <template #icon><span class="material-symbols-outlined">person</span></template>
        </Input>

        <Input v-model="account" placeholder="請輸入電子郵件" autocomplete="email">
          <template #icon><span class="material-symbols-outlined">mail</span></template>
        </Input>

        <div class="verify-group">
          <Input v-model="form.code" placeholder="請輸入驗證碼" class="flex-1" autocomplete="off">
            <template #icon><span class="material-symbols-outlined">key</span></template>
          </Input>
          <button type="button" class="btn btn-outline btn-xs" @click="handleSendCode" :disabled="isCodeButtonDisabled">
            {{ codeButtonText }}
          </button>
        </div>

        <Input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼"
          autocomplete="new-password">
          <template #icon><span class="material-symbols-outlined">lock</span></template>
          <template #append>
            <span class="material-symbols-outlined password-toggle"
              @click.stop="isPasswordVisible = !isPasswordVisible">
              {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <p class="hint-text">
          密碼需 8 個字元以上，且包含英文大小寫、數字
        </p>

        <Input v-model="form.confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
          placeholder="請再次輸入密碼" autocomplete="new-password">
          <template #icon><span class="material-symbols-outlined">lock</span></template>
          <template #append>
            <span class="material-symbols-outlined password-toggle"
              @click.stop="isConfirmPasswordVisible = !isConfirmPasswordVisible">
              {{ isConfirmPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <Button type="submit" variant="primary" :disabled="isLoading">
          {{ isLoading ? '註冊中...' : '確認註冊' }}
        </Button>

        <div class="register-wrapper">
          <span style="color: #666; margin-right: 8px;">已加入會員</span>
          <a class="link-text" @click="$emit('change-mode', 'login')">立即登入</a>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'
import { sendVerificationCode, register } from '@/utils/publicApi.js'

// 接收母元件傳來的 mode
const props = defineProps(['currentMode'])
const emit = defineEmits(['change-mode'])

const account = ref('')
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// 驗證碼相關
const isSendingCode = ref(false)
const countdown = ref(0)
const countdownTimer = ref(null)

const form = reactive({
  name: '',
  code: '',
  password: '',
  confirmPassword: '',
})

// 驗證碼按鈕文字
const codeButtonText = computed(() => {
  if (countdown.value > 0) return `${countdown.value}秒後重新獲取`
  return '獲取驗證碼'
})

// 驗證碼按鈕是否禁用
const isCodeButtonDisabled = computed(() => {
  return !account.value || isSendingCode.value || countdown.value > 0
})

// 發送驗證碼
const handleSendCode = async () => {
  errorMessage.value = ''

  if (!account.value) {
    errorMessage.value = '請先輸入電子郵件'
    return
  }

  // 簡單的 email 格式驗證
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(account.value)) {
    errorMessage.value = '請輸入有效的電子郵件格式'
    return
  }

  isSendingCode.value = true

  try {
    const result = await sendVerificationCode(account.value)

    // Demo 模式下會返回驗證碼，方便測試
    if (result.code) {
      console.log('驗證碼（測試用）:', result.code)
      alert(`驗證碼已發送！\n測試用驗證碼：${result.code}\n（正式環境不會顯示）`)
    } else {
      alert('驗證碼已發送至您的信箱，請查收')
    }

    // 開始倒數計時（5分鐘 = 300秒）
    countdown.value = 300
    countdownTimer.value = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer.value)
      }
    }, 1000)

  } catch (error) {
    console.error('發送驗證碼失敗:', error)

    if (error.error === 'email already registered') {
      errorMessage.value = '此電子郵件已註冊'
    } else if (error.error === 'invalid email format') {
      errorMessage.value = '電子郵件格式不正確'
    } else {
      errorMessage.value = error.error || '發送驗證碼失敗，請稍後再試'
    }
  } finally {
    isSendingCode.value = false
  }
}

// 提交註冊
const handleRegister = async () => {
  errorMessage.value = ''

  // 前端驗證
  if (!account.value || !form.name || !form.code || !form.password || !form.confirmPassword) {
    errorMessage.value = '請填寫所有欄位'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = '兩次輸入的密碼不一致'
    return
  }

  // 密碼格式驗證
  if (form.password.length < 8) {
    errorMessage.value = '密碼長度至少 8 個字元'
    return
  }

  if (!/[A-Z]/.test(form.password)) {
    errorMessage.value = '密碼必須包含至少一個大寫字母'
    return
  }

  if (!/[a-z]/.test(form.password)) {
    errorMessage.value = '密碼必須包含至少一個小寫字母'
    return
  }

  if (!/[0-9]/.test(form.password)) {
    errorMessage.value = '密碼必須包含至少一個數字'
    return
  }

  isLoading.value = true

  try {
    await register({
      email: account.value,
      code: form.code,
      password: form.password,
      name: form.name
    })

    // 清除倒數計時
    if (countdownTimer.value) {
      clearInterval(countdownTimer.value)
    }

    // 註冊成功，切換到成功頁面
    emit('change-mode', 'reg-success')

  } catch (error) {
    console.error('註冊失敗:', error)

    // 根據錯誤類型顯示相應訊息
    if (error.error === 'invalid verification code') {
      errorMessage.value = '驗證碼錯誤'
    } else if (error.error === 'no valid verification code found or expired') {
      errorMessage.value = '驗證碼已過期，請重新獲取'
    } else if (error.error === 'too many attempts, please request a new code') {
      errorMessage.value = '驗證碼錯誤次數過多，請重新獲取'
    } else if (error.error === 'email already registered and active') {
      errorMessage.value = '此電子郵件已註冊'
    } else {
      errorMessage.value = error.error || '註冊失敗，請稍後再試'
    }
  } finally {
    isLoading.value = false
  }
}

// 組件銷毀前清理計時器
onBeforeUnmount(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

:deep(.input-group) {
  margin-bottom: rem(16px);
  width: 100%;

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
    flex: 1;
    min-width: 0;
  }

  .password-toggle {
    cursor: pointer;
    color: #999;
    flex-shrink: 0;
    margin-left: 8px;

    &:hover {
      color: $secondary-color;
    }
  }
}

.fade-in-content {
  width: 100%;
  max-width: rem(400px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

:deep(.button) {
  width: 100%;
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

.verify-group {
  display: flex;
  gap: rem(8px);
  width: 100%;
  margin-bottom: rem(16px);

  :deep(.input-group) {
    margin-bottom: 0;
    flex: 1;
    min-width: 0;
  }

  .btn {
    border: 1px solid $secondary-color;
    white-space: nowrap;
    flex-shrink: 0;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: #f5f5f5;
    }
  }
}

.hint-text {
  font-size: rem(12px);
  color: #999;
  display: flex;
  align-items: center;
  gap: rem(4px);
  margin-top: rem(-12px);
  margin-bottom: rem(12px);
}

.register-wrapper {
  margin-top: rem(16px);
  text-align: center;
  font-size: rem(14px);
}

.link-text {
  cursor: pointer;
  color: $secondary-color;
  text-decoration: underline;

  &:hover {
    color: $highlight-color2;
  }
}

.success-page {
  text-align: center;
  padding: rem(40px) 0;
  width: 100%;
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