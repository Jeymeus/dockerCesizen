<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="text-center mb-4">Mot de passe oublié</h2>
            <form @submit.prevent="handleForgot">
              <div class="mb-3">
                <label for="email" class="form-label">Adresse email</label>
                <input v-model="email" type="email" class="form-control" id="email" required />
              </div>
              <button class="btn btn-warning w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Envoyer le lien de réinitialisation
              </button>
              <p v-if="resetLink" class="alert alert-success mt-3 text-center">
                Lien simulé : <br />
                <router-link :to="resetLink">{{ resetLink }}</router-link>
              </p>
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
import api from '../../services/api'

const email = ref('')
const resetLink = ref(null)
const loading = ref(false)
const error = ref(null)

const handleForgot = async () => {
  loading.value = true
  error.value = null
  resetLink.value = null

  try {
    const res = await api.post('/auth/forgot-password', { email: email.value })
    resetLink.value = res.data.resetLink
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur'
  } finally {
    loading.value = false
  }
}
</script>
