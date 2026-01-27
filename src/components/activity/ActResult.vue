<script setup>
import { ref, computed, watch } from 'vue'
import { publicApi, base } from '@/utils/publicApi'

const props = defineProps({
  activityInfo: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// 1. 定義數據對應表 (METRIC_ID -> 中文標籤)
const resultsMap = {
  0: '參與人數 (人)',
  1: '垃圾重量 (kg)',
  2: '垃圾袋數 (袋)',
  3: '廢棄物件數 (件)',
  4: '塑膠瓶蓋 (個)',
  5: '海龜爬痕 (道)',
  6: '確認卵窩 (窩)',
  7: '目擊母龜 (隻)',
  8: '海龜品種',
  9: '照護海龜 (隻)',
  10: '備餐重量 (kg)',
  11: '清洗水池 (池)',
  12: '整理時數 (hr)',
}

// 讀取外部 JSON 資料
const allResults = ref([])
const url = `${base}data/activityResultData.json`.replace('//', '/')
publicApi
  .get(url)
  .then((res) => {
    allResults.value = res.data
  })
  .catch((err) => console.error('無法讀取成果數據', err))

//根據 activityId 篩選出當前活動的數據
const currentActivityResults = computed(() => {
  if (!props.activityInfo.id || allResults.value.length === 0) return []

  //篩選出符合 ACTIVITY_ID 的資料
  return allResults.value.filter((item) => item.ACTIVITY_ID === props.activityInfo.id)
})

//顯示邏輯 (根據活動類型只顯示特定數據)
const displayItems = computed(() => {
  if (currentActivityResults.value.length === 0) return []

  return currentActivityResults.value.map((item) => {
    return {
      id: item.METRIC_ID,
      label: resultsMap[item.METRIC_ID] || '未知數據',
      value: item.VALUE,
      icon: getIcon(item.METRIC_ID), // 取得對應 icon
    }
  })
})

// 根據 Metric ID 給予 icon 圖片名稱或 class
const getIcon = (id) => {
  // 簡單分類給圖，你可以換成實際圖片路徑
  const iconMap = {
    0: 'group', // 人數
    1: 'scale', // 重量
    2: 'shopping_bag', // 袋子
    3: 'delete', // 廢棄物
    4: 'recycling', // 瓶蓋
    5: 'gesture', // 爬痕
    6: 'egg', // 卵窩
    7: 'visibility', // 目擊
    8: 'tsunami', // 品種
    9: 'medical_services', // 照護
    10: 'restaurant', // 備餐
    11: 'mop', // 水池
    12: 'schedule', // 時數
  }
  return iconMap[id] || 'bar_chart'
}
</script>

<template>
  <div class="act-result-container col-sm-4 col-md-12">
    <div v-if="displayItems.length > 0" class="result-grid">
      <div v-for="item in displayItems" :key="item.id" class="result-card">
        <div class="icon-wrapper">
          <span class="material-symbols-outlined icon">{{ item.icon }}</span>
        </div>
        <div class="text-content">
          <div class="value">{{ item.value }}</div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>數據統計中...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.act-result-container {
  width: 100%;
  margin-bottom: 24px;
}

.result-grid {
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(2, 1fr); // 手機版 2 欄
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr); // 平板 3欄
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr); // 平板以上 4 欄
  }
}

.result-card {
  background-color: $card-color;
  border: 1px solid $game-line-color;
  border-radius: 1px;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  text-align: center;

  .icon-wrapper {
    background-color: #eaf6f6; // 淺綠底
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      font-size: 28px;
      color: #0e6872; // 主色
    }
  }

  .text-content {
    .value {
      font-size: 24px;
      font-weight: bold;
      color: #0e6872;
      margin-bottom: 16px;
    }
    .label {
      font-size: 14px;
      color: #666;
    }
  }
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}
</style>
