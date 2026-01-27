<script setup>
//列表
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

//頁面跳轉
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const goToDetail = () => {
  // 跳轉到詳情頁，並帶入該活動的 id
  router.push({
    name: 'activityInfo',
    params: { id: props.event.id },

    query: {
      formCategory: route.query.category || '目前活動',
      formPage: route.query.page || 1,
      formSearch: route.query.search || '',
    },
  })
}

// 接收外部傳入的資料
const props = defineProps({
  event: { type: Object, required: true },
})
const status = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()

  const actDate = new Date(props.event.date)
  actDate.setHours(0, 0, 0, 0)
  const actTime = actDate.getTime()

  const deadlineDate = new Date(actDate)
  deadlineDate.setDate(actDate.getDate() - 1)
  const deadlineTime = deadlineDate.getTime()
  // console.log(deadlineDate)

  if (todayTime > actTime) {
    return 'ended'
  }
  if (todayTime === actTime) {
    return 'opening'
  }
  if (todayTime === deadlineTime) {
    return 'deadline'
  }
  return 'upcoming'
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
const isBookmarked = ref(false) // 是否已收藏
const isHovering = ref(false) // 是否正在 hover

// 根據狀態決定要顯示哪個 Icon 名稱
const bookmarkIcon = computed(() => {
  if (isBookmarked.value) {
    return isHovering.value ? 'bookmark' : 'bookmark'
  } else {
    return isHovering.value ? 'bookmark_add' : 'bookmark'
  }
})

const toggleBookmark = (e) => {
  //防止點愛心時觸發卡片跳轉
  e.stopPropagation()

  if (!authStore.isLogin) {
    authStore.openLoginModal()
    return
  }

  isBookmarked.value = !isBookmarked.value
}
</script>
<template>
  <a class="cardContainer activityCard" @click="goToDetail">
    <div class="cardPic">
      <img :src="event.image" :alt="event.title" />
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
          :class="{ 'is-active': isBookmarked }"
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
        <h3>{{ event.date }}</h3>
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
@import '@/assets/scss/component/_card.scss';
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
    min-height: 3rem;
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
    flex-wrap: wrap;
    @include font-body-l;
    color: $text-color;
    margin-bottom: 8px;
    gap: 8px;
  }
  .rowInfo.location {
    display: flex;
    flex-wrap: nowrap;
    align-self: start;
    margin-bottom: 8px;
    gap: 8px;
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
