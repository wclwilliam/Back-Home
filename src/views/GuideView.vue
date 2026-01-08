<script setup>
import { ref, computed } from 'vue'

const allTurtles = [
  {
    id: 1,
    nameCN: '綠蠵龜',
    nameEN: 'Green Turtle',
    type: 'taiwan',
    img: '/src/assets/image/GuideView/GreenTurtle.png',
  },
  {
    id: 2,
    nameCN: '玳瑁',
    nameEN: 'Hawksbill Turtle',
    type: 'taiwan',
    img: '/src/assets/image/GuideView/HawksbillTurtle.png',
  },
  {
    id: 3,
    nameCN: '赤蠵龜',
    nameEN: 'Loggerhead Turtle',
    type: 'taiwan',
    img: '/src/assets/image/GuideView/LoggerheadTurtle.png',
  },
  {
    id: 4,
    nameCN: '革龜',
    nameEN: 'Leatherback Turtle',
    type: 'taiwan',
    img: '/src/assets/image/GuideView/LeatherbackTurtle.png',
  },
  {
    id: 5,
    nameCN: '欖蠵龜',
    nameEN: 'Olive Ridley Turtle',
    type: 'taiwan',
    img: '/src/assets/image/GuideView/OliveRidleyTurtle.png',
  },
  {
    id: 6,
    nameCN: '肯氏龜',
    nameEN: "Kemp's Ridley Turtle",
    type: 'remote',
    img: '/src/assets/image/GuideView/LeatherbackTurtle.png',
  },
  {
    id: 7,
    nameCN: '平背龜',
    nameEN: 'Flatback Turtle',
    type: 'remote',
    img: '/src/assets/image/GuideView/LeatherbackTurtle.png',
  },
]

const turtleSections = computed(() => {
  return [
    {
      id: 'section-tw',
      title: '在台灣，我們有機會遇見這 5 位朋友',
      list: allTurtles.filter((t) => t.type === 'taiwan'),
    },
    {
      id: 'section-remote',
      title: '還有 2 位夥伴，生活在遙遠的彼端',
      list: allTurtles.filter((t) => t.type === 'remote'),
    },
  ]
})
</script>

<template>
  <div class="turtleBanner">
    <div class="turtleBannerInfo">
      <h1 class="">你所不知道的海龜</h1>
      <p>
        海龜演化足跡可追溯至一億多年前的恐龍時代，是見證地球歷史的「活化石」。然而，全世界目前僅存7種海龜，如今卻全數因棲地喪失、海洋汙染及氣候變遷等衝擊，被
        IUCN 紅色名錄列為瀕危或易危物種。這些古老的海洋旅人，正處於前所未有的生存危機之中。
      </p>
    </div>
  </div>

  <section class="GuideTitle">
    <h2>海龜圖鑑</h2>
    <!-- <h3>在台灣，我們有機會遇見這 5 位朋友</h3> -->
    <div class="container">
      <!-- <h1 class="main-title">海龜圖鑑</h1> -->

      <section v-for="section in turtleSections" :key="section.id" class="group-section">
        <h3 class="sub-title">{{ section.title }}</h3>

        <div class="turtle-grid">
          <div v-for="turtle in section.list" :key="turtle.id" class="turtle-card">
            <div class="img-box">
              <img :src="turtle.img" alt="" />
            </div>
            <div class="info">
              <h4>{{ turtle.nameCN }}</h4>
              <p>{{ turtle.nameEN }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.turtleBanner {
  width: 100%;
  height: 720px;
  background-image: url('/src/assets/image/GuideView/turtleBanner.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
}

.turtleBannerInfo {
  color: $text-white;
  display: flex;
  flex-direction: column;
  margin-left: 10%;
  width: 100%;
  max-width: 442px;
  gap: 86px;
}

.turtleBannerInfo h1 {
  @include font-secondary;
}

.turtleBannerInfo p {
  @include font-body-l ;
  //text-align: justify;
  width: 100%;
  max-width: 392px;
}

.GuideTitle h2 {
  font-size: $d-size-secondary;
  color: $primary-color;
  text-align: center;
  font-weight: bold;
  margin-top: 67px;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  text-align: center;
  padding: 40px 20px;
}

.group-section {
  margin-bottom: 60px;
}

.sub-title {
 @include font-secondary;
 color: $primary-color;
  margin-bottom: 50px;
  font-weight: bold;
}

.turtle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
}

.turtle-card {
  @include font-tertiary;
  color: $secondary-color;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 448px;
  gap: 24px;
}

@media (max-width: 768px) {
  .turtle-grid {
    grid-template-columns: 1fr;
  }
}

.img-box{
  width: 448px;
  height: 299px;
}
.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  object-position: center;

}

// .GuideTitle {
//   @include font-tertiary;
//   margin-top: 70px;
//   color: $primary-color;
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   text-align: center;
//}
</style>
