<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { backHomeApi,APIBase } from '@/utils/publicApi'
import TabSwitcher from '@/components/TabSwitcher.vue'
import Button from '@/components/auth/Button.vue'
import Pagination from '@/components/Pagination.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue';
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()



const isLightboxOpen = ref(false);
const activeType = ref('');
const selectedDonation = ref(null);
const ecpayForm = ref(null);
const amount = ref("");
const newestDate = ref("")

// --- API 資料儲存 ---
const subscriptionRecords = ref([]); // 歷史紀錄：定期定額
const singleRecords = ref([]);       // 歷史紀錄：單筆捐款
const activeSubscription = ref(null); // 進行中的定期計畫 (卡片用)

const currentTab = ref('single') 
const currentPage = ref(1)
const pageSize = 5 

const donationTabs = [
  { label: '單筆捐款', value: 'single' },
  { label: '定期定額', value: 'subscription' }
]

// --- 取得並轉換資料 ---
const fetchData = async () => {
  try {
    // 從 localStorage 取得 token (使用正確的鍵名)
    const token = localStorage.getItem('bh_front_token');
    
    if (!token) {
      console.error('未登入，請先登入');
      // 可以選擇重定向到首頁或顯示登入提示
      router.push('/');
      return;
    }

    // 1. 抓取所有捐款歷史 (auth_donation_list.php)
    const historyRes = await backHomeApi.get(`member/auth_donation_list.php?member_id=${auth.user?.MEMBER_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const historyData = historyRes.data;
    
    const formatRecord = (item) => {
      const dateObj = new Date(item.DONATION_DATE);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return {
        id: item.DONATION_ID,
        month: months[dateObj.getMonth()],
        day: String(dateObj.getDate()).padStart(2, '0'),
        amount: item.AMOUNT,
        fullDate: item.DONATION_DATE.split(' ')[0].replace(/-/g, '.'),
        payType: item.PAYMENT_METHOD,
        orderId: item.TRANSACTION_ID,
        donor: auth.user.name, 
        payMonth: `${dateObj.getMonth() + 1}月`
      };
    };

    // 依據類型分類並轉換格式
    subscriptionRecords.value = historyData
      .filter(d => d.DONATION_TYPE === '定期定額')
      .map(formatRecord);
    singleRecords.value = historyData
      .filter(d => d.DONATION_TYPE === '單次捐款')
      .map(formatRecord);

    // 2. 抓取進行中的定期計畫 (auth_subscription_list.php)
    const activeRes = await backHomeApi.get(`member/auth_subscription_list.php?member_id=${auth.user?.MEMBER_ID}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const activeData = activeRes.data;
    // 取得第一筆狀態為 1 的計畫
    activeSubscription.value = activeData.length > 0 ? activeData[0] : null;

  } catch (err) {
    console.error("資料抓取失敗:", err);
  }
};

onMounted(fetchData);

onMounted( async () => {
  try {
    const response = await backHomeApi.get(`donation/newestSubscription_get.php?member_id=${auth.user?.MEMBER_ID}`);
    if (response.data?.data?.DONATION_DATE) {
      newestDate.value = response.data.data.DONATION_DATE.split(' ')[0];
    }
  } catch (e){
    console.error(e);
  }
})

// 開啟燈箱
const openLightbox = (type, data = null) => {
  activeType.value = type;
  selectedDonation.value = data;
  isLightboxOpen.value = true;
};

// 處理燈箱確定動作 (正式對接 Update API)
const handleLightboxConfirm = async (updatedData) => {
  // 取得當前計畫的 ID
  const subId = activeSubscription.value?.SUBSCRIPTION_ID;
  amount.value = updatedData.newAmount;

  const token = localStorage.getItem('bh_front_token');

  if (!token) {
    console.error('未登入，請先登入');
    router.push('/');
    return;
  }

  if (activeType.value === 'terminate') {
    try {
      const response = await backHomeApi.post('/donation/stop_subscription.php', {
      member_id : auth.user?.MEMBER_ID
    },
    {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
      if (response.data.status === 'success') {
        isLightboxOpen.value = false;
        await fetchData(); // 立即重新抓取資料，卡片會消失
        setTimeout(() => {
          activeType.value = 'terminateSuccess';
          isLightboxOpen.value = true;
        }, 300);
      }
    } catch (err) { console.error("終止失敗", err); }

  } else if (activeType.value === 'editAmount') {//先終止原本的定期定額再重新送一份
    try {
      const response = await backHomeApi.post('/donation/stop_subscription.php', {
      member_id : auth.user?.MEMBER_ID
    },
    {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.status === 'success') {
      ecpayForm.value.submit();
      isLightboxOpen.value = false;
      await fetchData(); // 💡 重新抓取資料，卡片金額會立刻更新
        setTimeout(() => {
          activeType.value = 'editAmountSuccess';
          isLightboxOpen.value = true;
        }, 300);
    }
    //   const res = await fetch('http://localhost:8888/api/member/auth_donation_update.php', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       subscriptionId: subId,
    //       action: 'updateAmount',
    //       amount: updatedData.newAmount // 💡 改成 newAmount，才會對應到燈箱的輸入框
    //     })
    //   });
    //   const result = await res.json();
    //   if (result.status === 'success') {
    //     isLightboxOpen.value = false;
    //     await fetchData(); // 💡 重新抓取資料，卡片金額會立刻更新
    //     setTimeout(() => {
    //       activeType.value = 'editAmountSuccess';
    //       isLightboxOpen.value = true;
    //     }, 300);
    //   }
    } catch (err) { console.error("修改金額失敗", err); }
  }
};

const nextDonate = computed(() =>{  //先有最近扣款日
    const lastDate = new Date(newestDate.value);
    
    // 取得原本設定的「扣款日」（例如 31 號）
    const dayOfSubscription = lastDate.getDate();
    
    // 取得下一個月的年份與月份
    let nextYear = lastDate.getFullYear();
    let nextMonth = lastDate.getMonth() + 1; // getMonth() 是 0-11，所以 +1 代表下個月

    // 如果超過 12 月，年份加 1，月份重設為 0 (1月)
    if (nextMonth > 11) {
        nextYear++;
        nextMonth = 0;
    }

    // 關鍵邏輯：
    // new Date(year, month + 1, 0) 會回傳該月的最後一天
    const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0).getDate();

    // 依照規則：若下個月天數不足，則採最後一天；否則採原定扣款日
    const nextChargeDay = Math.min(dayOfSubscription, lastDayOfNextMonth);

    const nextDate = new Date(nextYear, nextMonth, nextChargeDay);

    // 格式化輸出為 YYYY-MM-DD
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const d = String(nextDate.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
})

const freq = computed(()=> {
  return new Date(newestDate.value).getDate();
})


// 分頁與導航邏輯
const totalPages = computed(() => {
  const data = currentTab.value === 'subscription' ? subscriptionRecords.value : singleRecords.value;
  return Math.ceil(data.length / pageSize);
})

const pagedRecords = computed(() => {
  const data = currentTab.value === 'subscription' ? subscriptionRecords.value : singleRecords.value;
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
})

const goToPage = (page) => {
  currentPage.value = page
  router.push({ query: { section: route.query.section || 'donation', tab: currentTab.value, page: page === 1 ? undefined : page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(currentTab, () => {
  currentPage.value = 1
  // 只在當前 section 是 donation 時才更新 URL
  if (route.query.section === 'donation') {
    router.push({ query: { section: 'donation', tab: currentTab.value, page: undefined } })
  }
})

watch(() => route.query, (newQuery) => {
  if (newQuery.tab && newQuery.tab !== currentTab.value) {
    currentTab.value = newQuery.tab
  }
  if (newQuery.page) {
    currentPage.value = parseInt(newQuery.page)
  } else if (!newQuery.tab) {
    // 如果沒有 tab 參數，表示切換到其他主分頁，重置狀態
    currentTab.value = 'single'
    currentPage.value = 1
  }
}, { immediate: true })

</script>

<template>
  <div class="container">
    <form :action="APIBase +'donation/epay.php'" ref="ecpayForm" v-show="false" method="post">
      <input type="hidden" name="UseEcpay" value="ecpay">
      <input type="hidden" name="CustomField1" :value="auth.user?.MEMBER_ID">
      <input type="hidden" name="CustomField2" value="monthly">
      <input type="hidden" name="TotalAmount" :value="amount">
      <input type="hidden" name="TradeDesc" value="monthly">
      <input type="hidden" name="ItemName" value="捐款金額">
    </form>
    <TabSwitcher v-model="currentTab" :tabs="donationTabs">
        
        <template v-if="currentTab === 'subscription'">
          <div v-if="activeSubscription" class="subscription-status-card">
            <div class="status-grid">
              <div class="grid-item status-box">
                <span class="label">狀態:</span>
                <div class="status-content">
                  <span class="material-symbols-outlined status-icon">calendar_month</span>
                  <span class="status-text">進行中</span>
                </div>
              </div>
              <div class="grid-item info-column">
                <p>定期定額編號：{{ activeSubscription.SUBSCRIPTION_ID }}</p>
                <p>開始日期：{{ activeSubscription.START_DATE.replace(/-/g, '.') }}</p>
              </div>
              <div class="grid-item info-column">
                <p>扣款週期：每月</p>
                <p>每期金額：${{ activeSubscription.AMOUNT }}</p>
              </div>
              <div class="grid-item info-column">
                <p>最近扣款日：{{newestDate}}</p>
                <p>下次扣款日：{{nextDonate}}</p>
              </div>
            </div>
          </div>
          
          <div v-if="activeSubscription" class="action-buttons">
            <Button variant="primary" @click="openLightbox('editAmount', activeSubscription)">修改金額</Button>
            <Button variant="outline" @click="openLightbox('terminate', activeSubscription)">終止捐款</Button>
          </div>

          <div v-else class="no-subscription-msg">
            <p>目前沒有進行中的定期定額計畫。</p>
          </div>
        </template>

        <div class="history-list">
          <div v-for="record in pagedRecords" :key="record.id" class="history-item">
            <div class="item-date">
              <span class="month">{{ record.month }}</span>
              <span class="day">{{ record.day }}</span>
            </div>

            <div class="timeline-visual">
              <div class="timeline-line"></div>
              <div class="timeline-dot"></div>
            </div>

            <div class="item-content">
              <div v-if="currentTab === 'subscription'" class="item-info">
                <p>金流類型：{{ record.payType }}</p>
                <p>扣款月份：{{ record.payMonth }}</p>
                <p>扣款金額：${{ record.amount }}</p>
                <p>扣款日期：{{ record.fullDate }}</p>
                <p>狀態：<span class="status-success">成功</span></p>
              </div>
              
              <div v-else class="item-info">
                <p>捐款編號：{{ record.orderId }}</p>
                <p>金流類型：{{ record.payType }}</p>
                <p>捐款人：{{ record.donor }}</p>
                <p>捐款日期：{{ record.fullDate }}</p>
              </div>
              
              <div class="item-badge">
                <span class="amount-tag">捐款金額: ${{ record.amount }}</span>
              </div>
            </div>
          </div>
        </div>

        <Pagination
          v-if="totalPages > 1"
          class="col-sm-4"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-change="goToPage"
        />
    </TabSwitcher>

    <MemberLightbox 
      v-model="isLightboxOpen" 
      :type="activeType" 
      :initialData="selectedDonation"
      :amount="activeSubscription?.AMOUNT"
      :freq="freq"
      @confirm="handleLightboxConfirm"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

// 原有的樣式保持不變，額外增加無資料時的樣式
.no-subscription-msg {
  text-align: center;
  padding: rem(40px);
  background: #f9f9f9;
  border-radius: rem(8px);
  margin: rem(24px) 0;
  color: $secondary-color;
}

/* ... 以下為你原本提供的所有樣式內容 ... */
.container {
  max-width: rem(1200px);
  margin: 0 auto;
  padding: 0 rem(20px);
}
// (樣式太長，這裡省略，請保留你原本 style 標籤內的所有內容)
</style>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.container {
  max-width: rem(1200px);
  margin: 0 auto;
  padding: 0 rem(20px);
}

.subscription-status-card {
  background-color: #DDE8E8; 
  /* 壓縮高度至 rem(20px) 上下 padding */
  padding: rem(20px) rem(32px); 
  margin-top: rem(24px);
  width: 100%;
  
  .status-grid {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-box {
    .label { 
      font-size: $m-size-caption; // 使用 12px 作為小標籤
      color: $text-color;
      margin-bottom: rem(4px); 
    }
    .status-content {
      display: flex;
      align-items: center;
      gap: rem(8px);
      
      .status-icon { 
        font-size: $d-size-primary; // 引用新變數：36px
        color: $primary-color;
      }
      .status-text { 
        font-size: $d-size-tertiary; // 引用新變數：24px
        font-weight: 700;
        color: $primary-color;
      }
    }
  }

  .no-subscription-msg {
  text-align: center;
  padding: rem(40px);
  background: #f9f9f9;
  border-radius: rem(8px);
  margin: rem(24px) 0;
  color: $secondary-color;
}

  .info-column {
    padding-left: rem(24px);
    /* 細線顏色引用 $input-line-color1 */
    border-left: 1px solid $input-line-color1; 
    
    p {
      font-size: $size-body; // 引用 16px 標準字
      line-height: 1.6;
      color: $text-color;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: rem(12px);
  margin-top: rem(16px);
  margin-bottom: rem(48px);
}

.history-list {
  width: 100%;
  margin-top: rem(20px);

  .history-item {
    display: flex;
    /* 移除 item 本身的 border-bottom，改用 timeline-line 處理視覺 */
    position: relative;
    padding-bottom: rem(24px); 
  }

  /* 日期文字 */
  .item-date {
    width: rem(60px);
    text-align: center;
    padding-top: rem(10px);

    .month {
      display: block;
      font-size: $m-size-caption; // 12px
      color: $secondary-color;
      font-weight: 700;
      line-height: 1;
    }
    .day {
      font-size: $d-size-tertiary; // 24px
      font-weight: 900;
      color: $primary-color;
      line-height: 1.2;
    }
  }

  /* 視覺裝飾線與圓點 */
  .timeline-visual {
    position: relative;
    width: rem(40px); // 控制日期與文字間的距離
    display: flex;
    justify-content: center;

    .timeline-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 1px;
      background-color: $secondary-color; // 使用二級主色
    }

    
  }

  /* 內容區域 */
  .item-content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: rem(16px);
    /* 橫向分隔細線 */
    border-bottom: 1px solid $secondary-color; 
    padding-top: rem(10px);
  }

  .item-info {
    p {
      font-size: $size-body; // 16px
      color: $text-color;
      margin-bottom: rem(4px);
    }
    .status-success {
      color: $secondary-color;
    }
  }

  /* 金額標籤樣式 */
  .item-badge {
    .amount-tag {
      background-color: $card-color; // 使用 $card-color (#CFDEE0) 淡青色背景
      color: $secondary-color;      // 文字使用二級主色
      padding: rem(4px) rem(16px);
      border-radius: rem(20px);
      font-size: $d-size-caption;   // 14px
      font-weight: 500;
    }
  }
}
// 手機板 RWD
@media (max-width: 768px) {
  .subscription-status-card {
    padding: rem(16px) rem(12px);
    
    .status-grid {
      flex-direction: column;
      gap: rem(12px);
    }

    .status-box,
    .info-column {
      width: 100%;
      padding-left: 0;
      border-left: none;
      border-top: 1px solid $input-line-color1;
      padding-top: rem(12px);
    }
  }

  .action-buttons {
    flex-direction: column;
    gap: rem(8px);
    
    button {
      width: 100%;
    }
  }

  .history-list {
    .history-item {
      flex-direction: column;
      padding-bottom: rem(16px);
    }

    .item-date {
      width: 100%;
      margin-bottom: rem(12px);
      text-align: left;
    }

    .timeline-visual {
      display: none;
    }

    .item-content {
      flex-direction: column;
      align-items: flex-start;
      border-bottom: 1px solid $secondary-color;
      padding-top: 0;
      padding-bottom: rem(12px);
    }

    .item-info {
      width: 100%;
      margin-bottom: rem(12px);
    }

    .item-badge {
      width: 100%;
    }
  }
}
</style>