<script setup>
/**
 * 🧪 Lightbox 測試頁面
 *
 * 📋 如何在 ActivityView.vue 中使用這兩個燈箱組件：
 *
 * 1️⃣ 導入組件
 *    import LightboxRegisterCheck from '@/components/activity/LightboxRegisterCheck.vue'
 *    import LightboxRegisterConfirm from '@/components/activity/LightboxRegisterConfirm.vue'
 *
 * 2️⃣ 定義狀態變數
 *    const showCheckLightbox = ref(false)
 *    const showConfirmLightbox = ref(false)
 *    const registrationFormData = ref({
 *      activityName: '',    // 活動名稱
 *      activityTime: '',    // 活動時間
 *      location: '',        // 活動地點
 *      name: '',            // 姓名
 *      phone: '',           // 手機號碼
 *      email: '',           // 電子信箱
 *      idNumber: '',        // 身份證字號
 *      birthDate: '',       // 出生年月日
 *      emergencyName: '',   // 緊急聯絡人姓名
 *      emergencyPhone: ''   // 緊急聯絡人電話
 *    })
 *
 * 3️⃣ 報名表單提交處理
 *    const handleFormSubmit = (formData) => {
 *      // 將表單資料存入 registrationFormData
 *      registrationFormData.value = { ...formData }
 *      // 打開第一個確認燈箱
 *      showCheckLightbox.value = true
 *    }
 *
 * 4️⃣ 確認報名處理
 *    const handleConfirmRegistration = async () => {
 *      try {
 *        // 發送 API 請求（如果需要）
 *        // await api.registerActivity(registrationFormData.value)
 *
 *        // 關閉第一個燈箱，打開成功確認燈箱
 *        showCheckLightbox.value = false
 *        showConfirmLightbox.value = true
 *      } catch (error) {
 *        console.error('報名失敗:', error)
 *        alert('報名失敗，請稍後再試')
 *      }
 *    }
 *
 * 5️⃣ 在 template 中添加燈箱組件
 *    <LightboxRegisterCheck
 *      v-model="showCheckLightbox"
 *      :form-data="registrationFormData"
 *      @confirm="handleConfirmRegistration"
 *    />
 *
 *    <LightboxRegisterConfirm v-model="showConfirmLightbox" />
 *
 * 📝 使用流程：
 *    用戶填寫報名表單 → 點擊送出 → 顯示確認燈箱（LightboxRegisterCheck）
 *    → 點擊「確認報名」→ 關閉確認燈箱 → 顯示成功燈箱（LightboxRegisterConfirm）
 *    → 點擊「簡閱」→ 關閉成功燈箱
 */

import { ref } from 'vue'
import LightboxRegisterCheck from '@/components/activity/LightboxRegisterCheck.vue'
import LightboxRegisterConfirm from '@/components/activity/LightboxRegisterConfirm.vue'
import LightboxReviewConfirm from '@/components/activity/LightboxReviewConfirm.vue'

const showLightbox = ref(false)
const showConfirmLightbox = ref(false)
const showReviewConfirmLightbox = ref(false)

// 測試用的表單資料（可以修改這裡來測試不同的數據）
const testFormData = ref({
  activityName: '2026 新年第一淨：萬里翡翠灣',
  activityTime: '2025-04-10(日) 10:30 - 16:30',
  location: '新北萬里翡翠灣',
  name: '王小明',
  phone: '0912-345-678',
  email: 'wanghsiaoming@gmail.com',
  idNumber: 'A123456789',
  birthDate: '1970/01/01',
  emergencyName: '王大壯',
  emergencyPhone: '0923-456-789',
})

const openLightbox = () => {
  showLightbox.value = true
}

const openReviewConfirm = () => {
  showReviewConfirmLightbox.value = true
}

const handleConfirm = () => {
  console.log('確認報名', testFormData.value)
  // 關閉第一個燈箱，打開第二個成功確認燈箱
  showLightbox.value = false
  showConfirmLightbox.value = true
}
</script>

<template>
  <div class="test-page">
    <div class="container">
      <h1>Lightbox 測試頁面</h1>
      <p>點擊下方按鈕來預覽報名確認燈箱</p>

      <button class="test-btn" @click="openLightbox">打開報名確認燈箱</button>
      <button class="test-btn" @click="openReviewConfirm">打開留言確認燈箱</button>

      <!-- Lightbox 組件 -->
      <LightboxRegisterCheck
        v-model="showLightbox"
        :form-data="testFormData"
        @confirm="handleConfirm"
      />

      <!-- 成功確認燈箱 -->
      <LightboxRegisterConfirm v-model="showConfirmLightbox" />

      <!-- 留言確認燈箱 -->
      <LightboxReviewConfirm v-model="showReviewConfirmLightbox" />
    </div>
  </div>
</template>

<style scoped>
.test-page {
  min-height: 100vh;
  padding: 60px 20px;
  background: #f5f5f5;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

h1 {
  color: #2c5f4f;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 40px;
}

.test-btn {
  background-color: #2c5f4f;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 10px 10px;
}

.test-btn:hover {
  background-color: #1e4537;
}
</style>
