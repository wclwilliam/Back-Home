<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
const props = defineProps({
  id: { type: Number, required: true },
  image: {type: String , default: 'https://picsum.photos/300/200'},
  title: { type: String, required: true },
  typeBadge: { type: String, required: true },
  date: { type: String, required: true }
});

</script>
<template>
  <div class="col-sm-4 col-md-6 col-lg-4">
    <div class="cardContainer newsCard">
      <div class="cardPic">
        <img :src="image">
      </div>
      <div class="cardInfo">
        <div class="rowInfo metaRow">
          <div class="openDate">{{date}}</div>
          <div class="typeBadge">{{typeBadge}}</div>
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