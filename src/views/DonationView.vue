<script setup>
    import Banner from "@/components/Banner.vue";
    import Accordion from "@/components/donation/accordion.vue";
    import donationCom from "@/components/donation/donationCom.vue";
    import MyButton from "@/components/donation/MyButton.vue";
    import SwiperRescueCards from "@/components/donation/SwiperRescueCards.vue";
    import AnimationNumber from "@/components/donation/AnimationNumber.vue";
    import CleanChart from "@/components/donation/CleanChart.vue";
    import {  ref, onMounted, computed, onUnmounted } from 'vue';
    import { publicApi } from "@/utils/publicApi";
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

    // 註冊外掛
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

    const targetComponent = ref(null);
    const bottomBtn = ref(null);
    // 點擊按鈕前往捐款組件函式
    const scrollToTarget = () => {
    gsap.to(window, {
        duration: 1,           // 捲動持續時間（秒）
        scrollTo: {
        y: targetComponent.value.$el, // 直接傳入 ref.value (DOM 元素)
        offsetY: 50          // 選擇性：位移量（例如避開固定的 Header）
        },
        ease: "power2.inOut"   // 動畫曲線，讓捲動更平滑
    });
    };

    onMounted(() => {
    // 建立 GSAP 動畫：初始狀態設為隱藏（透明度 0 且往下位移）
    
    const btnAnim = gsap.fromTo(bottomBtn.value.$el, 
        { y: 50, opacity: 0, display: 'none' },
        { y: 0, opacity: 1, display: 'block', duration: 0.3, paused: true }
    );

    ScrollTrigger.create({
        trigger: targetComponent.value.$el,
        start: "top bottom", // 當組件頂部進入視窗底部時
        end: "bottom top",   // 當組件底部離開視窗頂部時
        onToggle: (self) => {
        // self.isActive 代表目標組件是否在畫面中
        // 當 isActive 為 false 時（不在畫面），播放動畫顯示按鈕；反之倒轉動畫
        if (!self.isActive) {
            btnAnim.play();
        } else {
            btnAnim.reverse();
        }
        }
    });
    });

    onUnmounted(() => {
    // 清理資源防止記憶體洩漏
    ScrollTrigger.getAll().forEach(t => t.kill());
    });

    const selectedYear = ref('');
    const impactReports =ref([])
    
    // onMounted( async () => {
    // try {
    //     const base = import.meta.env.BASE_URL
    //     const response = await axios.get(base + 'data/impactReports.json')
    //     impactReports.value = response.data
    //     //進頁面給值
    //     selectedYear.value = impactReports.value[0].year
        
    // }catch (error){
    //     console.log(error)
    // }
    // })
    onMounted(() => {
        publicApi.get('data/impactReports.json').then((response) => {
            impactReports.value = response.data
            //進頁面給值
            selectedYear.value = impactReports.value[0].year
        })
    })

    const currentData = computed(() => {
    return impactReports.value.find(item => item.year === selectedYear.value) || {};
    });
    

    
</script>

<template>
    <Banner  imgName="donation" title="支持保育"/>
    <MyButton class="btn-xxl mbOnlyBtn" width="100%" ref="bottomBtn" @click="scrollToTarget">立即捐款</MyButton>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-6 col-lg-6">
                <section class="otherCom">
                        <div class="rescueChart container">
                            <h2>我們的影響力數據</h2>
                            <section class="rescue-section">
                                <div class="section-header">
                                    <h3>救援海龜數據</h3>
                                    <div class="select-wrapper">
                                    <select v-model="selectedYear">
                                        <option v-for="item in impactReports" :value="item.year" :key="item.year">
                                            {{item.year +"年"}}
                                        </option>
                                    </select>
                                    </div>
                                </div>
            
                                <div class="stats-grid">
                                    <div class="stat-item">
                                    <span class="label">救援海龜總數</span>
                                    <AnimationNumber :value="currentData.core_metrics?.total_rescued_turtles || 0" class="value">隻</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                    <span class="label">引導入海幼龜</span>
                                    <AnimationNumber :value="currentData.core_metrics?.hatchlings_guided_to_sea || 0" class="value">隻</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                    <span class="label">巡邏海岸線</span>
                                    <AnimationNumber :value="currentData.core_metrics?.patrolled_coastline_km || 0" class="value">公里</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                    <span class="label">專業醫療手術</span>
                                    <AnimationNumber :value="currentData.core_metrics?.professional_medical_surgeries || 0" class="value">場</AnimationNumber>
                                    </div>
                                </div>
                            </section>
                            <section class="clean-section">
                                <h3>清除海洋廢棄物</h3>
                                <CleanChart :data="currentData.ocean_debris_removed_kg"/>
                            </section>
                        </div>
                        <div class="rescueCards">
                            <h2>最新救援數據</h2>
                            <SwiperRescueCards></SwiperRescueCards>
                        </div>
                        <Accordion/>
                        <div class="report">
                            <h2>徵信資料</h2>
                            <div class="reportContent">
                                <select name="" id="">
                                    <option value="">2025徵信資料表</option>
                                </select>
                                <MyButton class="btn-xxl" height="71px">資料下載</MyButton>
                            </div>
                        </div>
                </section>
            </div>
            <div class="col-12 col-md-6 col-lg-6">
                <section class="mainCom">
                        <donationCom ref="targetComponent"/>
                </section>
            </div>
        </div>
    </div>
</template>
    
    
<style scoped lang="scss">
    .mbOnlyBtn{
        display:block;
        position: fixed;
        bottom: 0;
        z-index: 99;
        @media (width >= 768px) {
            display: none !important ;  
            }
        
    }
    .container {
        //設定預設樣式
        margin-top: 32px;
        
        h2 {
            @include font-secondary;
        }
        h3 {
            @include font-tertiary;
        }
        p {
            @include font-body;
        }
        .row {
            //手機板捐款組件在上面
            @media (width < 768px) {
                flex-direction: column-reverse;
                gap: 32px;
                margin-top: 32px;
                overflow-x: hidden;
            }
        }
        .otherCom {
            
            // margin-top: 32px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            .rescueChart{
                width: 100%;
                margin-top: 0px;
                // height: 727px;
                display: flex;
                flex-direction: column;
                align-items: center;
                background-color: $secondary-color;
                background: url(@/assets/image/DonationView/sea.png) center / cover no-repeat;
                padding-top: 24px;
                padding-bottom: 24px;
                h2 {
                    text-align: center;
                    color: #fff;
                }
                .rescue-section {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 76px;
                    margin-top: 32px;
                    .section-header {
                        display: flex;
                        justify-content: space-between;
                        h3 {
                            color: #fff;
                            
                        }
                        .select-wrapper {
                            select {
                                @include font-body;
                                background-color: #CFDEE0;
                                display: flex;
                                align-items: center;
                                padding: 8px 16px;
                                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e"); // 放入 SVG 箭頭
                                background-repeat: no-repeat;
                                background-position: right 10px center; /* 定位在右側中間 */
                                background-size: 12px;
                                padding-right: 30px; /* 預留空間給箭頭 */
                            }
                        }
    
                    }
                    .stats-grid {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                        gap: 52px 20%;
                        margin-bottom: 80px;
                        .stat-item {
                            min-width: 40%; //暫時
                            display: flex;
                            align-items: baseline;
                            gap: 4px;
                            .label {
                                @include font-body-l;
                                flex-shrink: 0;
                                color: #fff
                            }
                            .value {
                                @include font-tertiary;
                                flex-shrink: 0;
                                color: #fff
                            }
                        }
                    }
                }
                .clean-section {
                    width: 100%;
                    h3 {
                        color: #fff;
                        text-align: center;
                        margin-bottom: 36px;
                    }
                }
            }
            .rescueCards {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 80px;
                h2 {
                    @include font-secondary;
                    color: $primary-color;
                }
            }
            .report {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 80px;
                margin-bottom: 76px;
                h2 {
                    @include font-secondary;
                    color: $primary-color;
                }
                .reportContent {
                    display: flex;
                    width: 100%;
                    gap: 24px;
                    select {
                        text-align: center;
                        width: 50%;
                        position: relative;
                        border: 2px solid $secondary-color;
                        @include font-tertiary;
                        color: $secondary-color;
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e"); // 放入 SVG 箭頭
                        background-repeat: no-repeat;
                        background-position: right 10px center; /* 定位在右側中間 */
                        background-size: 12px;
                        padding-right: 24px; /* 預留空間給箭頭 */
                        @media (768px<=width<1000px) {
                            padding-right: 12px;
                            background-position: right 0px center;
                            font-size: $m-size-tertiary;
                        }
                        @media (width<430px) {
                            padding-right: 12px;
                            background-position: right 0px center;
                        }
                    }
                    button {
                        width: 50%;
                    }
                }
            }
        }
        .mainCom {
            height: 100%;
            z-index: 999;
        }
    }

        
    
</style>