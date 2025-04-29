<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">Bienvenue, {{ user?.firstname }}</h2>

    <div class="text-center">
      <p class="lead">Que souhaitez-vous faire aujourd'hui ?</p>

      <div class="d-grid gap-3 col-10 mx-auto mt-4">
        <router-link class="btn btn-outline-primary" to="/journal">📘 Consulter mon journal</router-link>
        <router-link class="btn btn-outline-secondary" to="/emotions">😊 Explorer les émotions</router-link>
        <router-link
          v-if="isAdmin"
          class="btn btn-outline-danger"
          to="/admin"
        >🛠 Panneau d'administration</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// Store logic
import { useUserStore } from '../stores/userStore'
import { computed } from 'vue'

const store = useUserStore()
const user = computed(() => store.user)
const isAdmin = computed(() => store.isAdmin)
</script>

<style scoped>
.container {
  max-width: 500px;
}
</style>
