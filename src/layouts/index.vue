<script setup>
    import MainHeader from '@/components/Header.vue';
    import MainFooter from '@/components/Footer.vue';
    import MainBanner from '@/components/Banner.vue';
</script>

<template>
    <MainHeader />
    <MainBanner />
    <RouterView />
    <MainFooter />
</template>
    
    
<style scoped lang="scss">
    
</style>