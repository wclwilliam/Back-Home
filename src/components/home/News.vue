<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { publicApi } from '@/utils/publicApi'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import NewsCard from '@/components/cards/NewsCard.vue'

const router = useRouter()
const newslist = ref([])

// 取得前 10 筆新聞
const topTenNews = computed(() => {
  return newslist.value.slice(0, 10)
})

// Swiper 設定
const modules = [Pagination]
const swiperOptions = {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    clickable: true,
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

onMounted(() => {
  publicApi
    .get('data/NewsList.json')
    .then((response) => {
      newslist.value = response.data.sort((a, b) => {
        return new Date(b.publish_time) - new Date(a.publish_time)
      })
    })
    .catch((error) => {
      console.error('載入新聞列表失敗:', error)
    })
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
      <div class="newsSwiperWrapper" v-if="topTenNews.length > 0">
        <Swiper
          :modules="modules"
          :slides-per-view="swiperOptions.slidesPerView"
          :space-between="swiperOptions.spaceBetween"
          :loop="swiperOptions.loop"
          :pagination="swiperOptions.pagination"
          :breakpoints="swiperOptions.breakpoints"
          class="newsSwiper"
        >
          <SwiperSlide v-for="item in topTenNews" :key="item.article_id">
            <NewsCard
              :id="item.article_id"
              :title="item.title"
              :date="formatDate(item.publish_time)"
              :typeBadge="item.category"
              :image="item.image_url"
              @click="goToDetail(item.article_id)"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div v-else class="loadingState">
        <p>載入中...</p>
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
  }

  .loadingState {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }
}
</style>
