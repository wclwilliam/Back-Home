<script>

</script>

<template>
 <div class="turtleBanner">
        <div class="container">
        <div class="turtleBannerInfo">
            <h1 class="">你所不知道的海龜</h1>
            <p>
                海龜演化足跡可追溯至一億多年前的恐龍時代，是見證地球歷史的「活化石」。然而，全世界目前僅存7種海龜，如今卻全數因棲地喪失、海洋汙染及氣候變遷等衝擊，被
                IUCN 紅色名錄列為瀕危或易危物種。這些古老的海洋旅人，正處於前所未有的生存危機之中。
            </p>
        </div>
        </div>
    </div>
</template>

<style  lang="scss" scoped>
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

</style>