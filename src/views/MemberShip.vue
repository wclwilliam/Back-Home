<script setup>
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'

const memberList = ref([
    { "id": 1, "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", "price": 109.95, "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday", "category": "men's clothing", "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png", "rating": { "rate": 3.9, "count": 120 } },
    { "id": 1, "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", "price": 109.95, "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday", "category": "men's clothing", "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png", "rating": { "rate": 3.9, "count": 120 } }
])

//快速計算陣列數量結果

onMounted(() => {
    axios
        .get('https://fakestoreapi.com/products')
        .then((response) => {
            memberList.value = response.data
        })
})

</script>

<template>
    <main>
        <h1>個人資料</h1>
        <RouterLink 
        v-for="item in memberList"
        :key="item.id"
        :to="`/member/${item}`">Member
        {{ item.id }}
        {{ item.title }}
        </RouterLink>
        
        
    </main>
    
</template>

<style scoped>
    a{
        display: block;
    }
</style>