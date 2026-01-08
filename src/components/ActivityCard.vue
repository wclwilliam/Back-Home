<script setup>
  //列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
const props = defineProps({
  id:{type: Number , require:true},//活動編號
  // image: {type: String , default: '/images/default-event.jpg'},
  title:{type: String , require : true},
  status:{type : String , default:'open'},// 活動的狀態
  type:{ type: String , require : true},//活動類別
  date:{type: String , require : true},
  location:{type: String , require : true},
  progress:{type: String , default : null}//已結束就沒有進度條了
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
      <div class="line"></div>
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

  <div class="card-container">
    <div class="card-pic">
      <img src="https://picsum.photos/300/200/?random=10">
      <div class="status-badge" >
        <i class="fa-solid fa-tag"></i>
        
      </div>
      <div class="type-badge">
        <i class="fa-solid fa-tag"></i>
        淨灘
      </div>
    </div>

    <div class="card-info">
      <div class="card-title">
        <span>漁網纏繞下的倖存者：截肢海龜的特殊照護需求認識</span>
        <i class="bookmark-icon material-symbols-outlined">
        </i>
      </div>
      <div class="line"></div>
      <div class="rowInfo dateTime">
        <i class="fa-solid fa-tag"></i>
        <h4>2026/01/04(日) 14:00-15:00</h4>
      </div>
      <div class="rowInfo location">
        <i class="fa-solid fa-tag"></i>
        <h4>新北萬里翡翠灣</h4>
      </div>
      <div class="rowInfo signUpNum">
        <i class="fa-solid fa-tag"></i>
        <div>活動進度條</div>
        <div>20/40</div>
      </div>
    </div>
  </div>
</template>

<style src="@/assets/scss/component/_card.scss" lang="scss" scoped>
  @import "@/assets/scss/components/_card.scss";
.volunteer-card {
  @extend %card-base; // 繼承基底樣式
  .info-row { display: flex; gap: 8px; } // 活動專屬樣式
}
  .status-badge{
      position: absolute;
      top: 0;
      left: 0;
      margin: 16px 0;
      padding: 8px 16px;
      background-color: $highlight-color2;
      color: $activity-card-color;
      @include font-secondary;
    }
    .type-badge{
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 8px 16px;
      background-color: $highlight-color3;
      color: $text-color;
      @include font-secondary;
      display: flex;
      align-items: center;
    }
</style>