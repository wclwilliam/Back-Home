import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useHealthStore = defineStore('health', () => {
  const maxHealth = ref(100)
  const health = ref(100)
  const totalHearts = 5

  const healthPercent = computed(() => {
    if (maxHealth.value <= 0) return 0
    return Math.max(0, Math.min(100, Math.round((health.value / maxHealth.value) * 100)))
  })

  const activeHeartsCount = computed(() => {
    if (maxHealth.value <= 0) return 0
    return Math.ceil((health.value / maxHealth.value) * totalHearts)
  })

  const setMaxHealth = (val = 100) => {
    maxHealth.value = Number(val) || 100
    health.value = Math.min(health.value, maxHealth.value)
  }

  const setHealth = (val = 100) => {
    const n = Number(val)
    health.value = Math.max(0, Math.min(maxHealth.value, Number.isFinite(n) ? n : 0))
  }

  const applyHealthChange = (healthChange = 0) => {
    const delta = (Number(healthChange) || 0) * 20
    setHealth(health.value + delta)
  }

  const reset = () => {
    setMaxHealth(100)
    setHealth(100)
  }

  return { maxHealth, health, totalHearts, healthPercent, activeHeartsCount, setMaxHealth, setHealth, applyHealthChange, reset }
})