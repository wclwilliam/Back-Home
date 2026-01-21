<script setup>
import { computed } from 'vue'

const props = defineProps({
  image: { type: String, default: 'https://picsum.photos/300/200' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  description: { type: String, required: true },
})

// 處理圖片路徑
const imageUrl = computed(() => {
  if (!props.image) return 'https://picsum.photos/300/200'

  let imagePath = props.image
  if (imagePath.startsWith('/src/')) {
    imagePath = imagePath.replace('/src/', '@/')
  }

  try {
    const imageModules = import.meta.glob('@/assets/image/**/*.{png,jpg,jpeg,gif,svg}', {
      eager: true,
    })
    const fullPath = imagePath.replace('@/', '/src/')
    const matchedModule = imageModules[fullPath]

    if (matchedModule && matchedModule.default) {
      return matchedModule.default
    }
    return 'https://picsum.photos/300/200'
  } catch (error) {
    console.error('圖片載入失敗:', error)
    return 'https://picsum.photos/300/200'
  }
})
</script>

<template>
  <div class="thread-card">
    <div class="card-image">
      <img :src="imageUrl" :alt="title" />
    </div>

    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-subtitle" v-if="subtitle">{{ subtitle }}</div>
      <p class="card-desc">{{ description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/base/_var.scss';
@import '@/assets/scss/base/_font.scss';

.thread-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 100%;
  aspect-ratio: 4/3; // 保持 4:3 比例
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.card-content {
  background-color: $card-color;
  padding: 24px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: $text-color;
}

.card-title {
  @include font-tertiary;
  margin-bottom: 4px;
  color: $text-color;
}

.card-subtitle {
  @include font-body-l-bold;
  margin-bottom: 8px;
  color: $text-color;
}

.card-desc {
  @include font-body;
  color: $text-color;
  margin: 0;
}
</style>
