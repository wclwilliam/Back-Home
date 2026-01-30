import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore()
    const status = err?.response?.status

    // token 失效 / 未登入
    if (status === 401) {
      await auth.logout()
      // 這裡不強制 router.push，避免循環；交給路由守衛處理
    }
    return Promise.reject(err)
  },
)

export default http
