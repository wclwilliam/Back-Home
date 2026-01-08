<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
const props = defineProps({
  id: { type: Number, require: true },//活動編號
  // image: {type: String , default: '/images/default-event.jpg'},
  title: { type: String, require: true },
  status: { type: String, default: 'open' },// 活動的狀態
  type: { type: String, require: true },//活動類別
  date: { type: String, require: true },
  location: { type: String, require: true },
  progress: { type: String, default: null }//已結束就沒有進度條了
})
// 活動是否已結束
const isEnded = computed(() => props.status === 'ended')

// const btnTxt = computed(() => 
//   if(isEnded.value) return '活動詳情';
//   // if(){

//   // }
// )

</script>
<template>
  <!-- <div class="card-container">
              <div class="card-pic">
                <img :src="img" :alt="title"/>
                <div class="status-badge" :class="currentStatus.class">
                  <i class="fa-solid fa-tag"></i>
                  {{status}}
                </div>
                <div v-if="type" class="type-badge">
                  <i class="fa-solid fa-tag"></i>
                  {{type}}
                </div>
              </div>
          
              <div class="card-info">
                <div class="card-title">
                  <span>{{title}}</span>
                  <i class="bookmark-icon material-symbols-outlined">
                  </i>
                </div>
                <div class="divider"></div>
                <div class="rowInfo dateTime">
                  <i class="fa-solid fa-tag"></i>
                  <h4>{{date}}</h4>
                </div>
                <div class="rowInfo location">
                  <i class="fa-solid fa-tag"></i>
                  <h4>{{location}}</h4>
                </div>
                <div class="rowInfo signUpNum">
                  <i class="fa-solid fa-tag"></i>
                  <div>{{progress}}</div>
                  <div>20/40</div>
                </div>
              </div>
            </div> -->
  <div class="col-4 col-md-4 col-lg-4">
    <div class="cardContainer activityCard">
      <div class="cardPic">
        <img src="https://picsum.photos/300/200/?random=10">
        <div class="statusBadge -on">
          已結束
  
        </div>
        <div class="typeBadge">
          <span class="material-symbols-outlined">
            sell
          </span>
          淨灘
        </div>
      </div>
  
      <div class="cardInfo">
        <div class="cardTitle">
          <span>漁網纏繞下的倖存者：截肢海龜的特殊照護需求認識</span>
          <span class="material-symbols-outlined bookmark">
            bookmark_add
          </span>
        </div>
        <div class="divider"></div>
        <div class="rowInfo dateTime">
          <span class="material-symbols-outlined calendar">
            calendar_today
          </span>
          <h4>2026/01/04(日) 14:00-15:00</h4>
        </div>
        <div class="rowInfo location">
  
          <span class="material-symbols-outlined location">
            location_on
          </span>
          <h4>新北萬里翡翠灣</h4>
        </div>
        <div class="rowInfo signUpNum">
          <span class="material-symbols-outlined group">
            group_add
          </span>
          <div class="progress-track-container">
            <div class="track-bg"></div>
            <div class="track-fill" :style="progressStyle"></div>
          </div>
          <div>20/40</div>
        </div>
  
      </div>
    <button class="btn  btn-outline btn-solid">
      立即報名
      <span class="material-symbols-outlined arrow">
        arrow_forward
      </span>
    </button>
  </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/component/_card.scss";

.activityCard {
  .cardPic {
    .status-badge {
      position: absolute;
      top: 0;
      left: 0;
      margin: 16px 0;
      padding: 8px 16px;
      background-color: $highlight-color2;
      color: $activity-card-color;
      @include font-tertiary;
    }

    .typeBadge {
      position: absolute;
      top: 0px;
      right: 0px;
      gap: 8px;
      padding: 8px 16px;
      background-color: $highlight-color3;
      color: $text-color;
      @include font-body-bold;
      display: flex;
      align-items: center;
    }
  }

  .cardInfo {
    .bookmark {
      font-size: 40px
    }

    .cardTitle {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      @include font-tertiary;
      color: $text-color;
      gap: 8px;

    }

    .divider {
      width: 120%;
      height: 1px;
      background-color: $page-number-color;
      margin: 16px -24px;
    }

    .rowInfo {
      display: flex;
      flex-wrap: wrap;
      @include font-body-l;
      color: $text-color;
      margin-bottom: 8px;
      gap: 8px;

      .progress-track-container {
        margin: auto 0;
        flex: 1;
        height: 16px;
        position: relative;
        margin-bottom: 30px; // 預留空間給下方的標籤，防止被切掉

        // 1. 灰色底軌
        .track-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid #777;
          border-radius: 20px;
        }

        // 2. 深色填充
        .track-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background-color: $primary-color;
          border-radius: 20px;
          width: 60%;
        }

      }
    }

    .signUpNum {
      margin-bottom: 0;
    }
  }

  .btn {
    width: 100%;
    text-align: center;
    border: 2px solid $secondary-color;
    border-bottom: 2px solid #ffffff00;
    border-right: 0;
    border-left: 0;

    .arrow {
      color: $secondary-color;
    }

    &:hover {
      border: 2px solid $secondary-color;
      background-color: $secondary-color;
      color: $text-white;
    }
  }
}
</style>