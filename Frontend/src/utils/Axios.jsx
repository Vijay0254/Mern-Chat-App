import axios from 'axios'

export const Axios = axios.create({
    baseURL: import.meta.env.VITE_MODE == "development" ? import.meta.env.VITE_BACKEND_URL : "/",
    withCredentials: true
})
