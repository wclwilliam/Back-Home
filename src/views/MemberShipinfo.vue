<script setup>
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
// 1. 引入剛剛寫好的元件
import Button from '@/components/auth/Button.vue'
import Lightbox from '@/components/Lightbox.vue'

const props = defineProps({
    id: String
})

const info = ref(null)

// 2. 控制燈箱顯示與標題的變數
const isLightboxOpen = ref(false)
const currentActivityTitle = ref('')

const openCancelModal = (title) => {
    currentActivityTitle.value = title
    isLightboxOpen.value = true
}

const handleConfirmCancel = () => {
    console.log(`已確認取消活動：${currentActivityTitle.value}`)
    // 這裡之後放取消報名的 API 邏輯
    isLightboxOpen.value = false
}

onMounted(() => {
    axios
        .get('/data/MemberShipinfo.json')
        .then((response) => {
            info.value = response.data
        })
        .catch(err => console.error("資料載入失敗", err))
})
</script>

<template>
    <main class="activity-page">
        <h1 class="page-title">我的活動</h1>
        
        <div v-if="info && info.activities" class="activity-list">
            <div v-for="item in info.activities" :key="item.id" class="activity-item">
                <div class="info-content">
                    <h3 class="activity-title">{{ item.title }}</h3>
                    <p class="activity-detail">活動時間：{{ item.time }}</p>
                    <p class="activity-detail">活動地點：{{ item.location }}</p>
                </div>
                
                <div class="action-links">
                    <Button variant="outline" @click="console.log('更改資料')">更改報名資料</Button>
                    <Button variant="outline" @click="openCancelModal(item.title)">取消報名</Button>
                </div>
            </div>
        </div>

        <div v-else-if="!info">
            載入中...
        </div>

        <Lightbox 
            v-model="isLightboxOpen" 
            @confirm="handleConfirmCancel"
        >
            <template #title>確定要取消「{{ currentActivityTitle }}」的報名嗎？</template>
        </Lightbox>
    </main>
</template>

<style lang="scss" scoped>
/* 引用你的變數 */
@import '@/assets/scss/base/_var.scss';

.activity-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;

    .page-title {
        font-size: 24px;
        margin-bottom: 30px;
        color: $primary-color; // 統一使用你的品牌色
    }
}

.activity-item {
    display: flex;
    justify-content: space-between;
    align-items: center; // 這裡改成 center 元件會比較整齊
    padding: 20px 0;
    border-bottom: 1px solid #ddd;

    .activity-title {
        font-size: 18px;
        margin: 0 0 10px 0;
        color: #000;
    }

    .activity-detail {
        margin: 5px 0;
        font-size: 14px;
        color: #666;
    }
}

.action-links {
    display: flex;
    gap: 15px; // 調整按鈕間距
}
</style>