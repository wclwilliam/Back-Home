<script setup>
//列表
import { computed } from 'vue'
import { parsePublicFile } from '@/utils/parseFile'
// 定義外部傳入的資料
const props = defineProps({
  id: { type: Number, required: true }, //海龜編號
  image: { type: String, default: 'https://picsum.photos/300/200' },
  name: { type: String, required: true }, // 名字 (阿福)
  species: { type: String, required: true }, //品種(綠蠵龜)
  description: { type: String, required: true },
  stage: { type: Number, default: 1 }, //階段：1~5
})
// 處理圖片路徑
const imageUrl = computed(() => {
  return parsePublicFile(props.image)
})

//計算百分比 (每個階段 20%)
const progressPercent = computed(() => {
  let safeStage = props.stage
  if (safeStage < 1) safeStage = 1
  if (safeStage > 5) safeStage = 5

  return safeStage * 20
})

//進度條%
const progressWidth = computed(() => {
  return { width: `${progressPercent.value}%` }
})
//進度條位置
const pointStyle = computed(() => {
  return { left: `${progressPercent.value - 2}%` }
})
//進度條文字
const progressText = computed(() => {
  let s = props.stage
  if (s === 1) return '入院檢查'
  if (s === 2) return '醫療照護'
  if (s === 3) return '休養觀察'
  if (s === 4) return '準備野放'
  if (s >= 4) return '重返大海'
  return '入院檢查'
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
              <div class="status-tag">{{ progressText }}</div>
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
</style>
