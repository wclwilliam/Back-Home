import axios from 'axios'

export const base = import.meta.env.BASE_URL
export const APIBase = import.meta.env.VITE_API_BASE

export const publicApi = axios.create({
  baseURL: base,
  timeout: 5000,
})

export const backHomeApi = axios.create({
  baseURL: APIBase,
  timeout: 5000,
})

// 發送驗證碼API
export const sendVerificationCode = async (email) => {
  try {
    const response = await backHomeApi.post('/member/auth_register_send_code.php', { email })
    return response.data
  } catch (error) {
    // 如果是後端返回的錯誤，直接拋出
    if (error.response?.data) {
      throw error.response.data
    }

    // 只有在網路錯誤時才使用mock（例如後端未啟動）
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
    const response = await backHomeApi.post('/member/auth_register.php', {
      email: data.email,
      code: data.code,
      password: data.password,
      name: data.name,
    })
    return response.data
  } catch (error) {
    // 如果是後端返回的錯誤，直接拋出
    if (error.response?.data) {
      throw error.response.data
    }

    // 只有在網路錯誤時才使用mock（例如後端未啟動）
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

// 登入 API
export const login = async (email, password) => {
  try {
    const response = await backHomeApi.post('/member/auth_login.php', {
      email,
      password,
    })
    return response.data
  } catch (error) {
    // 如果是後端返回的錯誤，直接拋出
    if (error.response?.data) {
      throw error.response.data
    }

    // 只有在網路錯誤時才使用mock（例如後端未啟動）
    if (!error.response) {
      console.warn('後端API不可用，使用開發測試模式', error)
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'demo@test.com' && password === 'Demo1234') {
            resolve({
              ok: true,
              token: 'mock_token_' + Date.now(),
              user: {
                id: 1,
                name: 'Demo User',
                email: 'demo@test.com',
              },
            })
          } else {
            reject({ error: 'invalid email or password' })
          }
        }, 500)
      })
    }

    throw error.response?.data || error
  }
}

// Google 登入 API
export const googleLogin = async (credential) => {
  try {
    const response = await backHomeApi.post('/member/auth_google_login.php', {
      credential,
    })
    return response.data
  } catch (error) {
    // 如果是後端返回的錯誤，直接拋出
    if (error.response?.data) {
      throw error.response.data
    }
    throw error.response?.data || error
  }
}

// LINE 登入 - 獲取授權 URL
export const getLineAuthUrl = async () => {
  try {
    const response = await backHomeApi.get('/member/auth_line_get_url.php')
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error.response?.data || error
  }
}

// LINE 登入 - 驗證 code 並登入
export const lineLoginVerify = async (code, state) => {
  try {
    const response = await backHomeApi.post('/member/auth_line_verify.php', {
      code,
      state,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error.response?.data || error
  }
}

// 發送重設密碼連結 API
export const forgotPassword = async (email) => {
  try {
    const response = await backHomeApi.post('/member/auth_forgot_password.php', { email })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error.response?.data || error
  }
}

// 重設密碼 API
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await backHomeApi.post('/member/auth_reset_password.php', {
      token,
      new_password: newPassword,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error.response?.data || error
  }
}
