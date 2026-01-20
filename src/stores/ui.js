import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const hideHeader = ref(false)

  const setHideHeader = (value) => {
    hideHeader.value = Boolean(value)
  }

  return { hideHeader, setHideHeader }
})
