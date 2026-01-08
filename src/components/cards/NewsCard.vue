<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
</script>
<template>
  <div class="col-4 col-md-4 col-lg-4">
    <div class="cardContainer NewsCard">
      <div class="cardPic">
        <img src="https://picsum.photos/300/200/?random=10">
      </div>
      <div class="cardInfo">
        <div class="rowInfo ">
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

.NewsCard {
  cursor: pointer;
  position: relative;

  .cardInfo {
    transition: background-color .8s ease;

    margin: 4px 0;

    .rowInfo {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      @include font-body-l;
      color: $text-color;
      margin-bottom: 16px;
      gap: 8px;

      .openDate {
        @include font-body;
      }

      .typeBadge {
        padding: 4px 8px;
        background-color: $input-line-color1;
        color: $text-white;
        @include font-body-bold;
        display: flex;
        align-items: center;

      }
    }

    .cardTitle {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      @include font-tertiary;
      color: $text-color;
      gap: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 11.206896%;
    display: flex;
    align-items: center;
    justify-content: flex-start; // 靠右對齊
    padding-top: 5%; // 右側留白
    // text-align: center;
    clip-path: polygon(0% 100%, 100% 100%, 100% 0);

    .arrow {
      color: $text-white;
    }
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