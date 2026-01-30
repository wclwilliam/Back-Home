import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/scss/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: '673363598369-snrgqtb6imro0obcmnns4sh0o57071k2.apps.googleusercontent.com',
})

app.mount('#app')
