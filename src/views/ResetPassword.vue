<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="text-center mb-4">Nouveau mot de passe</h2>
            <form @submit.prevent="handleReset">
              <div class="mb-3">
                <label for="password" class="form-label">Nouveau mot de passe</label>
                <input v-model="password" type="password" class="form-control" id="password" required />
              </div>
              <button class="btn btn-success w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Réinitialiser le mot de passe
              </button>
              <p v-if="message" class="alert alert-success mt-3 text-center">{{ message }}</p>
              <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const token = route.params.token

const handleReset = async () => {
  loading.value = true
  error.value = ''
  message.value = ''

  try {
    await api.post(`/auth/reset-password/${token}`, { newPassword: password.value })
    message.value = 'Mot de passe réinitialisé avec succès ! Redirection en cours...'
    setTimeout(() => router.push('/login'), 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur'
  } finally {
    loading.value = false
  }
}
</script>
