<script setup>
import MainHeader from '@/components/Header.vue'
import MainFooter from '@/components/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const uiStore = useUiStore()

const showFooter = computed(() => !route.meta.hideFooter)
</script>

<template>
  <div class="app-shell">
    <MainHeader v-if="!uiStore.hideHeader" />
    <main class="app-main">
      <RouterView />
    </main>
    <MainFooter v-if="showFooter" />
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100dvh; // 比 100vh 更適合手機
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  min-height: 0; // 避免內層 grid/overflow 撐爆
  position: relative;
  z-index: 0;
}
</style>
