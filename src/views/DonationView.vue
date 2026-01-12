<script setup>
    import Banner from "@/components/Banner.vue";
    import RescueCard from "@/components/cards/RescueCard.vue";
    import Accordion from "@/components/donation/accordion.vue";
    import donationCom from "@/components/donation/donationCom.vue";
    import MyButton from "@/components/donation/MyButton.vue";
    import { ref } from 'vue';

    const selectedYear = ref('');
</script>

<template>
    <Banner  imgName="donation" title="支持保育"/>
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
                                    <option value="">選擇年份</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                </select>
                                </div>
                            </div>
        
                            <div class="stats-grid">
                                <div class="stat-item">
                                <span class="label">救援海龜總數</span>
                                <span class="value">965 <small>隻</small></span>
                                </div>
                                <div class="stat-item">
                                <span class="label">引導入海幼龜</span>
                                <span class="value">624 <small>隻</small></span>
                                </div>
                                <div class="stat-item">
                                <span class="label">巡邏海岸線</span>
                                <span class="value">15,420 <small>公里</small></span>
                                </div>
                                <div class="stat-item">
                                <span class="label">專業醫療手術</span>
                                <span class="value">142 <small>場</small></span>
                                </div>
                            </div>
                            </section>
                        </div>
                        <div class="rescueCards">
                            <h2>最新救援數據</h2>
                            <RescueCard v-bind="{
                                id: 1,
                                image: 'https://picsum.photos/300/200',
                                name: '阿福',
                                species:'(綠蠵龜)',
                                description: '2025年10月發現於澎湖龍門沙灘，遭廢棄漁網纏繞導致左前肢壞死。阿福剛來時極度虛弱，經過截肢手術後，目前正在練習用三隻鰭狀肢游泳，每天的餐費與藥費是牠最大的支柱。',
                                stage: 2 //階段：1~5
                                }"
                                class="col-sm-12 col-md-12 col-lg-12"></RescueCard>
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
                        <donationCom/>
                </section>
            </div>
        </div>
    </div>
</template>
    
    
<style scoped lang="scss">
    .container {
        //設定預設樣式
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
            }
        }
        .otherCom {
            margin-top: 70px;
            display: flex;
            flex-direction: column;
            gap: 32px;
            .rescueChart{
                width: 100%;
                height: 727px;
                background-color: $secondary-color;
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
                                width: 160px;
                                padding: 8px;
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
                        .stat-item {
                            width: 40%;
                            color: #fff;
                            display: flex;
                            gap: 4px;
                            .label {
                                @include font-body-l;
                                flex-shrink: 0;
                            }
                            .value {
                                @include font-tertiary;
                                flex-shrink: 0;
                            }
                        }
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
                        width: 50%;
                        position: relative;
                        border: 2px solid $secondary-color;
                        @include font-tertiary;
                        color: $secondary-color;
                        padding-left: 32px;
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e"); // 放入 SVG 箭頭
                        background-repeat: no-repeat;
                        background-position: right 10px center; /* 定位在右側中間 */
                        background-size: 12px;
                        padding-right: 30px; /* 預留空間給箭頭 */
                    }
                    button {
                        width: 50%;
                    }
                }
            }
        }
        .mainCom {
            height: 100%;
        }
    }

        
    
</style>