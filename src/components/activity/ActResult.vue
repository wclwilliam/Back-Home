<script setup>
import { ref, computed, watch } from 'vue'
import { backHomeApi, APIBase } from '@/utils/publicApi'

const props = defineProps({
  activityInfo: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

// 讀取外部 JSON 資料
const currentMetrics = ref([])
const currentPhotos = ref([])
watch(
  () => props.activityInfo.id,
  async (newId) => {
    if (!newId) return
    const metricsUrl = `activity/activity_results_get.php`
    try {
      // 呼叫剛剛寫好的 PHP
      const response = await backHomeApi.get(`${metricsUrl}?activity_id=${newId}`)
      
      if (response.data.status === 'success') {
        const { metrics, photos } = response.data.data
        currentMetrics.value = metrics || []
        currentPhotos.value = photos || []
      }
    } catch (err) {
      console.error('無法讀取成果數據', err)
    }
  },
  { immediate: true } // 確保元件一載入若有 ID 就會執行
)

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

//顯示邏輯 (根據活動類型只顯示特定數據)
const displayItems = computed(() => {
  if (currentMetrics.value.length === 0) return []

  return currentMetrics.value.map((item) => {
    return {
      id: item.METRIC_ID,
    label: item.METRIC_NAME,
    unit: item.METRIC_UNIT,
    value: item.VALUE,
    icon: getIcon(item.METRIC_ID),
    }
  })
})

// 處理照片路徑
const displayPhotos = computed(() => {
  if (currentPhotos.value.length === 0) return []
  return currentPhotos.value.map(photo => ({
    id: photo.PHOTO_ID,
    src: `${APIBase}uploads/actResult/${photo.PHOTO_URL}`, 
    alt: photo.DESCRIPTION || '成果照片'
  }))
})
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
      <p>目前尚無成果數據</p>
    </div>

    <div v-if="displayPhotos.length > 0" class="photo-section">
      <div class="photo-grid">
        <div v-for="photo in displayPhotos" :key="photo.id" class="photo-item">
          <img :src="photo.src" :alt="photo.alt" loading="lazy" />
        </div>
      </div>
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
.photo-section {
  margin-top: 24px;
}
.photo-grid {
  display: grid;
  // justify-content: space-around;
  grid-template-columns: repeat(2, 1fr); // 手機版 2 欄
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr); // 平板 3欄
  }
}
.photo-item {
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
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
