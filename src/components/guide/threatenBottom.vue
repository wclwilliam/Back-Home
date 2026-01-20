<script setup>
import { ref } from 'vue';
import LightboxModal from '@/components/guide/LightboxModal.vue';
import { cardData } from '@/components/guide/threatenData';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const base = import.meta.env.BASE_URL
const parsePublicFile = (imgURL) => {
  return `${base}${imgURL}`
}
const isModalOpen = ref(false);
const currentItem = ref({});


const openModal = (item) => {
  currentItem.value = item;
  isModalOpen.value = true;
};

//swiper
const modules = [Pagination];

</script>
<template>
  <section class="desktopFlexCard container">
    <div v-for="item in cardData" :key="item.id" class="bottomcard" @click="openModal(item)">
       <img :src="parsePublicFile(item.image)" :alt="item.title">
      <div class="overlay">
        <div class="overlayContent">
          <h3>{{ item.title }}</h3>
          <p v-html="item.title2"></p>
        </div>
      </div>
    </div>
  </section>
  <LightboxModal :isOpen="isModalOpen" :item="currentItem" @close="isModalOpen = false" />

  <div class="mobileFlexCard">
    <swiper :modules="modules" :slides-per-view="1" :space-between="20"
      :pagination="{ clickable: true }">
      <swiper-slide v-for="item in cardData" :key="item.id">
        <div class="mobileCard">
          <div class="cardImage">
            <img :src="parsePublicFile(item.image)" :alt="item.title">
          </div>
          <div class="cardContent">
            <h3>{{ item.modalTitle }}</h3>
            <p>{{ item.modalDesc }}</p>
          </div>
        </div>

      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.desktopFlexCard {
  margin: 67px auto;
  display: flex;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.bottomcard {
  flex: 1;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: flex 0.3s ease; 
  will-change: flex;
  transform: translateZ(0); 

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
  }

  &:hover {
    flex: 1.5;

    .overlay {
      opacity: 1;
    }
  }
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  box-sizing: border-box;
  transition: opacity 0.3s ease; 
}


.overlayContent {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  z-index: 100;

  h3 {
    @include font-tertiary;
    color: $text-white;
  }

  p {
    @include font-body-bold;
    text-align: center;
    color: $text-white;
  }
}

//手機Swiper樣式
.mobileFlexCard {
  display: none;
  width: 100%;
  padding: 60px 20px;
  box-sizing: border-box;

  :deep(.swiper) {
    padding-bottom: 40px;
  }

  :deep(.swiper-pagination) {
    bottom: 0;
  }

  :deep(.swiper-pagination-bullet-active) {
    background-color: $primary-color;
  }

  .mobileCard {
    height: 500px;
    background: $card-color;
    width: 80%;
    overflow: hidden;
    margin: auto;
    @media(max-width:600px){
         width: 100%;
         height: 100%;
    }

    .cardImage {
      width: 100%;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .cardContent {
      padding: 20px;
      color: $text-color;

      h3 {
        @include font-tertiary;
        margin-bottom: 10px;
        text-align: center;
      }

      p {
        @include font-body;
      }
    }
  }
}


@media (max-width: 768px) {
  .desktopFlexCard {
    display: none;
  }

  .mobileFlexCard {
    display: block;
  }
}
</style>