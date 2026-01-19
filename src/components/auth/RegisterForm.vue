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

      <form @submit.prevent="$emit('change-mode', 'reg-success')">
        <Input v-model="account" placeholder="請輸入電子郵件">
          <template #icon><span class="material-symbols-outlined">mail</span></template>
        </Input>

        <div class="verify-group">
          <Input v-model="form.code" placeholder="請輸入驗證碼" class="flex-1">
            <template #icon><span class="material-symbols-outlined">key</span></template>
          </Input>
          <button type="button" class="btn btn-outline btn-xs">獲取驗證碼</button>
        </div>

        <Input v-model="form.password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼">
          <template #icon><span class="material-symbols-outlined">lock</span></template>
          <template #append>
            <span class="material-symbols-outlined password-toggle"
              @click.stop="isPasswordVisible = !isPasswordVisible">
              {{ isPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <p class="hint-text">
          <span class="material-symbols-outlined">info</span>
          密碼需 8 個字元以上，且包含英文大小寫、數字
        </p>

        <Input v-model="form.confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
          placeholder="請再次輸入密碼">
          <template #icon><span class="material-symbols-outlined">lock</span></template>
          <template #append>
            <span class="material-symbols-outlined password-toggle"
              @click.stop="isConfirmPasswordVisible = !isConfirmPasswordVisible">
              {{ isConfirmPasswordVisible ? 'visibility' : 'visibility_off' }}
            </span>
          </template>
        </Input>

        <Button type="submit" variant="primary">確認註冊</Button>

        <div class="register-wrapper">
          <span style="color: #666; margin-right: 8px;">已加入會員</span>
          <a class="link-text" @click="$emit('change-mode', 'login')">立即登入</a>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'

// 接收母元件傳來的 mode
const props = defineProps(['currentMode'])
const emit = defineEmits(['change-mode'])

const account = ref('')
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const form = reactive({
  code: '',
  password: '',
  confirmPassword: '',
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
</style>