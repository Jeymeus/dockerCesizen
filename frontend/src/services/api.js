import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// 🔐 Ajoute automatiquement le token JWT dans l'en-tête Authorization
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 🛠️ Gestion globale des erreurs
api.interceptors.response.use(
    res => res,
    err => {
        console.error('[API ERROR]', err.response?.data || err.message)
        return Promise.reject(err)
    }
)

export default api
