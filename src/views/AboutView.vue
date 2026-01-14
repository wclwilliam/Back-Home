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
    <AboutExperts />
  </div>
  <div class="partners">
    <AboutPartners />
  </div>
</template>
<style scoped>
.banner {
  margin: 5.5rem 0;
}
.intro {
  margin: 3.5rem 0;
}
</style>
