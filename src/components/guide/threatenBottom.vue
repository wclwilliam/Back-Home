<template>
    <section class="flexCard container">
        <div class="bottomcard">
            <img src="/public/img/GuideView/threatenBottom1.png" alt="">
            <div class="overlay">
                <div class="overlayContent">
                    <h3>海洋廢棄物</h3>
                    <p>致命的偽裝，成為體內的利刃</p>
                </div>
            </div>
        </div>
        <div class="bottomcard">
            <img src="/public/img/GuideView/threatenBottom2.png" alt="">
            <div class="overlay">
                <div class="overlayContent">
                    <h3>幽靈漁具與混獲</h3>
                    <p>被遺忘在海裡的兇器<br>無法浮上水面的絕望</p>
                </div>
            </div>
        </div>
        <div class="bottomcard">
            <img src="/public/img/GuideView/threatenBottom3.png" alt="">
            <div class="overlay">
                <div class="overlayContent">
                    <h3>棲地破壞與光害</h3>
                    <p>最漫長的 100 公尺</p>
                </div>
            </div>
        </div>
        <div class="bottomcard">
            <img src="/public/img/GuideView/threatenBottom4.png" alt="">
            <div class="overlay">
                <div class="overlayContent">
                    <h3>氣候變遷</h3>
                    <p>沒有退路的生存戰</p>
                </div>
            </div>
        </div>

    </section>
</template>

<style lang="scss" scoped>
.flexCard {
    margin: 67px auto;
    display: flex;
    width: 100%;
    height: 400px;
    overflow: hidden;
}

.bottomcard {
    flex: 1;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        flex: 1.5;

        .overlay {
            opacity: 1;
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s ease;
    background: rgba(0, 0, 0, 0.6);
    padding: 20px;
    box-sizing: border-box;
}

.overlayContent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: white;
    z-index: 100;

    h3 {
        font-size: $d-size-tertiary;
        font-weight: bold;
    }

    p {
        font-size: $size-body;
        font-weight: bold;
        line-height: 1.5;
        text-align: center;
    }
}
</style>