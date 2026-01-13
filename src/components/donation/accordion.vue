<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([])

onMounted(() => {
  axios.get('/public/data/donationAccordion.json').then((response) => {
    items.value = response.data
  })
})

// 1. 定義資料
// const items = ref([
//   { title: '我的捐款會如何被使用？', content: '您的捐款 85% 將直接用於海龜的實際救援、醫療復健，以及棲地巡邏與淨灘。其餘 15% 用於支持專業的保育研究、教育推廣與行政管理，確保我們的行動能夠持續且高效運行。' },
//   { title: '我是否可以指定捐款的用途？', content: '我們目前設有「海龜醫療基金」和「棲地巡邏基金」兩大選項供您選擇。若您未特別指定，資金將投入當前最緊急且最需要資源的保育項目。' },
//   { title: '我如何確認我的捐款是否用於實際的海龜救援？', content: '我們承諾每年公開經過第三方查核的財務報告，並每月更新捐款徵信與救援行動紀錄。您可以隨時在我們的「捐款徵信」頁面查看資金流向與成果數據。' },
//   { title: '身為一位忙碌的上班族，我還有機會參與志工活動嗎？', content: '絕對可以！我們設有週末淨灘專案及辦公室行政支援的志工機會。許多專案特別安排在非工作時間，讓您能在不影響正職的情況下，也能為海龜貢獻一份心力。' },
//   { title: '志工需要具備專業的海洋知識或特殊技能嗎？', content: '不需要。大部分的淨灘與基礎巡邏工作會提供完整的行前培訓。若是您具備醫療、攝影、數據分析或社群媒體技能，也歡迎告知，我們會安排您參與更專業的支援工作。' },
// ]);

// 2. 初始值設定為 0 (代表第一格預設打開)
const activeIndex = ref(0);

// 3. 切換邏輯
const toggle = (index) => {
  // 如果點擊的是已經打開的那一格，可以選擇關閉它或保持打開
  // 這裡設定：如果是單選手風琴，通常點擊同一格不會關閉，除非你想增加切換功能
  if (activeIndex.value === index) {
    activeIndex.value = -1
  } else {

      activeIndex.value = index;
  }
};
// 4. 動畫輔助：計算高度 (選用，為了讓 CSS transition 生效)
const contentStyle = (index) => {
  return {
    gridTemplateRows: activeIndex.value === index ? '1fr' : '0fr',
    opacity: activeIndex.value === index ? 1 : 0
  };
};
</script>

<template>
    <div class="faq">
        <h2 class="faqTitle">常見問題</h2>
        <div class="accordion">
            <div 
                class="accordionItem"
                v-for="(item, index) in items"
                :key="index"
                :class="{ active: activeIndex === index }"
            >
                <button class="accordion-header" @click="toggle(index)">
                    {{ item.title }}
                </button>
                <div class="accordion-content" :style="contentStyle(index)">
                    <div class="accordion-inner">
                        <p>{{ item.content }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
    
<style scoped lang="scss">
    .faq {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 40px;
            .faqTitle {
                @include font-secondary;
                color: $primary-color;
            }
            .accordion {
                    width: 100%;
                    .accordionItem {
                        button {
                            display: flex;
                            gap: 1rem;
                            align-items: center;
                            padding: 2rem;
                            width: 100%;
                            background-color: #0000;
                            border: none;
                            border-top: 1px solid $secondary-color;
                            @include font-body-l-bold;
                            color: $primary-color;
                            line-height: 1.4;
                            &:focus {
                                z-index: 3;
                                border-color: $highlight-color1;
                                outline: 0;
                                box-shadow: 0 0 0 2px $highlight-color1;
                            }
        
                            &::before {
                                width: 1.25rem;
                                height: 1.25rem;
                                content: " ";
                                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
                                background-repeat: no-repeat;
                                background-size: 1.25rem;
                                transition: transform 0.3s ease-in-out;
                                flex-shrink: 0;
                            }
                        }
                        .accordion-content {
                            display: grid;
                            width: 100%;
                            transition: all 0.2s ease-in-out;
                            overflow: hidden;
                            .accordion-inner {
                                /* 關鍵 3：必須設定 min-height，否則 0fr 會失效 */
                                min-height: 0; 
                                /* 關鍵 4：將原本的垂直 Padding 放在這裡 */
                                p {
                                    padding: 32px 16px;
                                    @include font-body;
                                    color: $text-color;
                                }
                            }
                        }
                    }
                    .active {
                        button {
                            box-shadow: inset 0 -1px 0 $secondary-color;
                            &::before {
                                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%230c63e4'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
                                transform: rotate(-180deg);
                            }
                        }
                    }
                }
        }
</style>