<script setup>
import { ref } from 'vue';

const tabs = ['全部', '重要公告', '異動通知'];


const currentTab = ref('全部');

const selectTab = (tabName) => {
    currentTab.value = tabName;
};
</script>

<template>
    <div class="bar">
        <span 
            v-for="tab in tabs" 
            :key="tab"
            :class="{ 'active': currentTab === tab }" 
            @click="selectTab(tab)"
        >
            {{ tab }}
        </span>
    </div>
</template>

<style lang="scss">
.bar {
    width: 100%;
    height: 70px;
    display: flex;
    margin: 100px 0 48px 0;
    border: 1px solid $secondary-color; 
    background-color: #FFFFFF;
    cursor: pointer;

    span {
        font-size: $size-quaternary;
        color: $secondary-color; 
        font-weight: bold;
        flex: 1;
        height: 100%;
        border: 1px solid $secondary-color;
        
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

       
        &.active {
            background-color: $secondary-color; 
            color: #FFFFFF; 
        }
        
       
    }
}
</style>