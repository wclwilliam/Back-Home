<script>
  import Card from '@/components/card.vue';
</script>
<template>
  <div class="home-page">
    <h1>志工活動</h1>
    
    <Card 
      title="2026 新年第一淨：萬里翡翠灣"
      :imageSrc="Imturtleg"
      date="2026/01/04(日) 14:00-15:00"
      location="新北萬里翡翠灣"
      :progress="65"
      type="淨灘"
    />
  </div>
</template>