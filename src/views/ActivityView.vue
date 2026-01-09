<script setup>
import ActivityCard from '@/components/cards/ActivityCard.vue';
import NewsCard from '@/components/cards/NewsCard.vue';
import TeamMemberCard from '@/components/cards/TeamMemberCard.vue';
import RescueCard from '@/components/cards/RescueCard.vue';

const eventData = {
  id: 1,
  image: 'https://picsum.photos/300/200',
  title: '海龜湯：解開海洋謎題',
  status: 'open',
  type: '淨灘',
  date: '2026/1/4(日) 14:00-15:00',
  location: '新北萬里翡翠灣',
  currentPeople: 20,
  maxPeople: 40
};
const newsData = {
  id: 1,
  image : 'https://picsum.photos/300/200',
  title : '守護海洋安全第一：【龜途】2025 綠蠵龜棲地守護淨灘活動延期通知延期通知延',
  typeBadge : '異動通知',
  date : '2025.12.31',
}
const memberData = {
  title :'林明杰 醫師 (Dr. Michael Lin)',
  jobTitle:'醫療救援組長',
  expertise:'專長：海龜臨床外科手術、爬蟲類放射線醫學。',
  description:`林醫師擁有超過十年的海洋生物救護經驗，是協會醫療中心的靈魂人物。 他曾主持過數百場海龜異物取出手術，精通精確的內視鏡醫療與複雜的背甲縫合技術。
對他而言，最幸福的時刻不是完成一場成功的手術，而是親手將復健完成的海龜放回海中，看著牠們奮力划向深藍的背影。`
}

const rescueData = {
  id: 1,
  image: 'https://picsum.photos/300/200',
  name: '阿福',
  species:'(綠蠵龜)',
  description: '2025年10月發現於澎湖龍門沙灘，遭廢棄漁網纏繞導致左前肢壞死。阿福剛來時極度虛弱，經過截肢手術後，目前正在練習用三隻鰭狀肢游泳，每天的餐費與藥費是牠最大的支柱。',
  stage: 2 //階段：1~5
}
</script>
<template>
  <h1>志工活動</h1>
  <div class="container">
    <div class="row">
      <RescueCard v-bind="rescueData"/>
      <ActivityCard v-bind="eventData" />
      <TeamMemberCard v-bind="memberData"></TeamMemberCard>
      <NewsCard v-bind="newsData"/>
    </div>
  </div>
</template>
