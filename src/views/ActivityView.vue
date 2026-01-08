<script setup>
import ActivityCard from '@/components/cards/ActivityCard.vue';
import NewsCard from '@/components/cards/NewsCard.vue';
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue';
import RescueCard from '@/components/cards/RescueCard.vue';
</script>
<template>
  <h1>志工活動</h1>
  <div class="container">
    <div class="row">
      <RescueCard></RescueCard>
      <TeamMemberCard></TeamMemberCard>
      <ActivityCard></ActivityCard>
      <NewsCard></NewsCard>
      <NewsCard></NewsCard>
      <NewsCard></NewsCard>
      <ActivityCard></ActivityCard>
      <ActivityCard></ActivityCard>
    </div>
  </div>
</template>
