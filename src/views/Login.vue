<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-6 col-lg-5">
        <div class="card p-4 shadow" style="background-color: #f8f9fa;">
          <!-- Toggle buttons -->
          <div class="d-flex justify-content-center gap-2 mb-4">
            <button class="btn" :class="mode === 'login' ? 'btn-warning' : 'btn-outline-warning'"
              @click="mode = 'login'">
              Connexion
            </button>
            <button class="btn" :class="mode === 'register' ? 'btn-success' : 'btn-outline-success'"
              @click="mode = 'register'">
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
              <label for="password" class="form-label">Mot de passe </label>
              <input type="password" v-model="password" id="password" class="form-control" placeholder="8 caractères minimum" required />
            </div>
            <div class="mb-2" v-if="mode === 'register' && password">
              <div class="password-meter mb-3" v-if="mode === 'register' && password.length > 0">
                <div class="meter-bar" :style="{ width: passwordStrength + '%', backgroundColor: passwordColor }">{{
                  passwordLabel }}</div>
              </div>
            </div>
            <div v-if="mode === 'register'" class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
              <input type="password" id="confirmPassword" class="form-control" v-model="confirmPassword" required />
            </div>
            <button type="submit" class="btn w-100" :class="mode === 'login' ? 'btn-warning' : 'btn-success'"
              :disabled="loading">
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
import { ref, computed } from 'vue'
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
const confirmPassword = ref('')
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
    userStore.setUser({ user: res.data.user, token: res.data.token })
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

  const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // 🔒 Vérifs frontend robustes
  if (!firstname.value || firstname.value.length > 30) {
    error.value = "Prénom requis (max 30 caractères)"
    loading.value = false
    return
  }

  if (!lastname.value || lastname.value.length > 30) {
    error.value = "Nom requis (max 30 caractères)"
    loading.value = false
    return
  }

  if (!email.value || email.value.length > 50 || !emailRegex.test(email.value)) {
    error.value = "Adresse email invalide"
    loading.value = false
    return
  }

  if (!password.value || password.value.length < 8) {
    error.value = "Mot de passe trop court (min 8 caractères)"
    loading.value = false
    return
  }

  if (!strongPassword.test(password.value)) {
    error.value = "Mot de passe trop faible"
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas"
    loading.value = false
    return
  }

  // ✅ Si tout est OK → appel API
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

const passwordStrength = computed(() => {
  const val = password.value
  let score = 0
  if (val.length >= 8) score += 25
  if (/[A-Z]/.test(val)) score += 25
  if (/\d/.test(val)) score += 25
  if (/[^A-Za-z0-9]/.test(val)) score += 25
  return score
})

const passwordColor = computed(() => {
  if (passwordStrength.value < 50) return '#dc3545'
  if (passwordStrength.value < 75) return '#ffc107'
  return '#28a745'                                  
})

const passwordLabel = computed(() => {
  if (passwordStrength.value < 25) return ''
  if (passwordStrength.value < 50) return 'Faible'
  if (passwordStrength.value < 75) return 'Moyen'
  if (passwordStrength.value < 100) return 'Bon'
  return 'Robuste'
})


</script>

<style scoped>
input::placeholder {
  font-size: 0.9rem;
}

.password-meter {
  width: 100%;
  height: 24px;
  /* au lieu de 8px */
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.meter-bar {
  height: 100%;
  color: white;
  /* ou black selon le fond */
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.5rem;
  transition: width 0.3s ease;
}
</style>
