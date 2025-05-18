<template>
    <div class="d-flex justify-content-between align-items-center px-3 py-2 text-white shadow-sm" :style="headerStyle">
        <router-link to="/" class="text-white fw-bold text-decoration-none">
            CesiZen
        </router-link>
        <router-link :to="isAuthenticated ? '/profil' : '/login'" class="btn btn-outline-light btn-sm">
            <font-awesome-icon :icon="isAuthenticated ? 'user' : 'circle-user'" />
        </router-link>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const isAuthenticated = computed(() => store.isAuthenticated)

const headerStyle = {
    background: 'linear-gradient(to right, #28a745, #007bff, #ffc107)',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}
</script>
  
