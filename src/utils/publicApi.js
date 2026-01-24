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

export const testApi = axios.create({
    baseURL: 'https://tibamef2e.com/cjd101/g2/php',
    timeout: 5000
})

export const testApi2 = axios.create({
    baseURL: 'https://notes.webmix.cc/ajax/teach/api',
    timeout: 5000
})