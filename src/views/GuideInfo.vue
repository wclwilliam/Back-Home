<script setup>

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { allTurtles } from '@/components/guide/turtleData'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


const route = useRoute()
const router = useRouter()

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
    return `${base}${imgURL}`
}
const turtleId = parseInt(route.params.id)

const turtleInfo = computed(() => {
    return allTurtles.find(t => t.id === turtleId)
})
const goBack = () => {
    router.back()
}

const modules = [Pagination];
const isDesktop = ref(window.innerWidth >= 992);

const updateWidth = () => {
    isDesktop.value = window.innerWidth >= 992;
};

onMounted(() => {
    window.addEventListener('resize', updateWidth);
    if (!document.getElementById('model-viewer-script')) {
        const script = document.createElement('script');
        script.id = 'model-viewer-script';
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});

</script>

<template>
    <div v-if="!turtleInfo" class="error">找不到資料</div>

    <div v-else class="detailPage">
        <div class="container">
            <button class="btn btn-outline-white btn-xs" @click="goBack">回列表</button>
            <div class="detailTitle">
                <h1>{{ turtleInfo.nameCN }} <span class="enName">{{ turtleInfo.nameEN }}</span></h1>
            </div>

            <div v-if="isDesktop" class="bubbles-desktop-grid">

                <div class="grid-item-image">
                    <model-viewer v-if="turtleInfo.modelPath" :src="parsePublicFile(turtleInfo.modelPath)"
                    :camera-orbit="turtleInfo.initialOrbit || '0deg 75deg 105%'"
                        alt="海龜 3D 模型" auto-rotate camera-controls shadow-intensity="0"
                        style="width: 70%; height: 500px; outline: none;"></model-viewer>

                    <img v-else :src="parsePublicFile(turtleInfo.detailImage)" :alt="turtleInfo.nameCN"
                        class="mainTurtle-img" />
                </div>

                <div class="bubble profile">
                    <h3>物種檔案</h3>
                    <p>{{ turtleInfo.profile }}</p>
                </div>
                <div class="bubble habit">
                    <h3>生活習性</h3>
                    <p>{{ turtleInfo.habit }}</p>
                </div>
                <div class="bubble feature">
                    <h3>辨識重點</h3>
                    <p>{{ turtleInfo.feature }}</p>
                </div>
                <div class="bubble status boxShape">
                    <h3>保育現況</h3>
                    <p>{{ turtleInfo.status }}</p>
                </div>
            </div>

            <template v-else>
                <div class="detailImage-container-mobile">
                    <model-viewer v-if="turtleInfo.modelPath" :src="parsePublicFile(turtleInfo.modelPath)" auto-rotate
                        camera-controls ar style="width: 100%; height: 300px; outline: none;"></model-viewer>
                    <img v-else :src="parsePublicFile(turtleInfo.detailImage)" :alt="turtleInfo.nameCN" />
                </div>

                <swiper :modules="modules" :slides-per-view="1" :space-between="20" :centered-slides="true"
                    :pagination="{ clickable: true }" class="bubbles-mobile-swiper">
                    <swiper-slide class="bubble profile">
                        <h3>物種檔案</h3>
                        <p>{{ turtleInfo.profile }}</p>
                    </swiper-slide>
                    <swiper-slide class="bubble habit">
                        <h3>生活習性</h3>
                        <p>{{ turtleInfo.habit }}</p>
                    </swiper-slide>
                    <swiper-slide class="bubble feature">
                        <h3>辨識重點</h3>
                        <p>{{ turtleInfo.feature }}</p>
                    </swiper-slide>
                    <swiper-slide class="bubble status">
                        <h3>保育現況</h3>
                        <p>{{ turtleInfo.status }}</p>
                    </swiper-slide>
                    <div class="swiper-pagination"></div>
                </swiper>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    // 手機
    width: 100%;
    margin: 0 auto;
    padding: 0 $mobile-margin;
    max-width: 1440px;

    // 平板
    @media (min-width: 768px) {
        padding: 0 40px;
    }
}

.btn {
    @include font-caption;
    color: $text-white;
    margin-bottom: 20px;

    &:hover {
        color: $highlight-color2;
    }
}

.detailPage {
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-image: url('/img/GuideView/DetailBg.jpg');
    position: relative;
    color: white;
    padding: 50px;
    box-sizing: border-box;
}

.detailTitle h1 {
    @include font-primary;
    text-align: center;
    color: $text-white;
    margin-bottom: 50px;
}

.enName {
    @include font-secondary;
    color: $text-white;
    font-weight: normal;
}

.detailImage-container {
    width: 100%;
    display: flex;
    justify-content: start;
    position: relative;
    z-index: 1;
}

.mainTurtle-img {
    max-width: 100%;
    height: auto;
    animation: floating 3s ease-in-out infinite;
    object-fit: contain;
}

model-viewer {
    // 消除選取時的藍色或灰色外框
    --outline: none;
    outline: none;

    // 確保背景完全透明，不產生色塊邊界
    background-color: transparent;

    // 移除可能存在的預設邊框
    border: none;

    // 針對一些瀏覽器可能的預設 focus 樣式
    &:focus, &:active, &:focus-visible {
        outline: none;
    }
}
// @keyframes floating {
//     0% {
//         transform: translateY(0px);
//     }

//     50% {
//         transform: translateY(-15px);
//     }

//     100% {
//         transform: translateY(0px);
//     }
// }

.bubbles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.bubble {
    background: rgba(0, 15, 101, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    color: $text-white;

    h3 {
        @include font-tertiary;
        color: $text-white;
        margin-bottom: 15px;
        font-weight: bold;
    }

    p {
        @include font-body;
        color: $text-white;
    }
}

//電腦版樣式
.bubbles-desktop-grid .bubble {
    width: 300px;
    height: 300px;
    margin: 0 auto;
}

.bubbles-desktop-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    grid-template-rows: auto;
    margin: 0 auto;
    align-items: center;

    .profile {
        grid-column: 3;
        grid-row: 1;
    }

    .grid-item-image {
        grid-column: 1/3;
        grid-row: 1;

        img {
            max-width: 150%;
            filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.5));
        }
    }

    .habit {
        grid-column: 2;
        grid-row: 1/3;
    }

    .feature {
        grid-column: 1;
        grid-row: 2;
    }

    .boxShape {
        grid-column: 2 / 4;
        grid-row: 2;
        width: 70%;
        height: 50%;
        border-radius: 0;
        backdrop-filter: blur(5px);
        margin-top: 250px;
    }
}

//手機版
.bubbles-mobile-swiper {
    width: 100%;
    padding-bottom: 50px;

    .bubble {
        width: 100%;
        max-width: 300px;
        aspect-ratio: 1 / 1;
        height: auto;
        border-radius: 50%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;

        p {
            @include font-body;
            color: $text-white;
        }
    }
}

.detailImage-container-mobile {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    position: relative;
    z-index: 1;

    img {
        width: 100%;
        height: auto;
        object-fit: contain;
    }
}

:deep(.swiper-pagination-bullet) {
    background-color: #ffffff !important;
    opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
    background-color: #ffffff !important;
    opacity: 1;
}
</style>