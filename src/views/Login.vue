<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-6 col-lg-4">
        <h2 class="text-center mb-4">Connexion</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Adresse email</label>
            <input type="email" v-model="email" id="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input type="password" v-model="password" id="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Se connecter
          </button>
          <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Login logic
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserStore } from '../stores/userStore'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.post('/auth/login', { email: email.value, password: password.value })
    userStore.setUser(res.data)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Échec de la connexion'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input::placeholder {
  font-size: 0.9rem;
}
</style>
