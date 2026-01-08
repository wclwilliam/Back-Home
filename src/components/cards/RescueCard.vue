<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
</script>
<template>
  <div class="col-4 col-md-6 col-lg-4">
    <div class="cardContainer rescueCard">
      <div class="cardPic">
        <img src="https://picsum.photos/300/200/?random=10">
      </div>
  
      <div class="cardInfo">
        <div class="cardTitle">
          <p>阿福 (綠蠵龜)</p>
        </div>
        <div class="divider"></div>
        <div class="rowInfo txt">
          <p>2025年10月發現於澎湖龍門沙灘，遭廢棄漁網纏繞導致左前肢壞死。阿福剛來時極度虛弱，經過截肢手術後，目前正在練習用三隻鰭狀肢游泳，每天的餐費與藥費是牠最大的支柱。</p>
        </div>
        <div class="subTitle">
          <p>回到大海之路</p>
        </div>
        <div class="rowInfo location">
          <span class="material-symbols-outlined location">
            explore
          </span>
          <div class="progress-track-container">
            <div class="track-bg"></div>
  
            <div class="track-fill" :style="progressStyle"></div>
  
            <div class="current-point" :style="pointStyle">
              <div class="dot"></div>
              <div class="line"></div>
              <div class="status-tag">準備野放</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/component/_card.scss";

.rescueCard {
  padding-bottom: 48px;
  cursor: default;

  .subTitle {
    @include font-body-l-bold;
  }

  .cardInfo {
    .cardTitle {
      @include font-tertiary;
    }

    
  }
}
.progress-track-container {

      // 3. 定位點 (跟隨進度)
      .current-point {
        position: absolute;
        top: 50%;
        left: 58%;
        transform: translate(-50%, -10%); // 讓點置中於百分比位置

        display: flex;
        flex-direction: column;
        align-items: center;

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