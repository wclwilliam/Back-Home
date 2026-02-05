<script setup>
import { ref, watch, computed, reactive  } from 'vue';
import Lightbox from '@/components/Lightbox.vue';
import Button from '@/components/auth/Button.vue';
import Input from '@/components/auth/Input.vue';

const props = defineProps({
    modelValue: Boolean,
    type: String,
    initialData: Object
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const formData = ref({});

const isMobile = computed(() => window.innerWidth <= 768);

// 鎖定的寬度值，避免關閉時寬度變化
const lockedWidth = ref('420px');

// 根據內容多寡決定寬度
const lightboxWidth = computed(() => {
  if (isMobile.value) return '85vw';
  // editActivity 表單內容多，用 650px；成功訊息內容少，用 420px
  return props.type === 'editActivity' ? '650px' : '420px';
});

// 错误提示
const errors = reactive({
  phone: false,
  emergencyPhone: false
});

watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        // 打開時鎖定當前計算的寬度
        lockedWidth.value = lightboxWidth.value;
        formData.value = props.initialData ? JSON.parse(JSON.stringify(props.initialData)) : {};
        // 清空错误
        errors.phone = false;
        errors.emergencyPhone = false;
    }
});

// 身分证验证（与捐款页面相同）
function validateTWID(id) {
  const regex = /^[A-Z][12]\d{8}$/
  if (!regex.test(id)) return false

  const city = {
    A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
    G: 16, H: 17, I: 34, J: 18, K: 19,
    L: 20, M: 21, N: 22, O: 35, P: 23,
    Q: 24, R: 25, S: 26, T: 27, U: 28,
    V: 29, W: 32, X: 30, Y: 31, Z: 33
  }

  const code = city[id[0]].toString().split('').map(Number)
  const numbers = id.slice(1).split('').map(Number)
  const idNums = code.concat(numbers)
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]
  const sum = idNums.reduce((acc, n, i) => acc + n * weights[i], 0)

  return sum % 10 === 0
}

// 手机验证
const validatePhone = (value) => {
  return /^09\d{8}$/.test(value)
}

// 验证手机号码
const checkPhone = () => {
  if (formData.value.phone && !validatePhone(formData.value.phone)) {
    errors.phone = true
  } else {
    errors.phone = false
  }
}

// 验证紧急联络人电话
const checkEmergencyPhone = () => {
  if (formData.value.emergencyPhone && !validatePhone(formData.value.emergencyPhone)) {
    errors.emergencyPhone = true
  } else {
    errors.emergencyPhone = false
  }
}

const handleConfirm = () => {
  // 验证所有字段
  checkPhone();
  checkEmergencyPhone();
  
  // 如果有错误，不提交
  if (errors.phone || errors.emergencyPhone) {
    return;
  }
  
  emit('confirm', formData.value);
};

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
    <Lightbox 
        :modelValue="modelValue" 
        :width="lockedWidth"
        @update:modelValue="close"
        @confirm="handleConfirm"
    >
        <template #title>
        <span v-if="type === 'editActivity'">更改報名資料</span>
        <span v-else-if="type === 'editActivitySuccess'">報名資料修改成功</span>
        <span v-else-if="type === 'cancelConfirm'">是否取消報名？</span>
        <span v-else-if="type === 'cancelSuccess'">取消成功</span>
        <span v-else>提示訊息</span>
        </template>

        <div class="member-lightbox-inner">
        
        <!-- 編輯活動報名資料表單 -->
        <div v-if="type === 'editActivity'" class="form-container">
            <div class="f-row">
            <label>姓名* ：</label>
            <div class="f-field">
                <Input v-model="formData.name" :readonly="true" />
                <p class="f-hint">● 如需修改姓名，請至個人資訊更新資料</p>
            </div>
            </div>
            <div class="f-row">
              <label>電子郵件* ：</label>
              <div class="f-field">
                <Input v-model="formData.email" :readonly="true" />
              </div>
            </div>
            <div class="f-row">
              <label>手機號碼* ：</label>
              <div class="f-field">
                <Input v-model="formData.phone" @blur="checkPhone" />
                <p v-if="errors.phone" class="error-msg">
                  <span class="material-symbols-outlined">error</span>
                  手機格式錯誤 (09xxxxxxxx)
                </p>
              </div>
            </div>
            <div class="f-row">
              <label>身分證* ：</label>
              <div class="f-field">
                <Input v-model="formData.idNumber" :readonly="true" />
              </div>
            </div>
            <div class="f-row">
              <label>出生日期* ：</label>
              <div class="f-field">
                <Input v-model="formData.birthday" type="date" :readonly="true" />
              </div>
            </div>
            <div class="f-row"><label>緊急聯絡* ：</label><div class="f-field"><Input v-model="formData.emergencyName" /></div></div>
            <div class="f-row">
              <label>聯絡電話* ：</label>
              <div class="f-field">
                <Input v-model="formData.emergencyPhone" @blur="checkEmergencyPhone" />
                <p v-if="errors.emergencyPhone" class="error-msg">
                  <span class="material-symbols-outlined">error</span>
                  手機格式錯誤 (09xxxxxxxx)
                </p>
              </div>
            </div>
            <div class="checkbox-row">
            <label class="custom-checkbox-wrapper">
                <input type="checkbox" v-model="formData.isSync" class="hidden-checkbox" />
                <span class="material-symbols-outlined checkbox-icon">
                {{ formData.isSync ? 'check_box' : 'check_box_outline_blank' }}
                </span>
                <span class="checkbox-text">同步更新會員資料：將本次修改之資訊儲存至我的個人資訊</span>
            </label>
            </div>
        </div>

        <!-- 成功訊息 -->
        <div v-else class="text-message-wrap">
            <template v-if="type && type.toLowerCase().includes('success')">
            <p v-if="type === 'editActivitySuccess'">報名資料已成功修改。</p>
            <p v-else-if="type === 'cancelSuccess'">您已成功取消該活動的報名。</p>
            <p v-else>設定已生效。</p>
            </template>

            <template v-else>
            <p v-if="type === 'cancelConfirm'"></p>
            <p v-else>確定要執行此操作嗎？</p>
            </template>
        </div>

        </div>

        <template #footer v-if="type && type.toLowerCase().includes('success')">
        <Button variant="primary" @click="close">確定</Button>
        </template>
    </Lightbox>
    </template>

    <style lang="scss" scoped>
    @import '@/assets/scss/base/_var.scss';

    .member-lightbox-inner {
    color: $text-color;
    max-height: 65vh;
    overflow-y: auto;
    }

    .form-container {
    display: flex;
    flex-direction: column;
    gap: rem(12px);
    text-align: left;
    }

    .f-row {
    display: flex;
    align-items: flex-start;
    gap: rem(16px);
    margin-bottom: rem(8px);
    
    label {
        width: rem(100px);
        font-weight: bold;
        padding-top: rem(10px);
        flex-shrink: 0;
    }
    
    .f-field {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: rem(4px);
        min-width: 0;
    }
    }

    .f-hint {
    font-size: rem(12px);
    color: #999;
    margin-top: 0;
    line-height: 1.4;
    }

    .checkbox-row {
    margin-top: rem(16px);
    display: flex;
    align-items: center;

    .custom-checkbox-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
        gap: rem(8px);

        .hidden-checkbox {
        display: none;
        }

        .checkbox-icon {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        color: #0E6273;
        font-size: rem(24px);
        line-height: 1;
        }

        .checkbox-text {
        font-size: rem(14px);
        color: #666;
        }

        input:checked + .checkbox-icon {
        font-variation-settings: 'FILL' 1;
        }
    }
    }

    :deep(.input-group) {
    margin-bottom: 0;
    width: 100%;
    }

    .error-msg {
    @include font-body;
    color: $highlight-color2;
    margin-top: rem(4px);
    display: flex;
    align-items: center;
    gap: rem(4px);
    font-weight: bold;

    .material-symbols-outlined {
        font-variation-settings: 'FILL' 1;
        font-size: rem(16px);
    }
    }

    .text-message-wrap {
    text-align: center;
    font-size: rem(18px);
    padding: rem(10px) 0;
    }

    /* 平板以下 RWD - 768px */
    @media (max-width: 768px) {
    .form-container {
        gap: rem(10px);
    }

    .f-row {
        flex-direction: column;
        gap: rem(8px);
        margin-bottom: rem(6px);
        
        label {
        width: 100%;
        padding-top: 0;
        margin-bottom: rem(4px);
        font-weight: bold;
        font-size: rem(14px);
        }
        
        .f-field {
        width: 100%;
        gap: rem(4px);
        }
    }

    .f-hint {
        font-size: rem(12px);
        margin-top: rem(4px);
    }

    .checkbox-row {
        margin-top: rem(12px);
        
        .custom-checkbox-wrapper {
        gap: rem(8px);
        flex-wrap: wrap;
        
        .checkbox-icon {
            font-size: rem(20px);
            flex-shrink: 0;
        }

        .checkbox-text {
            font-size: rem(13px);
            line-height: 1.5;
            flex-basis: 100%;
        }
        }
    }

    .text-message-wrap {
        font-size: rem(16px);
        padding: rem(12px) 0;
    }
    }
        /* 超小螢幕 - 480px 以下 */
    @media (max-width: 480px) {
    .f-row {
        label {
        font-size: rem(13px);
        }
        
        margin-bottom: rem(4px);
    }

    .checkbox-row .custom-checkbox-wrapper .checkbox-text {
        font-size: rem(12px);
    }

    .form-container {
        gap: rem(8px);
    }
    }

</style>
