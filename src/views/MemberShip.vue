<template>
    <div class="membership-page">
        <Header />
        <Banner title="會員中心" />

        <MemberTabs @update-tab="handleTabChange" />

        <div class="membership-content">
        <MemberInfoForm v-if="currentTabIndex === 0" />
        <MemberActivity v-else-if="currentTabIndex === 1" />
        <MemberDonation v-else-if="currentTabIndex === 2" />
        <MemberFavorite v-else-if="currentTabIndex === 3" />
        </div>

        <Footer />
    </div>
    </template>

    <script setup>
    import { ref } from 'vue';
    import MemberTabs from '@/components/auth/MemberTabs.vue';

    // 引入四個內容元件
    import MemberInfoForm from '@/components/auth/MemberInfoForm.vue';
    import MemberActivity from '@/components/auth/MemberActivity.vue';
    import MemberDonation from '@/components/auth/MemberDonation.vue';
    import MemberFavorite from '@/components/auth/MemberFavorite.vue';

    // 追蹤當前分頁索引
    const currentTabIndex = ref(0);

    // 接收從 MemberTabs 傳過來的 index
    const handleTabChange = (index) => {
    currentTabIndex.value = index;
    };
    </script>

    <style lang="scss" scoped>
    @import "@/assets/scss/base/_var.scss";

    .membership-content {
    padding: 0 $desktop-margin; // 使用你定義的 240px 邊距
    min-height: 500px; // 給內容區一個最小高度，避免頁面跳動
    }

    @media (max-width: 768px) {
    .membership-content {
        padding: 0 $mobile-margin; // 手機版縮小邊距
    }
    }
</style>