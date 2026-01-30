<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'
import { forgotPassword, resetPassword } from '@/utils/publicApi'

const props = defineProps(['currentMode'])
const emit = defineEmits(['change-mode'])

const authStore = useAuthStore()
const { resetToken: urlResetToken } = storeToRefs(authStore)

const email = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const debugResetUrl = ref('')

const newPassword = ref('')
const confirmPassword = ref('')
const resetError = ref('')
let resetToken = ''

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

// 如果有從 URL 來的 token，直接使用
onMounted(() => {
  if (urlResetToken.value) {
    resetToken = urlResetToken.value
  }
})

async function handleForgotPassword() {
  errorMessage.value = ''

  if (!email.value) {
    errorMessage.value = '請輸入電子郵件'
    return
  }

  isLoading.value = true

  try {
    const result = await forgotPassword(email.value)
    // 不論回傳內容都直接切換到 reset 狀態
    if (result.token) {
      resetToken = result.token
      emit('change-mode', 'reset')
    } else if (result.debug?.reset_url) {
      // 開發模式：顯示重設連結
      debugResetUrl.value = result.debug.reset_url
      // 提取 URL 中的 token
      const url = new URL(result.debug.reset_url)
      const token = url.searchParams.get('token')
      if (token) {
        resetToken = token
      }
      // 不自動切換，讓用戶看到連結
    } else {
      // 生產模式：直接切換到 reset
      emit('change-mode', 'reset')
    }
  } catch (error) {
    errorMessage.value = error.error || error.message || '發送失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}

async function handleResetPassword() {
  resetError.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    resetError.value = '請輸入新密碼並確認'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    resetError.value = '兩次密碼不一致'
    return
  }
  if (newPassword.value.length < 8) {
    resetError.value = '密碼需至少 8 個字元'
    return
  }

  isLoading.value = true
  try {
    // 使用 resetToken（可能來自 URL 或 forgotPassword API）
    await resetPassword(resetToken, newPassword.value)
    emit('change-mode', 'reset-success')
  } catch (error) {
    resetError.value = error.error || error.message || '重設失敗，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fade-in-content">
    <template v-if="currentMode === 'forgot'">
      <h2 class="form-title">忘記密碼？</h2>
      <p class="subtitle">請輸入您的電子郵件，我們將寄送重設密碼連結給您</p>
      <form @submit.prevent="handleForgotPassword">
        <Input v-model="email" placeholder="請輸入電子郵件" autocomplete="email">
          <template #icon><span class="material-symbols-outlined">mail</span></template>
        </Input>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <!-- 開發模式：顯示重設連結 -->
        <div v-if="debugResetUrl" class="debug-link">
          <p class="success-text">✓ 重設連結已生成（開發模式）</p>
          <a :href="debugResetUrl" class="reset-link" target="_blank">{{ debugResetUrl }}</a>
          <Button type="button" variant="primary" @click="emit('change-mode', 'reset')">
            直接輸入新密碼
          </Button>
        </div>

        <Button v-else type="submit" variant="primary" :disabled="isLoading">
          {{ isLoading ? '發送中...' : '發送重設連結' }}
        </Button>
        <div class="register-wrapper">
          <a class="link-text" @click="$emit('change-mode', 'login')">返回登入</a>
        </div>
      </form>
    </template>

    <template v-else-if="currentMode === 'reset'">
      <h2 class="form-title">重設密碼</h2>
      <form @submit.prevent="handleResetPassword">
        <!-- 新密碼 -->
        <Input v-model="newPassword" :type="isNewPasswordVisible ? 'text' : 'password'" placeholder="請輸入新密碼"
          autocomplete="new-password">
          <template #icon>
            <span class="material-symbols-outlined">lock</span>
          </template>

          <!-- 眼睛 icon：放在 input 內（絕對定位） -->
          <template #append>
            <span class="material-symbols-outlined password-toggle" @mousedown.prevent
              @click.stop="isNewPasswordVisible = !isNewPasswordVisible"
              :aria-label="isNewPasswordVisible ? '隱藏密碼' : '顯示密碼'" role="button" tabindex="0">
              {{ isNewPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <!-- 確認新密碼 -->
        <Input v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'" placeholder="請再次輸入新密碼"
          autocomplete="new-password">
          <template #icon>
            <span class="material-symbols-outlined">lock</span>
          </template>

          <!-- 眼睛 icon：放在 input 內（絕對定位） -->
          <template #append>
            <span class="material-symbols-outlined password-toggle" @mousedown.prevent
              @click.stop="isConfirmPasswordVisible = !isConfirmPasswordVisible"
              :aria-label="isConfirmPasswordVisible ? '隱藏密碼' : '顯示密碼'" role="button" tabindex="0">
              {{ isConfirmPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <p v-if="resetError" class="error-text">{{ resetError }}</p>
        <Button type="submit" variant="primary" :disabled="isLoading">
          {{ isLoading ? '重設中...' : '重設密碼' }}
        </Button>
        <div class="register-wrapper">
          <a class="link-text" @click="$emit('change-mode', 'login')">返回登入</a>
        </div>
      </form>
    </template>

    <div v-else class="success-page">
      <h2 class="form-title">密碼已重設</h2>
      <p class="subtitle">請使用新密碼登入您的帳號</p>
      <p class="subtitle">
        <a class="link-text" @click="$emit('change-mode', 'login')">返回登入</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

:deep(.input-group) {
  margin-bottom: rem(16px);
  width: 100%;

  .input-container {
    border: 1px solid $secondary-color !important;

    .icon-wrap,
    span {
      color: $secondary-color !important;
    }
  }
}

:deep(.button) {
  width: 100%;
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

.form-title {
  @include font-secondary;
  color: $primary-color;
  margin-bottom: rem(8px);
  text-align: center;
  width: 100%;
}

.subtitle {
  font-size: rem(14px);
  color: #666;
  margin-bottom: rem(24px);
  text-align: center;
  width: 100%;
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

.error-text {
  font-size: rem(14px);
  color: #d32f2f;
  margin-top: rem(-8px);
  margin-bottom: rem(12px);
}

.success-text {
  font-size: rem(14px);
  color: #388e3c;
  margin-bottom: rem(8px);
}

.debug-link {
  margin: rem(16px) 0;
  padding: rem(12px);
  background: #f5f5f5;
  border-radius: 4px;

  .reset-link {
    display: block;
    word-break: break-all;
    color: #1976d2;
    font-size: rem(12px);
    margin-bottom: rem(12px);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.link-text {
  cursor: pointer;
  color: $secondary-color;
  text-decoration: underline;
}

.register-wrapper {
  margin-top: rem(16px);
  width: 100%;
  text-align: center;
}

.success-page {
  text-align: center;
  padding: rem(40px) 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 眼睛 icon：固定放在 input 右側、框內 */
.password-toggle {
  position: absolute;
  right: rem(12px);
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  color: #999;
  user-select: none;

  /* Material Symbols 填滿版 */
  font-variation-settings: 'FILL' 1;

  &:hover {
    color: $secondary-color;
  }
}
</style>
