import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

const localStorageKey = 'USER_TOKEN'
const USERS = [
    { account: 'demo@gmail.com', password: '1234ffgg', token: 'fake_token_demo' },
    { account: 'ruby@gmail.com', password: '5678ccvv', token: 'fake_token_ruby' },]

export const useUserStore = defineStore('user', () => {
    const errorMeg = ref('')
    const token = ref('')
    const isLogin = computed(() => token.value !=='')

    
    const loadStorage = () => {
        // 讀取localStorage
        const cache = localStorage.getItem(localStorageKey)
        if (cache) {
        token.value = cache
        }
    }

    const login = (accountValue, passwordValue) => {
        //先判斷
        if (!accountValue || !passwordValue) {
            errorMeg.value = '請輸入帳號或密碼'
            return false
        }
        const result = USERS.find((user)=>{
            return user.account === accountValue && user.password === passwordValue
        })
        if (!result) {
            errorMeg.value = '登入失敗'
            return false
        }
        //成功登入
        token.value = result.token
        localStorage.setItem(localStorageKey, result.token) // 成功登入再寫入localStorage
    }
    const logout = () => {
        token.value = ''
        localStorage.removeItem(localStorageKey)
    }
    loadStorage()
    return { token, isLogin, login, logout }
    })

//     router.beforeEach((to) => {
//         console.log(to.fullPath)
//     const userStore = useUserStore()
//     if(to.meta.auth) {
//         if(!userStore.isLogin) {
//             return { 
//                 path: '/login', 
//                 query: { 
//                     redirect: to.fullPath 
//                 } 
//             }
//     }
//     }
// })   