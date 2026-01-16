<script setup>
import { ref, onMounted, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import axios from 'axios'

// 註冊 Chart.js 組件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// 從 CSS 變數讀取顏色和字體
const getCSSVariable = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const impactReports = ref([])
const totalRescued = ref(0)
const maxTick = ref(1600) // Y軸最大刻度（動態計算）
const tickStep = ref(400) // Y軸刻度間距（動態計算）

// 千分位格式化
const formattedTotal = computed(() => {
  return totalRescued.value.toLocaleString('en-US')
})

// 圖表數據
const chartData = ref({ labels: [], datasets: [] })

onMounted(async () => {
  try {
    const base = import.meta.env.BASE_URL
    const response = await axios.get(base + 'data/impactReports.json')
    impactReports.value = response.data

    // 計算所有歷年總和（包含2014年開始的所有數據）並向下取整到10位數
    const allYearsTotal = impactReports.value.reduce((sum, item) => {
      return (
        sum +
        (item.core_metrics.total_rescued_turtles || 0) +
        (item.core_metrics.hatchlings_guided_to_sea || 0)
      )
    }, 0)
    totalRescued.value = Math.floor(allYearsTotal / 10) * 10

    // 圖表只顯示2016年之後的近10年數據
    const chartYears = [...impactReports.value]
      .filter((item) => item.year >= 2016)
      .sort((a, b) => b.year - a.year)
      .slice(0, 10)
      .reverse()

    const labels = chartYears.map((item) => item.year.toString())
    const inTreatment = chartYears.map((item) => item.core_metrics.total_rescued_turtles || 0)
    const released = chartYears.map((item) => item.core_metrics.hatchlings_guided_to_sea || 0)

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
    chartData.value = {
      labels,
      datasets: [
        {
          label: '協會治療完成已釋放',
          data: released,
          backgroundColor: getCSSVariable('--secondary-color'),
          borderColor: getCSSVariable('--secondary-color'),
          borderWidth: 0,
          stack: 'total',
        },
        {
          label: '協會治療中',
          data: inTreatment,
          backgroundColor: getCSSVariable('--backstage-bar-color'),
          borderColor: getCSSVariable('--backstage-bar-color'),
          borderWidth: 0,
          stack: 'total',
        },
      ],
    }
  } catch (error) {
    console.log(error)
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
          size: 14,
          family: getCSSVariable('--font-main'),
        },
        color: getCSSVariable('--text-color'),
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
          // 只顯示小於等於 maxTick 的刻度
          if (value <= maxTick.value) {
            return value
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
})
</script>

<template>
  <div class="container">
    <h2 class="chartTitle">我們已經幫助了......</h2>
    <div class="row">
      <div class="savedChart col-lg-7 col-md-12 col-sm-12">
        <div class="chartContainer">
          <Bar :data="chartData" :options="chartOptions" :plugins="[axisLabelPlugin]" />
        </div>
      </div>
      <div class="col-lg-5 col-md-12 col-sm-12 circleArea">
        <div class="circleStats">
          <div class="circleDot DotA"></div>
          <div class="circleDot DotB"></div>
          <div class="circleDot DotC"></div>
          <div class="circleDot DotD"></div>
          <div class="circleDot DotE"></div>
          <div class="circleMain">
            <div class="statsDesc top">累積協助</div>
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
.container {
  position: relative;

  .chartTitle {
    @include font-secondary;
    margin-bottom: 30px;
    text-align: left;
  }

  .savedChart {
    padding: 0 20px;
    background-color: transparent;

    .chartContainer {
      width: 100%;
      height: 450px;
      padding: 30px;
      background: $backstage-swipe-color;
    }
  }

  .circleArea {
    display: flex;
    align-items: center;
    justify-content: center;
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

      &.DotA {
        width: clamp(40px, 5vw, 65px);
        height: clamp(40px, 5vw, 65px);
        top: -10%;
        right: 15%;
        background-color: lighten($highlight-color1, 12%);
      }

      &.DotB {
        width: clamp(60px, 7vw, 95px);
        height: clamp(60px, 7vw, 95px);
        top: 45%;
        left: -15%;
        background-color: lighten($highlight-color1, 18%);
      }

      &.DotC {
        width: clamp(35px, 4vw, 55px);
        height: clamp(35px, 4vw, 55px);
        bottom: 5%;
        right: -5%;
        background-color: darken($highlight-color1, 5%);
      }

      &.DotD {
        width: clamp(50px, 6vw, 75px);
        height: clamp(50px, 6vw, 75px);
        top: 10%;
        left: 0;
        background-color: lighten($highlight-color1, 8%);
      }

      &.DotE {
        width: clamp(28px, 3vw, 42px);
        height: clamp(28px, 3vw, 42px);
        bottom: -5%;
        right: 25%;
        background-color: darken($highlight-color1, 10%);
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

      .statsDesc {
        @include font-tertiary;
        width: 100%;
        color: $primary-color;

        &.top {
          margin-bottom: 8px;
          padding-left: 10%;
          padding-bottom: 0.4rem;
        }

        &.down {
          padding-right: 5%;
          text-align: right;
          padding-top: 0.4rem;
        }
      }

      .statsNumber {
        font-size: 68px;
        font-weight: 700;
        color: $text-white;
        line-height: 1;
        margin-bottom: 8px;

        @media (max-width: 768px) {
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
    top: 10%;
    right: 0;
    z-index: 10;
    @include font-tertiary;
    padding: 20px 40px;
    border-radius: 30px;
    background-color: $highlight-color3;

    @media (max-width: 768px) {
      position: static;
      display: inline-block;
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
