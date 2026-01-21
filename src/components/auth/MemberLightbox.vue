<script setup>
import { ref, watch } from 'vue';
import Lightbox from '@/components/Lightbox.vue';
import Button from '@/components/auth/Button.vue';

const props = defineProps({
    modelValue: Boolean,
    type: String, // 'editActivity', 'terminate', 'removeFavorite', 'editAmount', 'success'
    title: String, // 成功燈箱可自定義標題
    message: String, // 成功燈箱可自定義內文
    initialData: Object // 傳入的原始資料 (如報名資訊)
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// 內部表單狀態
const formData = ref({});

// 監聽燈箱開啟，進行資料深拷貝
watch(() => props.modelValue, (val) => {
    if (val && props.initialData) {
        formData.value = JSON.parse(JSON.stringify(props.initialData));
    }
    });

const handleConfirm = (dataFromLightbox) => {
    console.log('父組件收到資料了！', dataFromLightbox);
    
    if (activeType.value === 'editActivity') {
        // 這裡可以寫：updateApi(dataFromLightbox)
        alert('修改成功！姓名：' + dataFromLightbox.name);
    }
    
    // 記得要關閉燈箱
    isLightboxOpen.value = false;
    };

    const close = () => {
    emit('update:modelValue', false);
    };
    </script>

    <template>
    <Lightbox 
        :modelValue="modelValue" 
        @update:modelValue="close" 
        :class="['member-lightbox', { 'wide-mode': type === 'editActivity' }]"
    >
        <template #title>
        <span v-if="type === 'editActivity'">更改報名資料</span>
        <span v-else-if="type === 'terminate'">終止捐款申請確認</span>
        <span v-else-if="type === 'removeFavorite'">是否移出收藏夾？</span>
        <span v-else-if="type === 'editAmount'">修改定期定額金額</span>
        <span v-else-if="type === 'cancelConfirm'">是否取消報名？</span>
        <span v-else>{{ title || '提示' }}</span>
        </template>

        <div class="member-lightbox-body">
        <div v-if="type === 'editActivity'" class="form-container">
            <div class="input-item">
            <label for="name">姓名*</label>
            <input id="name" type="text" v-model="formData.name" class="custom-input disabled" disabled>
            <div class="message">
                <span class="material-symbols-outlined">info</span>
                如需修改姓名，請至 <router-link to="/member/personal" class="link">個人資訊</router-link> 更新
            </div>
            </div>

            <div class="input-item">
            <label for="email">電子信箱*</label>
            <input id="email" type="email" v-model="formData.email" class="custom-input">
            </div>

            <div class="grid-row">
            <div class="input-item">
                <label for="phone">手機號碼*</label>
                <input id="phone" type="tel" v-model="formData.phone" class="custom-input" placeholder="0912345678">
            </div>
            <div class="input-item">
                <label for="idNumber">身分證字號*</label>
                <input id="idNumber" type="text" v-model="formData.idNumber" class="custom-input">
            </div>
            </div>

            <div class="input-item">
            <label for="birthday">出生年月日*</label>
            <input id="birthday" type="date" v-model="formData.birthday" class="custom-input">
            </div>

            <div class="grid-row">
            <div class="input-item">
                <label for="emergencyName">緊急聯絡人姓名*</label>
                <input id="emergencyName" type="text" v-model="formData.emergencyName" class="custom-input">
            </div>
            <div class="input-item">
                <label for="emergencyPhone">緊急聯絡人手機*</label>
                <input id="emergencyPhone" type="tel" v-model="formData.emergencyPhone" class="custom-input">
            </div>
            </div>

            <div class="checkbox-item">
            <input type="checkbox" id="sync" v-model="formData.isSync">
            <label for="sync">同步更新會員資料：將本次修改之資訊儲存至我的個人資訊</label>
            </div>
        </div>

        <div v-else-if="type === 'editAmount'" class="edit-amount-form">
            <div class="current-info">
            <p>目前捐款金額：新台幣 $2,000</p>
            <p>目前扣款週期：每月固定 10 號</p>
            </div>
            <div class="input-item">
            <label>您想變更的金額為？</label>
            <div class="amount-input-group">
                <span>新台幣 $</span>
                <input type="number" v-model="formData.newAmount" placeholder="請輸入金額">
            </div>
            <p class="hint">● 最低金額新台幣 $100</p>
            </div>
        </div>

        <div v-else-if="['terminate', 'cancelConfirm', 'removeFavorite'].includes(type)" class="confirm-content">
            <div v-if="type === 'terminate'" class="text-start">
            <p class="warning-highlight">重要：扣款授權由終止流程涉及銀行作業，約需 3 至 5 個工作天。</p>
            <p>您的「下次扣款日」若位於此作業期間內，該筆款項可能已進入銀行處理程序而無法即時攔阻。</p>
            </div>
            <p v-else-if="type === 'cancelConfirm'">確定要取消此活動的報名嗎？</p>
            <p v-else-if="type === 'removeFavorite'">確定要將此項目移出收藏夾嗎？</p>
        </div>

        <div v-else-if="type === 'success'" class="success-content">
            <p>{{ message || '操作成功！' }}</p>
        </div>
    </div>

    <template #footer>
        <div class="member-lightbox-actions">
            <template v-if="type === 'success'">
            <Button variant="primary" @click="close">確定</Button>
            </template>
            <template v-else>
            <Button variant="primary" @click="handleConfirm">確定</Button>
            <Button variant="outline" @click="close">取消</Button>
            </template>
        </div>
        </template>
    </Lightbox>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

// 穿透修改基礎 Lightbox 寬度
:deep(.lightbox-content) {
    width: rem(500px);
    &.wide-mode {
        width: rem(680px);
    }
    }

    .member-lightbox-body {
    padding: rem(10px) 0;
    color: $text-color;
    }

    /* 1. 表單通用樣式 (報名表) */
    .form-container {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
    text-align: left;
    }
    .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: rem(16px);
    }
    .input-item {
    label {
        display: block; font-weight: bold; color: $primary-color;
        margin-bottom: rem(4px); font-size: $size-body;
    }
    .custom-input {
        width: 100%; height: rem(40px);
        border: 1px solid $input-line-color1;
        padding: 0 rem(12px); border-radius: rem(4px);
        &.disabled { background: #f5f5f5; color: #999; cursor: not-allowed; }
        &:not(.disabled):hover {  
            border-color: $secondary-color; 
        }
        
        &:not(.disabled):focus {  
            border-color: $secondary-color; 
            outline: none; 
        } 
    }
    .message {
        display: flex; align-items: center; gap: 4px;
        font-size: 12px; color: $secondary-color; margin-top: 4px;
        .link { text-decoration: underline; color: $secondary-color; }
    }
    }

    /* 2. 修改金額樣式 */
.edit-amount-form {
    text-align: left;
.current-info {
        background: #f8f9fa; padding: rem(12px);
        margin-bottom: rem(20px); border-radius: 4px;
        p { margin: 0; font-size: 14px; }
    }
.amount-input-group {
        display: flex; align-items: center; gap: 8px;
        input { flex: 1; border: 1px solid $input-line-color1; height: rem(40px); padding: 0 10px; }
    }
.hint { font-size: 12px; color: $secondary-color; margin-top: 4px; }
    }

    /* 3. 確認與成功訊息 */
.confirm-content, .success-content {
    text-align: center; font-size: $size-body; line-height: 1.6;
    }
.warning-highlight {
    color: $highlight-color2; // 橘色警告
    font-weight: bold; margin-bottom: rem(8px);
    }

.checkbox-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 14px; margin-top: 10px;
    }

.member-lightbox-actions {
    display: flex; justify-content: center;
    gap: rem(16px); margin-top: rem(32px);
    }
</style>