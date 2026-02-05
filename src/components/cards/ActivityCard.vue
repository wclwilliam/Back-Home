<script setup>
//列表
import { computed, ref, onMounted, watch} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { APIBase, backHomeApi } from '@/utils/publicApi'

//頁面跳轉
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 接收外部傳入的資料
const props = defineProps({
  event: { type: Object, required: true },
  queryParams: { type: Object, default: () => ({}) },
})

const goToDetail = () => {
  // 跳轉到詳情頁，並帶入該活動的 id
  router.push({
    name: 'activityInfo',
    params: { id: props.event.id },
    query: props.queryParams
  })
}

const imgSrc = computed(() => {
  const imgName = props.event.image
  if (!imgName) return '' 
  
  if (imgName.startsWith('http') || imgName.startsWith('data:')) {
    return imgName
  }

  return `${APIBase}uploads/actCover/${imgName}`
})

const status = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()
  const nowTime = new Date().getTime()

  const actDate = new Date(props.event.date)
  actDate.setHours(0, 0, 0, 0)
  const actTime = actDate.getTime()

  const endDate = new Date(props.event.endDate) // 假設你有傳 endDate 進來
  endDate.setHours(0, 0, 0, 0)
  const endTime = endDate.getTime()
  //使用 props 傳進來的報名截止時間
  const signupEndTime = props.event.signupEndDate 
    ? new Date(props.event.signupEndDate).getTime() 
    : actTime

  if (todayTime > endTime) {
    return 'ended'
  }
  if (todayTime >= actTime && todayTime <= endTime) {
    return 'opening'
  }
  if (nowTime > signupEndTime) {
    return 'deadline'
  }
  return 'upcoming'
})

//活動時間顯示邏輯(24小時制)
const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-TW', options).replace(/\//g, '-')
  
}
//活動開始及結束時間 
const startDate = computed(() => {
  return formatDate(props.event.date)
})
const endDate = computed(() => {
  return formatDate(props.event.endDate)
})
//活動結束時間
const endTime = computed(() => {
  return endDate.value.split(' ')[1]
})

//邏輯處理
const isEnded = computed(() => status.value === 'ended')
const isOpening = computed(() => status.value === 'opening')
const isDeadline = computed(() => status.value === 'deadline')
const isFulled = computed(() => {
  if (!props.event.maxPeople) return false
  return props.event.currentPeople >= props.event.maxPeople
})

const btnTxt = computed(() => {
  if (isEnded.value) return '查看詳情'
  if (isOpening.value) return '活動進行中'
  if (isDeadline.value) return '報名截止'
  if (isFulled.value) return '已額滿'
  return '立即報名'
})

const progressStyle = computed(() => {
  const { currentPeople, maxPeople } = props.event
  if (!maxPeople || maxPeople === 0) return { width: '0%' }
  const percent = Math.min((currentPeople / maxPeople) * 100, 100)
  return { width: `${percent}%` }
})

// 收藏功能邏輯
const isFavorited = ref(false) // 是否已收藏
const isHovering = ref(false) // 是否正在 hover
const isLoading = ref(false) // 是否正在載入

// 根據狀態決定要顯示哪個 Icon 名稱
const bookmarkIcon = computed(() => {
  if (isFavorited.value) {
    return isHovering.value ? 'bookmark' : 'bookmark'
  } else {
    return isHovering.value ? 'bookmark_add' : 'bookmark'
  }
})
const fetchFavoriteStatus = async () => {
  if (!authStore.isLogin || !authStore.token || !props.event?.id) return
  try {
    const activityId = props.event.id

    const likedUrl = `member/auth_favorite_check.php`
    const response = await backHomeApi.get(`${likedUrl}?activity_id=${activityId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    if (response.data.status === 'success') {
      isFavorited.value = response.data.isFavorite
    }
  } catch (error) {
    // console.error('Error fetching favorite status:', error)
  }
}

const toggleBookmark = async (e) => {
  //防止點愛心時觸發卡片跳轉
  e.stopPropagation()

  if (!authStore.isLogin) {
    authStore.openLoginModal()
    return
  }
  if (isLoading.value) return // 如果正在載入，則不執行任何操作
  isLoading.value = true
  
  const activityId = props.event.id
  const apiPath = isFavorited.value
    ? 'member/auth_favorite_delete.php'
    : 'member/auth_favorite_add.php'
  try {
    const response = await backHomeApi.post(apiPath, {
      activityId: props.event.id,
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    if (response.data.status === 'success') {
      isFavorited.value = !isFavorited.value  
    } else {
      console.error('Failed to toggle favorite status:', response.data.message)
    }
  } catch (error) {
    console.error('Error toggling favorite status:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if(authStore.isLogin) {
  fetchFavoriteStatus()
  }
})
watch(() => authStore.isLogin, () => {
  if(authStore.isLogin) {
    fetchFavoriteStatus()
  } else {
    isFavorited.value = false
  }
})

</script>
<template>
  <a class="cardContainer activityCard" @click="goToDetail">
    <div class="cardPic">
      <img :src="imgSrc" :alt="event.title" />
      <div v-if="isEnded" class="statusBadge">已結束</div>
      <div class="typeBadge">
        <span class="material-symbols-outlined">sell</span>
        {{ event.type }}
      </div>
    </div>

    <div class="cardInfo">
      <div class="cardTitle">
        <p>{{ event.title }}</p>
        <span
          class="material-symbols-outlined bookmark"
          :class="{ 'is-active': isFavorited }"
          @click="toggleBookmark"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          {{ bookmarkIcon }}
        </span>
      </div>
      <div class="divider"></div>
      <div class="rowInfo dateTime">
        <span class="material-symbols-outlined calendar">calendar_today</span>
        <h3>{{ startDate }} ~ {{ endTime }}</h3>
      </div>
      <div class="rowInfo location">
        <span class="material-symbols-outlined location">location_on</span>
        <h3>{{ event.location }}</h3>
      </div>

      <div v-if="!isEnded" class="rowInfo signUpNum">
        <span class="material-symbols-outlined group">group_add</span>
        <div class="progress-track-container">
          <div class="track-bg"></div>
          <div class="track-fill" :style="progressStyle"></div>
        </div>
        <div>{{ event.currentPeople }}/{{ event.maxPeople }}</div>
      </div>
    </div>

    <button class="btn btn-outline btn-solid">
      {{ btnTxt }}
      <span class="material-symbols-outlined arrow">arrow_forward</span>
    </button>
  </a>
</template>

<style lang="scss" scoped>
.activityCard {
  cursor: pointer;
  &:hover {
    .btn {
      background-color: $secondary-color;
      color: $text-white !important;
      border-color: $secondary-color;

      .arrow {
        color: $text-white;
      }
    }
  }
}
.cardPic {
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  .statusBadge {
    position: absolute;
    top: 16px;
    left: 0;
    padding: 8px;
    background-color: $highlight-color2;
    color: $activity-card-color !important;
    @include font-body-bold;
  }

  .typeBadge {
    position: absolute;
    top: 0px;
    right: 0px;
    gap: 8px;
    padding: 8px;
    background-color: $highlight-color3;
    @include font-body-bold;
    display: flex;
    align-items: center;
  }
}

.cardInfo {
  .cardTitle {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
      @include font-tertiary;
      color: $text-color;
      margin-bottom: 8px;
      p {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        
        @media (min-width: 768px) {
          min-height: 62px;
        }
      }
    }
  .bookmark {
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $secondary-color;
    user-select: none;

    &:hover {
      color: $highlight-color2;
    }

    &.is-active {
      color: $highlight-color2;
      font-variation-settings: 'FILL' 1;
    }
  }

  .rowInfo {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    @include font-body-l;
    margin-bottom: 8px;
    gap: 8px;
    h3 {
      display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rowInfo.location {
      display: flex;
      flex-wrap: nowrap;
      align-self: start;
      gap: 8px;
      margin-bottom: 8px;
    }
  }
}

.signUpNum {
  margin-bottom: 0;
}

.btn {
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 2px solid $secondary-color;
  border-bottom: 2px solid #ffffff00;
  border-right: 0;
  border-left: 0;
  transition: all 0.3s ease;

  .arrow {
    color: $secondary-color;
    transition: color 0.3s ease;
  }
}

@media (min-width: 768px) {
  .cardInfo {
    .bookmark {
      font-size: 40px;
    }
  }
}
</style>
