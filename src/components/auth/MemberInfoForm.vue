<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateMemberInfo } from '@/api/memberApi'
import Input from '@/components/auth/Input.vue'
import Button from '@/components/auth/Button.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue'

const authStore = useAuthStore()

const isLightboxOpen = ref(false)
const lightboxType = ref('')
const isLoading = ref(false)

// 每個欄位的錯誤訊息
const errors = reactive({
  name: '',
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyContact: '',
  emergencyPhone: '',
  newPassword: '',
  confirmPassword: ''
})

// 清除所有錯誤訊息
const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key] = ''
  })
}

// 只保留這一個 handleUpdate
const handleUpdate = async () => {
  clearErrors()
  isLoading.value = true

  try {
    // 基本驗證
    if (!form.name) {
      errors.name = '姓名為必填欄位'
      isLoading.value = false
      return
    }

    // 手機格式驗證
    if (form.phone && !/^09\d{8}$/.test(form.phone)) {
      errors.phone = '手機格式錯誤 (09xxxxxxxx)'
      isLoading.value = false
      return
    }

    // 身分證格式驗證
    if (form.idNumber && !/^[A-Z][12]\d{8}$/.test(form.idNumber)) {
      errors.idNumber = '身分證格式錯誤'
      isLoading.value = false
      return
    }

    // 緊急聯絡人電話格式驗證
    if (form.emergencyPhone && !/^09\d{8}$/.test(form.emergencyPhone)) {
      errors.emergencyPhone = '手機格式錯誤 (09xxxxxxxx)'
      isLoading.value = false
      return
    }

    // 準備要更新的資料（只傳送有值的欄位）
    const updateData = {}

    if (form.name) updateData.MEMBER_REALNAME = form.name
    if (form.phone) updateData.MEMBER_PHONE = form.phone
    if (form.idNumber) updateData.MEMBER_IDNUMBER = form.idNumber
    if (form.birthday) updateData.MEMBER_BIRTHDAY = form.birthday
    if (form.emergencyContact) updateData.MEMBER_EMERGENCY_NAME = form.emergencyContact
    if (form.emergencyPhone) updateData.MEMBER_EMERGENCY_PHONE = form.emergencyPhone

    const response = await updateMemberInfo(updateData)

    if (response.status === 'success') {
      // 更新 store 中的用戶資料
      authStore.user = response.member

      // 觸發成功燈箱
      isLightboxOpen.value = true
      lightboxType.value = 'updateSuccess'
    }
  } catch (error) {
    // 如果是後端返回的特定欄位錯誤，可以在這裡處理
    const errorMsg = error.error || error.message || '更新失敗，請稍後再試'

    // 根據錯誤類型設置對應欄位的錯誤
    if (errorMsg.includes('PHONE') || errorMsg.includes('phone')) {
      errors.phone = errorMsg
    } else if (errorMsg.includes('ID_NUMBER') || errorMsg.includes('id_number')) {
      errors.idNumber = errorMsg
    } else if (errorMsg.includes('BIRTHDAY') || errorMsg.includes('birthday')) {
      errors.birthday = errorMsg
    } else {
      // 通用錯誤顯示在姓名欄位下方（第一個欄位）
      errors.name = errorMsg
    }
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  isChangingPassword.value = false
}

const closeLightbox = () => {
  isLightboxOpen.value = false
}

// 建立響應式表單物件，包含所有 Mockup 欄位
const form = reactive({
  name: '',
  email: '',
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyContact: '',
  emergencyPhone: '',
  newPassword: '',
  confirmPassword: ''
})

const isChangingPassword = ref(false)

// 載入會員資料
onMounted(async () => {
  try {
    await authStore.fetchMe()

    if (authStore.user) {
      // 基本資料
      form.name = authStore.user.MEMBER_REALNAME || ''
      form.email = authStore.user.MEMBER_EMAIL || ''
      form.phone = authStore.user.MEMBER_PHONE || ''
      form.idNumber = authStore.user.ID_NUMBER || ''
      form.birthday = authStore.user.BIRTHDAY || ''
      form.emergencyContact = authStore.user.EMERGENCY || ''
      form.emergencyPhone = authStore.user.EMERGENCY_TEL || ''
    }
  } catch (error) {
    console.error('載入會員資料失敗', error)
  }
})

// 欄位失去焦點時驗證 - 姓名
const validateName = () => {
  if (!form.name) {
    errors.name = '姓名為必填欄位'
  } else {
    errors.name = ''
  }
}

// 欄位失去焦點時驗證 - 手機號碼
const validatePhone = () => {
  if (!form.phone) {
    errors.phone = ''
    return
  }
  const phoneRegex = /^09\d{8}$/
  if (!phoneRegex.test(form.phone)) {
    errors.phone = '手機格式錯誤 (09xxxxxxxx)'
  } else {
    errors.phone = ''
  }
}

// 欄位失去焦點時驗證 - 身分證
const validateIdNumber = () => {
  if (!form.idNumber) {
    errors.idNumber = ''
    return
  }
  const idRegex = /^[A-Z][12]\d{8}$/
  if (!idRegex.test(form.idNumber)) {
    errors.idNumber = '身分證格式錯誤'
  } else {
    errors.idNumber = ''
  }
}

// 欄位失去焦點時驗證 - 緊急聯絡人電話
const validateEmergencyPhone = () => {
  if (!form.emergencyPhone) {
    errors.emergencyPhone = ''
    return
  }
  const phoneRegex = /^09\d{8}$/
  if (!phoneRegex.test(form.emergencyPhone)) {
    errors.emergencyPhone = '手機格式錯誤 (09xxxxxxxx)'
  } else {
    errors.emergencyPhone = ''
  }
}
</script>

<template>
  <div class="member-info-form">
    <div class="form-container">

      <div class="form-group">
        <label class="form-label">姓名 * :</label>
        <div class="input-wrapper">
          <Input v-model="form.name" placeholder="請輸入姓名" autocomplete="name" @blur="validateName"
            @keyup.enter="validateName" />
          <p v-if="errors.name" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.name }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">電子郵件 * :</label>
        <div class="input-wrapper">
          <Input v-model="form.email" :readonly="true" autocomplete="email" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">手機號碼 :</label>
        <div class="input-wrapper">
          <Input v-model="form.phone" placeholder="請輸入手機號碼" autocomplete="tel" @blur="validatePhone"
            @keyup.enter="validatePhone" />
          <p v-if="errors.phone" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">身分證字號 :</label>
        <div class="input-wrapper">
          <Input v-model="form.idNumber" placeholder="請輸入身分證字號" autocomplete="off" @blur="validateIdNumber"
            @keyup.enter="validateIdNumber" />
          <p v-if="errors.idNumber" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.idNumber }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">出生年月日 :</label>
        <div class="input-wrapper">
          <Input v-model="form.birthday" type="date" autocomplete="bday" @keyup.enter="handleUpdate" />
          <p v-if="errors.birthday" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.birthday }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">緊急聯絡人姓名 :</label>
        <div class="input-wrapper">
          <Input v-model="form.emergencyContact" placeholder="請輸入緊急聯絡人姓名" autocomplete="off"
            @keyup.enter="handleUpdate" />
          <p v-if="errors.emergencyContact" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.emergencyContact }}
          </p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">緊急聯絡人電話 :</label>
        <div class="input-wrapper">
          <Input v-model="form.emergencyPhone" placeholder="請輸入緊急聯絡人手機號碼" autocomplete="tel"
            @blur="validateEmergencyPhone" @keyup.enter="validateEmergencyPhone" />
          <p v-if="errors.emergencyPhone" class="error-message">
            <span class="material-symbols-outlined icon-alert">error</span>
            {{ errors.emergencyPhone }}
          </p>
        </div>
      </div>

      <div class="form-group password-area">
        <label class="form-label">密碼 * :</label>
        <div class="input-wrapper">
          <button v-if="!isChangingPassword" type="button" class="btn-text-link" @click="isChangingPassword = true">
            更改密碼
          </button>

          <div v-else class="password-fields">
            <Input v-model="form.newPassword" type="password" placeholder="請輸入新密碼" autocomplete="new-password"
              @keyup.enter="handleUpdate" />
            <p v-if="errors.newPassword" class="error-message">
              <span class="material-symbols-outlined icon-alert">error</span>
              {{ errors.newPassword }}
            </p>
            <p class="hint">
              <span class="material-symbols-outlined">info</span>
              密碼需 8 個字元以上，且包含英文字母大小寫、數字
            </p>
            <Input v-model="form.confirmPassword" type="password" placeholder="請再次輸入新密碼" autocomplete="new-password"
              @keyup.enter="handleUpdate" />
            <p v-if="errors.confirmPassword" class="error-message">
              <span class="material-symbols-outlined icon-alert">error</span>
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <Button variant="primary" @click="handleUpdate" :disabled="isLoading">
          {{ isLoading ? '更新中...' : '變更資訊' }}
        </Button>
        <Button variant="outline" @click="handleCancel">取消</Button>
      </div>
    </div>
    <MemberLightbox v-model="isLightboxOpen" :type="lightboxType" @confirm="closeLightbox" />
  </div>
</template>


<style lang="scss" scoped>
// 使用你指定的正確路徑
@import '@/assets/scss/base/_var.scss';

.member-info-form {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: rem(40px) 0;
}

.form-container {
  width: 100%;
  max-width: rem(800px);
}

.form-group {
  display: flex;
  flex-direction: row; // 標籤在左
  align-items: flex-start;
  margin-bottom: rem(32px);

  .form-label {
    width: rem(150px); // 固定左側標籤寬度
    flex-shrink: 0;
    font-size: $size-body;
    color: $text-color;
    padding-top: rem(10px);
  }

  .input-wrapper {
    flex-grow: 1; // 輸入框佔滿右側

    .password-fields {
      display: flex;
      flex-direction: column;
      gap: rem(12px);

      .hint {
        font-size: $size-body;
        color: #999;
        margin: rem(-4px) 0 0 0;
        display: flex;
        align-items: center;
        gap: rem(4px);
      }
    }
  }
}

.btn-text-link {
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  padding: rem(10px) 0;
  color: $text-color;
  font-size: $size-body;

  &:hover {
    color: $secondary-color;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end; // 改成靠右
  gap: rem(16px);
  margin-top: rem(40px);
}

// 手機驗證後錯誤文字樣式
.error-text {
  color: #E14720;
  font-size: rem(12px);
  margin-top: rem(4px);
  // 讓提示文字縮排，對齊輸入框
  margin-left: rem(150px);
}

.error-message {
  color: $highlight-color2;
  font-size: rem(14px);
  margin-top: rem(6px);
  margin-bottom: 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: rem(4px);

  .icon-alert {
    color: $highlight-color2;
    font-variation-settings: 'FILL' 1;
    font-size: rem(16px);
  }
}

// 響應式手機版
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: rem(24px);

    .form-label {
      width: 100%;
      margin-bottom: rem(8px);
    }

    .input-wrapper {
      width: 100%; // 加上這行，讓 input 占滿寬度
      flex-grow: 1;
    }
  }

  .error-text {
    margin-left: 0; // 手機版移除左邊距
  }


  .form-container {
    width: 100%;
    max-width: 100%;
    padding: 0 rem(16px);
  }

  .form-actions {
    flex-direction: column;
    gap: rem(8px);
  }

  .form-actions button {
    width: 100%;
  }
}
</style>