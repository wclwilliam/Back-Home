<script setup>
import { ref } from 'vue'
import Staff from '@/components/about/staff.vue'

const bossMoney = ref(10000)
const salary = 100 // 這是你的薪水金額變數
const message = ref('初始標題')

// 薪水邏輯
const staffAMoney = ref(0)
const payStaffA = (amount) => {
  if (bossMoney.value < amount) return
  bossMoney.value -= amount
  staffAMoney.value += amount
}

// 改字邏輯
const updateTitle = (newVal) => {
  message.value = newVal
}
</script>
<template>
  <p>老闆剩餘: {{ bossMoney }} 元</p>
  <p>
    父層的標題是: <strong>{{ message }}</strong>
  </p>

  <hr />

  <Staff
    name="ingrid"
    :money="staffAMoney"
    :pay="salary"
    :title="message"
    @receiveMoney="payStaffA"
    @changeTitle="updateTitle"
  />
</template>
<style scoped></style>
