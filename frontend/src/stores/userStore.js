// src/stores/userStore.js
import { defineStore } from 'pinia'
import api from '../services/api'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null
    }),

    actions: {
        // ✅ Met à jour l'utilisateur et le token
        setUser({ user, token }) {
            this.user = user
            this.token = token
            localStorage.setItem('token', token)
        },

        // 🔓 Déconnexion
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },

        // 🔁 Chargement depuis le token JWT
        async loadUserFromToken() {
            if (!this.token) return

            try {
                const response = await api.get('/users/me') // API auto-gère le token
                this.user = response.data
            } catch (error) {
                console.error('Erreur lors du chargement de l’utilisateur :', error)
                this.logout()
            }
        }
    },

    getters: {
        // 🧾 Est connecté ?
        isAuthenticated: (state) => !!state.token,

        // 👮 Est admin ?
        requireAdmin: (state) => state.user?.role === 'admin',

        // 👤 Données utilisateur
        getUser: (state) => state.user
    }
})
