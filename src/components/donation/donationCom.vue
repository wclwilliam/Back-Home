<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import MyButton from './MyButton.vue'
import { useAuthStore } from '@/stores/auth'
import downloadReceipt from './downloadReceipt.vue'
// import ecpayCrypto from '@/utils/ecpayCrypto.js'
// import { useLocalStorage } from '@vueuse/core'
import { publicApi, APIBase,backHomeApi } from '@/utils/publicApi'
import linepay from '@/utils/linepay'
import { useRoute} from 'vue-router';

const APIFileBase = import.meta.env.VITE_FILE_URL

const route = useRoute();
const auth = useAuthStore()



//判斷最近有沒有捐款有就呈現捐款成功組件
onMounted( () => { //傳會員id
  if (!route.query.transactionId) {//用這個query參數判斷是不是綠界
    backHomeApi.get(`donation/donateTime.php?memberId=${auth.user?.MEMBER_ID}`).then((response) => {
      // console.log(response.data);
      if (response.data) {
        currentStep.value = 3
        // donationType.value = response.data.DONATION_TYPE
        response.data.DONATION_TYPE =="單次捐款" ? donationType.value ="once" : donationType.value ="monthly";
        setTimeout(() =>{
          selectedAmount.value = response.data.AMOUNT
        })
        donationId.value = response.data.DONATION_ID
      }
    })
  }
})

//linepay成功付款後邏輯
//linepay回傳值為transactionId orderId(orderid是我們建立的transactionId是linepay給的)
onMounted(async () => {
  const tid = route.query.transactionId; // 抓網址的參數
  const oid = route.query.orderId; // 抓網址的參數
  const amount = route.query.amount; // 抓網址的參數
  
  
  if (tid) {
    try {
      const response = await backHomeApi.get(`donation/linepayback.php?transactionId=${tid}&orderId=${oid}&memberId=${auth.user?.MEMBER_ID}&amount=${amount}`);
      if (response.data.status === 'success') {
        // 後端確定成功後邏輯
        // console.log(response.data.data);
        currentStep.value = 3
        response.data.data.DONATION_TYPE =="單次捐款" ? donationType.value ="once" : donationType.value ="monthly";
        setTimeout(() =>{
          selectedAmount.value = response.data.data.AMOUNT
        })
        donationId.value = response.data.data.DONATION_ID
      }
    } catch (err) {
      alert('付款確認失敗');
    }
  }
});

//海龜數據
const rescueCase = ref({})

// 捐款成功取一隻海龜邏輯
onMounted(() => {
  backHomeApi.get('savedcases/rescue_get.php').then((response) => {
    //取一隻救援海龜數據
    const randomIndex = Math.floor(Math.random() * response.data.length);
    rescueCase.value = response.data[randomIndex]
  })
})
// 處理圖片路徑 - 使用 Vite 動態 import 處理 assets 圖片
const imageUrl = computed(() => {
  if (!rescueCase.value.imageSrc) {
    return 'https://picsum.photos/300/200'
  } else {
    return APIFileBase + rescueCase.value.imageSrc ;
  }
})




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

const currentStep = ref(1)           //當前step
const donationType = ref('once')     //捐款類型
const selectedAmount = ref(5000)     //選擇金額
const customAmount = ref('')         //自訂金額
const payment = ref('ecpay')         //付款類型
const anonymous = ref(false)         //是否匿名
const loading = ref(false);          //等待狀態
const ecpayForm = ref(null);         //綠界表單
const isSubscription = ref(false)    //是否訂閱
const donationId = ref(0);          //訂單編號
const userBirthYear = computed(() => {  //會員出生年份
  if (!auth.user?.BIRTHDAY) return ''
  return  String(new Date(auth.user.BIRTHDAY).getFullYear())
})
const monthlyDisable = computed(() => {  //定期定額是否禁用
  if (isSubscription.value && donationType.value ==="monthly") {
        return true
      } else {
        return false
      }
})

const form = reactive({
  userName: auth.user?.MEMBER_REALNAME.split(/[（(]/)[0] || '',  //避免google登入有括號
  email: auth.user?.MEMBER_EMAIL ||'',
  phone: auth.user?.MEMBER_PHONE || '',
  birthYear: userBirthYear.value || '',
  identity: auth.user?.ID_NUMBER || '',
  agree: false,
})
const isBlank = reactive({
  userName: false,
  email: false,
  phone: false,
  birthYear: false,
  identity: false,
})
const errors = reactive({
  userName: false,
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

watch(donationType, (newValue) => {
  // 金額預設選中間
  selectedAmount.value = amountOptions[newValue][1];
  // 輸入值為空
  customAmount.value = '';
  errors.customAmount = false;
  //付款切回ecpay
  payment.value = 'ecpay';
})
//在此頁面登入時捐款表單自動填入
watch(() => auth.user, (newValue) => {
  if (auth.isLogin) {//如果是登入才執行
    form.userName = newValue.MEMBER_REALNAME.split(/[（(]/)[0] || '';  //避免google登入有括號
    form.email = newValue.MEMBER_EMAIL ||'';
    form.phone = newValue.MEMBER_PHONE ||'';
    form.birthYear = userBirthYear.value ||'';
    form.identity = newValue.ID_NUMBER ||'';
  }
})

// //localstorage
// const donationState = useLocalStorage('donationState', {
//   currentStep: 1,
//   donationType: 'monthly',
//   finalAmount: 0,
//   rawFinalAmount:0

// })



onMounted( async () => { //進頁面時調api判斷該會員有沒有定期定額，如果有就不能訂閱
  try {
      const res = await backHomeApi.get(`donation/subscription_get.php?member_id=${auth.user?.MEMBER_ID}`)
      // console.log(res.data.data);
      if (res.data.data.length >0) {
        isSubscription.value = true
      }
      
  }catch (error) {
    console.error('API 請求出錯:', error);
    ElMessage.error('無法取得資料，請檢查網路或伺服器狀態');
  }
})

const goStepTwo = async () => {
  loading.value = true;
  try {
    if (!errors.customAmount) { //判斷金額是否正確
      if (auth.isLogin) { //判斷是否登入
          // 前往第二步
          currentStep.value = 2
      } else {
        // 清除重定向，讓用戶登入後停留在當前頁面
        auth.redirectAfterLogin = null
        auth.isModalOpen = true
      }
    }
  }catch (error) {
    console.error('API 請求出錯:', error);
    ElMessage.error('無法取得資料，請檢查網路或伺服器狀態');
  } finally {
    loading.value = false;
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
    A: 10, B: 11, C: 12, D: 13, E: 14, F: 15,
    G: 16, H: 17, I: 34, J: 18, K: 19,
    L: 20, M: 21, N: 22, O: 35, P: 23,
    Q: 24, R: 25, S: 26, T: 27, U: 28,
    V: 29, W: 32, X: 30, Y: 31, Z: 33
  }

  // 英文字母轉兩碼
  const code = city[id[0]].toString().split('').map(Number)

  // 身分證後 9 碼
  const numbers = id.slice(1).split('').map(Number)

  const idNums = code.concat(numbers)

  // ✅ 正確 11 碼權重
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1]

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
      // //先寫入localstorage示意
      // donationState.value.currentStep = 3
      // donationState.value.donationType = donationType.value
      // donationState.value.finalAmount = finalAmount
      // donationState.value.rawFinalAmount = rawFinalAmount

      if (payment.value == "ecpay") { //判斷金流
        ecpayForm.value.submit()
      } else {
        goLinepay()
      }
    }
  } else {
    validateField('userName')
    validateField('email')
    validateField('phone')
    validateField('birthYear')
    validateField('identity')
    let hasError = Object.values(errors).some(v => v)
    let hasBlank = Object.values(isBlank).some(v => v)
    if (!hasError && !hasBlank && !errors.agree) {
      // //先寫入localstorage示意
      // donationState.value.currentStep = 3
      // donationState.value.donationType = donationType.value
      // donationState.value.finalAmount = finalAmount
      // donationState.value.rawFinalAmount = rawFinalAmount
      if (payment.value == "ecpay") { //判斷金流
        // ecpayCrypto() //在前端寫加密檢查碼
        ecpayForm.value.submit()
      } else {
        goLinepay()
      }
    }
  }

}







const goLinepay = async () => {
  loading.value = true;
  try {
    const orderData = {
      amount: rawFinalAmount.value,
      productName: '單次捐款',
    };

    const response = await linepay.createOrder(orderData);
    
    // 檢查後端是否成功回傳 LINE Pay 的支付網址
    if (response.data && response.data.paymentUrl) {
      // 關鍵動作：導向 LINE Pay 官方付款頁面
      console.log(response.data.paymentUrl);
      
      window.location.href = response.data.paymentUrl;
    } else {
      alert('無法取得付款連結，請稍後再試');
    }
  } catch (error) {
    console.error('結帳發生錯誤:', error);
    alert('伺服器連線失敗');
  } finally {
    loading.value = false;
  }
};




</script>

<template>
  <div class="donation-card">
    <downloadReceipt ref="modalRef" :donationId="donationId" :finalAmount="finalAmount"/>
    <div class="stepper">
      <div class="progress-line">
        <div class="progress-fill" :style="{ width: ((currentStep - 1) / 2) * 100 + '%' }"></div>
      </div>
      <div v-for="s in 3" :key="s" :class="['step-item', { active: currentStep >= s }]">
        <div class="dot"></div>
        <span class="label">{{ stepLabels[s - 1] }}</span>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="currentStep === 1" class="step-content">
        <div class="tab-group">
          <button @click="donationType = 'once'" class="tabBtn" :class="{ 'tabBtn-outline': donationType !== 'once' }"
            style="border-left: none;">單次捐款</button>
          <button @click="donationType = 'monthly'" class="tabBtn"
            :class="{ 'tabBtn-outline': donationType !== 'monthly' }" style="border-right: none;" >每月捐款</button>
        </div>

        <p class="intro-text">
          您的每一份支持，都是海龜重返海洋的生機；用專業的行動，將關懷轉化為守護力量。
        </p>

        <div class="amount-grid">
          <MyButton v-for="amt in activeAmountOptions" :key="amt"
            @click="selectedAmount = amt; customAmount = ''; errors.customAmount = false" class=" btn-xxl"
            :class="{ 'btn-outline': selectedAmount !== amt }" height="76px" width="30%">${{ amt.toLocaleString() }}
          </MyButton>
        </div>

        <div class="input-wrapper">
          <input v-model="customAmount" type="number" placeholder="其他金額" @input="selectedAmount = null"
            @blur="isGreater" />
          <p v-if="donationType === 'once'" class="error-msg" v-show="errors.customAmount">
            <span class="material-symbols-outlined">
              error
            </span> 最低捐款金額為:300
          </p>
          <p v-if="donationType === 'monthly'" class="error-msg" v-show="errors.customAmount">
            <span class="material-symbols-outlined">
              error
            </span>最低捐款金額為:100
          </p>
        </div>

        <div class="payment-selection">
          <span>選擇付款方式：</span>
          <label>
            <input type="radio" v-model="payment" value="ecpay"> 綠界金流(信用卡)
          </label>
          <Transition name="fade">
            <label v-if="donationType === 'once'">
              <input type="radio" v-model="payment" value="linepay"> Line Pay行動支付
            </label>
          </Transition>
        </div>
        <MyButton v-if="monthlyDisable" class=" btn-xxl dis" width="50%" :disabled="true">已訂閱</MyButton>
        <MyButton v-else @click="goStepTwo" class=" btn-xxl" width="50%" :disabled="loading">我要捐款</MyButton>
      </div>

    </Transition>
    <Transition name="fade">
      <div v-if="currentStep === 2" class="step-content">
        <div class="summary-header">
          <h3 class="type-tag">{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</h3>
          <p class="amount-display">新台幣 <span class="money">{{ finalAmount }}</span></p>
          <div class="btn-back-group" @click="currentStep = 1; anonymous = false">
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

          <div class="form-group" v-if="anonymous === false" v-for="field, index in formFields" :key="field.id">
            <input :id="field.id" :type="field.type" placeholder=" " class="form-input" @blur="validateField(field.id)"
              v-model="form[field.id]" :ref="el => inputs[index] = el"
              @keydown.enter.prevent="focusNext(index, field.id)">
            <label :for="field.id">{{ field.label }}</label>
            <p class="error-msg" v-if="isBlank[field.id]">
              <span class="material-symbols-outlined">
                error
              </span>請填入{{ field.label }}
            </p>
            <p class="error-msg" v-if="errors[field.id]">
              <span class="material-symbols-outlined">
                error
              </span>{{ field.label }}格式有誤
            </p>
          </div>
          <div class="form-group" v-if="anonymous === true">
            <input type="text" placeholder="善心人士" class="form-input" disabled>
          </div>

          <div class="form-group" v-if="anonymous === true">
            <input id="email" type="email" placeholder=" " class="form-input" @blur="validateField('email')"
              v-model="form.email">
            <label for="email">電子郵件</label>
            <p class="error-msg" v-if="isBlank.email">
              <span class="material-symbols-outlined">
                error
              </span>請填入電子郵件
            </p>
            <p class="error-msg" v-if="errors.email">
              <span class="material-symbols-outlined">
                error
              </span>電子郵件格式有誤
            </p>
          </div>
          <div class="policy-group">
            <label class="checkbox-label policy">
              <input type="checkbox" v-model="form.agree" @click="errors.agree = false">

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
              </span>您尚未同意保護政策
            </p>

          </div>
        </div>
        <!-- <form v-if="payment== 'ecpay'" id="ecpayForm" class="payForm" method="post" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5">
              <input type="hidden" name="MerchantID" value="3002607">
              <input type="hidden" name="MerchantTradeNo" id="MerchantTradeNo" value="">
              <input type="hidden" name="MerchantTradeDate" id="MerchantTradeDate" value="">
              <input type="hidden" name="PaymentType" value="aio">
              <input type="hidden" name="TotalAmount" :value="rawFinalAmount">
              <input type="hidden" name="TradeDesc" :value="donationType">
              <input type="hidden" name="ItemName" value="捐款金額">
              <input type="hidden" name="ReturnURL" value="https://tibamef2e.com/cjd102/g3/front/donation">
              <input type="hidden" name="ChoosePayment" value="Credit">
              <input type="hidden" name="EncryptType" value="1">
              <input type="hidden" name="IgnorePayment" value="WeiXin#TWQR#BNPL#CVS#BARCODE#ATM#WebATM">
              <input type="hidden" name="ClientBackURL" value="https://tibamef2e.com/cjd102/g3/front/donation">
              <input type="hidden" name="CheckMacValue" id="CheckMacValue" value="">
              <MyButton @click.prevent="goDonate" class=" btn-xxl" width="50%" >立即捐款</MyButton>
          </form> -->
        <form v-if="payment== 'ecpay'" id="ecpayForm" class="payForm" ref="ecpayForm" method="post" :action="APIBase +'donation/epay.php'">
              <input type="hidden" name="UseEcpay" value="ecpay">
              <input type="hidden" name="CustomField1" :value="auth.user?.MEMBER_ID">
              <input type="hidden" name="CustomField2" :value="donationType">
              <input type="hidden" name="TotalAmount" :value="rawFinalAmount">
              <input type="hidden" name="TradeDesc" :value="donationType">
              <input type="hidden" name="ItemName" value="捐款金額">
              <MyButton @click.prevent="goDonate"  class=" btn-xxl" width="50%" >立即捐款</MyButton>
          </form>
        <form v-else id="linepayForm" class="payForm" method="post" action="">
              <MyButton @click.prevent="goDonate" :disabled="loading" class=" btn-xxl" width="50%" >立即捐款</MyButton>
          </form>
      </div>

    </Transition>
    <Transition name="fade">
      <div v-if="currentStep === 3" class="step-content">
        <div class="success-page">
          <h2 class="success-title">捐款成功</h2>
          <p class="success-desc">
            感謝您捐款 [{{ finalAmount }}] 支持海龜保育計畫。您的這筆款項將直接用於海龜的醫療救援與棲地維護。
            我們承諾將每一分錢透明、高效地運用。正式的電子收據請您留意查收。
            再次感謝您的信任與行動！
          </p>

          <div class="info-card">
            <p class="card-title">捐款摘要</p>
            <p><strong>捐款金額：</strong>新台幣 <span>{{ finalAmount }}</span></p>
            <p><strong>捐款類型：</strong>{{ donationType === 'monthly' ? '每月捐款' : '單次捐款' }}</p>
            <p><strong>捐款時間：</strong>{{ nowTime }}</p>
          </div>

          <div class="photo-box">
            <img :src="imageUrl" alt="Sea Turtle">
            <div class="caption">您的支持正讓「{{ rescueCase.name }}」這樣的海龜獲得重生。</div>
          </div>
          <MyButton @click="modalRef?.openModal" class=" btn-xxl" width="50%">下載收據</MyButton>
        </div>
      </div>

    </Transition>
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
  top: clamp(65px, 6vw, 85px); //到時候根據header高度做調整
  width: 100%;
  padding-bottom: 12px;
  border: 2px solid $secondary-color;
  background-color: $card-color;

  /* 進入和離開的過程：設置 0.5 秒的透明度變化 */
  .fade-enter-active {
    transition: opacity 0.5s ease;
  }

  /* 隱藏狀態：透明度為 0 */
  .fade-enter-from {
    opacity: 0;
  }

  @media (768px<=width) {
    overflow-y: auto;
    max-height: calc(100vh - clamp(84px, 8vw, 100px));

    //firefox卷軸樣式
    scrollbar-width: thin;
    /* 寬度：auto, thin, 或 none */
    scrollbar-color: $primary-color $secondary-color;
    /* 滑塊顏色 軌道顏色 */


    //其他瀏覽器卷軸樣式
    /* 1. 定義捲軸整體的寬度 */
    &::-webkit-scrollbar {
      width: 8px;
      /* 垂直捲軸寬度 */
    }

    /* 2. 定義捲軸軌道 (底色) */
    &::-webkit-scrollbar-track {
      background: $secondary-color;
    }

    /* 3. 定義滑塊 (手柄部分) */
    &::-webkit-scrollbar-thumb {
      background: $primary-color;
      border-radius: 10px;
    }

  }
}

// 步驟條樣式
.stepper {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  position: relative;

  .progress-line {
    position: absolute;
    top: 24px;
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
      transform: translate(0, 2px);
    }

    .label {
      @include font-body;
      color: $text-color;
    }

    &.active {
      .dot {
        background-color: $primary-color;
      }
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
  margin-bottom: 20px;

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
  width: 90%;
  text-align: center;
  @include font-tertiary;
  margin-bottom: 32px;
  // padding: 0 10px;
}

// 金額按鈕網格
.amount-grid {
  width: 90%;
  display: flex;
  justify-content: space-between;
  gap: 3%;
  margin-bottom: 32px;

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
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  /* 進入和離開的過程：設置 0.5 秒的透明度變化 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }

  /* 隱藏狀態：透明度為 0 */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

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
        background-clip: content-box;
        /* 讓顏色只填在中間，不會碰到邊框 */
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
    grid-area: tag;
  }

  .amount-display {
    @include font-secondary;
    color: $primary-color;
    grid-area: amount;

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
    grid-area: back;
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

  @media (width<=768px) {
    gap: 12px;
  }

  .form-group {
    position: relative;

    label {
      position: absolute;
      @include font-body;
      left: 10px;
      top: 12px;
      /* 預設位置在 input 中間 */
      color: #3338;
      pointer-events: none;
      /* 重要：點擊標籤時要能穿透點到 input */
      transition: all 0.2s ease;
      /* 平滑動畫 */
    }

    .form-input {
      width: 100%;
      padding: 12px;
      height: 48px;
      border: 1px solid $input-line-color1;
      background: transparent;
      box-sizing: border-box;

      // 當 input 獲得焦點，或是內容不為空時
      &:focus+label,
      &:not(:placeholder-shown)+label {
        top: -2px;
        /* 往上移動 */
        left: 8px;
        /* 微調左邊距 */
        @include font-caption;
      }



      &:disabled {
        background-color: #D9D9D9;
        cursor: no-drop;

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
      display: none;
      /* 隱藏原始checkbox */
    }

    &.policy {
      line-height: 1.4;
      margin-bottom: 5px;
      align-items: flex-start;
    }
  }
}
.payForm {
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
    margin-bottom: 8px;
  }
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

  img {
    width: 100%;
    display: block;
  }

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