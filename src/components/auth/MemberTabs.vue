<template>
    <nav class="member-tabs">
        <button 
            v-for="(tab, index) in tabs" 
            :key="index"
            :class="['tab-item', { 'is-active': activeTab === index }]"
            @click="changeTab(index)"
        >
            <span class="icon material-symbols-outlined">{{ tab.icon }}</span>
            <span class="text">{{ tab.name }}</span>
        </button>
    </nav>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update-tab']);

const tabs = [
    { name: '個人資訊', icon: 'account_circle' },
    { name: '我的活動', icon: 'flag_2' },
    { name: '捐款紀錄', icon: 'volunteer_activism' },
    { name: '收藏夾', icon: 'bookmark' }
];

const activeTab = ref(props.modelValue);

// 監聽外部變化
watch(() => props.modelValue, (newVal) => {
  activeTab.value = newVal;
});

const changeTab = (index) => {
    activeTab.value = index;
    emit('update-tab', index);
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/base/_var.scss";

.member-tabs {
    width: 100%;
    border-bottom: 1px solid #ddd;
    margin-top: rem(40px);
    margin-bottom: rem(40px);
    display: flex;
    gap: rem(40px);
    justify-content: center;
}

.tab-item {
    display: flex;
    align-items: center;
    gap: rem(8px);
    padding: rem(12px) 0;
    border: none;
    background: none;
    cursor: pointer;
    color: #666;
    font-size: rem(16px);
    border-bottom: 4px solid transparent;
    transition: all 0.2s ease;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: rem(4px);
    }

    &:hover, &.is-active {
        color: $secondary-color;
        border-bottom: 4px solid $secondary-color;
        
        .icon {
            color: $secondary-color;
            font-variation-settings: 'FILL' 1, 'wght' 500;
        }
    }

    .icon {
        font-size: rem(24px);
        transition: all 0.2s ease;
    }

    .text {
        transition: color 0.2s ease;
    }
}
</style>