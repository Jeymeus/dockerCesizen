import api from './api' // Ton instance axios configurée

// 🔁 USERS
export const getUsers = () => api.get('/users')
export const deleteUser = (id) => api.delete(`/users/${id}`)
// Ajouter d'autres méthodes si tu fais update/role/activation

// 📋 MENUS
export const getMenus = () => api.get('/menus')
export const createMenu = (data) => api.post('/menus', data)
export const updateMenu = (id, data) => api.patch(`/menus/${id}`, data)
export const deleteMenu = (id) => api.delete(`/menus/${id}`)

// 📄 PAGES
export const getPages = () => api.get('/pages')
export const createPage = (data) => api.post('/pages', data)
export const updatePage = (id, data) => api.patch(`/pages/${id}`, data)
export const deletePage = (id) => api.delete(`/pages/${id}`)

// 😊 EMOJIS
export const getEmotions = () => api.get('/emotions')
export const createEmotion = (data) => api.post('/emotions', data)
export const updateEmotion = (id, data) => api.patch(`/emotions/${id}`, data)
export const deleteEmotion = (id) => api.delete(`/emotions/${id}`)
