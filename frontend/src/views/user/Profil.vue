<template>
  <div class="profil-container">
    <div class="profil-card shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="rainbow-title mb-0 text-center w-100">👤 Mon Profil</h2>
        <router-link to="/profil/edit" class="edit-icon" title="Modifier mon profil">⚙️</router-link>
      </div>

      <div v-if="user" class="profil-details text-start">
        <p><strong>Prénom :</strong> {{ user.firstname || 'Non renseigné' }}</p>
        <p><strong>Nom :</strong> {{ user.lastname || 'Non renseigné' }}</p>
        <p><strong>Email :</strong> {{ user.email || 'Non renseigné' }}</p>
        <p>
          <strong>Statut : </strong>
          <span :class="user.active ? 'text-success' : 'text-danger'">
            {{ user.active ? 'Actif' : 'Inactif' }}
          </span>
        </p>

        <button class="btn btn-outline-danger mt-4" @click="logout">
          🚪 Se déconnecter
        </button>
      </div>

      <div v-else>
        <p class="text-muted">Utilisateur non trouvé.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const user = userStore.user

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profil-container {
  max-width: 600px;
  margin: auto;
  margin-top: 3rem;
  padding: 2rem;
  background: #fffaf3;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Dancing Script', cursive;
  text-align: center;
}

.profil-card {
  background-color: #fff8e6;
  padding: 2rem;
  border-radius: 20px;
  color: #333;
  position: relative;
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

.profil-details {
  font-size: 1.1rem;
}

.edit-icon {
  position: absolute;
  top: 1.3rem;
  right: 1.5rem;
  font-size: 1.3rem;
  text-decoration: none;
  transition: transform 0.2s;
}

.edit-icon:hover {
  transform: scale(1.2);
}
</style>
