<script setup>
import { ref, reactive, watch } from 'vue';
import Input from '@/components/auth/Input.vue';
import Button from '@/components/auth/Button.vue';
import MemberLightbox from '@/components/auth/MemberLightbox.vue';

const isLightboxOpen = ref(false);
const lightboxType = ref('');

// 只保留這一個 handleUpdate
const handleUpdate = () => {
  console.log('送出資料：', form);

  // 觸發成功燈箱
  isLightboxOpen.value = true;
  lightboxType.value = 'updateSuccess';
};

const handleCancel = () => {
  isChangingPassword.value = false;
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
};

// 建立響應式表單物件，包含所有 Mockup 欄位
const form = reactive({
  name: '王曉明',
  email: '123gol@gmail.com',
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyContact: '',
  emergencyPhone: '',
  newPassword: '',
  confirmPassword: ''
});

const isChangingPassword = ref(false);
const phoneError = ref(false);
const emergencyPhoneError = ref(false);

// 手機號碼格式驗證
watch(() => form.phone, (newVal) => {
  if (!newVal) {
    phoneError.value = false;
    return;
  }
  const phoneRegex = /^09\d{8}$/; // 檢查 09 開頭且共 10 碼
  phoneError.value = !phoneRegex.test(newVal);
});

// 緊急聯絡人電話驗證
watch(() => form.emergencyPhone, (newVal) => {
  if (!newVal) {
    emergencyPhoneError.value = false;
    return;
  }
  const phoneRegex = /^09\d{8}$/;
  emergencyPhoneError.value = !phoneRegex.test(newVal);
});
</script>

<template>
  <div class="member-info-form">
    <div class="form-container">

      <div class="form-group">
        <label class="form-label">姓名 * :</label>
        <div class="input-wrapper">
          <Input v-model="form.name" placeholder="王曉明" autocomplete="name" />
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
          <Input v-model="form.phone" placeholder="請輸入手機號碼" autocomplete="tel" />
          <p v-if="phoneError" style="color: #E14720; font-size: 12px;">手機格式錯誤 (09xxxxxxxx)</p>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">身分證字號 :</label>
        <div class="input-wrapper">
          <Input v-model="form.idNumber" placeholder="請輸入身分證字號" autocomplete="off" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">出生年月日 :</label>
        <div class="input-wrapper">
          <Input v-model="form.birthday" type="date" autocomplete="bday" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">緊急聯絡人姓名 :</label>
        <div class="input-wrapper">
          <Input v-model="form.emergencyContact" placeholder="請輸入緊急聯絡人姓名" autocomplete="off" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">緊急聯絡人電話 :</label>
        <div class="input-wrapper">
          <Input v-model="form.emergencyPhone" placeholder="請輸入緊急聯絡人手機號碼" autocomplete="tel" />
          <p v-if="emergencyPhoneError" style="color: #E14720; font-size: 12px;">手機格式錯誤 (09xxxxxxxx)</p>
        </div>
      </div>

      <div class="form-group password-area">
        <label class="form-label">密碼 * :</label>
        <div class="input-wrapper">
          <button v-if="!isChangingPassword" type="button" class="btn-text-link" @click="isChangingPassword = true">
            更改密碼
          </button>

          <div v-else class="password-fields">
            <Input v-model="form.newPassword" type="password" placeholder="請輸入新密碼" autocomplete="new-password" />
            <p class="hint">
              <span class="material-symbols-outlined">info</span>
              密碼需 8 個字元以上，且包含英文字母大小寫、數字
            </p>
            <Input v-model="form.confirmPassword" type="password" placeholder="請再次輸入新密碼" autocomplete="new-password" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <Button variant="primary" @click="handleUpdate">變更資訊</Button>
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
  margin-bottom: rem(20px);

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

// 響應式手機版
@media (max-width: 768px) {
  .form-group {
    flex-direction: column;
    align-items: stretch;

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