<script setup>
import { ref,reactive, computed,watch, onMounted } from 'vue'
import MyButton from './MyButton.vue'
import { useAuthStore } from '@/stores/auth'
import downloadReceipt from './downloadReceipt.vue'
import ecpayCrypto from '@/utils/ecpayCrypto.js'
import { useLocalStorage } from '@vueuse/core'
import { publicApi } from '@/utils/publicApi'

//海龜數據
const rescueCase = ref({})

onMounted(() => {
  publicApi.get('data/rescueCases.json').then((response) => {
    //取一隻救援海龜數據
    const randomIndex = Math.floor(Math.random() * response.data.length);
    rescueCase.value = response.data[randomIndex]
    
    
  })
})

const auth = useAuthStore()

function formatNow() {
  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');

  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  return `${y}-${m}-${d}  ${h}:${min}:${s}`;
}


let nowTime = formatNow()

const currentStep = ref(1)
const donationType = ref('monthly')
const selectedAmount = ref(1000)
const customAmount = ref('')
const payment = ref('ecpay')
const anonymous = ref(false)
const form = reactive({
  userName:'',
  email: '',
  phone: '',
  birthYear: '',
  identity: '',
  agree: '',
})
const isBlank = reactive({
  userName:false,
  email: false,
  phone: false,
  birthYear: false,
  identity: false,
})
const errors = reactive({
  userName:false,
  email: false,
  phone: false,
  birthYear: false,
  identity: false,
  agree: false,
  customAmount: false
})
const modalRef = ref(null);

const stepLabels = ['選擇金額', '捐款人資料填寫', '捐款完成']
const amountOptions = {
  monthly: [800, 1000, 1200],
  once: [3000, 5000, 8000]
}



const isGreater = () => {
  if (!selectedAmount.value) { //判斷有沒有選金額
    if (donationType.value === 'once') {
      if (customAmount.value < 300) {
        errors.customAmount = true
      } else {
        errors.customAmount = false
      }
    } else {
      if (customAmount.value < 100) {
        errors.customAmount = true
      } else {
        errors.customAmount = false
      }
    }
    
  }
}

const activeAmountOptions = computed(() => amountOptions[donationType.value])
const finalAmount = computed(() => {
  const val = customAmount.value ? Number(customAmount.value) : selectedAmount.value
  return val.toLocaleString()
})
const rawFinalAmount = computed(() => customAmount.value ? Number(customAmount.value) : selectedAmount.value
)

watch(donationType,(newValue)=>{
    // 金額預設選中間
    selectedAmount.value = amountOptions[newValue][1];
    // 輸入值為空
    customAmount.value='';
    errors.customAmount = false;
    //付款切回ecpay
    payment.value='ecpay';
  })

  //localstorage
const donationState = useLocalStorage('donationState', {
  currentStep : 1,
  donationType : 'monthly',
  finalAmount : 0
  
})
if (donationState.value.currentStep == 3) {
  currentStep.value = 3
}

const goStepTwo = () => {

  if (!errors.customAmount) { //判斷金額是否正確
    if (auth.isLogin) { //判斷是否登入
      // 前往第二步
      currentStep.value = 2
    } else {
      auth.isModalOpen = true
    }
  }

}

const formFields = [
  { id: 'userName', label: '姓名', type: 'text' },
  { id: 'email', label: '電子郵件', type: 'email' },
  { id: 'phone', label: '手機號碼', type: 'tel' },
  { id: 'birthYear', label: '出生年份(西元)', type: 'text' },
  { id: 'identity', label: '身分證字號', type: 'text' }
]
//身分證驗證
function validateTWID(id) {
  const regex = /^[A-Z][12]\d{8}$/
  if (!regex.test(id)) return false

  const city = {
    A:10, B:11, C:12, D:13, E:14, F:15,
    G:16, H:17, I:34, J:18, K:19,
    L:20, M:21, N:22, O:35, P:23,
    Q:24, R:25, S:26, T:27, U:28,
    V:29, W:32, X:30, Y:31, Z:33
  }

  // 英文字母轉兩碼
  const code = city[id[0]].toString().split('').map(Number)

  // 身分證後 9 碼
  const numbers = id.slice(1).split('').map(Number)

  const idNums = code.concat(numbers)

  // ✅ 正確 11 碼權重
  const weights = [1,9,8,7,6,5,4,3,2,1,1]

  const sum = idNums.reduce((acc, n, i) => acc + n * weights[i], 0)

  return sum % 10 === 0
}



const validators = {
  userName(value) {
    return /^[\u4e00-\u9fa5]{1,50}$/.test(value)
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  phone(value) {
    return /^09\d{8}$/.test(value)
  },
  birthYear(value) {
    return /^(19|20)\d{2}$/.test(value)
  },
  identity(value) {
    return validateTWID(value);
  },
}
// 格式判斷函式
const validateField = (field) => {
  // 先設為false
  errors[field] = false
  isBlank[field] = form[field].trim() === ''
  if (!isBlank[field]) {
    errors[field] = !validators[field](form[field])
  }
  
}
//enter跳下個input
const inputs = ref([])

function focusNext(index, field) {
  validateField(field)
  if (!errors[field] && !isBlank[field]) {
    const next = inputs.value[index + 1]
    if (next) {
      next.focus()
    }
  }
}

//立即捐款函式
const goDonate = () => {
  if (!form.agree) {
    errors.agree = true
  }
  if (anonymous.value) { //是否匿名
    validateField('email')
    
    if (!errors.email && !isBlank.email && !errors.agree) {
      //先寫入localstorage示意
      donationState.value.currentStep = 3
      donationState.value.donationType = donationType.value
      donationState.value.finalAmount = finalAmount
      if (payment.value == "ecpay") { //判斷金流
        ecpayCrypto()
      } else {
        currentStep.value = 3
      }
    }
  }else {
    validateField('userName')
    validateField('email')
    validateField('phone')
    validateField('birthYear')
    validateField('identity')
    let hasError = Object.values(errors).some(v => v)
    let hasBlank = Object.values(isBlank).some(v => v)
    if (!hasError && !hasBlank && !errors.agree) {
      //先寫入localstorage示意
      donationState.value.currentStep = 3
      donationState.value.donationType = donationType.value
      donationState.value.finalAmount = finalAmount
      if (payment.value == "ecpay") { //判斷金流
        ecpayCrypto()
      } else {
        currentStep.value = 3
      }
  }
  }

}


</script>

<template>
  <div class="donation-card">
    <downloadReceipt ref="modalRef"/>
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
          class="tabBtn"
          :class="{ 'tabBtn-outline': donationType !== 'monthly' }"
          style="border-left: none;"
        >每月捐款</button>
        <button
          @click="donationType = 'once'"
          class="tabBtn"
          :class="{ 'tabBtn-outline': donationType !== 'once' }"
          style="border-right: none;"
        >單次捐款</button>
      </div>

      <p class="intro-text">
        您的每一份支持，都是海龜重返海洋的生機；用專業的行動，將關懷轉化為守護力量。
      </p>

      <div class="amount-grid">
        <MyButton
          v-for="amt in activeAmountOptions" 
          :key="amt"
          @click="selectedAmount = amt; customAmount = ''; errors.customAmount = false"
          class=" btn-xxl"
          :class="{ 'btn-outline': selectedAmount !== amt }"
          height="76px"
          width="30%"
        >${{ amt.toLocaleString() }}</MyButton>
      </div>

      <div class="input-wrapper">
        <input 
          v-model="customAmount"
          type="number" 
          placeholder="其他金額" 
          @input="selectedAmount = null"
          @blur="isGreater"
        />
        <p v-if="donationType === 'once'" class="error-msg" v-show="errors.customAmount">
          <span class="material-symbols-outlined">
          error
          </span> 最低捐款金額為:300</p>
        <p v-if="donationType === 'monthly'" class="error-msg" v-show="errors.customAmount">
          <span class="material-symbols-outlined">
          error
          </span>最低捐款金額為:100</p>
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
      <MyButton @click="goStepTwo" class=" btn-xxl" width="50%">我要捐款</MyButton>
    </div>

    <div v-if="currentStep === 2" class="step-content">
      <div class="summary-header">
        <h3 class="type-tag">{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</h3>
        <p class="amount-display">新台幣 <span class="money">{{ finalAmount }}</span></p>
        <div class="btn-back-group" @click="currentStep = 1; anonymous=false" >
          <div class="back-arrow"></div>
          <button class="btn-back">其他金額</button>
        </div>
      </div>

      <div class="form-body">
        <label class="checkbox-label">
          <input type="checkbox" v-model="anonymous">
          <span class="material-symbols-outlined checkbox" v-if="anonymous">
            check_box
            </span>
            <span class="material-symbols-outlined checkbox" v-else>
            check_box_outline_blank
            </span>
           我要匿名捐款（免填身分資料）
        </label>
        
        <div class="form-group" v-if="anonymous === false" v-for="field,index in formFields" :key="field.id">
          <input :id="field.id" :type="field.type" placeholder=" " class="form-input" @blur="validateField(field.id)" v-model="form[field.id]" :ref="el => inputs[index] = el" @keydown.enter.prevent="focusNext(index,field.id)">
          <label :for="field.id">{{ field.label }}</label>
          <p class="error-msg" v-if="isBlank[field.id]">
            <span class="material-symbols-outlined">
          error
          </span>請填入以上資料</p>
          <p class="error-msg" v-if="errors[field.id]">
            <span class="material-symbols-outlined">
          error
          </span>格式有誤</p>
        </div>
        <div class="form-group" v-if="anonymous === true">
          <input type="text" placeholder="善心人士" class="form-input" disabled>
        </div>
        <div class="form-group" v-if="anonymous === true">
          <input id="email" type="email" placeholder=" " class="form-input" @blur="validateField('email')" v-model="form.email">
          <label for="email">電子郵件</label>
          <p class="error-msg" v-if="isBlank.email">
            <span class="material-symbols-outlined">
          error
          </span>請填入以上資料</p>
          <p class="error-msg" v-if="errors.email">
            <span class="material-symbols-outlined">
          error
          </span>格式有誤</p>
        </div>
        <div class="policy-group">
          <label class="checkbox-label policy">
            <input type="checkbox" v-model="form.agree" @click="errors.agree=false">
            
            <span class="material-symbols-outlined checkbox" v-if="form.agree">
            check_box
            </span>
            <span class="material-symbols-outlined checkbox" v-else>
            check_box_outline_blank
            </span>
            <span>為確保保育資源能精確且即時地投入海洋保護工作，捐款程序一經完成，恕不接受退款申請。若對款項運用有任何疑問，歡迎隨時與我們聯繫，我們將竭誠為您說明。感謝您的慷慨支持！ </span>
          </label>
          <p class="error-msg" v-if="errors.agree">
            <span class="material-symbols-outlined">
          error
          </span>您尚未同意保護政策</p> 

        </div>
      </div>
      <form id="ecpayForm" method="post" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5">
            <input type="hidden" name="MerchantID" value="3002607">
            <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="">
            <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate" value="">
            <input type="hidden" name="PaymentType" value="aio">
            <input type="hidden" name="TotalAmount" :value="rawFinalAmount">
            <input type="hidden" name="TradeDesc" :value="donationType">
            <input type="hidden" name="ItemName" value="捐款金額">
            <input type="hidden" name="ReturnURL" value="https://tibamef2e.com/cjd102/g3/front/donation">
            <input type="hidden" name="ChoosePayment" value="ALL">
            <input type="hidden" name="EncryptType" value="1">
            <input type="hidden" name="IgnorePayment" value="WeiXin#TWQR#BNPL#CVS#BARCODE#ATM#WebATM">
            <!-- <input type="hidden" name="OrderResultURL" value="https://tibamef2e.com/cjd102/g3/front/donation"> -->
            <input type="hidden" name="ClientBackURL" value="https://tibamef2e.com/cjd102/g3/front/donation">
            <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="">
            <MyButton @click.prevent="goDonate" class=" btn-xxl" width="50%" >立即捐款</MyButton>
        </form>
    </div>

    <div v-if="currentStep === 3" class="step-content">
      <div class="success-page">
        <h2 class="success-title">捐款成功</h2>
        <p class="success-desc">
          感謝您捐款 [{{ donationState.finalAmount }}] 支持海龜保育計畫。您的這筆款項將直接用於海龜的醫療救援與棲地維護。
我們承諾將每一分錢透明、高效地運用。正式的電子收據請您留意查收。
再次感謝您的信任與行動！
        </p>
  
        <div class="info-card">
          <p class="card-title">捐款摘要</p>
          <p><strong>捐款金額：</strong>新台幣 <span>{{ donationState.finalAmount }}</span></p>
          <p><strong>捐款類型：</strong>{{ donationState.donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</p>
          <p><strong>捐款時間：</strong>{{ nowTime }}</p>
        </div>
  
        <div class="photo-box">
          <img :src="rescueCase.image" alt="Sea Turtle">
          <div class="caption">您的支持正讓「{{rescueCase.name}}」這樣的海龜獲得重生。</div>
        </div>
        <MyButton @click="modalRef?.openModal" class=" btn-xxl" width="50%">下載收據</MyButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  $btn-green: #0E6273;
//google font
.material-symbols-outlined {
  font-variation-settings:
  'FILL' 1,
  'wght' 700,
  'GRAD' 0,
  'opsz' 20;
  color: $highlight-color2;
  font-size: 16px;
}

.checkbox {
      font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
      color: $btn-green;
      font-size: 24px;
    }

.donation-card {
    position: sticky;
    // margin-top: 32px; //到時候根據header高度做調整
    top: 0px; //到時候根據header高度做調整
    width: 100%;
    padding-bottom: 12px;
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
  .tabBtn {
    @include font-tertiary;
    display: inline-block;
    cursor: pointer;
    transition: all 0.2s ease;
    border-style: solid;
    border-width: 2px;
    width: 50%;
    height: 71px;
    background-color: $btn-green;
    color: #ffffff;
    border-color: $btn-green;
  }
  .tabBtn-outline {
    background-color: transparent;
    color: $btn-green;
    border-color: $btn-green;
  }
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
  @include font-body;
  color: $highlight-color2;
  margin-top: -4px;
  display: flex;
  align-items: center;
  gap: 4px;
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
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: 
    "tag tag"
    "amount back";
  
  margin-bottom: 8px;
  @media (width<390px) {
    grid-template-areas: 
    "tag back"
    "amount amount";
  }

  .type-tag { 
    @include font-body-l-bold;
    color: $primary-color;
    margin: 0; 
    grid-area:tag;
  }
  .amount-display {
    @include font-secondary;
    color: $primary-color;
    grid-area:amount;
    .money { 
      // 手機
      font-size: $d-size-primary;
      line-height: 1.2;
      letter-spacing: 3px;
      @include font-giant;
      color: $primary-color;
    }
  }
  .btn-back-group {
    display: flex;
    align-items: center;
    gap: 4px;
    grid-area:back;
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
      padding: 0;
      @include font-body;
      color: $primary-color;
    }
  }
}

.form-body {
  width: 90%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (width<=768px){
    gap: 12px;
  }
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
    gap: 8px;
    cursor: pointer;
    input { 
      display: none; /* 隱藏原始checkbox */
    }
    &.policy { 
      line-height: 1.4; 
      margin-bottom: 5px; 
      align-items: flex-start;
    }
  }
}
#ecpayForm {
  width: 90%;
  display: flex;
  justify-content: center;
}

// 成功頁面
.success-page {
  text-align: center;
  width: 90%;
  .success-title { 
    @include font-secondary;
    color: $primary-color; 
    margin-bottom: 16px; 
  }
  .success-desc { 
    text-align: left; 
    @include font-body;
    margin-bottom: 8px; }
}

.info-card {
  text-align: left;
  margin-bottom: 16px;
  .card-title { 
    @include font-tertiary; 
    margin-bottom: 8px; 
  }
  p { 
    @include font-body;
    margin: 8px 0; 
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
  margin-bottom: 20px;
  img { width: 100%; display: block; }
  .caption {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    @include font-body-l;
    color: #fff;
    padding: 2px 0;
  }
}
</style>