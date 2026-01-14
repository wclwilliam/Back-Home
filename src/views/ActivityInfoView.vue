<script setup>
import { ref, onMounted, reactive,computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Autoplay, Pagination } from 'swiper/modules'
// import { useAuthStore } from '@/stores/auth' 
// import { storeToRefs } from 'pinia'

import ActivityCard from '@/components/cards/ActivityCard.vue'
import FormInput from '@/components/activity/FormInput.vue'
import ActivityIntroduce from '@/components/activity/ActivityIntroduce.vue'
import ReviewCard from '@/components/activity/ReviewCard.vue'
import ReviewSwiper from '@/components/activity/ReviewSwiper.vue'
// 建立 route 物件
const route = useRoute()
//活動介紹
const activityInfo = ref([])
//輪播卡片
const activityList = ref([])
// 判斷活動是否結束
const isEnded = computed(() => activityInfo.value.status === 'ended')


// --- 模擬登入狀態 
// 預設未登入
const isLoggedIn = ref(false) 
// 預設未參加 (模擬 API 回傳資料)，留言時需檢查此狀態
const isParticipant = ref(false) 

// --- 核心功能：模擬登入 ---
// 點擊按鈕後，直接變成已登入狀態
const handleMockLogin = () => {
  // 為了讓體驗更真實，可以加個小延遲或提示
  // alert('模擬登入成功！') 
  isLoggedIn.value = true
  
  // (選用) 如果你想讓他在登入後，自動也變成「已參加過」的狀態，可以把下面這行解開
  isParticipant.value = true 
}
// 封裝成一個函式，方便重複呼叫
const fetchActivityData = (id) => {
  // 轉成數字確保比對正確
  const currentId = Number(id)

  axios.get('/data/activityData.json')
    .then(res => {
      const allData = res.data

      // 1. 抓取主要活動資料
      const target = allData.find(item => item.id === currentId)
      if (target) {
        activityInfo.value = target
        isParticipant.value = false
      } else {
        // 如果找不到 ID 導回列表頁
        router.push({ name: 'activity' }) 
      }

      // 推薦活動 (排除自己 + 排除已結束 + 隨機或排序)
      activityList.value = allData
        .filter(item => item.id !== currentId && item.status !== 'ended')
        .sort(() => 0.5 - Math.random()) // 簡單隨機排序，讓推薦每次看起來不一樣
        .slice(0, 4) // 只取前 4 筆
    })
    .catch(err => console.error(err))
}

// 初始化載入
onMounted(() => {
  fetchActivityData(route.params.id)
})

// ★ 重要：監聽路由 ID 變化，解決點擊推薦活動不更新的問題
watch(
  () => route.params.id,
  (newId) => {
    fetchActivityData(newId)
    window.scrollTo({ top: 100, behavior: 'smooth' }) // 切換時自動捲到最上面
  }
)


const formData = reactive({
  name: '王曉明',
  email: '123go@gmail.com', // 模擬已登入帶入的資料
  phone: '',
  idNumber: '',
  birthday: '',
  emergencyName: '',
  emergencyPhone: '',
  syncData: true,      // 同步更新資料
  agreeHealth: false,  // 健康聲明
  agreePhoto: false    // 肖像權
})

const errors = reactive({
  phone: '',
  idNumber: ''
})
const reviewData = reactive({
  stars: 0,
  comment: ''
})

const setRating = (starCount) => {
  reviewData.rating = starCount
}
</script>
<template>
  <div class="container">
    <div class="dev-tool">
      <p>開發測試面板</p>
      <div class="tool-row">
        <label><input type="checkbox" v-model="isLoggedIn"> 強制登入</label>
      </div>
      <div class="tool-row">
        <label><input type="checkbox" v-model="isParticipant"> 模擬已參加過</label>
        <small>(影響留言權限)</small>
      </div>
    </div>


    <div class="row introduce">
      <ActivityIntroduce v-if="activityInfo.id" :activity="activityInfo" />
    </div>
  
  <template v-if="!isEnded">
    <form v-if="isLoggedIn" class="row signUpForm " @submit.prevent="submitForm">
      <div class="secondary-title col-sm-4">立即報名</div>
      <FormInput label="姓名" required htmlFor="name">
        <input id="name" type="text" v-model="formData.name" class="customInput disable" disabled>
        <template #message>
  
          <span class="material-symbols-outlined info">info</span>
          如需修改姓名，請至 <a href="#" class="link">會員中心</a> 更新資料
        </template>
      </FormInput>
      <FormInput label="電子信箱" required htmlFor="email">
        <input id="email" type="text" v-model="formData.email" class="customInput disable" disabled>
  
      </FormInput>
      <FormInput label="手機號碼" required htmlFor="phone" :error="errors.phone">
        <input id="phone" type="tel" v-model="formData.phone" class="customInput" placeholder="請輸入手機號碼">
      </FormInput>
  
      <FormInput label="身分證字號" required htmlFor="idNumber">
        <input id="idNumber" type="text" v-model="formData.idNumber" class="customInput" placeholder="請輸入身分證字號">
      </FormInput>
  
      <FormInput label="出生年月日" required htmlFor="birthday">
        <input id="birthday" type="date" v-model="formData.birthday" class="customInput" placeholder="請選擇日期">
      </FormInput>
  
      <FormInput label="緊急聯絡人姓名" required htmlFor="emergencyName">
        <input id="emergencyName" type="text" v-model="formData.emergencyName" class="customInput">
      </FormInput>
  
      <FormInput label="緊急聯絡人手機號碼" required htmlFor="emergencyPhone" :error="errors.phone">
        <input id="emergencyPhone" type="tel" v-model="formData.emergencyPhone" class="customInput"
          placeholder="請輸入緊急聯絡人手機號碼">
      </FormInput>
  
      <div class="checkbox-row col-sm-4 col-md-8">
        <label class="check-label">
          <input type="checkbox" v-model="formData.syncData" hidden>
          <span class="material-symbols-outlined checkIcon" :class="{'isChecked':formData.syncData}">{{formData.syncData?
            'select_check_box' : 'check_box_outline_blank'}}</span>
          <span>同步更新會員資料：將本次填寫之資訊儲存至我的會員中心，下次報名更快速！</span>
        </label>
      </div>
  
      <div class="checkbox-group col-sm-4 col-md-8">
        <div class="checkbox-title">免責與授權</div>
  
        <div class="checkbox-row ">
          <label class="check-label">
            <input type="checkbox" v-model="formData.agreeHealth" hidden>
            <span class="material-symbols-outlined checkIcon"
              :class="{'isChecked':formData.agreeHealth}">{{formData.agreeHealth? 'check_box_outline_blank' :
              'select_check_box'}}</span>
            <span>我確認無心臟病、高血壓等不適合烈日下活動的病史</span>
          </label>
        </div>
  
        <div class="checkbox-row ">
          <label class="check-label">
            <input type="checkbox" v-model="formData.agreePhoto" hidden>
            <span class="material-symbols-outlined checkIcon"
              :class="{'isChecked':formData.agreePhoto}">{{formData.agreePhoto? 'check_box_outline_blank' :
              'select_check_box'}}</span>
            <span>我同意肖像權使用 (活動照片將用於海龜保育推廣，不作商業用途)。</span>
          </label>
        </div>
  
      </div>
      <div class="submit-btm col-sm-4">
        <button class="btn-solid">送出表單</button>
      </div>
    </form>

    <div v-else class="row login-cta-section">
        <div class="cta-content">
          <h3>您尚未登入</h3>
          <p>登入會員後，即可快速帶入資料完成報名！</p>
          <button class="btn-solid btn-large" @click="handleMockLogin">
            登入後立即報名
          </button>
        </div>
      </div>
  </template>
  <template v-else>
    <div class="row result" v-if="activityInfo.results">
      <div class="secondary-title col-sm-4">成果數據區</div>
      <div class="data col-sm-3 col-md-8">
        <ul class="resultData">
          <li v-if="activityInfo.results.totalWeight">
            清理總重量：{{ activityInfo.results.totalWeight }} 公斤
          </li>
          <li v-if="activityInfo.results.bagsCount">
            清理袋數：{{ activityInfo.results.bagsCount }} 袋
          </li>
  
          <li v-if="activityInfo.results.turtlesCared">
            照護海龜數：{{ activityInfo.results.turtlesCared }} 隻
          </li>
          <li v-if="activityInfo.results.foodPrepared">
            備餐重量：{{ activityInfo.results.foodPrepared }} 公斤
          </li>
  
          <li v-if="activityInfo.results.tracksFound">
            發現爬痕：{{ activityInfo.results.tracksFound }} 處
          </li>
          <li v-if="activityInfo.results.nestsConfirmed">
            確認產卵窩數：{{ activityInfo.results.nestsConfirmed }} 窩
          </li>
        </ul>
      </div>
  
      <div class="picArea col-sm-4">
        <div class="pic" v-for="n in 3" :key="n">
          <img :src="`https://picsum.photos/400/300/?random=${n}`">
        </div>
      </div>
  
    </div>
    <div class="row review">
      <div class="secondary-title col-sm-4">志工回饋牆</div>
      <ReviewSwiper v-if="activityInfo.messages && activityInfo.messages.length > 0" :messages="activityInfo.messages" />
      <div v-else class="no-review">目前尚無回饋</div>
    </div>

    <div v-if="!isLoggedIn" class="row login-cta-section">
        <div class="cta-content">
          <h3>想分享您的心得嗎？</h3>
          <p>登入會員並驗證參加紀錄後，即可發表留言。</p>
          <button class="btn-solid btn-large" @click="handleMockLogin">
            登入後立即留言
          </button>
        </div>
      </div>

      <div v-else-if="isLoggedIn && !isParticipant" class="row login-cta-section">
        <div class="cta-content">
          <span class="material-symbols-outlined icon-disabled">block</span>
          <h3>無法發表留言</h3>
          <p>系統查無您的參加紀錄，只有實際參與本活動的志工可以填寫心得喔！</p>
        </div>
      </div>


    <form  v-else class="row commentSection" @submit.prevent="submitForm">
      <div class="commentForm col-sm-4 col-md-10 col-lg-10">
        <div class="leftContent col-sm-4 col-md-5 col-lg-5">
          <div class="secondary-title ">分享你的感動</div>
          <p class="content">你的每一份回饋都是我們前進的動力。告訴大家你在 [活動標題]中的收穫與發現吧！</p>
          <div class="activityInfo-row">
            <span class="material-symbols-outlined calendar_today">calendar_today</span>
            <div class="activityInfo-text">{{ activityInfo.date }}</div>
          </div>
          <div class="activityInfo-row">
            <span class="material-symbols-outlined">location_on</span>
            <div class="activityInfo-text"> {{ activityInfo.location }}</div>
          </div>
  
        </div>
        <div class="rightContent col-sm-4 col-md-7 col-lg-7">
          <FormInput label="滿意度 : " required>
            <div class="star-rating">
              <span v-for="star in 5" :key="star" class="material-symbols-outlined star"
                :class="{ 'is-active': star <= reviewData.rating }" @click="reviewData.rating = star">
                kid_star
              </span>
            </div>
          </FormInput>
  
          <FormInput label="心得內容" required htmlFor="comment">
            <textarea id="comment" type="text" v-model="reviewData.comment" class="customInput"
              placeholder="分享你的活動體驗(限100字)"></textarea>
          </FormInput>

          <div class="submit-btm col-sm-4">
            <button class="btn-solid">確認送出</button>
          </div>
        </div>
      </div>
    </form>
    </template>
  
  
    <div class="row recommendActivity">
      <div class="secondary-title col-sm-4">你可能會喜歡這些活動</div>
      <swiper :slides-per-view="1.3" :space-between="24" :autoplay="{ delay: 3000 }" :pagination="{ clickable: true }"
        :breakpoints="{
                        '768': { slidesPerView: 2.3 },
                        '992': { slidesPerView: 3.3 }
                      }">
        <swiper-slide v-for="activity in activityList" :key="activity.id">
          <ActivityCard :event="activity" />
        </swiper-slide>
      </swiper>
    </div>

  </div>
</template>
<style lang="scss" scoped>
@import "@/assets/scss/component/_btn.scss";

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
    // padding-top: 0; // 視情況保留
    color: $primary-color;
    text-align: left; // 確保標題靠左
    width: 100%; // 確保標題佔滿一行
  }

  /* 使用 :deep() 穿透 scoped 的限制 */
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

textarea {
  min-height: 150px;
  min-width: 200px;
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
    height: 200px;
    overflow: hidden;

    @media (min-width: 390px) {
      width: calc((100% - 24px) / 2);
    }

    // --- 狀態 3: 桌機版 (>= 768px) ---
    // 一列 3 張
    // 計算公式：(100% - 2個間距) / 3
    @media (min-width: 768px) {
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


//登入部分測試
.dev-tool {
  position: fixed; 
  top: 100px; 
  right: 10px; 
  z-index: 50; 
  background: #fff; 
  border: 1px solid #ccc; 
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
    max-width: 500px;
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
      color: $text-color;
      margin-bottom: 32px;
    }

    .icon-disabled {
      font-size: 48px;
      color: #999;
      margin-bottom: 16px;
    }

    .btn-large {
      width: 100%;
      padding: 16px 32px;
      font-size: 18px;
      cursor: pointer;
    }
  }
}

</style>
