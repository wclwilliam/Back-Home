<script setup>
import { defineProps, defineEmits } from 'vue';

// 1. 接收父元件傳來的資料
const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  currentPage: {
    type: Number,
    required: true,
    default: 1
  }
});

// 2. 定義要傳出去的事件
const emit = defineEmits(['page-change']);

// 3. 點擊按鈕時，通知父元件
const onPageClick = (page) => {
  // 如果點擊的不是當前頁面，才觸發
  if (page !== props.currentPage) {
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <button 
      v-for="page in totalPages" 
      :key="page" 
      class="page-btn number"
      :class="{ 'active': currentPage === page }" 
      @click="onPageClick(page)"
    >
      {{ page }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
// 注意：如果你有全域變數檔案 (variables.scss)，可能需要在這裡 @import 或確保 Vite 有自動引入
// 這裡保留你原本的樣式

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  margin-bottom: 60px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid $secondary-color; /* 確保你的專案能讀取到這個變數 */
  background-color: transparent;
  color: $secondary-color;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;

  &:hover:not(:disabled) {
    background-color: $highlight-color2; /* 確保能讀取到變數 */
    color: white;
    border-color: $highlight-color2;
  }

  &.active {
    background-color: $secondary-color;
    color: white;
  }
}
</style>