<script setup>
import { ref } from 'vue'
import ThreadsCard from '@/components/cards/ThreadsCard.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const modules = [Pagination]

const hazardousList = ref([
  {
    id: 1,
    image: '/src/assets/image/home/threads/plastic.jpg',
    title: '誤食塑膠',
    subtitle: '「致命的透明陷阱」',
    description: '海龜無法分辨水母與塑膠袋，誤食後將導致腸道阻塞，甚至活活餓死。',
  },
  {
    id: 2,
    image: '/src/assets/image/home/threads/ship.jpg',
    title: '船隻撞擊',
    subtitle: '「避不開的強力衝擊」',
    description: '頻繁的船隻往來，螺旋槳常在海龜背甲留下難以癒合的巨大傷痕。',
  },
  {
    id: 3,
    image: '/src/assets/image/home/threads/net.jpg',
    title: '魚網纏繞',
    subtitle: '「掙脫不了的束縛」',
    description: '廢棄幽靈漁網在海中漂流，纏繞住海龜的四肢，使其無法換氣而溺水。',
  },
])
</script>

<template>
  <div class="hazardous-section">
    <div class="container">
      <!-- 桌機版：Grid 佈局 -->
      <div class="row desktop-grid">
        <div class="col-sm-4 col-lg-4 mb-4" v-for="item in hazardousList" :key="item.id">
          <ThreadsCard
            :image="item.image"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
          />
        </div>
      </div>

      <!-- 手機/平板版：Swiper 輪播 -->
      <div class="mobile-swiper">
        <swiper
          :modules="modules"
          :space-between="20"
          :pagination="{ clickable: true }"
          :breakpoints="{
            // 當螢幕 >= 768px (平板)
            '768': { slidesPerView: 2 },
            // 預設 (手機)
            '0': { slidesPerView: 1 },
          }"
        >
          <SwiperSlide v-for="item in hazardousList" :key="item.id">
            <ThreadsCard
              :image="item.image"
              :title="item.title"
              :subtitle="item.subtitle"
              :description="item.description"
            />
          </SwiperSlide>
        </swiper>
      </div>
      <div class="bottom-action">
        <router-link to="/game" class="btn btn-outline btn-xxl">
          當你是一隻海龜，能躲開這些威脅嗎？
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.hazardous-section {
  padding-top: 60px;
}

.mb-4 {
  margin-bottom: 24px;
}

// 桌機版：Grid 佈局 (預設顯示)
.desktop-grid {
  display: flex;
  @media (max-width: 1023px) {
    display: none;
  }
}

// 手機/平板版：Swiper 輪播 (預設隱藏)
.mobile-swiper {
  display: none;

  @media (max-width: 1023px) {
    display: block;
  }

  .swiper {
    padding-bottom: 50px; // 給分頁器留空間
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

  :deep(.swiper-slide) {
    height: auto; // 讓 slide 自動計算高度
    display: flex;
    flex-direction: column;
  }
}

// 底部按鈕
.bottom-action {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

@media (max-width: 480px) {
  .btn {
    font-size: $size-quaternary;
  }
}
</style>
