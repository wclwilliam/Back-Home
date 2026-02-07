<script setup>
//列表
import { computed } from 'vue'

// 從環境變數讀取檔案 URL 基礎路徑
const fileBaseUrl = import.meta.env.VITE_FILE_URL

// 定義外部傳入的資料
const props = defineProps({
  id: { type: Number, required: true }, //海龜編號
  imageSrc: { type: String, default: 'https://picsum.photos/300/200' },
  name: { type: String, required: true }, // 名字 (阿福)
  species: { type: String, required: true }, //品種(綠蠵龜)
  description: { type: String, required: true },
  status: { type: String, default: '入院檢查' }, //階段：入院檢查、醫療照護、休養觀察、準備野放、重返大海
})
// 處理圖片路徑 - 支援三種模式：
// 1. /src/assets/... - 本地開發時的資產路徑（Vite 動態 import）
// 2. /images/... - 遠端文件路徑（從環境變數的 FILE_URL 讀取）
// 3. savedcases/... - 相對路徑（直接拼接環境變數）
const imageUrl = computed(() => {
  if (!props.imageSrc) return 'https://picsum.photos/300/200'

  const imagePath = props.imageSrc

  // 模式 1: 如果是 /src/assets/ 路徑，使用 Vite 動態 import（開發模式）
  if (imagePath.startsWith('/src/')) {
    try {
      const imageModules = import.meta.glob('@/assets/image/**/*.{png,jpg,jpeg,gif,svg}', {
        eager: true,
      })
      const fullPath = imagePath.replace('@/', '/src/')
      const matchedModule = imageModules[fullPath]

      if (matchedModule && matchedModule.default) {
        return matchedModule.default
      }
    } catch (error) {
      console.error('本地圖片載入失敗:', error)
    }
  }

  // 模式 2: 如果是 /images/ 路徑，使用環境變數拼接完整 URL（生產模式）
  if (imagePath.startsWith('/images/')) {
    return `${fileBaseUrl}${imagePath}`
  }

  // 模式 3: 相對路徑（如 savedcases/xxx.png），直接拼接環境變數
  // 這是從資料庫取得的路徑格式
  if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
    const url = `${fileBaseUrl}${imagePath}`
    return url
  }

  // 如果都不符合，回傳預設圖片
  return 'https://picsum.photos/300/200'
})

// 根據字串狀態計算百分比
const progressPercent = computed(() => {
  const statusMap = {
    入院檢查: 20,
    醫療照護: 40,
    休養觀察: 60,
    準備野放: 80,
    重返大海: 100,
  }
  return statusMap[props.status] || 20 // 預設為入院檢查
})

//進度條%
const progressWidth = computed(() => {
  return { width: `${progressPercent.value}%` }
})
//進度條位置
const pointStyle = computed(() => {
  return { left: `${progressPercent.value - 2}%` }
})
//進度條文字（直接使用 status）
const progressText = computed(() => {
  return props.status
})

// 狀態標籤樣式：當進度為 100% 時，向左位移以避免超出右邊界
const tagStyle = computed(() => {
  if (progressPercent.value >= 100) {
    return { transform: 'translateX(-40%)' }
  }
  return {}
})
</script>
<template>
  <div class="col-sm-4 col-md-6 col-lg-4">
    <div class="cardContainer rescueCard">
      <div class="cardPic">
        <img :src="imageUrl" :alt="name" />
      </div>

      <div class="cardInfo">
        <div class="cardTitle">
          <p>{{ name }}({{ species }})</p>
        </div>
        <div class="divider"></div>
        <div class="rowInfo description">
          <p>{{ description }}</p>
        </div>
        <div class="subTitle">
          <p>回到大海之路</p>
        </div>
        <div class="rowInfo location">
          <span class="material-symbols-outlined location"> explore </span>
          <div class="progress-track-container">
            <div class="track-bg"></div>

            <div class="track-fill" :style="progressWidth"></div>

            <div class="current-point" :style="pointStyle">
              <div class="dot"></div>
              <div class="line"></div>
              <div class="status-tag" :style="tagStyle">{{ progressText }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/component/_card.scss';

// 让 col 容器使用 flexbox
.col-sm-4,
.col-md-6,
.col-lg-4 {
  display: flex;
  flex-direction: column;
}

.rescueCard {
  padding-bottom: 32px;
  cursor: default;
  display: flex;
  flex-direction: column;
  height: 100%; // 撑满父容器

  .cardInfo {
    display: flex;
    flex-direction: column;
    flex: 1; // 让 cardInfo 占据剩余空间

    .cardTitle {
      @include font-tertiary;
    }

    .description {
      flex: 1; // 让 description 自动扩展填充空间
      display: flex;
      align-items: flex-start; // 文字从顶部开始
    }
  }

  .subTitle {
    @include font-body-l-bold;
    margin-top: auto; // 推到 description 之后
  }
}
.progress-track-container {
  // 3. 定位點 (跟隨進度)
  .current-point {
    position: absolute;
    top: 50%;
    // left 由 Vue style 控制
    transform: translate(-50%);
    margin-top: -6px;
    transition: left 0.5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
    // 圓點
    .dot {
      width: 12px;
      height: 12px;
      background-color: $secondary-color;
      // 藍綠色點
      border-radius: 50%;
      border: 2px solid $secondary-color;
      // 增加一點白邊區隔
      z-index: 2;
    }

    // 垂線
    .line {
      width: 1px;
      height: 15px; // 線的長度
      background-color: $secondary-color;
      margin: -2px 0; // 接合修正
    }

    // 狀態標籤
    .status-tag {
      background-color: $secondary-color;
      color: $text-white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: bold;
      white-space: nowrap; // 防止文字換行
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
}
.cardContainer .progress-track-container .track-fill {
  top: 1px !important;
}
</style>
