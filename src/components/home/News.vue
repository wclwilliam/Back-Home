<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { publicApi, backHomeApi } from '@/utils/publicApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import NewsCard from '@/components/cards/NewsCard.vue'

const router = useRouter()
const newslist = ref([])
const isLoading = ref(true)

// 取得前 10 筆新聞
const topTenNews = computed(() => {
  return newslist.value.slice(0, 10)
})

// Swiper 設定
const modules = [Pagination, Navigation]
const swiperOptions = {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
}

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await backHomeApi.get('./news/news_get.php')
    newslist.value = response.data.sort((a, b) => {
      return new Date(b.published_at) - new Date(a.published_at)
    })
  } catch (error) {
    console.error('載入新聞列表失敗:', error)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const goToDetail = (id) => {
  router.push({
    name: 'NewsDetail',
    params: { id: id },
  })
}
</script>
<template>
  <section class="newsSection">
    <div class="container">
      <div v-if="isLoading" class="loadingState">
        <p>載入中...</p>
      </div>

      <div class="newsSwiperWrapper" v-else-if="topTenNews.length > 0">
        <Swiper
          :modules="modules"
          :slides-per-view="swiperOptions.slidesPerView"
          :space-between="swiperOptions.spaceBetween"
          :loop="swiperOptions.loop"
          :pagination="swiperOptions.pagination"
          :navigation="swiperOptions.navigation"
          :breakpoints="swiperOptions.breakpoints"
          class="newsSwiper"
        >
          <SwiperSlide v-for="item in topTenNews" :key="item.id">
            <NewsCard
              :id="item.id"
              :title="item.title"
              :date="formatDate(item.published_at)"
              :typeBadge="item.category"
              :image="item.image_path"
              @click="goToDetail(item.id)"
            />
          </SwiperSlide>
        </Swiper>
        <!-- 自定義導航按鈕 -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>

      <div v-else class="loadingState">
        <p>目前沒有新聞</p>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/base/color';
@import '@/assets/scss/base/font';

.newsSection {
  .newsSwiperWrapper {
    position: relative;

    .newsSwiper {
      padding-bottom: 50px; // 給分頁器留空間

      // 覆蓋 NewsCard 內部的 col 類別，讓它在 Swiper 中正常顯示
      :deep(.col-sm-4),
      :deep(.col-md-6),
      :deep(.col-lg-4) {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        flex: none !important;
      }

      // 分頁器樣式
      :deep(.swiper-pagination-bullet) {
        background: $primary-color;
        opacity: 0.5;
      }

      :deep(.swiper-pagination-bullet-active) {
        background: $secondary-color;
        opacity: 1;
      }
    }

    // 導航按鈕樣式
    .swiper-button-prev,
    .swiper-button-next {
      color: $primary-color; // 跟分頁器一樣使用主色
      opacity: 0.5; // 跟分頁器未選中狀態一致 (0.5)
      width: 30px;
      height: 30px;
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      transition: all 0.3s ease;

      &:hover {
        background: transparent;
        color: $secondary-color; // hover 時改為次要色 (跟分頁器選中狀態一致)
        opacity: 1; // opacity 變為 1
      }

      // 手機版隱藏 (<= 767px)
      @media (max-width: 767px) {
        display: none;
      }
    }

    // 完美置中於 40px 的 padding 空間內
    // 垂直置中：因為 container 有 padding-bottom: 50px，所以中心點要上移 25px
    // 修正：為了避免 44px 按鈕加上 centering 後超出 40px padding (導致 2px overflow)，將偏移量從 -20px 改為 -15px
    .swiper-button-prev {
      left: -25px;
      top: calc(50% - 25px);
      transform: translate(-50%, -50%); // 水平+垂直居中
      margin-top: 0;
    }

    .swiper-button-next {
      right: -25px;
      top: calc(50% - 25px);
      transform: translate(50%, -50%); // 水平+垂直居中
      margin-top: 0;
    }
  }

  .loadingState {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }
}
</style>
