<script setup>
import { ref, computed } from 'vue'
import GuideBanner from '@/components/guide/GuideBanner.vue';
import Guide from '@/components/guide/turtleGuide.vue';
import TurtleMap from '@/components/guide/Guidemap.vue';
import Guidethreaten from '@/components/guide/Guidethreaten.vue';


</script>

<template>

    <GuideBanner></GuideBanner>
    <Guide></Guide>
    <TurtleMap></TurtleMap>
    <Guidethreaten></Guidethreaten>


</template>
