<script setup>
import { ref, watch } from 'vue';
import Lightbox from '@/components/Lightbox.vue';
import Button from '@/components/auth/Button.vue';
import Input from '@/components/auth/Input.vue';

const props = defineProps({
  modelValue: Boolean,
  type: String,         // 傳入的類型，如 editActivity, removeFavoriteSuccess 等
  initialData: Object   // 傳入的原始資料
});

const emit = defineEmits(['update:modelValue', 'confirm']);
const formData = ref({});

// 監聽燈箱開啟
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    // 深拷貝資料，避免直接更動到外部清單
    formData.value = props.initialData ? JSON.parse(JSON.stringify(props.initialData)) : {};
    console.log('[Debug] 燈箱開啟，Type為:', props.type);
  }
});

const handleConfirm = () => {
  emit('confirm', formData.value);
};

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <Lightbox 
    :modelValue="modelValue" 
    :width="type && type.toLowerCase().includes('activity') ? '650px' : '420px'"
    @update:modelValue="close"
    @confirm="handleConfirm"
  >
    <template #title>
      <span v-if="type === 'editActivity'">更改報名資料</span>
      <span v-else-if="type === 'editActivitySuccess'">報名資料修改成功</span>
      <span v-else-if="type === 'updateSuccess'">資訊修改成功</span>
      <span v-else-if="type === 'editAmount'">修改定期定額金額</span>
      <span v-else-if="type === 'terminate'">終止捐款申請確認</span>
      <span v-else-if="type === 'terminateSuccess'">終止成功</span>
      <span v-else-if="type && type.toLowerCase().includes('remove')">
        {{ type.toLowerCase().includes('success') ? '已移出收藏' : '是否移出收藏夾？' }}
      </span>
      <span v-else-if="type && type.toLowerCase().includes('cancel')">
        {{ type.toLowerCase().includes('success') ? '取消成功' : '是否取消報名？' }}
      </span>
      <span v-else-if="type === 'editAmountSuccess'">金額修改成功</span>
      <span v-else>提示訊息</span>
    </template>

    <div class="member-lightbox-inner">
      
      <div v-if="type === 'editActivity'" class="form-container">
        <div class="f-row">
          <label>姓名* ：</label>
          <div class="f-field">
            <Input v-model="formData.name" disabled />
            <p class="f-hint">● 如需修改姓名，請至個人資訊更新資料</p>
          </div>
        </div>
        <div class="f-row"><label>電子郵件* ：</label><div class="f-field"><Input v-model="formData.email" /></div></div>
        <div class="f-row"><label>手機號碼* ：</label><div class="f-field"><Input v-model="formData.phone" /></div></div>
        <div class="f-row"><label>身分證* ：</label><div class="f-field"><Input v-model="formData.idNumber" /></div></div>
        <div class="f-row"><label>出生日期* ：</label><div class="f-field"><Input v-model="formData.birthday" type="date" /></div></div>
        <div class="f-row"><label>緊急聯絡* ：</label><div class="f-field"><Input v-model="formData.emergencyName" /></div></div>
        <div class="f-row"><label>聯絡電話* ：</label><div class="f-field"><Input v-model="formData.emergencyPhone" /></div></div>
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

      <div v-else-if="type === 'editAmount'" class="amount-container">
        <div class="grey-box">
          <p>目前捐款金額：新台幣 $ {{ initialData?.amount || '1,000' }}</p>
          <p>目前扣款週期：每月固定 10 號</p>
        </div>
        <div class="amount-input">
          <label>您想變更的金額為？</label>
          <div class="input-flex">
            <span>新台幣</span>
            <Input v-model="formData.newAmount" placeholder="請輸入金額" />
          </div>
          <p class="min-t">● 最低金額新台幣 $100</p>
        </div>
        <div class="red-alert-card">
          <p class="bold"><span class="material-symbols-outlined">warning</span> 異動生效提醒</p>
          <p>銀行端異動處理約需 3 至 5 個工作天。若您的下次扣款日在作業期間內，將於「下下次」扣款日生效。</p>
        </div>
      </div>

            <div v-else class="text-message-wrap">
        <template v-if="type && type.toLowerCase().includes('success')">
            
          <p v-if="type === 'updateSuccess'">您的個人資訊已成功修改。</p>
          <p v-else-if="type === 'editActivitySuccess'">報名資料已成功修改。</p>
          <p v-else-if="type.toLowerCase().includes('remove')">該項目已從您的收藏清單中移除。</p>
          <p v-else-if="type.toLowerCase().includes('cancel')">您已成功取消該活動的報名。</p>
          <p v-else-if="type.toLowerCase().includes('amount')">定期定額金額已修改成功。</p>
          <p v-else-if="type.toLowerCase().includes('terminate')">終止成功。</p>
          <p v-else>設定已生效。</p>

          <div v-if="type.toLowerCase().includes('amount') || type.toLowerCase().includes('terminate')" class="service-note">
            <p>若有疑問，請聯繫客服中心辦理退款事宜。</p>
            <p>● 客服專線：02-XXXX-XXXX</p>
          </div>
        </template>

        <template v-else>
          <p v-if="type === 'cancelConfirm'"></p>
          <p v-else-if="type === 'removeFavorite'"></p>
          <p v-else-if="type === 'terminate'"></p>
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
}

/* 編輯資料表單樣式 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: rem(12px);
  text-align: left;
}
.f-row {
  display: flex;
  align-items: flex-start;  // 改成 flex-start，避免垂直置中導致的高度問題
  gap: rem(16px);
  margin-bottom: rem(8px);
  label {
    width: rem(100px);
    font-weight: bold;
    padding-top: rem(10px);  // 調整對齐
    flex-shrink: 0;  // 防止縮小
  }
  .f-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: rem(4px);
    min-width: 0;  // 防止溢出
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
  gap: rem(8px);
  font-size: rem(14px);

  /* 統一 Checkbox 樣式 - 跟 LoginForm 一致 */
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

  // input { 
  //   cursor: pointer; 
  //   width: rem(16px);
  //   height: rem(16px);
  //   }

  //   label { 
  //   cursor: pointer; 
  //   margin: 0;
  //   }
}

:deep(.input-group) {
  margin-bottom: 0;  // 移除 Input 預設的 margin
  width: 100%;
}

/* 金額修改樣式 */
.grey-box {
  background: #f8f9fa;
  padding: rem(15px);
  border-radius: rem(4px);
  margin-bottom: rem(20px);
  text-align: left;
  p { margin: rem(4px) 0; font-weight: 500; }
}

.amount-input {
  text-align: left;
  margin-bottom: rem(20px);
  label { 
    display: block; 
    font-weight: bold; 
    margin-bottom: rem(10px); 
  }
  .input-flex {
    display: flex;
    align-items: center;
    gap: rem(10px);
    flex-wrap: nowrap;  // 加上這行，禁止換行

    span { 
      font-weight: bold; 
      white-space: nowrap;  // 加上這行，禁止文字換行
      flex-shrink: 0;  // 加上這行，防止縮小
    }
    :deep(.input-group) {
      flex: 1;
      min-width: 0;
    }
  }
  .min-t { 
    font-size: 12px; 
    color: #666; 
    margin-top: rem(5px); 
  }
}

.red-alert-card {
  background: #fff5f5;
  border: 1px solid $highlight-color2;
  padding: rem(12px);
  border-radius: rem(4px);
  color: $highlight-color2;
  font-size: 13px;
  text-align: left;
  .bold {
    display: flex;
    align-items: center;
    gap: rem(4px);
    font-weight: bold;
    margin-bottom: rem(4px);
  }
}

/* 純文字訊息與成功訊息樣式 */
.text-message-wrap {
  text-align: center;
  font-size: rem(18px);
  padding: rem(10px) 0;
  
  .service-note {
    margin-top: rem(20px);
    padding-top: rem(15px);
    border-top: 1px dashed #ccc;
    font-size: 14px;
    color: #666;
    text-align: left;
  }
}
</style>