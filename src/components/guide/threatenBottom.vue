<script setup>
import { ref } from 'vue';
import LightboxModal from '@/components/guide/LightboxModal.vue';
import { cardData } from '@/components/guide/threatenData';

// --- 1. 新增：定義控制燈箱的變數 ---
// const isModalOpen = ref(false); // 控制開關 (預設關閉)
// const currentItem = ref({});    // 暫存被點到的那一筆資料

// // --- 2. 新增：開啟燈箱的函式 ---
// const openModal = (item) => {
//     console.log("點擊到了:", item.title); // 可以用這行檢查有沒有點擊成功
//     currentItem.value = item; // 把點到的資料存起來
//     isModalOpen.value = true; // 打開燈箱
// };

</script>
<template>
    <section class="flexCard container">
        <div v-for="item in cardData" :key="item.id" class="bottomcard" > <!-- @click="openModal(item)" -->
            <img :src="item.image">

            <div class="overlay">
                <div class="overlayContent">
                    <h3>{{ item.title }}</h3>
                    <p v-html="item.title2"></p>
                </div>
            </div>
        </div>
    </section>
    <!-- <LightboxModal :isOpen="isModalOpen" :item="currentItem" @close="isModalOpen = false" /> -->
</template>

<style lang="scss" scoped>
.flexCard {
    margin: 67px auto;
    display: flex;
    width: 100%;
    height: 400px;
    overflow: hidden;
}

.bottomcard {
    flex: 1;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    &:hover {
        flex: 1.5;

        .overlay {
            opacity: 1;
        }
    }
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: all 0.3s ease;
    background: rgba(0, 0, 0, 0.6);
    padding: 20px;
    box-sizing: border-box;
}

.overlayContent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: white;
    z-index: 100;

    h3 {
        font-size: $d-size-tertiary;
        font-weight: bold;
    }

    p {
        font-size: $size-body;
        font-weight: bold;
        line-height: 1.5;
        text-align: center;
    }
}
</style>