<script setup>
import { useRouter } from 'vue-router'
import turtleMap from '@/components/guide/Guidemap.vue'

const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<template>
    <button class="btn btn-outline" @click="goBack">上一頁</button>
    <turtleMap />
    <div class="space"></div>
</template>

<style lang="scss" scoped>
.btn {
    margin-left: 50px;
    margin-top: 50px;

    @media(max-width:992px) {
        padding: 10px 8px;
        font-size: $m-size-caption;
        margin-bottom: 10px;
    }

}

.space {
    margin-top: 100px;

    @media (max-width:992px) {
        margin-top: 200px;

    }
}
</style>