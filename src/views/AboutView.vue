<script setup>
import AboutBanner from '@/components/about/Banner.vue'
import AboutIntro from '@/components/about/Intro.vue'
import AboutExperts from '@/components/about/Experts.vue'
import AboutPartners from '@/components/about/Partners.vue'
import AboutReport from '@/components/about/Report.vue'
</script>
<template>
  <div class="banner">
    <AboutBanner />
  </div>
  <div class="intro">
    <AboutIntro />
  </div>
  <div class="experts">
    <h2>專業團隊</h2>
    <AboutExperts />
  </div>
  <div class="partners">
    <h2>企業合作夥伴</h2>
    <AboutPartners />
  </div>
  <div class="reports">
    <h2>跨界公信，透明守護<br />我們的努力備受肯定</h2>
    <AboutReport />
  </div>
</template>
<style lang="scss" scoped>
.banner {
  margin-top: 5.5rem;
}
.intro {
  margin-top: 5.5rem;
}
.experts {
  margin-top: 9rem;
}
.partners {
  margin-top: 9rem;
}
.reports {
  margin-top: 9rem;
}

h2 {
  @include font-secondary;
  width: 100%;
  text-align: center;
  display: block;
  margin-bottom: 3.5rem;
}
</style>
