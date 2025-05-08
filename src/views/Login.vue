<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-6 col-lg-5">
        <div class="card p-4 shadow" style="background-color: #f8f9fa;">
          <!-- Toggle buttons -->
          <div class="d-flex justify-content-center gap-2 mb-4">
            <button
              class="btn"
              :class="mode === 'login' ? 'btn-warning' : 'btn-outline-warning'"
              @click="mode = 'login'"
            >
              Connexion
            </button>
            <button
              class="btn"
              :class="mode === 'register' ? 'btn-success' : 'btn-outline-success'"
              @click="mode = 'register'"
            >
              Inscription
            </button>
          </div>

          <h2 class="text-center mb-4">{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h2>

          <form @submit.prevent="mode === 'login' ? handleLogin() : handleRegister()">
            <div v-if="mode === 'register'" class="mb-3">
              <label for="firstname" class="form-label">Prénom</label>
              <input type="text" v-model="firstname" id="firstname" class="form-control" required />
            </div>
            <div v-if="mode === 'register'" class="mb-3">
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
            <button
              type="submit"
              class="btn w-100"
              :class="mode === 'login' ? 'btn-warning' : 'btn-success'"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ mode === 'login' ? 'Se connecter' : "M'inscrire" }}
            </button>
            <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
            <p class="text-center mt-3">
              <router-link to="/forgot-password" class="link-danger text-decoration-underline">
                Mot de passe oublié ?
              </router-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useUserStore } from '../stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const mode = ref('login') // 'login' ou 'register'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    userStore.setUser(res.data)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Échec de la connexion'
  } finally {
    loading.value = false
  }
}

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
