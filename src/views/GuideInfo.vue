<script setup>

import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { allTurtles } from '@/components/guide/turtleData'

const route = useRoute()
const router = useRouter()

const turtleId = parseInt(route.params.id)

const turtleInfo = computed(() => {
    return allTurtles.find(t => t.id === turtleId)
})


const goBack = () => {
    router.push('/guide')
}
</script>

<template>
    <div v-if="!turtleInfo" class="error">找不到資料</div>

    <div v-else class="detail-page ">
            <div class="container">
        <button class="btn btn-outline-white" @click="goBack">回列表</button>

        <div class="detailTitle">
            <h1>{{ turtleInfo.nameCN }} <span class="en-name">{{ turtleInfo.nameEN }}</span></h1>
        </div>

        <div class=" detailImage-container">
            <img :src="turtleInfo.detailImage" :alt="turtleInfo.nameCN" class="main-turtle-img" />
        </div>

        <main class="bubbles-container">
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

            <div class="bubble status box-shape">
                <h3>保育現況</h3>
                <p>{{ turtleInfo.status }}</p>
            </div>
        </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    // 手機版
    width: 100%;
    margin: 0 auto;
    padding: 0 $mobile-margin;
    max-width: 1440px;

    // 平板版
    @media (min-width: 768px) {
        padding: 0 40px;
    }
}

.detail-page {
    width: 100%;
    min-height: 100vh;
    background-size: cover;
    background-position: center;
    background-image: url('../assets/image/GuideView/DetailBg.jpg');
    position: relative;
    color: white;
    padding: 50px;
    box-sizing: border-box;
}

.detailTitle h1 {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 50px;
}

.en-name {
    font-size: 1.5rem;
    font-weight: normal;
}


.detailImage-container {
    width: 100%;
    display: flex;
    justify-content: start;
    // margin-bottom: 50px;
    position: relative;
    z-index: 1;
}

.main-turtle-img {
    max-width: 600px;
    width: 40%;
    height: auto;
    animation: floating 3s ease-in-out infinite;
}


@keyframes floating {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }

    100% {
        transform: translateY(0px);
    }
}

.bubbles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
}

.bubble {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    width: 300px;
    height: 300px;
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    h3 {
        font-size: 1.5rem;
        margin-bottom: 15px;
        font-weight: bold;
    }

    p {
        font-size: 1rem;
        line-height: 1.6;
    }
}

.box-shape {
    border-radius: 20px;
    width: 400px;
    height: auto;
    min-height: 200px;
}

</style>