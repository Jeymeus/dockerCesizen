import api from './api.js'

/**
 * 📦 Récupère toutes les entités dynamiques selon leur type
 * @param {string} resource - Type d'entité (users, pages, entries, menus, emotions)
 */
export const getAll = (resource) => {
    return api.get(`/${resource}`)
}

/**
 * 🔍 Récupère une entité par son ID
 */
export const getById = (resource, id) => {
    return api.get(`/${resource}/${id}`)
}

/**
 * 🆕 Crée une nouvelle entité
 */
export const create = (resource, data) => {
    return api.post(`/${resource}`, data)
}

/**
 * ✏️ Met à jour une entité
 */
export const update = (resource, id, data) => {
    return api.put(`/${resource}/${id}`, data)
}

/**
 * 🗑️ Supprime une entité
 */
export const remove = (resource, id) => {
    return api.delete(`/${resource}/${id}`)
}

/**
 * 📊 Récupère le rapport émotionnel par période (entries/report/user)
 */
export const getEmotionReport = (start, end) => {
    return api.get(`/entries/report/user`, { params: { start, end } })
}
