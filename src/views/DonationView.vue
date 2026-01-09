<script setup>
    import Banner from "@/components/Banner.vue";
    import RescueCard from "@/components/cards/RescueCard.vue";
    import Accordion from "@/components/donation/accordion.vue";
    import donationCom from "@/components/donation/donationCom.vue";
    import { ref } from 'vue';

    const selectedYear = ref('');
</script>

<template>
    <Banner  imgName="donation" title="支持保育"/>
    <div class="container">
        <div class="row outer">
            <section class="otherCom col-12 col-md-6 col-lg-6">
                <div class="rescueChart">
                    <h1>我們的影響力數據</h1>
                    <section class="rescue-section">
                    <div class="section-header">
                        <h2>救援海龜數據</h2>
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
                    <RescueCard></RescueCard>
                </div>
                <Accordion/>
                <div class="report">
                    <h2>徵信資料</h2>
                    <div class="reportContent">
                        <select name="" id="">
                            <option value="">2025徵信資料表</option>
                        </select>
                        <button>資料下載</button>
                    </div>
                </div>
            </section>
            <section class="mainCom col-12 col-md-6 col-lg-6">
                <donationCom/>
            </section>
        </div>
    </div>
</template>
    
    
<style scoped lang="scss">
    .otherCom {
        margin-top: 70px;
        display: flex;
        flex-direction: column;
        gap: 32px;
        .rescueChart{
            width: 100%;
            height: 727px;
            background-color: $secondary-color;
        }
        .rescueCards {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 80px;
            h2 {
                font-size: $d-size-secondary;
            }
        }
        .report {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 80px;
            h2 {
                font-size: $d-size-secondary;
            }
            .reportContent {
                display: flex;
                width: 100%;
                gap: 24px;
                select {
                    width: 50%;
                    border: 2px solid $secondary-color;
                }
                button {
                    width: 50%;
                    background-color: $secondary-color;
                }
            }
        }
    }
    .mainCom {
    }

        
    
</style>