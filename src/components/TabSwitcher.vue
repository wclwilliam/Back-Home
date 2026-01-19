<template>
  <div class="tabs-wrapper">
    <div class="tabs-header">
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
defineProps(['tabs', 'modelValue']);
defineEmits(['update:modelValue']);
</script>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.tabs-header {
  display: flex;
  gap: rem(24px);
  margin-bottom: rem(32px);
  border-bottom: 1px solid #eee;

  .tab-item {
    padding: rem(8px) 0;
    border: none;
    background: none;
    cursor: pointer;
    font-size: rem(16px);
    color: #666;
    position: relative;

    &.active {
      color: $secondary-color;
      font-weight: bold;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $secondary-color;
      }
    }
  }
}
</style>