<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import IndexBanner from '@/components/home/Banner.vue'
import IndexHazardous from '@/components/home/Hazardous.vue'
import IndexSavedChart from '@/components/home/SavedChart.vue'
import IndexSavedCases from '@/components/home/SavedCases.vue'
import IndexVolunteer from '@/components/home/BecomeVolunteer.vue'
import IndexNews from '@/components/home/News.vue'

const hazardousRef = ref(null)
let observer = null

onMounted(() => {
  window.scrollTo(0, 0)

  // 建立 IntersectionObserver
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          // 動畫觸發後可以停止觀察，避免重複觸發
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2, // 當 20% 的元素進入視口時觸發
    },
  )

  if (hazardousRef.value) {
    observer.observe(hazardousRef.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
<template>
  <IndexBanner />
  <div class="hazardous" ref="hazardousRef">
    <div class="container titleWrap">
      <h2>每一天，都有海龜因為人類的活動而受傷</h2>
      <p>牠們面臨的日常，是我們製造的災難。</p>
    </div>
    <IndexHazardous />
  </div>
  <div class="savedChart">
    <div class="container">
      <h2>我們已經幫助了......</h2>
    </div>
    <IndexSavedChart />
  </div>
  <div class="savedCases">
    <div class="container">
      <h2>最新救援案例</h2>
    </div>
    <IndexSavedCases />
  </div>
  <div class="volunteer">
    <IndexVolunteer />
  </div>
  <div class="news">
    <div class="container">
      <h2>最新消息</h2>
    </div>
    <IndexNews />
  </div>
</template>
<style lang="scss" scoped>
.hazardous {
  margin-top: 8rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
.savedChart {
  margin-top: 8rem;
}
.savedCases {
  margin-top: 8rem;
}
.volunteer {
  margin-top: 8rem;
}

.news {
  margin-top: 8rem;
  margin-bottom: 8rem;
}

.titleWrap h2 {
  margin-bottom: 1rem;
}

h2 {
  @include font-secondary;
  width: 100%;
  text-align: center;
  display: block;
  margin-bottom: 3.5rem;
}

p {
  @include font-body-l-bold;
  width: 100%;
  text-align: center;
  display: block;
}
</style>
