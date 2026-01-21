<script setup>
const parseAssets = (fileName) => {
  return new URL(`../../assets/image/about/${fileName}`, import.meta.url).href
}
</script>
<template>
  <div class="container">
    <div class="content-grid">
      <!-- Section 1: Text 1 -->
      <div class="content-block text-block-1">
        <p class="title">一、那場令人心碎的岸邊相遇</p>
        <p class="content">
          這一切的起點，源於十年前在岸邊一次令人心碎的偶遇。那天，我們在巡視沙灘時發現了一隻被廢棄幽靈漁網層層纏繞、氣息奄奄的綠蠵龜。牠那充滿絕望與掙扎的眼神，深深烙印在我們心中。儘管我們在第一時間剪開束縛，但看著牠因人類留下的海洋垃圾而失去鰭狀肢，我們深切意識到：如果沒有人為這群沉默的海洋領航者發聲，這片海洋將逐漸失去守護了億年的生命力。
        </p>
      </div>

      <!-- Image 1 -->
      <div class="content-block image-block-1">
        <div class="img_box">
          <img :src="parseAssets('intro_1.png')" alt="Saving Sea Turtle" class="introImg" />
        </div>
      </div>

      <!-- Section 2: Text 2 -->
      <div class="content-block text-block-2">
        <p class="title">二、從救援出發，構築海洋醫務所</p>
        <p class="content">
          為了不讓悲劇重演，我們集結了獸醫、海洋生物學家與熱心志工，正式成立了本協會。我們從最艱難的緊急救援做起，逐步建立了專業的「海龜醫療收容體系」。在這裡，每一隻受傷的海龜不只是數據，更是我們的夥伴。從清理食道內的塑膠、縫合螺旋槳的傷口，到漫長的術後復健,我們傾盡全力，只為換取牠們康復入水時，那一次奮力的划動與回首。
        </p>
      </div>

      <!-- Image 2 -->
      <div class="content-block image-block-2">
        <div class="img_box">
          <img :src="parseAssets('intro_2.png')" alt="Saving Sea Turtle" class="introImg" />
        </div>
      </div>

      <!-- Section 3: Text 3 -->
      <div class="content-block text-block-3">
        <p class="title">三、治標亦治本，預約未來的重逢</p>
        <p class="content">
          然而，僅僅只有救援是不夠的。我們深知，救援是治標，守護棲地才是治本。因此，協會除了第一線的醫療任務，更投入大量資源於源頭減塑教育與產卵棲地的監測。我們深信，每一位支持者的參與都是一份改變的力量。我們不只是在救一隻海龜，而是在修復人與海洋受損的關係。我們在此承諾，會持續守護這條回家的路，直到有一天，每一隻海龜都能在純淨的大海中自由遨遊。
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// Text blocks styling
.text-block-1,
.text-block-2,
.text-block-3 {
  .title {
    @include font-quaternary;
    margin-top: 1.2rem;
    margin-bottom: 1rem;
  }

  .content {
    @include font-body-l;
  }
}

// Only first block's first title has no top margin
.text-block-1 .title:first-child {
  margin-top: 0;
}

// Image blocks styling
.image-block-1,
.image-block-2 {
  .img_box {
    width: 100%;

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
      display: block;
    }
  }
}

// Desktop and Tablet layout (>= 768px): Float layout
@media (min-width: 768px) {
  .content-grid {
    display: block;

    &::after {
      content: '';
      display: table;
      clear: both;
    }
  }

  // Text blocks float left
  .text-block-1,
  .text-block-2,
  .text-block-3 {
    float: left;
    width: 58.33%;
    padding-right: 2rem;
  }

  // Image blocks float right
  .image-block-1,
  .image-block-2 {
    float: right;
    width: 41.67%;
  }

  .image-block-1 {
    margin-top: 0;
    margin-bottom: 12px;
  }

  .image-block-2 {
    margin-top: 0;
  }

  .image-block-1 .img_box {
    width: 80%;
  }

  .image-block-2 .img_box {
    width: 80%;
    margin-left: auto;
  }
}

// Tablet specific adjustments (768px - 1023px)
@media (min-width: 768px) and (max-width: 1023px) {
  .text-block-1,
  .text-block-2,
  .text-block-3 {
    padding-right: 1rem;
  }
}

// Mobile layout (< 768px): Stack in natural order
@media (max-width: 767px) {
  .content-grid {
    display: flex;
    flex-direction: column;
  }

  .image-block-1,
  .image-block-2 {
    margin-top: 1.5rem;

    .img_box {
      width: 100%;
      margin-left: 0;
    }
  }
}
</style>
