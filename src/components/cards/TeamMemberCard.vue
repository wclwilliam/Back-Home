<script setup>
//列表
import { computed, ref, onMounted } from 'vue'
// 定義外部傳入的資料
</script>
<template>
  <div class="col-4 col-md-6 col-lg-4">
    <div class="cardContainer teamCard">
      <div class="cardPic">
        <img src="https://picsum.photos/300/200/?random=10">
      </div>
  
      <div class="cardInfo">
        <div class="cardTitle">
          <p>林明杰 醫師 (Dr. Michael Lin)</p>
        </div>
        <div class="jobTitle">
          <p>醫療救援組長</p>
        </div>
        <div class="divider"></div>
        <div class="rowInfo expertise">
          <span>專長： 海龜臨床外科手術、爬蟲類放射線醫學。</span>
        </div>
        <div class="rowInfo txt">
          <p>林醫師擁有超過十年的海洋生物救護經驗，是協會醫療中心的靈魂人物。 他曾主持過數百場海龜異物取出手術，精通精確的內視鏡醫療與複雜的背甲縫合技術。
            對他而言，最幸福的時刻不是完成一場成功的手術，而是親手將復健完成的海龜放回海中，看著牠們奮力划向深藍的背影。</p>
        </div>
  
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/component/_card.scss";

.teamCard{
  cursor: default;
  .cardInfo {
    transition: background-color .8s ease;

    margin: 4px 0;

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