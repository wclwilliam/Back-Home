<template>
    <nav class="member-tabs">
        <div class="tabs-container">
        <div 
            v-for="(tab, index) in tabs" 
            :key="index"
            class="tab-item"
            :class="{ 'is-active': activeTab === index }"
            @click="changeTab(index)"
        >
            <span class="material-symbols-outlined icon">{{ tab.icon }}</span>
            <span class="tab-text">{{ tab.name }}</span>
        </div>
        </div>
    </nav>
    </template>

    <script setup>
    import { ref } from 'vue';

    // 1. 定義分頁資料：包含顯示文字與對應的 Google Icon 名稱
    const tabs = [
    { name: '個人資訊', icon: 'account_circle' },
    { name: '我的活動', icon: 'flag_2' },
    { name: '捐款紀錄', icon: 'volunteer_activism' },
    { name: '收藏夾', icon: 'bookmark' }
    ];

    // 2. 建立一個響應式變數來追蹤「目前選中的分頁索引」
    // 預設為 0，代表一進頁面就選中「個人資訊」
    const activeTab = ref(0);

    // 3. 點擊分頁時執行的函式
    const changeTab = (index) => {
    activeTab.value = index;
    // 提示：未來如果你要做頁面跳轉，可以在這裡加入 router.push()
    console.log(`切換到了：${tabs[index].name}`);
    };
    </script>

    <style lang="scss" scoped>
    // 引用組員建置好的全域變數
    @import "@/assets/scss/base/_var.scss";

    .member-tabs {
    width: 100%;
    border-bottom: 1px solid #ddd; // 底部的裝飾細線
    margin-top: rem(40px);
    margin-bottom: rem(40px);

    .tabs-container {
        display: flex;
        justify-content: center; // 分頁水平居中
        gap: rem(60px);          // 分頁之間的間隔
        max-width: 1200px;
        margin: 0 auto;
    }
    }

    .tab-item {
    display: flex;
    align-items: center;
    gap: rem(8px);
    padding: rem(12px) 0;
    cursor: pointer;
    color: $text-color;       // 使用你的變數 #333333
    transition: all 0.3s ease;
    border-bottom: 4px solid transparent; // 預留底部條的位置，防止跳動

    .icon {
        font-size: rem(24px);
    }

    .tab-text {
        font-size: $size-quaternary; // 使用你的變數 20px
        font-weight: 500;
    }

    // 滑鼠移入及選中狀態 (Active) 的樣式
    &:hover, &.is-active {
        color: $secondary-color;    // 變為深綠色 #0E6273
        border-bottom: 4px solid $secondary-color; // 出現深綠色底部條
        
        .icon {
        // 讓 Google Icon 變粗或填滿（如果該 Icon 支援）
        color: $secondary-color; 
        font-variation-settings: 'FILL' 1, 'wght' 500;
        }
    }
    }

    // 響應式：手機版時縮小間距與字體
    @media (max-width: 768px) {
    .member-tabs .tabs-container {
        gap: rem(20px);
        padding: 0 $mobile-margin;
    }
    .tab-text {
        font-size: $m-size-caption; // 轉為手機版小字
    }
}
</style>