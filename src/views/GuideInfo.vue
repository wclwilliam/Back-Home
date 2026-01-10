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

const turtleId = parseInt(route.params.id)

const turtleInfo = computed(() => {
    return allTurtles.find(t => t.id === turtleId)
})
const goBack = () => {
    router.push('/guide')
}

const modules = [Pagination];
const isDesktop = ref(window.innerWidth >= 992); // 預設值


const updateWidth = () => {
    isDesktop.value = window.innerWidth >= 992;
};

onMounted(() => {
    window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});

</script>

<template>
    <div v-if="!turtleInfo" class="error">找不到資料</div>

    <div v-else class="detail-page">
        <div class="container">
            <button class="btn btn-outline-white" @click="goBack">回列表</button>
            <div class="detailTitle">
                <h1>{{ turtleInfo.nameCN }} <span class="en-name">{{ turtleInfo.nameEN }}</span></h1>
            </div>

            <div v-if="isDesktop" class="bubbles-desktop-grid">
                
                <div class="grid-item-image">
                    <img :src="turtleInfo.detailImage" :alt="turtleInfo.nameCN" class="main-turtle-img" />
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
                <div class="bubble status box-shape">
                    <h3>保育現況</h3>
                    <p>{{ turtleInfo.status }}</p>
                </div>
            </div>

            <template v-else>
                <div class="detailImage-container-mobile">
                    <img :src="turtleInfo.detailImage" :alt="turtleInfo.nameCN" class="main-turtle-img" />
                </div>

                <swiper
                    :modules="modules"
                    :slides-per-view="1"
                    :space-between="20"
                    :centered-slides="true"
                    :pagination="{ clickable: true }"
                    class="bubbles-mobile-swiper"
                >
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
                    <swiper-slide class="bubble status box-shape">
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
    background-image: url('../../public/img/GuideView/DetailBg.jpg');
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
    max-width: 100%; 
    height: auto;
    animation: floating 3s ease-in-out infinite;
    object-fit: contain; 
}


@keyframes floating {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
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
    color: white;

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

//電腦版樣式
.bubbles-desktop-grid .bubble {
    width: 280px; 
    height: 280px;
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
        filter: drop-shadow(0 0 20px rgba(0,0,0,0.5)); 
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

    .box-shape {
       
        grid-column: 2 / 4; 
        grid-row: 2;
        width: 70%;
        height: 50%; 
        border-radius: 0;
        backdrop-filter: blur(5px);
        margin-top: 250px;
        //margin-bottom: 100px;
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
    }
    
    
    .box-shape {
        aspect-ratio: auto;  
        border-radius: 20px;
        width: 100%;         
        max-width: none;    
        height: auto;       
        min-height: 200px;  
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
</style>