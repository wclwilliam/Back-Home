<script setup>
    import Banner from "@/components/Banner.vue";
    import Accordion from "@/components/donation/accordion.vue";
    import donationCom from "@/components/donation/donationCom.vue";
    import MyButton from "@/components/donation/MyButton.vue";
    import SwiperRescueCards from "@/components/donation/SwiperRescueCards.vue";
    import AnimationNumber from "@/components/donation/AnimationNumber.vue";
    import CleanChart from "@/components/donation/CleanChart.vue";
    import {  ref, onMounted, computed, onUnmounted,watch } from 'vue';
    import { publicApi , backHomeApi, APIBase } from "@/utils/publicApi";
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
    import axios from "axios";

    // 註冊外掛
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

    

    // gsap邏輯
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

    const impactSelectedYear = ref('');
    const impactReports =ref([])
    const reportSelectYear = ref('');
    const creditReports = ref([]);
    const reportSelectPath = ref('');
    


    // 連資料庫我們的影響力
    onMounted(async () => {
        await backHomeApi.get('donation/impact_get.php').then((response) => {
            impactReports.value = response.data
            // console.log(impactReports.value);
            
            //進頁面給值
            impactSelectedYear.value = impactReports.value[0].year
        })
    })

    // // 連json
    // onMounted(() => {
    //     publicApi.get('data/impactReports.json').then((response) => {
    //         impactReports.value = response.data
    //         console.log(impactReports.value);
            
    //         //進頁面給值
    //         impactSelectedYear.value = impactReports.value[0].year
    //     })
    // })

    // 連資料庫徵信資料
    onMounted(async () => {
        await backHomeApi.get('donation/report_get.php').then((response) => {
            // console.log(response.data);
            creditReports.value = response.data

            //進頁面給值
            reportSelectYear.value = creditReports.value[0].DATA_YEAR
        })
    })

    const impactCurrentData = computed(() => {
    return impactReports.value.find(item => item.year === impactSelectedYear.value) || {};
    });

    const reportCurrentData = computed(() => {
    return creditReports.value.find(item => item.DATA_YEAR === reportSelectYear.value) || {};
    });
    
    watch(reportCurrentData,() =>{
        reportSelectPath.value = reportCurrentData.value.FILE_PATH.replace("reports/","")
        
    })


    /**
 * 非同步下載圖片函數
 * @param {string} imgName - 圖片的識別名稱（例如：2025_Q1）
 */
const downloadImage = async (imgName) => {
  try {
    // 使用 axios 發送請求
    const response = await backHomeApi.get(`donation/report_download.php?file=${reportSelectPath.value}`,{
        /**
         * 關鍵設定：responseType
         * 告訴 axios 將伺服器回傳的數據處理成 'blob' (Binary Large Object)
         * 這對於圖片、PDF、Excel 等非文字檔案是必須的，否則數據會被當作字串解析導致損壞
         */
        responseType: 'blob'
    }
    );

    /**
     * 1. 建立一個指向該 Blob 數據的臨時 URL
     * response.data 包含了從伺服器拿到的二進位原始數據
     * URL.createObjectURL 會產生一個像 "blob:http://localhost:5173/..." 的字串
     * 這個字串可以被瀏覽器當作實體檔案路徑來讀取
     */
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    /**
     * 2. 模擬使用者點擊下載連結
     * 由於 blob URL 不能直接用 window.open 開啟，我們必須建立一個虛擬的 <a> 標籤
     */
    const link = document.createElement('a');
    link.href = url;
    
    /**
     * 設定 download 屬性
     * 這會強制瀏覽器執行「下載」而非「開啟」
     * 這裡自定義了下載後的檔案名稱
     */
    link.setAttribute('download', imgName + "徵信資料.png"); 
    
    // 將標籤暫時加入 DOM 樹中（某些瀏覽器要求標籤必須在 DOM 內才能觸發 click）
    document.body.appendChild(link);
    
    // 程式觸發點擊動作
    link.click();

    /**
     * 3. 資源清理 (Memory Management)
     * 檔案下載後，這個標籤就不再需要了，將其從頁面移除
     */
    link.parentNode.removeChild(link);
    
    /**
     * 釋放記憶體
     * URL.createObjectURL 產生的 URL 會一直佔用瀏覽器記憶體
     * 使用 revokeObjectURL 告訴瀏覽器可以回收這個資源了
     */
    window.URL.revokeObjectURL(url);

  } catch (error) {
    // 捕捉請求失敗、檔案不存在或網路問題
    console.error("下載失敗:", error);
    alert("無法下載圖片，請檢查後端路徑或權限。");
  }
};

    
</script>

<template>
    <Banner  imgName="donation" title="支持保育"/>
    <MyButton class="btn-xxl mbOnlyBtn" width="100%" ref="bottomBtn" @click="scrollToTarget">立即捐款</MyButton>
    <div class="container">
        <div class="row">
            <div class="col-12 col-md-6 col-lg-6 left">
                <section class="otherCom">
                        <div class="rescueChart container">
                            <h2>我們的影響力數據</h2>
                            <section class="rescue-section">
                                <div class="section-header">
                                    <h3>救援海龜數據</h3>
                                    <div class="select-wrapper">
                                    <select v-model="impactSelectedYear">
                                        <option v-for="item in impactReports" :value="item.year" :key="item.year">
                                            {{item.year +"年"}}
                                        </option>
                                    </select>
                                    </div>
                                </div>
            
                                <div class="stats-grid">
                                    <div class="stat-item">
                                        <span class="material-symbols-outlined">
                                        healing
                                        </span>
                                    <span class="label">救援海龜總數</span>
                                    <AnimationNumber :value="impactCurrentData.core_metrics?.total_rescued_turtles + impactCurrentData.core_metrics?.turtles_released || 0" class="value">隻</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                        <span class="material-symbols-outlined">
                                        egg
                                        </span>
                                    <span class="label">引導入海幼龜</span>
                                    <AnimationNumber :value="impactCurrentData.core_metrics?.hatchlings_guided_to_sea || 0" class="value">隻</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                        <span class="material-symbols-outlined">
                                        anchor
                                        </span>
                                    <span class="label">巡邏海岸線</span>
                                    <AnimationNumber :value="impactCurrentData.core_metrics?.patrolled_coastline_km || 0" class="value">公里</AnimationNumber>
                                    </div>
                                    <div class="stat-item">
                                        <span class="material-symbols-outlined">
                                        health_cross
                                        </span>
                                    <span class="label">專業醫療手術</span>
                                    <AnimationNumber :value="impactCurrentData.core_metrics?.professional_medical_surgeries || 0" class="value">場</AnimationNumber>
                                    </div>
                                </div>
                            </section>
                            <section class="clean-section">
                                <h3>清除海洋廢棄物</h3>
                                <CleanChart :data="impactCurrentData.ocean_debris_removed_kg"/>
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
                                <select name="" id="" v-model="reportSelectYear">
                                    <option v-for="item in creditReports" :value="item.DATA_YEAR">{{item.DATA_YEAR}}徵信資料表</option>
                                </select>
                                <MyButton class="btn-xxl" height="71px" @click="downloadImage(reportCurrentData.DATA_YEAR)">資料下載</MyButton>
                            </div>
                        </div>
                </section>
            </div>
            <div class="col-12 col-md-6 col-lg-6 right">
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
            .left {
                z-index: 1;
            }
            .right {
                z-index: 1;
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
                                color: $secondary-color;
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
                        justify-content: space-between;
                        width: 100%;
                        gap: 52px 16px;
                        margin-bottom: 80px;
                        .material-symbols-outlined {
                        font-variation-settings:
                        'FILL' 0,
                        'wght' 400,
                        'GRAD' 0,
                        'opsz' 20;
                        @include font-body-l;
                        color: #Fff;
                        }
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