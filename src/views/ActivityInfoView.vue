<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
import { publicApi, backHomeApi, base, APIBase } from '@/utils/publicApi'
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

// 預設未參加，留言時需檢查此狀態
const isParticipant = ref(false)

//檢查是否參加過此活動
const checkUserAttended = async () => {
  if (!authStore.token) {
    isParticipant.value = false
    return
  }

  let currentUserId = authStore.user?.id

  const attendanceUrl = 'activity/activity_check_attend.php'

  try {
    const response = await backHomeApi.get(
      `${attendanceUrl}?user_id=${currentUserId}&activity_id=${activityInfo.value.id}`,
    )

    if (response.data.status === 'success') {
      isParticipant.value = response.data.isParticipant
    } else {
      isParticipant.value = false
    }
  } catch (err) {
    console.error('無法檢查參加狀態', err)
  }
}

// 使用計算屬性取得登入狀態
const isLoggedIn = computed(() => authStore.isLogin)

// 開啟登入燈箱
const handleLoginPrompt = () => {
  // 清空 redirectAfterLogin，確保登入後停留在當前頁面
  authStore.redirectAfterLogin = null
  authStore.openLoginModal()
}
const url = 'activity/activity_get.php'
const listUrl = 'activity/activity_list.php'

// 抓取單一活動資料
const fetchActivityData = async (id) => {
  const currentId = Number(id)
  try {
    const response = await backHomeApi.get(`${url}?activity_id=${currentId}`)
    const act = response.data.data
    if (!act) {
      router.push({ name: 'activity' })
      return
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTime = today.getTime()

    //處理單一活動資料
    //取得活動開始與結束日期
    const actDate = new Date(act.ACTIVITY_START_DATETIME)
    actDate.setHours(0, 0, 0, 0)
    const actTime = actDate.getTime()

    const endDate = new Date(act.ACTIVITY_END_DATETIME)
    endDate.setHours(0, 0, 0, 0)
    const endTime = endDate.getTime()
    //報名截止時間
    const signupEndDate = new Date(act.ACTIVITY_SIGNUP_END_DATETIME)
    const signupEndTime = signupEndDate.getTime()

    let status = 'upcoming'
    // 已結束
    if (todayTime > actTime) {
      status = 'ended'
    } else if (todayTime === actTime) {
      //進行中
      status = 'opening'
    } else if (new Date().getTime() > signupEndTime) {
      //報名截止
      status = 'deadline'
    } else {
      //報名中
      status = 'upcoming'
    }
    //圖片路徑處裡
    const imagePath = act.ACTIVITY_COVER_IMAGE
      ? `${APIBase}uploads/actCover/${act.ACTIVITY_COVER_IMAGE}`
      : ''

    const noticesArr = act.ACTIVITY_NOTES ? act.ACTIVITY_NOTES.split('\n') : []
    activityInfo.value = {
      id: act.ACTIVITY_ID,
      title: act.ACTIVITY_TITLE,
      description: act.ACTIVITY_DESCRIPTION,
      image: imagePath,
      notices: noticesArr,
      date: act.ACTIVITY_START_DATETIME,
      endDate: act.ACTIVITY_END_DATETIME,
      signupEndDate: act.ACTIVITY_SIGNUP_END_DATETIME,
      location: act.ACTIVITY_LOCATION,
      category: act.CATEGORY_VALUE,
      type: act.CATEGORY_VALUE,
      status: status,
      maxPeople: act.ACTIVITY_MAX_PEOPLE,
      currentPeople: act.ACTIVITY_SIGNUP_PEOPLE,
      messages: [], // 預設空陣列，等待 fetchReviews 填入
    }

    // 抓取留言
    await fetchReviews(currentId)

    // --- 抓取推薦活動
    const listResponse = await backHomeApi.get(`${listUrl}`)
    const allList = listResponse.data.data

    if (Array.isArray(allList)) {
      const now = new Date().getTime()

      // 處理下方推薦 Swiper (可以報名的活動)

      activityList.value = allList

        .filter((item) => {
          if (item.ACTIVITY_ID === act.ACTIVITY_ID) return false // 排除目前這一個
          if (String(item.ACTIVITY_STATUS) !== '1') return false // 只要發布中的活動

          const signupEnd = new Date(item.ACTIVITY_SIGNUP_END_DATETIME).getTime()
          if (now > signupEnd) return false // 排除報名截止的活動

          const max = Number(item.ACTIVITY_MAX_PEOPLE)
          const current = Number(item.ACTIVITY_SIGNUP_PEOPLE)

          if (max && current >= max) return false // 排除已額滿的活動
          return true
        })

        .map((item) => {
          return {
            id: item.ACTIVITY_ID,
            title: item.ACTIVITY_TITLE,
            image: item.ACTIVITY_COVER_IMAGE,
            date: item.ACTIVITY_START_DATETIME,
            endDate: item.ACTIVITY_END_DATETIME,
            signupEndDate: act.ACTIVITY_SIGNUP_END_DATETIME,
            location: item.ACTIVITY_LOCATION,
            type: item.CATEGORY_VALUE,
            maxPeople: item.ACTIVITY_MAX_PEOPLE,
            currentPeople: item.ACTIVITY_SIGNUP_PEOPLE,
          }
        })
        .sort(() => 0.5 - Math.random()) // 隨機排序
        .slice(0, 7) // 取前 7 個
    }
  } catch (err) {
    console.error('連線發生錯誤:', err)
  }
  // 檢查是否參加過此活動
  checkUserAttended()
}
// 抓取活動留言
const reviewUrl = 'activity/activity_reviews_get.php'
const fetchReviews = async (activityId) => {
  try {
    //取得user id
    const currentUserId = authStore.user?.id || 0

    const response = await backHomeApi.get(
      `${reviewUrl}?activity_id=${activityId}&user_id=${currentUserId || 0}`,
    )
    // console.log('留言列表原始資料:', response.data.data)
    if (response.data.status === 'success') {
      // 轉換資料格式以符合 ReviewSwiper 需求
      const reviewsList = Array.isArray(response.data.data) ? response.data.data : []
      const formattedMessages = reviewsList.map((item) => ({
        id: item.REVIEW_ID,
        name: item.USER_NAME || '熱心志工',
        stars: item.RATING,
        content: item.CONTENT,
        likes: item.LIKE_COUNT || item.like_count || 0,
        date: formatDate(new Date(item.CREATED_AT), 'YYYY-MM-DD'),
        image: '', // 後端若無頭貼欄位，留空讓前端自動生成
        isLiked: Number(item.IS_LIKED) > 0,
      }))

      // 寫入 activityInfo
      if (activityInfo.value) {
        activityInfo.value.messages = formattedMessages
      }
    }
  } catch (err) {
    console.error('留言讀取失敗:', err)
  }
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
  name: '',
  email: '',
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

// 取得會員詳細資料並填入表單
const getMemberInfo = async () => {
  // 1. 檢查是否登入，若沒登入直接結束
  if (!authStore.isLogin || !authStore.token) return

  try {
    const res = await backHomeApi.get('member/auth_me.php', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    if (res.data.status === 'success') {
      const user = res.data.member

      formData.name = user.MEMBER_REALNAME || ''
      formData.email = user.MEMBER_EMAIL || ''
      formData.phone = user.MEMBER_PHONE || ''
      formData.idNumber = user.ID_NUMBER || ''
      formData.birthday = user.BIRTHDAY || ''
      formData.emergencyName = user.EMERGENCY || ''
      formData.emergencyPhone = user.EMERGENCY_TEL || ''

      // console.log('會員資料自動帶入成功')
    }
  } catch (error) {
    console.error('無法取得會員資料:', error)
    if (error.response && error.response.status === 401) {
    }
  }
}
// 監聽登入狀態與生命週期
onMounted(() => {
  if (route.params.id) {
    fetchActivityData(route.params.id)
  }
  // 進頁面時若已登入，就抓會員資料
  if (authStore.isLogin) {
    getMemberInfo()
  }
})

// 如果使用者在這一頁才登入 (例如點了「登入後報名」)，要監聽變化並補抓資料
watch(
  () => authStore.isLogin,
  (val) => {
    if (val) {
      getMemberInfo()
      checkUserAttended()
      if (activityInfo.value.id) {
        fetchReviews(activityInfo.value.id)
      }
    }
  },
)

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
const currentReportReview = ref(null) // 暫存被檢舉的留言物件

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
    // 檢查是否登入 (防呆)
    if (!authStore.isLogin || !authStore.user) {
      alert('請先登入會員')
      return
    }

    const payload = {
      user_id: authStore.user.id, // 從 Pinia 取會員 ID
      activity_id: activityInfo.value.id, // 從頁面資料取活動 ID
      // 讀取使用者填寫(或自動帶入)的 formData
      name: formData.name,
      idNumber: formData.idNumber,
      phone: formData.phone,
      email: formData.email,
      birthday: formData.birthday,
      emergencyName: formData.emergencyName,
      emergencyPhone: formData.emergencyPhone,
      sync: formData.syncData,
    }

    const response = await backHomeApi.post('activity/activity_signup.php', payload)

    if (response.data.status === 'success') {
      // 關閉確認燈箱，打開成功燈箱
      showCheckLightbox.value = false
      showSuccessLightbox.value = true
      isSignupSuccess.value = true

      if (activityInfo.value) {
        activityInfo.value.currentPeople = (Number(activityInfo.value.currentPeople) || 0) + 1
      }
    } else {
      // 失敗 (如：已額滿、重複報名)
      alert(response.data.message)
      showCheckLightbox.value = false // 失敗通常會關閉燈箱讓使用者重試或離開
    }
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
const handleConfirmReview = async () => {
  try {
    if (!authStore.isLogin) return
    // 確認字數
    if (reviewData.comment.length > 100) {
      alert('留言內容需為100字之內')
      return
    }
    const payload = {
      user_id: authStore.user.id,
      activity_id: activityInfo.value.id,
      rating: reviewData.stars,
      content: reviewData.comment,
    }
    const response = await backHomeApi.post('activity/activity_add_review.php', payload)

    if (response.data.status === 'success') {
      showReviewCheckLightbox.value = false
      isReviewSubmit.value = true

      // 清空表單
      reviewData.stars = 0
      reviewData.comment = ''

      fetchReviews(activityInfo.value.id)
    } else {
      alert(response.data.message)
      showReviewCheckLightbox.value = false
    }
  } catch (error) {
    console.error('留言送出失敗:', error)
    alert('留言送出失敗，請稍後再試')
  }
}

// 處理檢舉留言
const handleReport = (review) => {
  if (!authStore.isLogin) {
    alert('請先登入會員')
    return
  }
  // console.log('點擊檢舉，留言ID:', review.id)
  // 打開檢舉燈箱，並傳入被檢舉的留言物件
  currentReportReview.value = review
  showReportLightbox.value = true
}
// 返回列表頁，並帶回原本的查詢參數
const goBackToList = () => {
  router.push({
    path: '/activity',
    query: {
      category: route.query.formCategory || '目前活動' ,
      page: route.query.formPage || 1,
      search: route.query.formSearch || undefined,
      filter: route.query.formFilter || undefined,
    },
  })
}

//打包當前網址參數，傳給推薦卡片使用
const currentQueryParams = computed(() => ({
  formCategory: route.query.formCategory || '目前活動',
  formPage: route.query.formPage || 1,
  formSearch: route.query.formSearch || undefined,
  formFilter: route.query.formFilter || undefined,
}))


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
      </div>
      <div class="row review">
        <div class="secondary-title col-sm-4">志工回饋牆</div>
        <ReviewSwiper v-if="activityInfo.messages && activityInfo.messages.length > 0" :messages="activityInfo.messages"
          @report="handleReport" />
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
                <span v-for="star in 5" :key="star" class="material-symbols-outlined star"
                  :class="{ 'is-active': star <= reviewData.stars }" @click="setRating(star)">
                  kid_star
                </span>
              </div>
            </FormInput>
  
            <FormInput label="心得內容" required htmlFor="comment" :error="errors.comment">
              <div class="input-wrapper">
                <textarea id="comment" type="text" v-model="reviewData.comment" class="customInput"
                  placeholder="分享你的活動體驗(限100字)"></textarea>
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
          <router-link :to="{ name: 'activity' }" class="btn-solid btn-large"
            style="display: inline-block; text-decoration: none">
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
          <router-link :to="{ name: 'activity' }" class="btn-solid btn-large"
            style="display: inline-block; text-decoration: none">
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
          <input id="name" type="text" v-model="formData.name" class="customInput disable" disabled />
          <template #message>
            <span class="material-symbols-outlined info">info</span>
            如需修改姓名，請至 <a href="#" class="link">會員中心</a> 更新資料
          </template>
        </FormInput>
        <FormInput label="電子信箱" required htmlFor="email">
          <input id="email" type="text" v-model="formData.email" class="customInput disable" disabled />
        </FormInput>
        <FormInput label="手機號碼" required htmlFor="phone" :error="errors.phone">
          <input id="phone" type="tel" v-model="formData.phone" class="customInput" placeholder="請輸入手機號碼" />
        </FormInput>
  
        <FormInput label="身分證字號" required htmlFor="idNumber" :error="errors.idNumber">
          <input id="idNumber" type="text" v-model="formData.idNumber" @input="handleIdNumCheck" class="customInput"
            placeholder="請輸入身分證字號" maxlength="10" />
        </FormInput>
  
        <FormInput label="出生年月日" required htmlFor="birthday" :error="errors.birthday">
          <input id="birthday" type="date" v-model="formData.birthday" class="customInput" placeholder="請選擇日期" />
        </FormInput>
  
        <FormInput label="緊急聯絡人姓名" required htmlFor="emergencyName" :error="errors.emergencyName">
          <input id="emergencyName" type="text" v-model="formData.emergencyName" class="customInput" />
        </FormInput>
  
        <FormInput label="緊急聯絡人手機號碼" required htmlFor="emergencyPhone" :error="errors.emergencyPhone">
          <input id="emergencyPhone" type="tel" v-model="formData.emergencyPhone" class="customInput"
            placeholder="請輸入緊急聯絡人手機號碼" />
        </FormInput>
  
        <div class="checkbox-row col-sm-3 col-md-8">
          <label class="check-label">
            <input type="checkbox" v-model="formData.syncData" hidden />
            <span class="material-symbols-outlined checkIcon" :class="{ isChecked: formData.syncData }">{{
              formData.syncData ?
              'check_box' : 'check_box_outline_blank' }}</span>
            <span>同步更新會員資料：將本次填寫之資訊儲存至我的會員中心，下次報名更快速！</span>
          </label>
        </div>
  
        <div class="checkbox-group col-sm-3 col-md-8">
          <div class="checkbox-title">免責與授權</div>
  
          <div class="checkbox-row">
            <label class="check-label">
              <input type="checkbox" v-model="formData.agreeHealth" hidden />
              <span class="material-symbols-outlined checkIcon" :class="{ isChecked: formData.agreeHealth }"
                :error="errors.agreeHealth">{{ formData.agreeHealth ? 'check_box' : 'check_box_outline_blank' }}</span>
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
              <span class="material-symbols-outlined checkIcon" :class="{ isChecked: formData.agreePhoto }"
                :error="errors.agreePhoto">{{ formData.agreePhoto ? 'check_box' : 'check_box_outline_blank' }}</span>
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
      <swiper :modules="[Autoplay, Pagination]" :slides-per-view="1" :space-between="24" :autoplay="{ delay: 3000 }"
        :pagination="{ clickable: true }" :breakpoints="{
            '768': { slidesPerView: 2.3 },
            '1024': { slidesPerView: 3.3 },
          }" class="recommend-swiper">
        <swiper-slide v-for="activity in activityList" :key="activity.id">
          <ActivityCard :event="activity" 
          :query-params="currentQueryParams"/>
        </swiper-slide>
      </swiper>
  
      <!-- 報名確認燈箱 -->
      <LightboxRegisterCheck v-model="showCheckLightbox" :form-data="registrationData"
        @confirm="handleConfirmRegistration" />
  
      <!-- 留言確認燈箱 -->
      <LightboxReviewCheck v-model="showReviewCheckLightbox" @confirm="handleConfirmReview" />
  
      <!-- 檢舉留言燈箱 -->
      <LightboxReport v-model="showReportLightbox" :review-id="currentReportReview?.id" />
  
      <!-- 報名成功燈箱 -->
      <LightboxRegisterSuccess v-model="showSuccessLightbox" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.btn {
  margin: 16px 0;

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
      min-width: 100%;
    }
  }

  :deep(.formContent) {
    @media (min-width: 768px) {
      flex: 0 0 auto;
      min-width: 100%;
    }
  }
}

.leftContent {
  padding: 24px;
  background-color: $card-color;
}

textarea.customInput {
  min-height: 150px;
  min-width: 100%;
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
// 調整活動卡片內進度條位置
:deep(.progress-track-container .track-fill) {
    top: 1px !important;
}
</style>
