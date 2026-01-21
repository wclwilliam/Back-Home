<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/utils/publicApi'

const awardList = ref([])

const parseAssets = (fileName) => {
  return new URL(`../../assets/image/about/award/${fileName}`, import.meta.url).href
}

onMounted(async () => {
  try {
    const res = await publicApi.get('data/award.json')
    awardList.value = res.data
  } catch (error) {
    console.error('Failed to fetch awards:', error)
  }
})
</script>

<template>
  <div class="award-section">
    <div class="container">
      <div class="row">
        <div class="col-sm-2 col-md-4 col-lg-2 award-item" v-for="item in awardList" :key="item.id">
          <div class="image-box">
            <img :src="parseAssets(item.image)" :alt="item.title" />
          </div>
          <div class="text-content">
            <div class="year">{{ item.year }}</div>
            <div class="title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';

.award-section {
  padding: 60px 0;
}

.award-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  text-align: center;
}

.image-box {
  width: 100%;
  aspect-ratio: 1; // 正方形
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.text-content {
  .year {
    @include font-body-l-bold;
    color: $text-color;
  }

  .title {
    @include font-body-bold;
    color: $text-color;
  }
}

// RWD 調整
@media (max-width: 767px) {
  .award-section {
    padding: 40px 0;
  }
}
</style>
