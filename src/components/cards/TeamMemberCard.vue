<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
const props = defineProps({
  image: { type: String, default: 'https://picsum.photos/300/200' },
  title: { type: String, required: true },
  jobTitle: { type: String, required: true },
  expertise: { type: String, required: true },
  description: { type: String, required: true },
})
</script>
<template>
  <div class="cardContainer teamCard">
    <div class="cardPic">
      <img src="https://picsum.photos/300/200/?random=10" />
    </div>

    <div class="cardInfo">
      <div class="cardTitle">
        <p>{{ title }}</p>
      </div>
      <div class="jobTitle">
        <p>{{ jobTitle }}</p>
      </div>
      <div class="divider"></div>
      <div class="rowInfo expertise">
        <p>{{ expertise }}</p>
      </div>
      <div class="rowInfo description">
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/component/_card.scss';

.teamCard {
  cursor: default;
  height: 100%; // 讓卡片填滿 col 的高度
  margin-bottom: 0;
  .cardInfo {
    transition: background-color 0.8s ease;
    margin: 4px 0;
    .cardTitle {
      text-align: center;
      display: block;
    }
    .jobTitle {
      text-align: center;
      @include font-body-l-bold;
    }
    .expertise {
      @include font-body-bold;
      color: $text-color;
      margin: 8px 0;
    }
  }
}
</style>
