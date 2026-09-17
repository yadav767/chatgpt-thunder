import axios from 'axios';

const api = axios.create({
    baseURL: "https://backend-chatgpt-two.vercel.app/api",
    withCredentials: true
})

export default api;