<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <h2 class="mb-4">Bienvenue, {{ user?.firstname }}</h2>
            <p class="lead">Que souhaitez-vous faire aujourd'hui ?</p>

            <div class="d-grid gap-3 col-10 mx-auto mt-4">
              <router-link class="btn btn-outline-primary" to="/journal">
                📘 Consulter mon journal
              </router-link>
              <router-link class="btn btn-outline-secondary" to="/emotions">
                😊 Explorer les émotions
              </router-link>
              <router-link
                v-if="isAdmin"
                class="btn btn-outline-danger"
                to="/admin"
              >
                🛠 Panneau d'administration
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { computed } from 'vue'

const store = useUserStore()
const user = computed(() => store.user)
const isAdmin = computed(() => store.isAdmin)
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
