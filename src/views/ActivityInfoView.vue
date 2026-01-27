<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { publicApi, base } from '@/utils/publicApi'
import { useAuthStore } from '@/stores/auth'

import ActivityCard from '@/components/cards/ActivityCard.vue'
import FormInput from '@/components/activity/FormInput.vue'
import ActivityIntroduce from '@/components/activity/ActivityIntroduce.vue'
import ReviewSwiper from '@/components/activity/ReviewSwiper.vue'
import LightboxRegisterCheck from '@/components/activity/Lightbox/LightboxRegisterCheck.vue'
import LightboxRegisterSuccess from '@/components/activity/Lightbox/LightboxRegisterSuccess.vue'
import LightboxReviewCheck from '@/components/activity/Lightbox/LightboxReviewCheck.vue'
import LightboxReport from '@/components/activity/Lightbox/LightboxReport.vue'
import ActResult from '@/components/activity/ActResult.vue'
import { format } from 'crypto-js'
import { formatDate } from '@vueuse/core'

//**資料表：`activities`欄位名稱資料型態說明`status`**TINYINT**人工設定狀態**
//  `0`: 草稿 (Draft)
//  `1`: 發布 (Published)
//  `2`: 取消 (Cancelled)
// activity.status === 1 實則會有四種狀態+判斷順序

// 1. (isEnded)已結束 now > activity.end_time[時間不可逆]
// 2. (opening)進行中 (活動正在舉辦，但不能報名了)start_time <= now <= end_time
// 3. (isDeadline)報名截止 超過報名期限，不管有沒有剩餘名額，使用者都無法報名。
// 4. (isFulled)已額滿 人數到達設置的最高志工人數，不能報名了
// 5. (upcoming)報名中 (即將開始) now < activity.start_time

// 建立 route 物件
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

//活動介紹
const activityInfo = ref({})
//輪播卡片
const activityList = ref([])
//活動照片，先以相同類型的照片代替
const relatedImages = ref([])
// 預設未參加，留言時需檢查此狀態
const isParticipant = ref(false)

// 使用計算屬性取得登入狀態
const isLoggedIn = computed(() => authStore.isLogin)

// 開啟登入燈箱
const handleLoginPrompt = () => {
  // 不設定 redirectAfterLogin，讓用戶登入後停留在當前頁面
  authStore.openLoginModal()
}

const fetchActivityData = (id) => {
  const currentId = Number(id)

  publicApi
    .get('data/activityData.json')
    .then((res) => {
      let allData = res.data
      //取得今日日期
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayTime = today.getTime()

      allData = allData.map((act) => {
        //取得活動日期
        const actDate = new Date(act.date)
        actDate.setHours(0, 0, 0, 0)
        const actTime = actDate.getTime()
        //取得活動截止日期
        const deadlineDate = new Date(actDate)
        deadlineDate.setDate(actDate.getDate() - 1)
        const deadlineTime = deadlineDate.getTime()

        let status = 'upcoming'
        if (todayTime > actTime) {
          status = 'ended'
        } else if (todayTime === actTime) {
          status = 'opening'
        } else if (todayTime === deadlineTime) {
          status = 'deadline'
        } else {
          status = 'upcoming'
        }
        //圖片路徑處裡
        const cleanPath = act.image.startsWith('/') ? act.image.slice(1) : act.image
        return {
          ...act,
          status: status,
          image: `${base}${cleanPath}`,
        }
      })
      // 抓取主要活動資料
      const target = allData.find((item) => item.id === currentId)
      if (target) {
        activityInfo.value = target
        isParticipant.value = false
        //找出同類型且非當前活動的資料
        const sameType = allData.filter(
          (item) => item.type === target.type && item.id !== target.id,
        )

        relatedImages.value = sameType.slice(0, 3).map((item) => item.image)
      } else {
        // 如果找不到 ID 導回列表頁
        router.push({ name: 'activity' })
      }

      // 推薦活動 (排除自己 + 排除已結束 + 隨機或排序)
      activityList.value = allData
        .filter((item) => item.id !== currentId && item.status !== 'ended')
        .sort(() => 0.5 - Math.random())
        .slice(0, 7)
    })
    .catch((err) => console.error(err))
}
// 判斷活動是否結束
const isEnded = computed(() => activityInfo.value?.status === 'ended')
const isOpening = computed(() => activityInfo.value?.status === 'opening')
const isDeadline = computed(() => activityInfo.value?.status === 'deadline')
const isFulled = computed(() => {
  const info = activityInfo.value
  if (!info || !info.maxPeople) return false
  return (info.currentPeople || 0) >= info.maxPeople
})

// 初始化載入
onMounted(() => {
  if (route.params.id) {
    fetchActivityData(route.params.id)
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchActivityData(newId)
      window.scrollTo({ top: 100, behavior: 'smooth' }) // 切換時自動捲到最上面
    }
  },
)

const formData = reactive({
  name: '王曉明',
  email: '123go@gmail.com', // 模擬已登入帶入的資料
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyName: '',
  emergencyPhone: '',
  syncData: true, // 同步更新資料
  agreeHealth: false, // 健康聲明
  agreePhoto: false, // 肖像權
})

//表單輸入資料的判斷
const errors = reactive({
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyName: '',
  emergencyPhone: '',
  agreeHealth: '',
  agreePhoto: '',
  stars: '',
  comment: '',
})

//身份證字號的檢查
const handleIdNumCheck = () => {
  if (!formData.idNumber) return

  //第一碼確認或轉型為大寫
  formData.idNumber = formData.idNumber.toUpperCase()
  //僅能輸入10碼
  if (formData.idNumber.length > 10) {
    formData.idNumber = formData.idNumber.slice(0, 10)
  }
}
//檢查身分證格式是否符合要求
const checkIdFormat = (id) => {
  //第一碼為英文
  //第二碼為1,2,or 3
  //僅能10碼
  //檢查碼不檢查
  const idFormat = /^[A-Z][1-3]\d{8}/
  return idFormat.test(id)
}
const handleSingUpSubmit = () => {
  let isValid = true
  //先檢查所有必填欄位
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  //檢查
  if (!formData.phone) {
    errors.phone = '請輸入手機號碼'
    isValid = false
  } else if (!/^09\d{8}$/.test(formData.phone)) {
    errors.phone = '手機格式錯誤 (09xxxxxxxx)'
    isValid = false
  }
  if (!formData.idNumber) {
    errors.idNumber = '請輸入身分證字號'
    isValid = false
  } else if (!checkIdFormat(formData.idNumber)) {
    errors.idNumber = '身分證格式錯誤'
    isValid = false
  }
  if (!formData.birthday) {
    errors.birthday = '請輸入生日'
    isValid = false
  }
  if (!formData.emergencyName) {
    errors.emergencyName = '請輸入緊急聯絡人姓名'
    isValid = false
  }
  if (!formData.emergencyPhone) {
    errors.emergencyPhone = '請輸入緊急聯絡人電話'
    isValid = false
  } else if (!/^09\d{8}$/.test(formData.emergencyPhone)) {
    errors.emergencyPhone = '手機格式錯誤 (09xxxxxxxx)'
    isValid = false
  }

  //檢查是否同意健康聲明
  if (!formData.agreeHealth) {
    errors.agreeHealth = '請同意健康聲明'
    isValid = false
  }
  //檢查是否同意肖像權
  if (!formData.agreePhoto) {
    errors.agreePhoto = '請同意肖像權'
    isValid = false
  }

  //如果所有檢查都通過
  if (isValid) {
    submitForm()
  }
}

const reviewData = reactive({
  stars: 0,
  comment: '',
})

const setRating = (star) => {
  reviewData.stars = star

  if (errors.stars) {
    errors.stars = ''
  }
}
const handleReviewSubmit = () => {
  let isValid = true
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  if (!reviewData.stars) {
    errors.stars = '請輸入評分'
    isValid = false
  }
  if (!reviewData.comment) {
    errors.comment = '請輸入評論'
    isValid = false
  }
  if (isValid) {
    submitReview()
  }
}
// 燈箱狀態控制
const showCheckLightbox = ref(false)
const showSuccessLightbox = ref(false)
const showReviewCheckLightbox = ref(false)
const showReportLightbox = ref(false)

// 準備傳給燈箱的資料
const registrationData = computed(() => ({
  activityName: activityInfo.value?.title || '',
  activityTime: activityInfo.value?.date || '',
  location: activityInfo.value?.location || '',
  name: formData.name,
  phone: formData.phone,
  email: formData.email,
  idNumber: formData.idNumber,
  birthDate: formData.birthday,
  emergencyName: formData.emergencyName,
  emergencyPhone: formData.emergencyPhone,
}))

const submitForm = () => {
  // 開啟確認燈箱
  showCheckLightbox.value = true
}
const isSignupSuccess = ref(false)
// 確認報名處理
const handleConfirmRegistration = async () => {
  try {
    // 這裡可以加入 API 請求
    // await api.registerActivity(registrationData.value)

    // 關閉確認燈箱，打開成功燈箱
    showCheckLightbox.value = false
    showSuccessLightbox.value = true
    isSignupSuccess.value = true
  } catch (error) {
    console.error('報名失敗:', error)
    alert('報名失敗，請稍後再試')
  }
}

// 提交留言處理
const submitReview = () => {
  // 開啟留言確認燈箱
  showReviewCheckLightbox.value = true
}
// 留言送出狀態
const isReviewSubmit = ref(false)

// 確認送出留言
const handleConfirmReview = () => {
  // 這裡可以加入 API 請求
  // await api.submitReview(reviewData)

  // 關閉燈箱後可以顯示成功訊息或重新整理評論列表
  showReviewCheckLightbox.value = false

  // 清空表單
  reviewData.rating = 0
  reviewData.comment = ''
  //已送出留言
  isReviewSubmit.value = true
}

// 處理檢舉留言
const handleReport = (review) => {
  console.log('檢舉留言:', review)
  showReportLightbox.value = true
}

const goBackToList = () => {
  router.push({
    path: '/activity',
    query: {
      category: route.query.fromCategory || '目前活動',
      page: route.query.fromPage || 1,
      search: route.query.fromSearch || undefined,
    },
  })
}
</script>
<template>
  <div class="container">
    <div class="row introduce">
      <div class="actionBar">
        <button class="btn btn-outline btn-xs" @click="goBackToList">回列表</button>
      </div>
      <ActivityIntroduce v-if="activityInfo.id" :activity="activityInfo" />
    </div>
    <!-- 活動結束 -->
    <template v-if="isEnded">
      <div class="row result">
        <div class="secondary-title col-sm-4">成果數據區</div>

        <ActResult :activityInfo="activityInfo" />
        <div class="picArea col-sm-4">
          <div class="pic" v-for="(img, index) in relatedImages" :key="index">
            <img :src="img" :alt="activityInfo.title + ' 成果花絮'" />
          </div>
        </div>
      </div>
      <div class="row review">
        <div class="secondary-title col-sm-4">志工回饋牆</div>
        <ReviewSwiper
          v-if="activityInfo.messages && activityInfo.messages.length > 0"
          :messages="activityInfo.messages"
          @report="handleReport"
        />
        <div v-else class="no-review">目前尚無回饋</div>
      </div>

      <div v-if="!isLoggedIn" class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <h3>想分享您的心得嗎？</h3>
          <p>登入會員並驗證參加紀錄後，即可發表留言。</p>
          <button class="btn-solid btn-large" @click="handleLoginPrompt">登入後立即留言</button>
        </div>
      </div>

      <div v-else-if="isLoggedIn && !isParticipant" class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <span class="material-symbols-outlined icon-disabled">block</span>
          <h3>無法發表留言</h3>
          <p>系統查無您的參加紀錄，只有實際參與本活動的志工可以填寫心得喔！</p>
        </div>
      </div>
      <div v-else-if="isReviewSubmit" class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <span class="material-symbols-outlined icon-success">check_circle</span>
          <h3>已收到您的回饋</h3>
          <p>感謝您的回饋，期待下次再見！</p>
        </div>
      </div>

      <form v-else class="row commentSection" @submit.prevent="handleReviewSubmit">
        <div class="commentForm col-sm-4 col-md-10 col-lg-10">
          <div class="leftContent col-sm-4 col-md-5 col-lg-5">
            <div class="secondary-title">分享你的感動</div>
            <p class="content">
              你的每一份回饋都是我們前進的動力。告訴大家你在{{
                activityInfo.title
              }}中的收穫與發現吧！
            </p>
            <div class="activityInfo-row">
              <span class="material-symbols-outlined calendar_today">calendar_today</span>
              <div class="activityInfo-text">{{ activityInfo.date }}</div>
            </div>
            <div class="activityInfo-row">
              <span class="material-symbols-outlined">location_on</span>
              <div class="activityInfo-text">{{ activityInfo.location }}</div>
            </div>
          </div>
          <div class="rightContent col-sm-4 col-md-7 col-lg-7">
            <FormInput label="滿意度 : " required :error="errors.stars">
              <div class="star-rating">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="material-symbols-outlined star"
                  :class="{ 'is-active': star <= reviewData.stars }"
                  @click="setRating(star)"
                >
                  kid_star
                </span>
              </div>
            </FormInput>

            <FormInput label="心得內容" required htmlFor="comment" :error="errors.comment">
              <div class="input-wrapper">
                <textarea
                  id="comment"
                  type="text"
                  v-model="reviewData.comment"
                  class="customInput"
                  placeholder="分享你的活動體驗(限100字)"
                ></textarea>
                <span class="word-count">{{ reviewData.comment.length }} / 100</span>
              </div>
            </FormInput>

            <div class="submit-btm col-sm-4">
              <button class="btn-solid">確認送出</button>
            </div>
          </div>
        </div>
      </form>
    </template>
    <!-- 活動進行中、報名截止 -->
    <template v-else-if="isOpening || isDeadline">
      <div class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <h3>{{ isOpening ? '活動進行中' : '報名截止' }}</h3>
          <p>{{ isOpening ? '活動正在進行，無法受理報名。' : '報名已截止，請探索其他活動。' }}</p>
          <router-link
            :to="{ name: 'activity' }"
            class="btn-solid btn-large"
            style="display: inline-block; text-decoration: none"
          >
            查看其他活動
          </router-link>
        </div>
      </div>
    </template>
    <!-- 活動名額已滿 -->
    <template v-else-if="isFulled">
      <div class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <h3>名額已滿</h3>
          <p>名額已滿，請探索其他活動</p>
          <router-link
            :to="{ name: 'activity' }"
            class="btn-solid btn-large"
            style="display: inline-block; text-decoration: none"
          >
            查看其他活動
          </router-link>
        </div>
      </div>
    </template>
    <!-- 報名成功 -->
    <template v-else-if="isSignupSuccess">
      <div class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <span class="material-symbols-outlined icon-success">check_circle</span>
          <h3>已收到您的報名</h3>
          <p>感謝您的報名，我們活動見！</p>
        </div>
      </div>
    </template>
    <!-- 活動報名中 -->
    <template v-else>
      <div v-if="!isLoggedIn" class="row login-cta-section">
        <div class="cta-content col-sm-4 col-md-4">
          <h3>您尚未登入</h3>
          <p>登入會員後，即可快速帶入資料完成報名！</p>
          <button class="btn-solid btn-large" @click="handleLoginPrompt">登入後立即報名</button>
        </div>
      </div>
      <form v-else class="row signUpForm" @submit.prevent="handleSingUpSubmit">
        <div class="secondary-title col-sm-4">立即報名</div>
        <FormInput label="姓名" required htmlFor="name">
          <input
            id="name"
            type="text"
            v-model="formData.name"
            class="customInput disable"
            disabled
          />
          <template #message>
            <span class="material-symbols-outlined info">info</span>
            如需修改姓名，請至 <a href="#" class="link">會員中心</a> 更新資料
          </template>
        </FormInput>
        <FormInput label="電子信箱" required htmlFor="email">
          <input
            id="email"
            type="text"
            v-model="formData.email"
            class="customInput disable"
            disabled
          />
        </FormInput>
        <FormInput label="手機號碼" required htmlFor="phone" :error="errors.phone">
          <input
            id="phone"
            type="tel"
            v-model="formData.phone"
            class="customInput"
            placeholder="請輸入手機號碼"
          />
        </FormInput>

        <FormInput label="身分證字號" required htmlFor="idNumber" :error="errors.idNumber">
          <input
            id="idNumber"
            type="text"
            v-model="formData.idNumber"
            @input="handleIdNumCheck"
            class="customInput"
            placeholder="請輸入身分證字號"
            maxlength="10"
          />
        </FormInput>

        <FormInput label="出生年月日" required htmlFor="birthday" :error="errors.birthday">
          <input
            id="birthday"
            type="date"
            v-model="formData.birthday"
            class="customInput"
            placeholder="請選擇日期"
          />
        </FormInput>

        <FormInput
          label="緊急聯絡人姓名"
          required
          htmlFor="emergencyName"
          :error="errors.emergencyName"
        >
          <input
            id="emergencyName"
            type="text"
            v-model="formData.emergencyName"
            class="customInput"
          />
        </FormInput>

        <FormInput
          label="緊急聯絡人手機號碼"
          required
          htmlFor="emergencyPhone"
          :error="errors.emergencyPhone"
        >
          <input
            id="emergencyPhone"
            type="tel"
            v-model="formData.emergencyPhone"
            class="customInput"
            placeholder="請輸入緊急聯絡人手機號碼"
          />
        </FormInput>

        <div class="checkbox-row col-sm-3 col-md-8">
          <label class="check-label">
            <input type="checkbox" v-model="formData.syncData" hidden />
            <span
              class="material-symbols-outlined checkIcon"
              :class="{ isChecked: formData.syncData }"
              >{{ formData.syncData ? 'check_box' : 'check_box_outline_blank' }}</span
            >
            <span>同步更新會員資料：將本次填寫之資訊儲存至我的會員中心，下次報名更快速！</span>
          </label>
        </div>

        <div class="checkbox-group col-sm-3 col-md-8">
          <div class="checkbox-title">免責與授權</div>

          <div class="checkbox-row">
            <label class="check-label">
              <input type="checkbox" v-model="formData.agreeHealth" hidden />
              <span
                class="material-symbols-outlined checkIcon"
                :class="{ isChecked: formData.agreeHealth }"
                :error="errors.agreeHealth"
                >{{ formData.agreeHealth ? 'check_box' : 'check_box_outline_blank' }}</span
              >
              <span>我確認無心臟病、高血壓等不適合烈日下活動的病史</span>
            </label>
            <p v-if="errors.agreeHealth" class="error-text">
              <span class="material-symbols-outlined icon-alert">error</span>
              {{ errors.agreeHealth }}
            </p>
          </div>

          <div class="checkbox-row">
            <label class="check-label">
              <input type="checkbox" v-model="formData.agreePhoto" hidden />
              <span
                class="material-symbols-outlined checkIcon"
                :class="{ isChecked: formData.agreePhoto }"
                :error="errors.agreePhoto"
                >{{ formData.agreePhoto ? 'check_box' : 'check_box_outline_blank' }}</span
              >
              <span>我同意肖像權使用 (活動照片將用於海龜保育推廣，不作商業用途)。</span>
            </label>
            <p v-if="errors.agreePhoto" class="error-text">
              <span class="material-symbols-outlined icon-alert">error</span>
              {{ errors.agreePhoto }}
            </p>
          </div>
        </div>
        <div class="submit-btm col-sm-4">
          <button class="btn-solid">送出表單</button>
        </div>
      </form>
    </template>
    <!-- 推薦的活動 -->
    <div class="row recommendActivity">
      <div class="secondary-title col-sm-4">你可能會喜歡這些活動</div>
      <swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :space-between="24"
        :autoplay="{ delay: 3000 }"
        :pagination="{ clickable: true }"
        :breakpoints="{
          '768': { slidesPerView: 2.3 },
          '1024': { slidesPerView: 3.3 },
        }"
        class="recommend-swiper"
      >
        <swiper-slide v-for="activity in activityList" :key="activity.id">
          <ActivityCard :event="activity" />
        </swiper-slide>
      </swiper>

      <!-- 報名確認燈箱 -->
      <LightboxRegisterCheck
        v-model="showCheckLightbox"
        :form-data="registrationData"
        @confirm="handleConfirmRegistration"
      />

      <!-- 留言確認燈箱 -->
      <LightboxReviewCheck v-model="showReviewCheckLightbox" @confirm="handleConfirmReview" />

      <!-- 檢舉留言燈箱 -->
      <LightboxReport v-model="showReportLightbox" />

      <!-- 報名成功燈箱 -->
      <LightboxRegisterSuccess v-model="showSuccessLightbox" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.btn {
  margin-bottom: 20px;

  @media (max-width: 1600px) {
    //height: 40px;
    padding: 16px 10px;
  }
}

.signUpForm {
  padding: 24px;
  background-color: $activity-comment-card;
  justify-content: center;
}

.secondary-title {
  @include font-secondary;
  text-align: center;
  padding: 60px 0;
}

.customInput {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid $backstage-bar-line-color;
  background-color: $backstage-swipe-color;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: all 0.3s;
}
.error-text {
  color: $highlight-color2;
  font-size: 14px;
  margin-top: 4px;
  padding-left: 34px;
  display: flex;
  align-items: center;
  gap: 4px;

  .icon-alert {
    color: $highlight-color2;
    font-variation-settings: 'FILL' 1;
    font-size: 16px;
  }
}

.disable {
  background-color: $backstage-bar-line-color;
}

.info {
  color: $secondary-color;
}

.checkbox-row {
  margin: 20px 0;
  padding-left: 0;
}

.check-label {
  @include font-body;
  // display: flex;
  // align-items: flex-start; /* 讓 Checkbox 對齊文字開頭 */
  gap: 10px;
  cursor: pointer;
  margin-bottom: 12px;
  line-height: 1.5;
}

.checkIcon {
  color: $secondary-color;
}

.checkbox-group {
  padding: 24px;
  background-color: $text-white;
  border: 1px solid $text-color;
}

.checkbox-title {
  @include font-body-l-bold;
  text-align: center;
}

.submit-btm {
  padding: 24px 0;
  display: flex;
  justify-content: center;
}

.btn-solid {
  padding: 12px 20px;
}

//留言表單
.input-wrapper {
  position: relative;
  width: 100%;
}

.word-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 12px;
  color: $page-number-color;
}
.row {
  padding: 24px;
}

.commentSection {
  display: flex;
  justify-content: center;
}

.commentForm {
  background-color: $text-white;
  display: flex;
  justify-content: center;
  @include font-body-bold;
  flex-wrap: wrap;

  .secondary-title {
    padding-bottom: 24px;
    color: $primary-color;
    text-align: left;
    width: 100%;
  }

  :deep(.formItem) {
    @media (min-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  :deep(.formLabel) {
    @media (min-width: 768px) {
      width: 100%;
      max-width: 100%;
    }
  }

  :deep(.formContent) {
    @media (min-width: 768px) {
      flex: 0 0 auto;
      max-width: 100%;
    }
  }
}

.leftContent {
  padding: 24px;
  background-color: $card-color;
}

textarea.customInput {
  min-height: 150px;
  min-width: 200px;
  max-width: 100%;
}

.rightContent {
  padding: 24px;
}

.content {
  margin-bottom: 24px;
  color: $primary-color;
}

.activityInfo-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.star {
  font-size: 24px;
  color: $page-number-color;
  /* 未選取顏色 (灰) */
  cursor: pointer;
  transition: color 0.2s;
}

.star.is-active {
  color: $highlight-color3;
  /* 選取顏色 (黃) */
  font-variation-settings: 'FILL' 1;
}

//志工回饋牆
.reviewCard-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

//成果數據
.result {
  justify-content: center;
}

.resultData {
  @include font-body-l;
  color: $text-color;
  list-style-type: none;
  margin-top: 16px;
  border: 2px solid $card-color;
  padding: 16px;
  margin: 0 auto;

  li {
    margin-bottom: 8px;
  }
}

.picArea {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 16px;
  width: 100%;

  .pic {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    // 平板版
    @media (min-width: 768px) {
      width: calc((100% - 24px) / 2);
    }

    // 桌機版
    @media (min-width: 1024px) {
      width: calc((100% - 48px) / 3);
    }

    img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  }
}

.no-review {
  text-align: center;
  width: 100%;
  color: #666;
  padding: 20px;
}

// --- 登入引導卡片 (Login CTA) ---
.login-cta-section {
  padding: 60px 24px;
  background-color: $activity-comment-card;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;

  .cta-content {
    text-align: center;
    background-color: $text-white;
    padding: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    h3 {
      @include font-secondary;
      color: $primary-color;
      margin-bottom: 16px;
    }

    p {
      @include font-body;
      margin-bottom: 32px;
    }

    .icon-disabled {
      font-size: 48px;
      color: $text-white !important;
      margin-bottom: 16px;
    }

    .btn-large {
      width: 100%;
      padding: 16px 32px;
      @include font-body-l-bold;
      cursor: pointer;
      color: $text-white !important;
    }
  }
  .icon-success {
    font-size: 48px;
    color: $secondary-color;
    margin-bottom: 16px;
    font-variation-settings: 'FILL' 1;
  }
}

.recommendActivity {
  padding-bottom: 60px;

  .recommend-swiper {
    width: 100%;
    padding-bottom: 50px;
    padding-top: 10px;
  }

  :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background-color: #ccc;
    opacity: 0.6;
    transition: all 0.3s;
    margin: 0 6px !important;
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: $secondary-color;
    opacity: 1;
    border-radius: 5px;
  }
}
</style>
