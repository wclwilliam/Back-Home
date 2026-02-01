import http from './http'

// 獲取會員資料 API
export const fetchMemberInfo = async () => {
  try {
    const response = await http.get('/member/auth_me.php')
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error
  }
}

// 更新會員資料 API
export const updateMemberInfo = async (data) => {
  try {
    const response = await http.patch('/member/auth_update_me.php', data)
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error
  }
}

// 更新密碼 API
export const updatePassword = async (newPassword) => {
  try {
    const response = await http.patch('/member/auth_update_password.php', {
      new_password: newPassword,
    })
    return response.data
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw error
  }
}
