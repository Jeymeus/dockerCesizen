<template>
  <div class="container mt-5 text-center text-white">
    <h2 class="mb-4">Mon Profil</h2>

    <div v-if="user" class="card mx-auto" style="max-width: 400px;">
      <div class="card-body bg-dark text-white">
        <p><strong>Nom d'utilisateur :</strong> {{ user.firstname || 'Non renseigné' }}</p>
        <p><strong>Email :</strong> {{ user.email || 'Non renseigné' }}</p>
        <p><strong>Rôle :</strong> {{ user.role }}</p>
        <button class="btn btn-danger mt-3" @click="logout">Se déconnecter</button>
      </div>
    </div>

    <div v-else>
      <p>Utilisateur non trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
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
h2 {
  color: white;
}
</style>
