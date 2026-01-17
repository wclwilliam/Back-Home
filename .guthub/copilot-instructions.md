# GitHub Copilot 開發規範

## 專案概述

這是一個海龜保育主題的 Vue 3 + Vite 專案，包含活動管理、捐款系統、互動遊戲和海龜保育指南等功能。

## 技術棧

- **框架**: Vue 3 (Composition API)
- **構建工具**: Vite
- **狀態管理**: Pinia
- **路由**: Vue Router
- **樣式**: SCSS

## 編碼規範

### 1. Vue 組件規範

- 使用 Composition API (`<script setup>`)
- 組件命名採用 PascalCase，例如：`ActivityCard.vue`
- 組件檔案放置在 `src/components/` 對應的功能目錄下
- Props 使用 TypeScript 型別定義或明確的 defineProps
- Emits 使用 defineEmits 明確聲明

### 2. 程式碼結構

```vue
<script setup>
// 1. 引入依賴
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Props 和 Emits
const props = defineProps({
  // props 定義
})

const emit = defineEmits(['update', 'change'])

// 3. 響應式資料
const data = ref([])

// 4. 計算屬性
const filteredData = computed(() => {
  // logic
})

// 5. 方法
const handleClick = () => {
  // logic
}

// 6. 生命週期
onMounted(() => {
  // initialization
})
</script>

<template>
  <!-- 模板內容 -->
</template>

<style scoped lang="scss">
/* 樣式 */
</style>
```

### 3. 命名規範

- **變數和函數**: camelCase，例如：`userData`, `fetchUserData()`
- **常數**: UPPER_SNAKE_CASE，例如：`API_BASE_URL`
- **組件**: PascalCase，例如：`NewsCard`
- **CSS 類名**: kebab-case，例如：`card-container`

### 4. 目錄結構規範

- `src/components/`: 可複用組件，按功能分類子目錄
  - `about/`: 關於我們相關組件
  - `activity/`: 活動相關組件
  - `auth/`: 認證相關組件
  - `cards/`: 卡片類組件
  - `donation/`: 捐款相關組件
  - `Game/`: 遊戲相關組件
  - `guide/`: 指南相關組件
- `src/views/`: 頁面級組件
- `src/stores/`: Pinia 狀態管理
- `src/router/`: 路由配置
- `src/assets/`: 靜態資源
  - `scss/`: 全域樣式
  - `image/`: 圖片資源
  - `fonts/`: 字體文件
- `public/`: 公開資源和資料檔案

### 5. 樣式規範

- 使用 SCSS 預處理器
- 組件樣式使用 `scoped` 避免污染
- 共用樣式變數定義在 `src/assets/scss/base/` 下
- 遵循 BEM 命名方式或語義化命名
- 引用全域變數：`@use '@/assets/scss/base/var' as *;`

### 6. 資料管理

- 靜態資料存放在 `public/data/` (JSON 格式)
- 使用 fetch 或 axios 獲取資料
- 組件內資料使用 ref 或 reactive 管理
- 全域狀態使用 Pinia stores

### 7. 路由規範

- 路由配置統一在 `src/router/index.js`
- 路由守衛邏輯放在 `src/router/guards.js`
- 使用懶加載提升效能：`component: () => import('@/views/HomeView.vue')`
- 404 頁面處理：使用 `NotFound.vue`

### 8. 最佳實踐

- 優先使用 Composition API
- 適當拆分組件，保持單一職責
- 使用 computed 處理衍生資料
- 避免在 template 中使用複雜邏輯
- Props 向下傳遞，Events 向上發送
- 使用 async/await 處理非同步操作
- 錯誤處理要完整，使用 try-catch
- 添加適當的註釋說明複雜邏輯

### 9. 效能優化

- 使用 v-show 替代 v-if（頻繁切換時）
- 長列表使用虛擬滾動或分頁
- 圖片使用懶加載
- 合理使用 keep-alive 緩存組件
- 避免不必要的響應式資料

### 10. 註釋規範

```javascript
/**
 * 函數功能描述
 * @param {String} id - 參數描述
 * @returns {Object} 返回值描述
 */
function getData(id) {
  // 實現邏輯
}
```

## Git 提交規範

- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文檔更新
- `style`: 程式碼格式調整
- `refactor`: 重構
- `perf`: 效能優化
- `test`: 測試相關
- `chore`: 建置流程或輔助工具變更

範例：`feat: 新增捐款頁面互動動畫`

## 注意事項

- 遵循專案現有的程式碼風格
- 確保程式碼在不同瀏覽器的兼容性
- 響應式設計，支援多種螢幕尺寸
- 注重使用者體驗和無障礙性
- 定期更新依賴套件，注意安全性
