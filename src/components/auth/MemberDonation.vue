<script setup>
import { ref, computed, watch } from 'vue'
import TabSwitcher from '@/components/TabSwitcher.vue'
import Button from '@/components/auth/Button.vue'
import Pagination from '@/components/Pagination.vue'
import MemberLightbox from '@/components/auth/MemberLightbox.vue';

const isLightboxOpen = ref(false);
const activeType = ref('');
const selectedDonation = ref(null);

// 開啟燈箱
const openLightbox = (type, data = null) => {
  activeType.value = type;
  selectedDonation.value = data;
  isLightboxOpen.value = true;
};

// 處理確定終止
const handleLightboxConfirm = () => {
  if (activeType.value === 'terminate') {
    console.log('正在向後端發送終止請求，捐款編號：', selectedDonation.value?.id);
    
    isLightboxOpen.value = false;
    setTimeout(() => {
      activeType.value = 'terminateSuccess';
      isLightboxOpen.value = true;
    }, 300);
  } else if (activeType.value === 'editAmount') {
    console.log('修改金額成功');
    
    isLightboxOpen.value = false;
    setTimeout(() => {
      activeType.value = 'editAmountSuccess';
      isLightboxOpen.value = true;
    }, 300);
  }
};

const currentTab = ref('single') 
const currentPage = ref(1)
const pageSize = 5 // 每頁顯示 5 筆

const donationTabs = [
  { label: '單筆捐款', value: 'single' },
  { label: '定期定額', value: 'subscription' }
]

// 模擬大量資料以測試分頁
const subscriptionData = ref(Array.from({ length: 12 }, (_, i) => ({
  id: i + 1, 
  month: 'DEC', 
  day: '29', 
  payMonth: `${12 - (i % 12)}月`, 
  amount: '2000', 
  fullDate: '2025.12.29',
  payType: '信用卡' 
})))

const singleData = ref(Array.from({ length: 15 }, (_, i) => ({
  id: 100 + i, month: 'DEC', day: '29', orderId: `SN${123456 + i}`, payType: '信用卡', donor: '王曉明', fullDate: '2025.12.29', amount: '2000'
})))

// 修正：計算當前 Tab 的總頁數
const totalPages = computed(() => {
  const data = currentTab.value === 'subscription' ? subscriptionData.value : singleData.value
  return Math.ceil(data.length / pageSize)
})

// 修正：根據當前頁碼切割數據 (Slice)
const pagedRecords = computed(() => {
  const data = currentTab.value === 'subscription' ? subscriptionData.value : singleData.value
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return data.slice(start, end)
})

const goToPage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 修正：切換 Tab 時重置頁碼
watch(currentTab, () => {
  currentPage.value = 1
})

</script>

<template>
  <div class="container">
    <TabSwitcher v-model="currentTab" :tabs="donationTabs">
        
        <template v-if="currentTab === 'subscription'">
          <div class="subscription-status-card">
            <div class="status-grid">
              <div class="grid-item status-box">
                <span class="label">狀態:</span>
                <div class="status-content">
                  <span class="material-symbols-outlined status-icon">calendar_month</span>
                  <span class="status-text">進行中</span>
                </div>
              </div>
              <div class="grid-item info-column">
                <p>定期定額編號：123456</p>
                <p>開始日期：2025.11.29</p>
              </div>
              <div class="grid-item info-column">
                <p>扣款週期：每月</p>
                <p>每期金額：$2000</p>
              </div>
              <div class="grid-item info-column">
                <p>最近扣款日：2025.12.29 (成功)</p>
                <p>下次扣款日：2026.01.29</p>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <Button variant="primary" @click="openLightbox('editAmount')">修改金額</Button>
            <Button variant="outline" @click="openLightbox('terminate', { id: '123456' })">終止捐款</Button>
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
    @confirm="handleLightboxConfirm"
    />
  </div>
</template>

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