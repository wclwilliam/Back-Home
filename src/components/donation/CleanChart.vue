<script setup>
// 從 vue-chartjs 引入圓餅圖組件
import { Pie } from 'vue-chartjs'
// 從 chart.js 引入必要的核心功能
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  CategoryScale 
} from 'chart.js'
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    default: {
        plastic_bottles: 850,
        iron_cans: 1200,
        aluminum_cans: 950,
        waste_paper: 2100,
        glass_bottles: 3400,
        styrofoam: 4200,
        bamboo_wood: 5800,
        ghost_nets_fishing_gear: 12500,
        unclassifiable_waste: 3850
      }
  },
});


// 必須手動註冊 Chart.js 的插件，否則圖表無法顯示
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// 定義圖表的數據內容
const chartData =computed(()=>{
  return{// 對應圖片右側的標籤名稱
  labels: ['寶特瓶', '鐵罐', '鋁罐', '廢紙', '玻璃瓶', '保麗龍', '竹木', '廢漁具漁網', '無法分類廢棄物'],
  datasets: [
    {
      // 根據圖片顏色估算的十六進位色碼
      backgroundColor: [
        '#0B574D', // 寶特瓶 (深綠)
        '#086B9A', // 鐵罐 (深藍)
        '#1F4E79', // 鋁罐 (靛藍)
        '#1A8C9E', // 廢紙 (青色)
        '#5DA9B8', // 玻璃瓶 (淺青)
        '#05323D', // 保麗龍 (墨綠)
        '#457B87', // 竹木 (灰綠)
        '#376470', // 廢漁具漁網 (深灰)
        '#007F6D'  // 無法分類廢棄物 (翠綠)
      ],
      // 根據圖片圓餅區塊比例大致分配的數值
      data: [
        props.data.plastic_bottles,
        props.data.iron_cans,
        props.data.aluminum_cans,
        props.data.waste_paper,
        props.data.glass_bottles,
        props.data.styrofoam,
        props.data.bamboo_wood,
        props.data.ghost_nets_fishing_gear,
        props.data.unclassifiable_waste],
      // 邊框寬度
      borderWidth: 1,
      radius: '70%' ,// 預設 100%
    }
  ]}
  
}) 


// 定義圖表的配置選項
const chartOptions = {
  // 讓圖表隨容器大小縮放
  responsive: true,
  // 不強制維持原始長寬比，以便更靈活地控制尺寸
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 60   // Pie 與右側 legend 的距離
    }
  },
  plugins: {
    // 圖例配置 (對應圖片右側的標籤列表)
    legend: {
      position: 'right', // 圖例放置在右側
      labels: {
        color: '#ffffff', // 字體顏色改為白色以對應深色背景
        font: {
          size: 16 // 字體大小
        },
        padding: 4, // 標籤之間的間距
        boxWidth: 14,
        boxHeight: 14,
      }
    },
    // 圖表標題配置
    title: {
      display: false, // 關閉標題
      text: '清除海洋廢棄物', // 標題文字
      color: '#ffffff', // 標題顏色
      font: {
        size: 24, // 標題字體大小
        weight: 'bold' // 標題加粗
      },
      padding: {
        bottom: 30, // 標題與圖表之間的距離
      }
    },
    // 滑鼠移入時顯示的提示框
    tooltip: {
      enabled: true,
      callbacks: {
        // 在數值後加上 "kg"
        label: (item) => `${item.formattedValue} kg`
      }
    }
  }
}
</script>

<template>
  <div style="width: 100%; height: 200px;">
    <Pie :data="chartData" :options="chartOptions"/>
  </div>
</template>