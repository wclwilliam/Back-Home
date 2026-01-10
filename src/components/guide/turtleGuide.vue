<script setup>
import { ref, computed } from 'vue'
import { allTurtles } from '@/components/guide/turtleData'

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

// const parseAssetsIcon = (fileName) => { 
//     return new URL(`src/assets/${fileName}`, import.meta.url).href 
//     }
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
        <div class="container">
            <section v-for="section in turtleSections" :key="section.id" class="group-section">
                <h3 class="sub-title">{{ section.title }}</h3>
                <div class="row">
                    <div v-for="turtle in section.list" :key="turtle.id" class="col-sm-4 col-md-6 col-lg-4" style="margin-bottom: 48px;">
                        
                        <router-link :to="`/guide/${turtle.id}`" class="turtle-card-link">
                            <div class="turtle-card">
                                
                                <div class="img-box">
                                    <img :src="turtle.img" :alt="turtle.nameCN" />
                                </div>
                                <div class="info">
                                    <h4>{{ turtle.nameCN }}</h4>
                                    <p>{{ turtle.nameEN }}</p>
                                </div>
                            </div>
                        </router-link>

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
    background-image: url('/public/img/GuideView/turtleBanner.png');
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
    @include font-body-l;
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


.group-section {
    margin-bottom: 60px;
}

.sub-title {
    @include font-secondary;
    color: $primary-color;
    margin-bottom: 50px;
    font-weight: bold;
    text-align: center;
}

.turtle-card {
    @include font-tertiary;
    color: $secondary-color;
    font-weight: bold;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    gap: 24px;
    cursor: pointer;
}

.img-box {
    width: 100%;
    height: 100%;
}

.img-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}
</style>
