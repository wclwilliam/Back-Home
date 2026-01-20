<script setup>
// 1. 從 vue-router 引入 useRouter
import { useRouter } from 'vue-router'
import turtleMap from '@/components/guide/Guidemap.vue'

// 2. 宣告 router 變數
const router = useRouter()

const goBack = () => {
    router.back() 
}
</script>

<template>
    <button class="btn btn-outline" @click="goBack">上一頁</button>
    <turtleMap/>
</template>

<style lang="scss" scoped>

</style>