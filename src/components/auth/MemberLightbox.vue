<script setup>
import { ref, watch } from 'vue';
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

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
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
    :width="type && type.toLowerCase().includes('amount') ? '650px' : '420px'"
    @update:modelValue="close"
    @confirm="handleConfirm"
  >
    <template #title>
      <span v-if="type === 'updateSuccess'">資訊修改成功</span>
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
      
      <div v-if="type === 'editAmount'" class="amount-container">
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
          <p v-else-if="type.toLowerCase().includes('remove')">該項目已從您的收藏清單中移除。</p>
          <p v-else-if="type.toLowerCase().includes('cancel')">您已成功取消該活動的報名。</p>
          <p v-else-if="type.toLowerCase().includes('amount')">定期定額金額已修改成功。</p>
          <p v-else-if="type.toLowerCase().includes('terminate')">終止成功。</p>
          <p v-else>設定已生效。</p>

          <div v-if="type.toLowerCase().includes('amount') || type.toLowerCase().includes('terminate')" class="service-note">
            <p>若有疑問，請聯繫客服中心辦理退款事宜。</p>
            <p>● 客服專線：03-425-1108</p>
          </div>
        </template>

        <template v-else>
          <p v-if="type === 'removeFavorite'">確定要移出收藏夾嗎？</p>
          <p v-else-if="type === 'terminate'">確定要終止捐款嗎？</p>
          <p v-else>確定要執行此操作嗎？</p>
        </template>
      </div>

    </div>

    <template #footer>
      <div class="member-lightbox-actions" v-if="type && type.toLowerCase().includes('success')">
        <Button variant="primary" @click="close">確定</Button>
      </div>
      <div class="member-lightbox-actions" v-else>
        <Button variant="primary" @click="handleConfirm">確定</Button>
        <Button variant="outline" @click="close">取消</Button>
      </div>
    </template>
  </Lightbox>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.member-lightbox-inner {
  color: $text-color;
}

.amount-container {
  padding: rem(20px) 0;
}

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
    flex-wrap: nowrap;

    span { 
      font-weight: bold; 
      white-space: nowrap;
      flex-shrink: 0;
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

.text-message-wrap {
  text-align: center;
  font-size: rem(18px);
  padding: rem(10px) 0;
  
  p {
    margin: rem(10px) 0;
  }
  
  .service-note {
    margin-top: rem(20px);
    padding-top: rem(15px);
    border-top: 1px dashed #ccc;
    font-size: 14px;
    color: #666;
    text-align: left;
  }
}

.member-lightbox-actions {
  display: flex;
  justify-content: center;
  gap: rem(16px);
  margin-top: rem(32px);
}

@media (max-width: 768px) {
  .amount-input {
    .input-flex {
      flex-wrap: nowrap;
      
      span {
        white-space: nowrap;
        flex-shrink: 0;
      }
    }
  }

  .member-lightbox-actions {
    flex-direction: column;
    gap: rem(8px);
  }

  .member-lightbox-actions :deep(button) {
    width: 100%;
  }
}
</style>