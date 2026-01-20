<template>
  <div class="tab-switcher-container">
    <div class="tab-header">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        :class="['tab-item', { active: modelValue === tab.value }]"
        @click="$emit('update:modelValue', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * tabs: 接收陣列 [{ label: '未來活動', value: 'upcoming' }, ...]
 * modelValue: 當前選中的 value (由父組件 v-model 傳入)
 */
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.tab-header {
  display: flex;
  gap: rem(32px); // 標籤間距
  margin-bottom: rem(24px);
  border-bottom: 1px solid #E5E5E5; // 底線

  .tab-item {
    padding: rem(12px) 0;
    border: none;
    background: none;
    font-size: rem(18px);
    color: #999;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    @include font-body-bold;

    &:hover {
      color: $secondary-color;
    }

    &.active {
      color: $secondary-color;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px; // 貼合底線
        left: 0;
        width: rem(40px); //分頁底線寬度
        height: 3px;
        background-color: $secondary-color;
      }
    }
  }
}

.tab-content {
  width: 100%;
}
</style>