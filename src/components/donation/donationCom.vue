<script setup>
import { ref, computed,watch } from 'vue'
import MyButton from './MyButton.vue'


const currentStep = ref(1)
const donationType = ref('monthly')
const selectedAmount = ref(1000)
const customAmount = ref('')
const payment = ref('ecpay')
const anonymous = ref(false)

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

// const changeDonationType = (type) => {
//   if (type =='monthly') {
//     donationType.value = type;
//     selectedAmount.value = 1000;
//   } else if (type =='once') {
//     donationType.value = type;
//     selectedAmount.value = 5000;
//   }
// }
watch(donationType,(newValue)=>{
    selectedAmount.value = amountOptions[newValue][1];
    customAmount.value='';
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
        <MyButton
          @click="donationType = 'monthly'"
          class=" btn-xxl"
          :class="{ 'btn-outline': donationType !== 'monthly' }"
          width="50%"
          height="71px"
          style="border-left: none;"
        >每月捐款</MyButton>
        <!-- <button 
          @click="donationType = 'monthly'"
          :class="{ active: donationType === 'monthly' }"
        >每月捐款</button> -->
        <MyButton
          @click="donationType = 'once'"
          class=" btn-xxl"
          :class="{ 'btn-outline': donationType !== 'once' }"
          width="50%"
          height="71px"
          style="border-right: none;"
        >單次捐款</MyButton>
        <!-- <button 
          @click="donationType = 'once'"
          :class="{ active: donationType === 'once' }"
        >單次捐款</button> -->
      </div>

      <p class="intro-text">
        您的每一份支持，都是海龜重返海洋的生機；用專業的行動，將關懷轉化為守護力量。
      </p>

      <div class="amount-grid">
        <MyButton
          v-for="amt in activeAmountOptions" 
          :key="amt"
          @click="selectedAmount = amt; customAmount = ''"
          class=" btn-xxl"
          :class="{ 'btn-outline': selectedAmount !== amt }"
          height="76px"
          width="30%"
        >${{ amt.toLocaleString() }}</MyButton>
        <!-- <button 
          v-for="amt in activeAmountOptions" 
          :key="amt"
          @click="selectedAmount = amt; customAmount = ''"
          :class="{ active: selectedAmount === amt }"
        >
          ${{ amt.toLocaleString() }}
        </button> -->
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

      <!-- <button @click="currentStep = 2" class="btn-submit">我要捐款</button> -->
      <MyButton @click="currentStep = 2" class=" btn-xxl" width="50%">我要捐款</MyButton>
    </div>

    <div v-if="currentStep === 2" class="step-content">
      <div class="summary-header">
        <div class="amount-info">
          <h3 class="type-tag">{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</h3>
          <p class="amount-display">新台幣 <span class="money">{{ finalAmount }}</span></p>
        </div>
        <div class="btn-back-group" @click="currentStep = 1; anonymous=false" >
          <div class="back-arrow"></div>
          <button class="btn-back">其他金額</button>
        </div>
      </div>

      <div class="form-body">
        <label class="checkbox-label">
          <input type="checkbox" v-model="anonymous"> 我要匿名捐款（免填身分資料）
        </label>
        
        <div class="form-group" v-if="anonymous === false" v-for="field in formFields" :key="field.id">
          <input :id="field.type" :type="field.type" placeholder=" " class="form-input">
          <label :for="field.type">{{ field.label }}</label>
          <p class="error-msg">● 請填入以上資料</p>
        </div>
        <div class="form-group" v-if="anonymous === true">
          <input type="text" placeholder="善心人士" class="form-input" disabled>
        </div>
        <div class="form-group" v-if="anonymous === true">
          <input id="email" type="email" placeholder=" " class="form-input">
          <label for="email">電子郵件</label>
          <p class="error-msg">● 請填入以上資料</p>
        </div>
        <div class="policy-group">
          <label class="checkbox-label policy">
            <input type="checkbox">
            <span>為確保保育資源能精確且即時地投入海洋保護工作，捐款程序一經完成，恕不接受退款申請。 在您按下送出前，請務必再次核對捐款金額與相關資訊。您的每一分善款都將被謹慎運用於海龜救援與棲地守護。若對款項運用有任何疑問，歡迎隨時與我們聯繫，我們將竭誠為您說明。感謝您的慷慨支持！ </span>
          </label>
          <p class="error-msg">● 您尚未同意保護政策</p> 

        </div>
      </div>
      <MyButton @click="currentStep = 3" class=" btn-xxl" width="50%">立即捐款</MyButton>
      <!-- <button @click="currentStep = 3" class="btn-submit">立即捐款</button> -->
    </div>

    <div v-if="currentStep === 3" class="step-content">
      <div class="success-page">
        <h2 class="success-title">捐款成功</h2>
        <p class="success-desc">
          感謝您捐款 [{{ finalAmount }}] 支持海龜保育計畫。您的這筆款項將直接用於海龜的醫療救援與棲地維護。
我們承諾將每一分錢透明、高效地運用。正式的電子收據（可用於報稅折抵）請您留意查收。
再次感謝您的信任與行動！
        </p>
  
        <div class="info-card">
          <p class="card-title">捐款摘要</p>
          <p><strong>捐款金額：</strong>新台幣 <span>{{ finalAmount }}</span></p>
          <p><strong>捐款類型：</strong>{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</p>
          <p><strong>捐款時間：</strong>2025-12-25 18:15:30</p>
        </div>
  
        <div class="photo-box">
          <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80" alt="Sea Turtle">
          <div class="caption">您的支持正讓「小翠」這樣的海龜獲得重生。</div>
        </div>
        <MyButton @click="reset" class=" btn-xxl" width="50%">下載收據</MyButton>
        <!-- <button @click="reset" class="btn-submit">下載收據</button> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.donation-card {
    position: sticky;
    top: 0;
    width: 100%;
    padding-bottom: 20px;
    border: 2px solid $secondary-color;
    background-color: $card-color;
    overflow: hidden;
}

// 步驟條樣式
.stepper {
  display: flex;
  justify-content: space-around;
  padding: 25px 0;
  position: relative;

  .progress-line {
    position: absolute;
    top: 33px;
    left: 15%;
    right: 15%;
    height: 2px;
    background-color: $highlight-color1;
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
      background-color: $highlight-color1;
      border-radius: 50%;
      margin-bottom: 10px;
      transition: background 0.3s;
      transform: translate(0 ,2px);
    }

    .label {
      @include font-body;
      color: $text-color;
    }

    &.active {
      .dot { background-color: $primary-color; }
    }
  }
}

.step-content {
  // padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Tab 切換
.tab-group {
  width: 100%;
  display: flex;
  margin-bottom: 26px;
}

.intro-text {
  text-align: center;
  @include font-tertiary;
  margin-bottom: 67px;
  padding: 0 10px;
}

// 金額按鈕網格
.amount-grid {
  width: 90%;
  display: flex;
  justify-content: space-between;
  gap: 3%;
  margin-bottom: 46px;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 輸入框樣式
.input-wrapper {
  margin-bottom: 20px;
  width: 90%;
  input {
    width: 100%;
    height: 48px;
    padding: 12px;
    border: 1px solid $input-line-color1;
    background: transparent;
    box-sizing: border-box;
  }
}

.error-msg {
  color: $highlight-color2;
  @include font-body;
  margin-top: 5px;
}

.payment-selection {
  width: 90%;
  @include font-body;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    input { 
      border: 1px solid $input-line-color1;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin: 0;
      padding: 2px;
      margin-right: 5px; 
      cursor: pointer;
      &:checked {
        background-color: $secondary-color;
        background-clip: content-box;/* 讓顏色只填在中間，不會碰到邊框 */
      }
    }
  }
}


// 第二步特定樣式
.summary-header {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;

  .type-tag { 
    @include font-body-l-bold;
    margin: 0; 
  }
  .amount-display {
    @include font-secondary;
    margin: 5px 0 0 0;
    color: $primary-color;
    .money { 
      // 手機
      font-size: $d-size-primary;
      line-height: 1.2;
      letter-spacing: 3px;
      @include font-giant;
    }
  }
  .btn-back-group {
    display: flex;
    align-items: center;
    cursor: pointer;
    .back-arrow {
      width: 1.25rem;
      height: 1.25rem;
      background-image: url("@/assets/image/DonationView/backIcon.svg");
      background-repeat: no-repeat;
      background-size: 1.25rem;
      flex-shrink: 0;
    }
    .btn-back {
      background: none;
      border: none;
      text-decoration: underline;
      color: $primary-color;
      @include font-body;
    }
  }
}

.form-body {
  width: 90%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  .form-group {
    position: relative;
    label {
      position: absolute;
      @include font-body;
      left: 10px;
      top: 12px;            /* 預設位置在 input 中間 */
      color: #3338;
      pointer-events: none; /* 重要：點擊標籤時要能穿透點到 input */
      transition: all 0.2s ease; /* 平滑動畫 */
    }
    .form-input {
      width: 100%;
      padding: 12px;
      height: 48px;
      border: 1px solid $input-line-color1;
      background: transparent;
      box-sizing: border-box;

      // 當 input 獲得焦點，或是內容不為空時
      &:focus + label,
      &:not(:placeholder-shown) + label {
        top: -2px;          /* 往上移動 */
        left: 8px;           /* 微調左邊距 */
        @include font-caption;
      }

      

      &:disabled {
        background-color: #D9D9D9;
        cursor:no-drop;
        &::placeholder {
          color: $text-color;
        }
      }
    }
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    @include font-body;
    color: $text-color;
    margin-bottom: 15px;
    gap: 8px;
    cursor: pointer;
    input { 
      margin-top: 3px; 
      border: 1px solid $input-line-color1;
      height: 24px;
      width: 24px;
      flex-shrink: 0;
      padding: 2px;
      cursor: pointer;
      &:checked { //這裡要改
        background-color: $secondary-color;
        background-clip: content-box;/* 讓顏色只填在中間，不會碰到邊框 */
      }
    }
    &.policy { 
      line-height: 1.4; 
      margin-bottom: 5px; 
      align-items: flex-start;
    }
  }
}

// 成功頁面
.success-page {
  text-align: center;
  width: 90%;
  .success-title { 
    color: $primary-color; 
    @include font-secondary;
    margin-bottom: 32px; 
  }
  .success-desc { 
    text-align: left; 
    @include font-body;
    margin-bottom: 24px; }
}

.info-card {
  text-align: left;
  margin-bottom: 20px;
  .card-title { 
    @include font-tertiary; 
    margin-bottom: 10px; 
  }
  p { 
    @include font-body;
    margin: 10px 0; 
    strong {
      @include font-body-bold;
    }
    span {
      @include font-tertiary;
    }
  }
}

.photo-box {
  position: relative;
  margin-bottom: 25px;
  img { width: 100%; display: block; }
  .caption {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    @include font-body-l;
    padding: 5px 0;
  }
}
</style>