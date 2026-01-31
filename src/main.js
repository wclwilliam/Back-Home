import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

import '@/assets/scss/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: '673363598369-snrgqtb6imro0obcmnns4sh0o57071k2.apps.googleusercontent.com',
})

// 應用初始化時，如果有 token 就從後端恢復用戶狀態
const authStore = useAuthStore()
if (authStore.token) {
  authStore.fetchMe()
}

app.mount('#app')
