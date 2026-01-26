import axios from 'axios'

export const base = import.meta.env.BASE_URL
export const APIBase = import.meta.env.VITE_API_BASE

export const publicApi = axios.create({
  baseURL: base,
  timeout: 5000,
})

// 沒有攔截器，乾乾淨淨
export const musicApi = axios.create({
  baseURL: 'https://api.spotify.com',
  timeout: 5000,
})
//上課測試用
export const testApi = axios.create({
  baseURL: 'https://tibamef2e.com/cjd101/g1/api',
  timeout: 5000,
})
//上課測試用2
export const test2Api = axios.create({
  baseURL: 'https://tibamef2e.com/cjd101/g2/php/activities/list-latest.php',
  timeout: 5000,
})

export const backHomeApi = axios.create({
  baseURL: APIBase,
  timeout: 5000,
})

// 模擬登入驗證函數（預設帳號：demo，密碼：1234）
export const mockLogin = async (account, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (account === 'demo' && password === '1234') {
        const mockData = {
          token: 'mock_token_' + Date.now(),
          user: {
            id: 1,
            name: 'Demo User',
            email: 'demo@backhome.com',
            account: 'demo',
            createdAt: new Date().toISOString(),
          },
        }
        resolve(mockData)
      } else {
        reject(new Error('帳號或密碼錯誤'))
      }
    }, 500) // 模擬網路延遲
  })
}
