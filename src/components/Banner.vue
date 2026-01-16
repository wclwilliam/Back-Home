<script setup>
import { computed } from "vue";

const props = defineProps({
  imgName: {
    type: String,
    default: 'default' // 預設值
  },
  title: {
    type: String,
    default: '歡迎光臨'
  }
});

// 注意：Vite/Webpack 在執行時無法直接解析字串內的 @ 符號，建議圖片放在 public 或透過 new URL 處理
const imgURL = computed(() => {
  // 注意：這裡的路徑必須是相對於當前這個 .vue 檔的「相對路徑」
  // 並且末尾要加上 .href
  const path = new URL(`../assets/image/banner/${props.imgName}Banner.png`, import.meta.url).href;
  return `url("${path}")`;
});

</script>

<template>
    <div class="banner" :style="{backgroundImage: imgURL}">
        <h1>{{title}}</h1>
    </div>
</template>
    
    
<style scoped lang="scss">
        .banner {
                width: 100%;
                height: 400px;
                background-position-x: center;
                
                display: flex;
                justify-content: center;
                align-items: center;
                h1 {
                  @include font-primary;
                  color: $primary-color;
                }
        } 
        @media (min-width: 1920px) {
          .banner {
            background-size: 100% 400px;
            background-repeat: no-repeat;
            }
        }
</style>