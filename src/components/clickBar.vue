<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const selectTab = (tabName) => {
    emit('update:modelValue', tabName);
};
</script>

<template>
    <div class="bar">
        <span 
            v-for="tab in tabs" 
            :key="tab" 
            :class="{ 'active': modelValue === tab }" 
            @click="selectTab(tab)"
        >
            {{ tab }}
        </span>
    </div>
</template>

<style lang="scss">
.bar {
    width: 100%;
    height: 65px;
    display: flex;
    margin: 100px 0 48px 0;
    background-color: #FFFFFF;
    cursor: pointer;

    @media(max-width:768px) {
        height: 50px;
        margin: 48px 0 48px 0;
    }

    span {
        @include font-tertiary;
        color: $secondary-color;
        font-weight: bold;
        flex: 1;
        height: 100%;
        border: 1px solid $secondary-color;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        // 選中狀態
        &.active {
            background-color: $secondary-color;
            color: #FFFFFF;
        }
    }
}
</style>