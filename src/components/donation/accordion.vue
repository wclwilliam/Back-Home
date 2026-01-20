<script setup>
import { ref, onMounted } from 'vue';
import { publicApi } from "@/utils/publicApi";

const items = ref([])


onMounted(() => {
        publicApi.get('data/donationAccordion.json').then((response) => {
            items.value = response.data
        })
    })


// 初始值設定為 0 (代表第一格預設打開)
const activeIndex = ref(0);

// 切換邏輯
const toggle = (index) => {
  // 如果點擊的是已經打開的那一格，可以選擇關閉它或保持打開
  // 這裡設定：如果是單選手風琴，通常點擊同一格不會關閉，除非你想增加切換功能
  if (activeIndex.value === index) {
    activeIndex.value = -1
  } else {

      activeIndex.value = index;
  }
};
// 動畫輔助：計算高度 (選用，為了讓 CSS transition 生效)
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
                                border-color: #0000;
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