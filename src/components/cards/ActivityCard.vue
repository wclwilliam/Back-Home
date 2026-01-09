<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
const props = defineProps({
  id: { type: Number, required: true },//活動編號
  image: {type: String , default: 'https://picsum.photos/300/200'},
  title: { type: String, required: true },
  status: { type: String, default: 'open' },// 活動的狀態
  type: { type: String, required: true },//活動類別
  date: { type: String, required: true },
  location: { type: String, required: true },
  currentPeople: { type: Number, default: 0 }, 
  maxPeople: { type: Number, required: true }
})
// 活動是否已結束
const isEnded = computed(() => props.status === 'ended')
//活動報名是否額滿
const isFulled = computed(() => {
  if(!props.maxPeople) return false
  return props.currentPeople >= props.maxPeople
})
// 按鈕顯示文字隨狀態改變
const btnTxt = computed(() => {
  if(isEnded.value )return '查看詳情'
  if(isFulled.value)return '已額滿'
  return'立即報名' });

// 進度條寬度
const progressStyle = computed (() => {
  if(props.maxPeople === 0) return {width: '0%'}
  const percent = (props.currentPeople / props.maxPeople) * 100
  return {width : `${percent}`}
})

</script>
<template>
  <div class="col-4 col-md-6 col-lg-4">
    <div class="cardContainer activityCard">
      <div class="cardPic">
        <img :src="image" :alt="title">
        <div v-if="isEnded" class="statusBadge ">
          已結束
        </div>
        <div class="typeBadge">
          <span class="material-symbols-outlined">
            sell
          </span>
          {{type}}
        </div>
      </div>
  
      <div class="cardInfo">
        <div class="cardTitle">
          <p>{{ title }}</p>
          <span class="material-symbols-outlined bookmark">
            bookmark_add
          </span>
        </div>
        <div class="divider"></div>
        <div class="rowInfo dateTime">
          <span class="material-symbols-outlined calendar">
            calendar_today
          </span>
          <h3>{{ date }}</h3>
        </div>
        <div class="rowInfo location">
  
          <span class="material-symbols-outlined location">
            location_on
          </span>
          <h3>{{ location }}</h3>
        </div>
        <div v-if="!isEnded" class="rowInfo signUpNum">
          <span class="material-symbols-outlined group">
            group_add
          </span>
          <div class="progress-track-container">
            <div class="track-bg"></div>
            <div v-if="isFulled" class="track-fill" :style="progressStyle"></div>
          </div>
          <div>{{currentPeople}}/{{ maxPeople }}</div>
        </div>
  
      </div>
    <button class="btn  btn-outline btn-solid">
      {{btnTxt}}
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
      top: 16px;
      left: 0;
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

    .rowInfo {
      display: flex;
      flex-wrap: wrap;
      @include font-body-l;
      color: $text-color;
      margin-bottom: 8px;
      gap: 8px;

      }
    }

    .signUpNum {
      margin-bottom: 0;
    }
  }

  .btn {
    width: 100%;
    padding: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
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
</style>