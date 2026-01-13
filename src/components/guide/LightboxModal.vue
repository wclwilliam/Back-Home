<script setup>
// 1. 接收父層傳來的資料 (Props)
// 這裡定義了兩個變數：isOpen (開關狀態), item (內容資料)
const props = defineProps({
  isOpen: Boolean,      // true = 顯示, false = 隱藏
  item: Object          // 包含 image, modalTitle, modalDesc 的那包資料
});

// 2. 定義要發送給父層的訊號 (Emits)
// 我們只有一個訊號要發送：'close'
const emit = defineEmits(['close']);

// 3. 關閉功能的函式
// 當使用者點擊關閉按鈕或背景時，觸發這個函式
const handleClose = () => {
  // 發送 'close' 訊號給父層
  emit('close');
};
</script>

<template>
  <Transition name="fade">
    
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
      
      <div class="modal-card">
        
        <button class="close-btn" @click="handleClose">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div class="card-image">
          <img :src="item.image" :alt="item.title">
        </div>

        <div class="card-content">
          <h3>{{ item.modalTitle || item.title }}</h3>
          <p v-html="item.modalDesc || item.desc"></p>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
/* 1. 動畫設定：淡入淡出 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 2. 背景遮罩：佔滿全螢幕的半透明黑底 */
.modal-overlay {
  position: fixed; /* 固定在視窗上，不隨捲軸移動 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7); /* 70% 透明度的黑 */
  z-index: 9999; /* 確保蓋在網頁最上面 */
  
  display: flex; /* 讓裡面的白卡片置中 */
  justify-content: center;
  align-items: center;
}

/* 3. 白色卡片本體 */
.modal-card {
  background: #EAF4F6; /* 淺藍色背景，可自行修改 */
  width: 900px;         /* 預設寬度 */
  max-width: 90%;       /* 手機版不要超過螢幕 */
  max-height: 90vh;     /* 高度不要超過螢幕的 90% */
  overflow-y: auto;     /* 如果文字太多，卡片內部可以捲動 */
  
  border-radius: 12px;
  position: relative;   /* 為了讓關閉按鈕可以定位 */
  display: flex;        /* 左右排版 */

  /* 手機版 RWD：變成上下排版 */
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

/* 圖片區域 */
.card-image {
  flex: 1; /* 佔一半空間 */
  min-height: 300px; /* 手機版至少要有高度 */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 填滿不變形 */
    display: block;
  }
}

/* 文字區域 */
.card-content {
  flex: 1; /* 佔另一半空間 */
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直置中 */

  h3 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #333;
    font-weight: bold;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #555;
    white-space: pre-line; /* 讓文字裡的換行符號生效 */
  }
}

/* 關閉按鈕 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #333;
  z-index: 10; /* 浮在最上面 */

  &:hover {
    background-color: rgba(0,0,0,0.1); /* hover 時有點背景色 */
  }
}
</style>