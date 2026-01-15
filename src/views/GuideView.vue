<script setup>
import { ref, computed } from 'vue'
import GuideBanner from '@/components/guide/GuideBanner.vue';
import Guide from '@/components/guide/turtleGuide.vue';
import TurtleMap from '@/components/guide/Guidemap.vue';
import Guidethreaten from '@/components/guide/Guidethreaten.vue';
import threatenBottom from'@/components/guide/threatenBottom.vue'


</script>

<template>

    <GuideBanner/>
    <Guide/>
    <TurtleMap/>
    <Guidethreaten/>
    <threatenBottom/>


</template>
