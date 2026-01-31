<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
const props = defineProps({
  id: { type: Number, required: true },
  image: { type: String, default: '/img/default-placeholder.png' },
  title: { type: String, required: true },
  typeBadge: { type: String, required: true },
  date: { type: String, required: true }
});

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
  return imgURL ? `${base}${imgURL}` : ''
}
const fileUrl = import.meta.env.VITE_FILE_URL
</script>
<template>
  <div class="col-sm-4 col-md-6 col-lg-4">
    <div class="cardContainer newsCard">
      <div class="cardPic">
        <img :src="fileUrl + image" :alt="title">
      </div>
      <div class="cardInfo">
        <div class="rowInfo metaRow">
          <div class="openDate">{{ date }}</div>
          <div class="typeBadge">{{ typeBadge }}</div>
        </div>
        <div class="cardTitle">
          {{ title }}
        </div>

      </div>
      <button class="btn btn-solid">
        <span class="material-symbols-outlined arrow">
          arrow_forward
        </span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/component/_card.scss";

.newsCard {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: $text-white;
  transition: all 0.3s ease;
  z-index: 1;
  height: 490px;

  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    bottom: -32px;
    right: -32px;

    background: $secondary-color;


    height: 65px;
    width: 65px;
    border-radius: 50%;

    /* 動畫設定 */
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.5s ease-out;
  }


  &:hover:before {
    transform: scale(25);
  }

  /* 內容區域設定 */
  .cardInfo {
    position: relative;
    z-index: 2;
    /* 確保文字浮在擴散層上面 */
    transition: color 0.3s ease;
    margin: 4px 0;

    .metaRow {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .typeBadge {
        padding: 4px 8px;
        background-color: $input-line-color1;
        color: $text-white !important;
        @include font-body-bold;
        display: flex;
        transition: background-color 0.3s, color 0.3s;
      }

      .openDate {
        transition: color 0.3s;
      }
    }

    .cardTitle {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      transition: color 0.3s;
    }
  }

  /* 右下角三角形按鈕 */
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15%;
    /* 根據需求調整大小 */
    aspect-ratio: 1;
    /* 保持正方形 */

    background-color: $secondary-color;
    /* 右下角三角形 */
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);

    z-index: 2;
    border: none;
    cursor: pointer;

    /* 移除原本的 padding 和 flex 設定，改用 absolute 定位內部箭頭 */
    padding: 0;

    .arrow {
      position: absolute;
      color: $text-white;

      /* --- 關鍵幾何定位 --- */
      /* 直角三角形的重心位於距離直角邊 1/3 處 */
      /* 換算成正方形座標，就是距離左上角 2/3 (66.66%) 處 */
      top: 67%;
      left: 67%;

      /* 校正：讓箭頭自己的中心點對準座標 */
      transform: translate(-50%, -50%);

      font-size: 1.2rem;
    }
  }

  /* Hover 狀態下的文字變色處理 */
  &:hover {
    .cardInfo {
      .btn-solid {
        border-color: $secondary-color;
      }

      .rowInfo {
        .openDate {
          color: $text-white;
          /* 日期變白 */
        }

        .typeBadge {
          background-color: $text-white !important;
          color: $secondary-color !important;
        }
      }

      .cardTitle {
        color: $text-white;
      }
    }

    /* 按鈕在 Hover 時的效果 */
    /*  .btn {
      選擇性：可以讓按鈕顏色稍微變深，或者保持不變 */
    /* 因為背景也變成 secondary-color，按鈕會視覺上「融合」進背景
    }*/
  }
}
</style>