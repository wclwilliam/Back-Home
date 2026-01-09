<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
</script>
<template>
  <div class="col-4 col-md-6 col-lg-4">
    <div class="cardContainer newsCard">
      <div class="cardPic">
        <img src="https://picsum.photos/300/200/?random=10">
      </div>
      <div class="cardInfo">
        <div class="rowInfo metaRow">
          <div class="openDate">2025.12.31</div>
          <div class="typeBadge">異動通知
          </div>
        </div>
        <div class="cardTitle">
          守護海洋安全第一：【龜途】2025 綠蠵龜棲地守護淨灘活動延期通知延期通知延
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

  .cardInfo {
    transition: background-color .8s ease;
    margin: 4px 0;

    .metaRow {
      justify-content: space-between;
      margin-bottom: 16px;

      .typeBadge {
        padding: 4px 8px;
        background-color: $input-line-color1;
        color: $text-white;
        @include font-body-bold;
        display: flex;
      }
    }
    .cardTitle{
     display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 設定顯示的行數 */
    overflow: hidden;
  }
  }
  

  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 12%;
    aspect-ratio:0;// 保持方形比例
    display: flex;
    align-items: center;
    justify-content: flex-start; // 靠右對齊
    padding-top: 9%; // 右側留白
    // text-align: center;
    clip-path: polygon(0% 100%, 100% 100%, 100% 0);

    .arrow {
      color: $text-white;
    }
  }
  &:before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -16px;
    right: -16px;
    background: #00838d;
    height: 32px;
    width: 32px;
    border-radius: 32px;
    transform: scale(1);
    transform-origin: 50% 50%;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    background-color: $secondary-color;
    color: $text-white;

    .cardInfo {
      .rowInfo {
        color: $text-white;

        .openDate {
          color: $text-white;
        }

        .typeBadge {
          background-color: $text-white;
          color: $text-color;
        }
      }

      .cardTitle {
        color: $text-white;
      }
    }

    .btn {

      background-color: $secondary-color;
      border: $secondary-color;
      .arrow {
        color: $text-white;
      }
    }

  }
}
</style>