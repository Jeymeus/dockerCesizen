<template>
  <div class="welcome-container">
    <div class="card shadow-sm welcome-card">
      <div class="card-body text-center">
        <h2 class="rainbow-title mb-3">Bienvenue, {{ user?.firstname }}</h2>
        <p class="lead">Que souhaitez-vous faire aujourd'hui ?</p>

        <div class="d-grid gap-3 col-10 mx-auto mt-4">
          <router-link class="btn btn-outline-success" to="/profil">
            📄 Consulter mon profil
          </router-link>
          <router-link class="btn btn-outline-info" to="/menu">
            📚 Parcourir les ressources
          </router-link>
          <router-link class="btn btn-outline-primary" to="/journal">
            📘 Consulter mon journal
          </router-link>
          <router-link class="btn btn-outline-secondary" to="/emotions">
            😊 Explorer les émotions
          </router-link>
          <router-link class="btn btn-outline-warning" to="/rapport">
            📊 Générer un rapport
          </router-link>
          <router-link v-if="requireAdmin" class="btn btn-outline-danger" to="/admin">
            🛠 Panneau d'administration
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/userStore'
import { computed, ref } from 'vue'

const showReportModal = ref(false)


const store = useUserStore()
const user = computed(() => store.user)
const requireAdmin = computed(() => store.requireAdmin)
</script>

<style scoped>
.welcome-container {
  text-align: center;
  max-width: 700px;
  margin: auto;
  margin-top: 2rem;
  padding: 2rem;
  background: #fffaf3;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Dancing Script', cursive;
}

.welcome-card {
  background-color: #fff8e6;
  border-radius: 20px;
  padding: 2rem;
}

.rainbow-title {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(to right,
      #ff4e50,
      #fc913a,
      #f9d423,
      #e2f356,
      #7ed957,
      #00c9a7,
      #2e86de,
      #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
