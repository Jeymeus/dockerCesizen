<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-6 col-lg-4">
        <h2 class="text-center mb-4">Inscription</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="firstname" class="form-label">Prénom</label>
            <input type="text" v-model="firstname" id="firstname" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="lastname" class="form-label">Nom</label>
            <input type="text" v-model="lastname" id="lastname" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Adresse email</label>
            <input type="email" v-model="email" id="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <input type="password" v-model="password" id="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success w-100" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            M'inscrire
          </button>
          <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// Register logic
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserStore } from '../stores/userStore'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const router = useRouter()
const userStore = useUserStore()

const handleRegister = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.post('/auth/register', {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      password: password.value
    })
    userStore.setUser(res.data)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || "Échec de l'inscription"
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