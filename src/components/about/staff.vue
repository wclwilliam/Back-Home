<script setup>
// 1. 所有的 Props (接收父層) 寫在一起
const props = defineProps({
  name: { type: String, default: '員工' },
  money: { type: [String, Number], default: 0 },
  pay: { type: Number, default: 100 },
  title: String, // 接收父層傳來的 message
})

// 2. 所有的 Emits (傳給父層) 寫在一起
const emit = defineEmits(['receiveMoney', 'changeTitle'])

const handleClick = () => {
  emit('receiveMoney', props.pay) // 取得薪水
}

const handleClick2 = () => {
  emit('changeTitle', '新的標題內容') // 告訴父層改字
}
</script>

<template>
  <div style="border: 1px solid #ccc; margin: 5px; padding: 5px">
    <div>{{ name }}: {{ money }} 元</div>
    <button @click="handleClick">給薪水</button>

    <div style="margin-top: 10px; color: blue">
      <p>子層收到的標題: {{ title }}</p>
      <button @click="handleClick2">點我改父層文字</button>
    </div>
  </div>
</template>
<style scoped></style>
