<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import gsap from 'gsap'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
// import axios from 'axios'
import { publicApi, backHomeApi } from '@/utils/publicApi'

// 註冊 Chart.js 組件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 從 CSS 變數讀取顏色和字體
const getCSSVariable = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const impactReports = ref([])
const totalRescued = ref(0)
const animatedTotal = ref(0)
const maxTick = ref(1600) // Y軸最大刻度（動態計算）
const tickStep = ref(400) // Y軸刻度間距（動態計算）

// 千分位格式化
const formattedTotal = computed(() => {
  return Math.floor(animatedTotal.value).toLocaleString('en-US')
})

// 圖表數據
// 圖表數據（初始為 0，等到 isVisible 才填入真實數據）
const chartData = ref({ labels: [], datasets: [] })
const realChartData = ref(null) // 暫存真實數據

// 滾動觸發動畫相關
const isVisible = ref(false)
const chartContainerRef = ref(null)
let observer = null

watch(isVisible, (val) => {
  if (val) {
    // Start from 85% of the total value to reduce wait time but keep the "fast" phase visible
    animatedTotal.value = totalRescued.value * 0.95
    gsap.to(animatedTotal, {
      duration: 3,
      value: totalRescued.value,
      ease: 'expo.out', // Exaggerated slow-down at the end
    })

    // 觸發圖表長出來的動畫：填入真實數據
    if (realChartData.value) {
      // 延遲 0.5 秒再長高
      setTimeout(() => {
        chartData.value = realChartData.value
      }, 500)
    }
  }
})

onMounted(async () => {
  try {
    // 嘗試從資料庫 API 抓取資料
    try {
      const dbResponse = await backHomeApi.get('donation/impact_get.php')
      if (Array.isArray(dbResponse.data) && dbResponse.data.length > 0) {
        impactReports.value = dbResponse.data
      } else {
        throw new Error('Database empty or invalid format')
      }
    } catch (apiError) {
      console.warn('API 抓取失敗，改用靜態 JSON 檔案', apiError)
      // 失敗時使用靜態 JSON 作為備案 (Fallback)
      const jsonResponse = await publicApi.get('data/impactReports.json')
      impactReports.value = jsonResponse.data
    }

    // 計算所有歷年總和並向下取整到10位數
    const allYearsTotal = impactReports.value.reduce((sum, item) => {
      return (
        sum +
        (item.core_metrics.total_rescued_turtles || 0) +
        (item.core_metrics.turtles_released || 0)
      )
    }, 0)
    totalRescued.value = Math.floor(allYearsTotal / 10) * 10

    // 圖表顯示近10年數據 (不足10筆就全部顯示)
    const chartYears = [...impactReports.value]
      .sort((a, b) => b.year - a.year) // 依照年份降序 (2025, 2024...)
      .slice(0, 10) // 取前10筆
      .reverse() // 反轉為升序 (..., 2024, 2025) 以便在圖表X軸由左至右顯示

    const labels = chartYears.map((item) => item.year.toString())
    const inTreatment = chartYears.map((item) => item.core_metrics.total_rescued_turtles || 0)
    const released = chartYears.map((item) => item.core_metrics.turtles_released || 0)

    // 計算堆疊後的最大值
    const stackedMax = Math.max(...inTreatment.map((val, i) => val + released[i]))
    // Y軸最大刻度：向上取整到最近的100，但不超過數據最大值太多
    // 找到一個合適的間距，讓刻度線接近數據最大值
    const roundTo = 100
    // 計算比數據最大值稍大的整數（向上取整到100）
    const suggestedMax = Math.ceil(stackedMax / roundTo) * roundTo
    // 計算間距：分成4等份
    tickStep.value = Math.ceil(suggestedMax / 4 / roundTo) * roundTo
    // 最大刻度 = 間距 * 4
    maxTick.value = tickStep.value * 4

    // 更新圖表配置中的 stepSize 和 max
    chartOptions.value.scales.y.ticks.stepSize = tickStep.value
    chartOptions.value.scales.y.max = maxTick.value

    // 以全新物件指派，確保 vue-chartjs 深度偵測到變更
    // 準備真實數據
    realChartData.value = {
      labels,
      datasets: [
        {
          label: '協會治療完成已釋放',
          data: released,
          backgroundColor: getCSSVariable('--secondary-color'),
          borderColor: getCSSVariable('--secondary-color'),
          hoverBackgroundColor: getCSSVariable('--secondary-color'),
          hoverBorderColor: getCSSVariable('--secondary-color'),
          borderWidth: 0,
          stack: 'total',
        },
        {
          label: '協會治療中',
          data: inTreatment,
          backgroundColor: getCSSVariable('--backstage-bar-color'),
          borderColor: getCSSVariable('--backstage-bar-color'),
          hoverBackgroundColor: getCSSVariable('--backstage-bar-color'),
          hoverBorderColor: getCSSVariable('--backstage-bar-color'),
          borderWidth: 0,
          stack: 'total',
        },
      ],
    }

    // 初始化圖表數據：使用 0 值，讓圖表先渲染座標軸
    chartData.value = {
      labels,
      datasets: [
        {
          label: '協會治療完成已釋放',
          data: released.map(() => 0), // 全部設為 0
          backgroundColor: getCSSVariable('--secondary-color'),
          borderColor: getCSSVariable('--secondary-color'),
          hoverBackgroundColor: getCSSVariable('--secondary-color'),
          hoverBorderColor: getCSSVariable('--secondary-color'),
          borderWidth: 0,
          stack: 'total',
        },
        {
          label: '協會治療中',
          data: inTreatment.map(() => 0), // 全部設為 0
          backgroundColor: getCSSVariable('--backstage-bar-color'),
          borderColor: getCSSVariable('--backstage-bar-color'),
          hoverBackgroundColor: getCSSVariable('--backstage-bar-color'),
          hoverBorderColor: getCSSVariable('--backstage-bar-color'),
          borderWidth: 0,
          stack: 'total',
        },
      ],
    }
  } catch (error) {
    console.log(error)
  }

  // 設定 IntersectionObserver
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.2 },
  )

  if (chartContainerRef.value) {
    observer.observe(chartContainerRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// 自定義插件：在軸末端顯示單位
const axisLabelPlugin = {
  id: 'axisLabelPlugin',
  afterDraw: (chart) => {
    const ctx = chart.ctx
    const xAxis = chart.scales.x
    const yAxis = chart.scales.y

    ctx.save()
    ctx.font = `14px ${getCSSVariable('--font-main')}`
    ctx.fillStyle = getCSSVariable('--text-color')
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    // X軸末端顯示「年」
    const xEnd = xAxis.right
    const xY = xAxis.bottom - 18
    ctx.fillText('年', xEnd + 10, xY)

    // Y軸末端顯示「隻」（不旋轉）
    const yTop = yAxis.top
    const yX = yAxis.left + 40
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText('隻', yX, yTop - 20)

    ctx.restore()
  },
}

// 圖表配置
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 40,
      right: 30,
      bottom: 0,
      left: 20,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: false,
        boxWidth: 12,
        boxHeight: 12,
        padding: 15,
        font: {
          size: 16,
          family: getCSSVariable('--font-main'),
        },
        color: getCSSVariable('--text-color'),
        // 自訂圖例樣式：可見的加粗，隱藏的不要刪除線
        generateLabels: (chart) => {
          const datasets = chart.data.datasets
          return datasets.map((ds, i) => {
            const isVisible = chart.isDatasetVisible(i)
            return {
              text: ds.label,
              fillStyle: ds.backgroundColor,
              strokeStyle: ds.borderColor,
              lineWidth: 0,
              hidden: false, // 不使用內建的 hidden 樣式（刪除線）
              datasetIndex: i,
              fontColor: isVisible ? getCSSVariable('--text-color') : 'rgba(128, 128, 128, 0.5)', // 隱藏時變灰
              font: {
                weight: isVisible ? 'bold' : 'normal',
                size: 16,
                family: getCSSVariable('--font-main'),
              },
            }
          })
        },
      },
      // 點擊圖例：只顯示該項（其他隱藏）
      onClick: (e, legendItem, legend) => {
        const chart = legend.chart
        const ci = legendItem.datasetIndex
        const isOnlyVisible = chart.data.datasets.every((ds, i) =>
          i === ci ? chart.isDatasetVisible(i) : !chart.isDatasetVisible(i),
        )

        if (isOnlyVisible) {
          // 如果只有這個可見，則全部顯示
          chart.data.datasets.forEach((ds, i) => {
            chart.setDatasetVisibility(i, true)
          })
        } else {
          // 否則只顯示這個
          chart.data.datasets.forEach((ds, i) => {
            chart.setDatasetVisibility(i, i === ci)
          })
        }
        chart.update()
      },
      // 滑鼠移入圖例時顯示手指游標
      onHover: (e) => {
        e.native.target.style.cursor = 'pointer'
      },
      onLeave: (e) => {
        e.native.target.style.cursor = 'default'
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          family: getCSSVariable('--font-main'),
        },
        color: getCSSVariable('--text-color'),
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: maxTick.value,
      ticks: {
        stepSize: tickStep.value,
        callback: function (value) {
          // 只顯示小於等於 maxTick 的刻度，並加上千分位
          if (value <= maxTick.value) {
            return value.toLocaleString('en-US')
          }
          return null
        },
        font: {
          size: 14,
          family: getCSSVariable('--font-main'),
        },
        color: getCSSVariable('--text-color'),
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  // 調整bar寬度和間距：
  // barPercentage: 控制單個bar相對於分類寬度的比例 (0-1)，值越大bar越寬
  // categoryPercentage: 控制分類相對於可用空間的比例 (0-1)，值越大分類間距越小
  // barThickness: 固定像素寬度，例如 30 就是 30px
  // maxBarThickness: 限制bar的最大寬度，例如 50
  barPercentage: 0.8,
  categoryPercentage: 0.9,
  // 調整動畫速度：持續 2.5 秒，讓長高過程更慢更清楚
  animation: {
    duration: 2500,
    easing: 'easeOutQuart', // 使用更平滑的緩動函數
  },
})
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="savedChart col-lg-7 col-md-12 col-sm-4">
        <div class="chartContainer" ref="chartContainerRef">
          <Bar
            v-if="chartData.datasets.length > 0"
            :data="chartData"
            :options="chartOptions"
            :plugins="[axisLabelPlugin]"
          />
        </div>
      </div>
      <div class="col-lg-5 col-md-12 col-sm-4 circleArea">
        <div class="circleStats">
          <div class="circleDot DotA"></div>
          <div class="circleDot DotB"></div>
          <div class="circleDot DotC"></div>
          <div class="circleDot DotD"></div>
          <div class="circleDot DotE"></div>
          <div class="circleMain">
            <div class="statsDesc top">累積</div>
            <div class="statsNumber">{{ formattedTotal }}<sup>+</sup></div>
            <div class="statsDesc down">隻海龜回到大海</div>
          </div>
        </div>
      </div>
    </div>
    <div class="yellowBadge">治療與野放數量持續增加</div>
  </div>
</template>

<style lang="scss" scoped>
// 定義漂浮動畫 Keyframes
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0px);
  }
}

// 主圓圈用較緩和的漂浮
@keyframes floatSlow {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
}

.container {
  position: relative;

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .savedChart {
    padding: 0 20px;
    background-color: transparent;
    order: 1;

    @media (max-width: 1023px) {
      order: 2;
      display: flex;
      justify-content: center;
    }

    @media (max-width: 575px) {
      padding: 0;
      margin: 0 -10px;
      // 覆蓋 col-sm-4 的限制
      flex: 0 0 calc(100% + 20px) !important;
      max-width: calc(100% + 20px) !important;
      width: calc(100% + 20px);
    }

    .chartContainer {
      width: 100%;
      height: 450px;
      background: $bg-color;

      @media (max-width: 1023px) {
        width: 90%;
        // height: 400px;
      }

      @media (max-width: 767px) {
        width: 100%;
        height: unset; // 明確取消上面的 height
        min-height: 200px; // 設定最小高度避免太扁
        aspect-ratio: 3 / 2;
      }
      @media (max-width: 575px) {
        min-height: 300px; // 設定最小高度避免太扁
        aspect-ratio: unset;
      }
    }
  }

  .circleArea {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 2;

    @media (max-width: 1023px) {
      order: 1;
      padding: 40px 0;
    }
  }

  .circleStats {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;

    .circleDot {
      position: absolute;
      border-radius: 50%;
      animation: float 4s ease-in-out infinite;

      &.DotA {
        width: clamp(40px, 5vw, 65px);
        height: clamp(40px, 5vw, 65px);
        top: -10%;
        right: 15%;
        background-color: lighten($highlight-color1, 12%);
        animation-duration: 3.5s;
        animation-delay: -1.2s;
      }

      &.DotB {
        width: clamp(60px, 7vw, 95px);
        height: clamp(60px, 7vw, 95px);
        top: 45%;
        left: -15%;
        background-color: lighten($highlight-color1, 18%);
        animation-duration: 4.2s;
        animation-delay: -2.8s;
      }

      &.DotC {
        width: clamp(35px, 4vw, 55px);
        height: clamp(35px, 4vw, 55px);
        bottom: 5%;
        right: -5%;
        background-color: darken($highlight-color1, 5%);
        animation-duration: 3.8s;
        animation-delay: -0.5s;
      }

      &.DotD {
        width: clamp(50px, 6vw, 75px);
        height: clamp(50px, 6vw, 75px);
        top: 10%;
        left: 0;
        background-color: lighten($highlight-color1, 8%);
        animation-duration: 4.5s;
        animation-delay: -3.5s;
      }

      &.DotE {
        width: clamp(28px, 3vw, 42px);
        height: clamp(28px, 3vw, 42px);
        bottom: -5%;
        right: 25%;
        background-color: darken($highlight-color1, 10%);
        animation-duration: 3.2s;
        animation-delay: -1.8s;
      }
    }

    .circleMain {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: clamp(280px, 25vw, 350px);
      height: clamp(280px, 25vw, 350px);
      padding: 0 10px;
      border-radius: 50%;
      background-color: rgba($highlight-color1, 0.95);
      animation: floatSlow 5s ease-in-out infinite;
      @media (max-width: 575px) {
        width: 240px;
        height: 240px;
      }

      .statsDesc {
        @include font-tertiary;
        width: 100%;
        color: $primary-color;

        &.top {
          padding-left: 10%;
          padding-bottom: 0.6rem;
        }

        &.down {
          padding-right: 5%;
          text-align: right;
          padding-top: 0.8rem;
        }
      }

      .statsNumber {
        font-size: 68px;
        font-weight: 700;
        color: $text-white;
        line-height: 1;
        margin-bottom: 8px;

        @media (max-width: 575px) {
          font-size: 60px !important;
        }

        sup {
          font-size: 0.5em;
          vertical-align: super;
        }
      }
    }
  }

  .yellowBadge {
    position: absolute;
    top: 5%;
    right: 2%;
    z-index: 10;
    @include font-tertiary;
    padding: 20px 40px;
    border-radius: 30px;
    background-color: $highlight-color3;

    @media (max-width: 767px) {
      top: 0%;
      padding: 16px 28px;
      border-radius: 24px;
    }

    @media (max-width: 575px) {
      padding: 12px 20px;
      border-radius: 16px;
    }
  }
}
</style>
