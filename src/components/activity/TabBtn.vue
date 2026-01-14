<script setup>
const activeTab = defineModel({ default: 'current' })

const tabs = [
  { label: '目前活動', value: 'current' },
  { label: '活動回顧', value: 'review' }
]
</script>

<template>
  <div class="tab col-sm-4 col-md-12 col-lg-12">
    <div 
      class="tabItem" 
      v-for="tab in tabs" 
      :key="tab.value" 
      @click="activeTab = tab.value"
      :class="{'is-active' : activeTab === tab.value}"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>

.tab {
  display: flex;
  text-align: center;
  align-items: center;
  margin-bottom: 24px;
  background-color: $text-white; 
  
  .tabItem {
    @include font-secondary; 
    cursor: pointer;
    border: 2px solid $secondary-color; 
    flex: 1; // 讓兩個按鈕平均分配寬度
    background-color: $text-white;
    color: $secondary-color;
    padding: 18px 24px;
    transition: all 0.3s ease; // 加入過渡動畫讓切換更滑順

    // 滑鼠移過去的效果
    &:hover {
      background-color: $highlight-color2; // 淺色高亮
      color: $text-white;
      border-color: $highlight-color2;
    }

    // 被選中時的樣式 (實心背景)
    &.is-active {
      background-color: $secondary-color;
      color: $text-white;
      border-color: $secondary-color;
    }
  }
}
</style>