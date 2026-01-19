<template>
  <div class="fade-in-content">
    <template v-if="currentMode === 'forgot'">
      <h2 class="form-title">忘記密碼？</h2>
      <p class="subtitle">請先完成郵件驗證，再設定密碼</p>
      <form @submit.prevent="$emit('change-mode', 'set-success')">
        <Input v-model="account" placeholder="請輸入電子郵件">
          <template #icon><span class="material-symbols-outlined">mail</span></template>
        </Input>
        <div class="verify-group">
          <Input v-model="form.code" placeholder="請輸入驗證碼" class="flex-1">
            <template #icon><span class="material-symbols-outlined">key</span></template>
          </Input>
          <button type="button" class="get-code-btn">獲取驗證碼</button>
        </div>
        <Input v-model="password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="請輸入密碼">
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
        <Button type="submit" variant="primary">確認設定</Button>
        <div class="register-wrapper">
          <a class="link-text" @click="$emit('change-mode', 'login')">返回上一步</a>
        </div>
      </form>
    </template>

    <div v-else class="success-page">
      <h2 class="form-title">設定成功</h2>
      <p class="subtitle">請前往 <a class="link-text" @click="$emit('change-mode', 'login')">登入會員</a></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'

const props = defineProps(['currentMode'])
const emit = defineEmits(['change-mode'])
const account = ref('')
const password = ref('')
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const form = reactive({ code: '', confirmPassword: '' })
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

:deep(.input-group) {
  margin-bottom: rem(16px);
  width: 100%;
  .input-container {
    border: 1px solid $secondary-color !important;
    .icon-wrap, span { color: $secondary-color !important; }
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
  }
  
  .get-code-btn { 
    height: 48px; 
    padding: 0 rem(15px); 
    border: 1px solid $secondary-color; 
    color: $secondary-color; 
    background: transparent; 
    border-radius: 4px; 
    white-space: nowrap; 
    cursor: pointer; 
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
</style>