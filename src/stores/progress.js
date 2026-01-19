import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress',()=>{
const roleId = ref('') // 角色（baby/teen/adult）
const step = ref(1) // 關卡：1=Q1, 2=Q2, 3=Q3
const isResult = ref(false)

const setStepByNodeId = (nodeId = '') => {
    const m = String(nodeId).match(/_q(\d)/i)
    const n = Number(m?.[1] ?? 1)
    step.value = [1, 2, 3].includes(n) ? n : 1
  }

  const setRole = (val = '') => {
    roleId.value = val
  }

  const setResult = (val = false) => {
    isResult.value = !!val
  }

  const reset = () => {
    roleId.value = ''
    step.value = 1
    isResult.value = false
  }

  const fillTarget = computed(() => {
    if (isResult.value) return 1.5

    if (step.value === 1) return 0.34 // 約對齊 line-bottom（66% from top = 底部剩 34%）
    if (step.value === 2) return 0.67 // 約對齊 line-top（33% from top = 底部剩 67%）
    return 1.0 // q3 填滿
  })

  const turtleTarget = computed(() => {
    if (isResult.value) return 0.79

    if (step.value === 1) return 0.25 // line-bottom 下方
    if (step.value === 2) return 0.50 // line-top 與 line-bottom 中間
    return 0.78 // line-top 上方（可微調）
  })

  return {
    roleId,
    step,
    isResult,
    setRole,
    setStepByNodeId,
    setResult,
    fillTarget,
    turtleTarget,
    reset,
  }
})