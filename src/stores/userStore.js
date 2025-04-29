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
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin'
    }
})