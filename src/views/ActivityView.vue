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
      <RescueCard></RescueCard>
      <ActivityCard 
      :id="1" 
      image="https://picsum.photos/300/200" 
      title="海龜湯解開海洋謎題解開海洋謎題謎解開" 
      status="open"
      type="淨灘" 
      date="2026/01/04(日) 14:00-15:00" 
      location="新北萬里翡翠灣" 
      :currentPeople="20" 
      :maxPeople="40" />
      <ActivityCard 
      :id="1" 
      image="https://picsum.photos/300/200" 
      title="海龜湯解開海洋謎題解開海洋謎題謎解開" 
      status="open"
      type="淨灘" 
      date="2026/01/04(日) 14:00-15:00" 
      location="新北萬里翡翠灣" 
      :currentPeople="20" 
      :maxPeople="40" />
  
      <TeamMemberCard></TeamMemberCard>
  
      <NewsCard></NewsCard>
      <NewsCard></NewsCard>
      <NewsCard></NewsCard>
      <ActivityCard></ActivityCard>
      <ActivityCard></ActivityCard>
    </div>
  </div>
</template>
