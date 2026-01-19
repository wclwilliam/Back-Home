<script setup>
import IndexBanner from '@/components/home/Banner.vue'
import IndexHazardous from '@/components/home/Hazardous.vue'
import IndexSavedChart from '@/components/home/SavedChart.vue'
import IndexSavedCases from '@/components/home/SavedCases.vue'
import IndexNews from '@/components/home/News.vue'
import IndexSeaTurtle from '@/components/home/SeaTurtle.vue'
</script>
<template>
  <h1>首頁</h1>
  <IndexBanner />
  <IndexHazardous />
  <div class="savedChart">
    <h2>我們已經幫助了......</h2>
    <IndexSavedChart />
  </div>
  <IndexSavedCases />
  <div class="news">
    <h2>最新消息</h2>
    <IndexNews />
  </div>
  <IndexSeaTurtle />
</template>
<style lang="scss" scoped>
.savedChart {
  margin-top: 5.5rem;
}

.news {
  margin-top: 5.5rem;
}

h2 {
  @include font-secondary;
  width: 100%;
  text-align: center;
  display: block;
  margin-bottom: 3.5rem;
}
</style>
