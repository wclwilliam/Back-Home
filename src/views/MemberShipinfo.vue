<script setup>
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
const props = defineProps({
    id:String
})
const info = ref(null)
onMounted(() => {
    axios
        .get(`https://fakestoreapi.com/products/${props.id}`)
        .then((response) => {
            info.value = response.data
        })
})
</script>

<template>
    <main>
        <h1>我的活動</h1>
        {{ props.id }}
        {{ info }}
    </main>
    
</template>

<style lang="scss" scoped></style>