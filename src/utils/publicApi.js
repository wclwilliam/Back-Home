import axios from 'axios'

export const base = import.meta.env.BASE_URL

export const publicApi = axios.create({
    baseURL: base,
    timeout: 5000
})

// 沒有攔截器，乾乾淨淨
export const musicApi = axios.create({
    baseURL: 'https://api.spotify.com',
    timeout: 5000
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
