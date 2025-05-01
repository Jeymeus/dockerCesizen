// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null
    }),
    actions: {
        setUser({ user, token }) {
            this.user = user
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },
        async loadUserFromToken() {
            if (!this.token) return

            try {
                const response = await fetch('/api/me', {
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })

                if (!response.ok) throw new Error('Token invalide')

                this.user = await response.json()
            } catch (error) {
                console.error('Erreur lors du chargement de l’utilisateur :', error)
                this.logout() // ⬅️ Bonne pratique : token invalide = nettoyage
            }
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    },
})

