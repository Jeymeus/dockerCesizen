import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useMenuStore = defineStore('menu', () => {
    const menus = ref([])

    const fetchMenus = async () => {
        try {
            const res = await api.get('/menus')
            menus.value = res.data
        } catch (error) {
            console.error('Erreur chargement menus:', error.response ? error.response.data : error.message)
        }
    }

    return { menus, fetchMenus }
})
