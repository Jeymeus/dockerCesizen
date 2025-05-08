// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null
    }),
    actions: {
        // Fonction pour mettre à jour l'utilisateur et le token
        setUser({ user, token }) {
            this.user = user
            this.token = token
            localStorage.setItem('token', token)
        },

        // Fonction de déconnexion
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },

        // Charger l'utilisateur à partir du token JWT
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
                this.logout() // Nettoyage en cas de token invalide
            }
        }
    },
    getters: {
        // Vérifie si l'utilisateur est authentifié
        isAuthenticated: (state) => !!state.token,

        // Vérifie si l'utilisateur a le rôle admin
        requireAdmin: (state) => state.user?.role === 'admin',

        // Permet d'obtenir les données de l'utilisateur
        getUser: (state) => state.user
    },
})
