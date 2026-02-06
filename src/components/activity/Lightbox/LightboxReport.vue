<script setup>
import Button from '../../auth/Button.vue'
import LightboxReportCheck from './LightboxReportCheck.vue'
import LightboxReportSuccess from './LightboxReportSuccess.vue'
import { ref, computed, watch } from 'vue'
import { backHomeApi } from '@/utils/publicApi'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  modelValue:{
    type: Boolean, // 控制顯示隱藏
    required: true,
  },
  //接收的review 物件
  review: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedReason = ref('')
const otherReason = ref('')
const maxLength = 100
const currentLength = computed(() => otherReason.value.length)
const showError = ref(false)
const showCheckLightbox = ref(false)
const showSuccessLightbox = ref(false)

// 監聆燈箱關閉，清空資料
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      // 燈箱關閉時清空所有資料
      selectedReason.value = '商業廣告或垃圾訊息'
      otherReason.value = ''
      showError.value = false
    } 
  }
)

// 監聆選擇的理由，如果不是「其他」，隱藏錯誤提示
watch(selectedReason, (newVal) => {
  if (newVal !== '其他') {
    showError.value = false
  }
})

const handleConfirm = () => {
  // 如果選擇了「其他」，但沒有填寫理由
  if (selectedReason.value === '其他' && otherReason.value.trim() === '') {
    showError.value = true
    return
  }
  // 驗證通過，關閉當前燈箱，顯示確認檢舉框
  showError.value = false
  // 關閉當前燈箱
  emit('update:modelValue', false)
  // 顯示確認框
  showCheckLightbox.value = true
}

const handleCheckConfirm =  async () => {
  // 關閉確認框，顯示成功框
  if (!authStore.user?.id || !props.review) {
    alert('身分驗證失效，請重新登入')
    showCheckLightbox.value = false
    return
  }
  const finalReason = selectedReason.value === '其他' ? otherReason.value : selectedReason.value
  // 傳送檢舉資料到後端
  const reportUrl = 'activity/activity_report_review.php'
  try {
    const payload = {
      user_id: authStore.user.id,
      review_id: props.review,
      reason: finalReason
    }
    const response = await backHomeApi.post(reportUrl, payload)
    if (response.data.status === 'success') {
      showCheckLightbox.value = false 
      showSuccessLightbox.value = true
    } else {
      alert(response.data.message)
      showCheckLightbox.value = false
    }
  } catch (error) {
    console.error('檢舉失敗:', error)
    showCheckLightbox.value = false
  }
}

const handleSuccessClose = () => {
  showSuccessLightbox.value = false
  emit('update:modelValue', false)
}

// 當使用者開始輸入時，隱藏錯誤提示
const handleInput = () => {
  if (showError.value && otherReason.value.trim() !== '') {
    showError.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="lightbox-overlay"
        @click.self="$emit('update:modelValue', false)"
      >
        <div class="lightbox-content">
          <button class="close-btn" @click="$emit('update:modelValue', false)">✕</button>

          <div class="lightbox-main">
            <h2 class="title">檢舉留言</h2>

            <div class="report-form">
              <div class="form-row">
                <label class="form-label"> 檢舉理由<span class="required">*</span> </label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      v-model="selectedReason"
                      value="商業廣告或垃圾訊息"
                      hidden
                    />
                    <span
                      class="material-symbols-outlined radioIcon"
                      :class="{ isChecked: selectedReason === '商業廣告或垃圾訊息' }"
                    >
                      {{
                        selectedReason === '商業廣告或垃圾訊息'
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      }}
                    </span>
                    <span>商業廣告或垃圾訊息</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="selectedReason" value="不當或攻擊性內容" hidden />
                    <span
                      class="material-symbols-outlined radioIcon"
                      :class="{ isChecked: selectedReason === '不當或攻擊性內容' }"
                    >
                      {{
                        selectedReason === '不當或攻擊性內容'
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      }}
                    </span>
                    <span>不當或攻擊性內容</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="selectedReason" value="錯誤的資訊" hidden />
                    <span
                      class="material-symbols-outlined radioIcon"
                      :class="{ isChecked: selectedReason === '錯誤的資訊' }"
                    >
                      {{
                        selectedReason === '錯誤的資訊'
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      }}
                    </span>
                    <span>錯誤的資訊</span>
                  </label>
                  <label class="radio-label">
                    <input type="radio" v-model="selectedReason" value="其他" hidden />
                    <span
                      class="material-symbols-outlined radioIcon"
                      :class="{ isChecked: selectedReason === '其他' }"
                    >
                      {{
                        selectedReason === '其他'
                          ? 'radio_button_checked'
                          : 'radio_button_unchecked'
                      }}
                    </span>
                    <span>其他(請填寫)</span>
                  </label>
                  <textarea
                    v-model="otherReason"
                    class="customInput"
                    placeholder="請填寫檢舉理由(限100字)"
                    :maxlength="maxLength"
                    @input="handleInput"
                    @focus="selectedReason = '其他'"
                  ></textarea>
                  <div class="input-footer">
                    <p v-show="showError" class="error-msg">
                      <span class="material-symbols-outlined">error</span>
                      請填入檢舉理由
                    </p>
                    <div class="char-counter" :class="{ 'is-max': currentLength >= maxLength }">
                      {{ currentLength }} / {{ maxLength }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="actions">
              <Button variant="primary" @click="handleConfirm">確認</Button>
              <Button variant="outline" @click="$emit('update:modelValue', false)">取消</Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 確認檢舉燈箱 -->
  <LightboxReportCheck v-model="showCheckLightbox" @confirm="handleCheckConfirm" />

  <!-- 檢舉成功燈箱 -->
  <LightboxReportSuccess v-model="showSuccessLightbox" @update:modelValue="handleSuccessClose" />
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.lightbox-content {
  background-color: #f0f2f5; // 灰底
  border: 1px solid $primary-color;
  width: rem(800px);
  max-width: 90vw;
  padding: rem(50px) rem(60px);
  position: relative;
  text-align: center;
}

.title {
  font-size: rem(26px);
  color: $primary-color;
  font-weight: bold;
  margin-bottom: rem(48px);
}

.report-form {
  margin-bottom: rem(50px);

  .form-row {
    display: flex;
    align-items: flex-start;
    gap: rem(30px);
  }

  .form-label {
    @include font-body-l;
    color: $text-color;
    font-weight: 700;
    white-space: nowrap;

    .required {
      color: $highlight-color2;
      margin-left: 4px;
    }
  }

  .radio-group {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .radio-label {
    @include font-body;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    margin-bottom: 12px;
    line-height: 1.5;

    span {
      @include font-body-l;
      color: $text-color;
    }
  }

  .radioIcon {
    color: $secondary-color;
    font-size: 24px;
  }

  .radioIcon.isChecked {
    color: $secondary-color;
  }

  .customInput {
    width: 100%;
    min-height: rem(150px);
    padding: rem(12px) rem(16px);
    border: 1px solid $backstage-bar-line-color;
    background-color: $backstage-swipe-color;
    font-size: rem(16px);
    color: #333;
    outline: none;
    resize: none;

    &::placeholder {
      color: #999;
    }
  }

  .input-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: rem(8px);
    min-height: rem(24px);
  }

  .error-msg {
    @include font-body;
    color: $highlight-color2;
    display: flex;
    align-items: center;
    gap: 4px;

    .material-symbols-outlined {
      font-variation-settings:
        'FILL' 1,
        'wght' 700,
        'GRAD' 0,
        'opsz' 20;
      color: $highlight-color2;
      font-size: 16px;
    }
  }

  .char-counter {
    text-align: right;
    font-size: rem(16px);
    color: $page-number-color;
    transition: color 0.3s;
    margin-left: auto;

    &.is-max {
      color: $highlight-color2;
      font-weight: 700;
    }
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: rem(20px);
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 8px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: $primary-color;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 手機版 RWD
@media screen and (max-width: 767px) {
  .lightbox-content {
    width: 90vw;
    padding: rem(50px) rem(20px);
    max-height: 70vh;
    overflow-y: auto;
  }

  .report-form {
    .form-row {
      flex-direction: column;
      gap: rem(15px);
      align-items: center;
    }

    .form-label {
      width: 100%;
      text-align: left;
    }

    .radio-group {
      width: 100%;
    }

    .radio-label {
      justify-content: flex-start;
    }
  }

  .actions {
    gap: rem(12px);
  }
}
</style>
