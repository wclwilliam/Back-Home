<script setup>
  //列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
defineProps([
  'img','status','type','title','date','location','progress'
])
</script>
<template>
  
  <div class="card-container">
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