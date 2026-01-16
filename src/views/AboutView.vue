<script setup>
import AboutBanner from '@/components/about/Banner.vue'
import AboutIntro from '@/components/about/Intro.vue'
import AboutExperts from '@/components/about/Experts.vue'
import AboutPartners from '@/components/about/Partners.vue'
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

h2 {
  @include font-secondary;
  width: 100%;
  text-align: center;
  display: block;
  margin-bottom: 3.5rem;
}
</style>
