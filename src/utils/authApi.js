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

