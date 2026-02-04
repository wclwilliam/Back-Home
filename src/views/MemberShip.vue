<template>
    <div class="membership-page">
        <Banner imgName="member" title="會員中心" />

        <MemberTabs :model-value="currentTabIndex" @update-tab="handleTabChange" />

        <div class="membership-content">
        <MemberInfoForm v-if="currentTabIndex === 0" />
        <MemberActivity v-else-if="currentTabIndex === 1" />
        <MemberDonation v-else-if="currentTabIndex === 2" />
        <MemberFavorite v-else-if="currentTabIndex === 3" />
        </div>
    </div>
    </template>

    <script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MemberTabs from '@/components/auth/MemberTabs.vue';

// 引入四個內容元件
import MemberInfoForm from '@/components/auth/MemberInfoForm.vue';
import MemberActivity from '@/components/auth/MemberActivity.vue';
import MemberDonation from '@/components/auth/MemberDonation.vue';
import MemberFavorite from '@/components/auth/MemberFavorite.vue';
import Banner from '@/components/Banner.vue';

const router = useRouter();
const route = useRoute();

// section 對應關係
const sectionMap = {
  'info': 0,
  'activity': 1,
  'donation': 2,
  'favorite': 3
};

const indexToSection = ['info', 'activity', 'donation', 'favorite'];

// 追蹤當前分頁索引
const currentTabIndex = ref(0);

// 初始化：根據 URL 的 section 參數設定 tab
const initTabFromUrl = () => {
  const section = route.query.section || 'info';
  currentTabIndex.value = sectionMap[section] || 0;
};

onMounted(() => {
  initTabFromUrl();
});

// 監聽整個 query 變化，確保 tab/page 參數消失時也能更新
watch(() => route.query, () => {
  initTabFromUrl();
}, { deep: true });

// 接收從 MemberTabs 傳過來的 index
const handleTabChange = (index) => {
  currentTabIndex.value = index;
  // 使用 replace 而不是 push，並強制更新 URL
  router.replace({ 
    path: route.path,
    query: { 
      section: indexToSection[index]
      // 不保留 tab 和 page，讓子組件重新初始化
    } 
  });
};
</script>

    <style lang="scss" scoped>
    @import "@/assets/scss/base/_color.scss";

    .membership-content {
    //padding: 0 $desktop-margin; // 使用你定義的 240px 邊距
    min-height: 500px; // 給內容區一個最小高度，避免頁面跳動
    }

    @media (max-width: 768px) {
    .membership-content {
        padding: 0 $mobile-margin; // 手機版縮小邊距
    }
    }
</style>