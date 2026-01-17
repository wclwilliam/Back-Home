import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const cartCount = computed(() => items.value.reduce((sum, item) => sum + item.count, 0))

  const add = (val) => {
    const target = items.value.find((prod) => prod.id === val.id)
    if (!target) {
      items.value.push({ ...val, count: 1, })
    } else {
      target.count += 1
    }
  }
  const clear = () => {
    items.value = []
  }


  return { items, cartCount, clear, add }
})
//這是vue的範例