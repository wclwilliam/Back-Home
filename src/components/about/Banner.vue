<script setup>
const parseAssets = (fileName) => {
  return new URL(`../../assets/image/about/${fileName}`, import.meta.url).href
}
</script>

<template>
  <div class="container">
    <div class="row banner_row">
      <div class="col-sm-4 col-md-7 col-lg-7 no-gutter">
        <div class="img_box">
          <img :src="parseAssets('mainBanner.png')" alt="Sea Turtle" />
        </div>
      </div>

      <div class="col-sm-4 col-md-5 col-lg-5 no-gutter">
        <div class="bg_block"></div>
      </div>

      <div class="textCard">
        <h1>讓每一隻受傷的靈魂，都有機會游回蔚藍。</h1>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// 1. 處理 Grid 相關的微調
.banner_row {
  position: relative;
}

// 關鍵：複寫你的 Grid System padding，讓圖片跟色塊無縫接合
.no-gutter {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.img_box {
  aspect-ratio: 825.45 / 523;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.bg_block {
  background-color: $card-color;
  height: 100%;
}

// 3. 浮動文字框樣式
.textCard {
  @include font-tertiary;
  background-color: $secondary-color;
  color: $text-white;
  position: absolute;
  z-index: 10;
  padding: 24px 32px;
  bottom: 40px;
  right: 0; // 先靠右
  margin-right: 8%;

  // 手機版 RWD 調整
  // 你的手機版是 col-sm-4 (全寬)，通常這時候不需要浮動，而是改為正常堆疊
  @media (max-width: 1023px) {
    position: relative;
    width: 100%;
    bottom: auto;
    right: auto;
    margin-right: 0;
    margin-top: -20px; // 稍微往上蓋住一點圖片
  }
}
</style>
