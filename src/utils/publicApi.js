import axios from 'axios'

export const base = import.meta.env.BASE_URL
export const APIBase = import.meta.env.VITE_API_BASE

export const publicApi = axios.create({
  baseURL: base,
  timeout: 5000,
})

// 沒有攔截器，乾乾淨淨
export const testApi = axios.create({
  baseURL: 'https://notes.webmix.cc/ajax/teach/api',
<<<<<<< HEAD
  timeout: 5000
=======
  timeout: 5000,
>>>>>>> cathy
})
//上課測試用
export const testApi2 = axios.create({
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

// 發送驗證碼API
export const sendVerificationCode = async (email) => {
  try {
    const response = await backHomeApi.post('/member_auth_register_send_code.php', { email })
    return response.data
  } catch (error) {
    // 如果是后端返回的错误，直接抛出
    if (error.response?.data) {
      throw error.response.data
    }

    // 只有在网络错误时才使用mock（例如后端未启动）
    if (!error.response) {
      console.warn('後端API不可用，使用開發測試模式', error)
      return new Promise((resolve) => {
        setTimeout(() => {
          const code = String(Math.floor(100000 + Math.random() * 900000))
          resolve({ ok: true, code })
        }, 500)
      })
    }

    throw error.response?.data || error
  }
}

// 註冊API
export const register = async (data) => {
  try {
    const response = await backHomeApi.post('/member_auth_register.php', {
      email: data.email,
      code: data.code,
      password: data.password,
      name: data.name,
    })
    return response.data
  } catch (error) {
    // 如果是后端返回的错误，直接抛出
    if (error.response?.data) {
      throw error.response.data
    }

    // 只有在网络错误时才使用mock（例如后端未启动）
    if (!error.response) {
      console.warn('後端API不可用，使用開發測試模式', error)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!data.email || !data.code || !data.password || !data.name) {
            reject({ error: 'email, code, password, name are required' })
            return
          }
          resolve({ ok: true })
        }, 500)
      })
    }

    throw error.response?.data || error
  }
}
