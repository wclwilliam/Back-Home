<template>
  <div class="donation-card">
    <div class="stepper">
      <div class="progress-line">
        <div class="progress-fill" :style="{ width: ((currentStep - 1) / 2) * 100 + '%' }"></div>
      </div>
      <div 
        v-for="s in 3" 
        :key="s" 
        :class="['step-item', { active: currentStep >= s }]"
      >
        <div class="dot"></div>
        <span class="label">{{ stepLabels[s-1] }}</span>
      </div>
    </div>

    <div v-if="currentStep === 1" class="step-content">
      <div class="tab-group">
        <button 
          @click="donationType = 'monthly'"
          :class="{ active: donationType === 'monthly' }"
        >每月捐款</button>
        <button 
          @click="donationType = 'once'"
          :class="{ active: donationType === 'once' }"
        >單次捐款</button>
      </div>

      <p class="intro-text">
        您的每一份支持，都是海龜重返海洋的生機；用專業的行動，將關懷轉化為守護力量。
      </p>

      <div class="amount-grid">
        <button 
          v-for="amt in activeAmountOptions" 
          :key="amt"
          @click="selectedAmount = amt; customAmount = ''"
          :class="{ active: selectedAmount === amt }"
        >
          ${{ amt.toLocaleString() }}
        </button>
      </div>

      <div class="input-wrapper">
        <input 
          v-model="customAmount"
          type="number" 
          placeholder="其他金額" 
          @input="selectedAmount = null"
        />
        <p v-if="donationType === 'once'" class="error-msg">● 最低捐款金額為:300</p>
      </div>

      <div class="payment-selection">
        <span>選擇付款方式：</span>
        <label>
          <input type="radio" v-model="payment" value="ecpay"> 綠界金流(信用卡)
        </label>
        <label v-if="donationType === 'once'">
          <input type="radio" v-model="payment" value="linepay"> Line Pay行動支付
        </label>
      </div>

      <button @click="currentStep = 2" class="btn-submit">我要捐款</button>
    </div>

    <div v-if="currentStep === 2" class="step-content">
      <div class="summary-header">
        <div class="amount-info">
          <h3 class="type-tag">{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</h3>
          <p class="amount-display">新台幣 <span>{{ finalAmount }}</span></p>
        </div>
        <button @click="currentStep = 1" class="btn-back">其他金額</button>
      </div>

      <div class="form-body">
        <label class="checkbox-label">
          <input type="checkbox"> 我要匿名捐款（免填身分資料）
        </label>
        
        <div class="form-group" v-for="field in formFields" :key="field.id">
          <input :type="field.type" :placeholder="field.label" class="form-input">
          <p class="error-msg">● 請填入以上資料</p>
        </div>

        <label class="checkbox-label policy">
          <input type="checkbox">
          <span>為確保保育資源能精確且即時地投入海洋保護工作... (同意保護政策內容)</span>
        </label>
        <p class="error-msg">● 您尚未同意保護政策</p>
      </div>

      <button @click="currentStep = 3" class="btn-submit">立即捐款</button>
    </div>

    <div v-if="currentStep === 3" class="step-content success-page">
      <h2 class="success-title">捐款成功</h2>
      <p class="success-desc">
        感謝您捐款 [{{ finalAmount }}] 支持海龜保育計畫。您的這筆款項將直接用於海龜的醫療救援與棲地維護。
      </p>

      <div class="info-card">
        <p class="card-title">捐款摘要</p>
        <p><strong>捐款金額：</strong>新台幣 {{ finalAmount }}</p>
        <p><strong>捐款類型：</strong>{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</p>
        <p><strong>捐款時間：</strong>2025-12-25 18:15:30</p>
      </div>

      <div class="photo-box">
        <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80" alt="Sea Turtle">
        <div class="caption">您的支持正讓「小翠」這樣的海龜獲得重生。</div>
      </div>

      <button @click="reset" class="btn-submit">下載收據</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentStep = ref(1)
const donationType = ref('monthly')
const selectedAmount = ref(1000)
const customAmount = ref('')
const payment = ref('ecpay')

const stepLabels = ['選擇金額', '捐款人資料填寫', '捐款完成']
const amountOptions = {
  monthly: [800, 1000, 1200],
  once: [3000, 5000, 8000]
}

const activeAmountOptions = computed(() => amountOptions[donationType.value])
const finalAmount = computed(() => {
  const val = customAmount.value ? Number(customAmount.value) : selectedAmount.value
  return val.toLocaleString()
})

const formFields = [
  { id: 'name', label: '姓名', type: 'text' },
  { id: 'email', label: '電子郵件', type: 'email' },
  { id: 'phone', label: '手機號碼', type: 'tel' },
  { id: 'birth', label: '出生年份', type: 'text' },
  { id: 'id', label: '身分證字號', type: 'text' }
]

const reset = () => { currentStep.value = 1 }
</script>

<style lang="scss" scoped>
// 變數定義
$primary-color: #00525d;
$secondary-color: #89b3b8;
$bg-color: #d6e2e1;
$tab-inactive: #c4d5d4;
$error-color: #e65c41;
$white: #ffffff;

.donation-card {
    position: sticky;
    top: 0;
    width: 100%;
    background-color: $bg-color;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: "Microsoft JhengHei", sans-serif;
    color: #333;
}

// 步驟條樣式
.stepper {
  display: flex;
  justify-content: space-around;
  padding: 25px 0;
  background-color: rgba(255, 255, 255, 0.3);
  position: relative;

  .progress-line {
    position: absolute;
    top: 33px;
    left: 15%;
    right: 15%;
    height: 2px;
    background-color: $secondary-color;
    z-index: 1;

    .progress-fill {
      height: 100%;
      background-color: $primary-color;
      transition: width 0.3s ease;
    }
  }

  .step-item {
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;

    .dot {
      width: 14px;
      height: 14px;
      background-color: $secondary-color;
      border-radius: 50%;
      margin-bottom: 8px;
      transition: background 0.3s;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    &.active {
      .dot { background-color: $primary-color; }
    }
  }
}

.step-content {
  padding: 24px;
}

// Tab 切換
.tab-group {
  display: flex;
  margin-bottom: 20px;

  button {
    flex: 1;
    padding: 12px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    background-color: $tab-inactive;
    color: $primary-color;
    transition: 0.2s;

    &.active {
      background-color: $primary-color;
      color: $white;
    }
  }
}

.intro-text {
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.6;
  margin-bottom: 25px;
  padding: 0 10px;
}

// 金額按鈕網格
.amount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  button {
    padding: 15px 0;
    background: transparent;
    border: 2px solid $primary-color;
    color: $primary-color;
    font-weight: bold;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background-color: $primary-color;
      color: $white;
    }
  }
}

// 輸入框樣式
.input-wrapper {
  margin-bottom: 20px;
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #999;
    background: transparent;
    border-radius: 4px;
    box-sizing: border-box;
  }
}

.error-msg {
  color: $error-color;
  font-size: 12px;
  margin-top: 5px;
}

.payment-selection {
  font-size: 14px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    input { margin-right: 5px; }
  }
}

// 按鈕
.btn-submit {
  width: 100%;
  padding: 15px;
  background-color: $primary-color;
  color: $white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 2px;
  &:hover { opacity: 0.9; }
}

// 第二步特定樣式
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;

  .type-tag { font-size: 16px; margin: 0; }
  .amount-display {
    font-size: 18px;
    margin: 5px 0 0 0;
    color: $primary-color;
    font-weight: bold;
    span { font-size: 28px; }
  }
  .btn-back {
    background: none;
    border: none;
    text-decoration: underline;
    color: #666;
    cursor: pointer;
    font-size: 13px;
  }
}

.form-body {
  .form-group { margin-bottom: 15px; }
  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #999;
    background: transparent;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .checkbox-label {
    display: flex;
    font-size: 13px;
    margin-bottom: 15px;
    cursor: pointer;
    input { margin-right: 8px; margin-top: 3px; }
    &.policy { line-height: 1.4; margin-bottom: 5px; }
  }
}

// 成功頁面
.success-page {
  text-align: center;
  .success-title { color: $primary-color; font-size: 24px; margin-bottom: 15px; }
  .success-desc { text-align: left; font-size: 14px; line-height: 1.6; margin-bottom: 20px; }
}

.info-card {
  background-color: rgba(255, 255, 255, 0.4);
  padding: 15px;
  text-align: left;
  border-radius: 4px;
  margin-bottom: 20px;
  .card-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
  p { font-size: 14px; margin: 5px 0; }
}

.photo-box {
  position: relative;
  margin-bottom: 25px;
  img { width: 100%; border-radius: 4px; display: block; }
  .caption {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    color: $white;
    font-size: 11px;
    padding: 5px 0;
  }
}
</style>