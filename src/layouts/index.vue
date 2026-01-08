<script setup>
    import MainHeader from '@/components/Header.vue';
    import MainFooter from '@/components/Footer.vue';
    import MainBanner from '@/components/Banner.vue';
</script>

<template>
    <MainHeader />
    <Banner v-if="$route.path !== '/guide'" />
    <RouterView />
    <MainFooter />
</template>
    
    
<style scoped lang="scss">
    
</style>