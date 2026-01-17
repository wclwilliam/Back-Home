<script setup>
import { useCartStore } from '@/stores/counter'
const cart = useCartStore()
const products = [
  { id: 1, name: '咖啡', price: 120 },
  { id: 2, name: '吐司', price: 60 },
  { id: 3, name: '紅茶', price: 45 },
]
</script>
<template>
  <div v-for="product in products" :key="product.id">
    {{ product.id }}. {{ product.name }} $ {{ product.price
    }}<button @click="cart.add(product)">加入購物車</button>
  </div>

  <p>購物車商品總數: {{ cart.cartCount }}</p>

  <p v-for="cartItem in cart.items" :key="cartItem.id">購物車列表: {{ cartItem }}</p>

  <button @click="cart.clear()">清空購物車</button>
</template>
<style lang="scss" scoped></style>
