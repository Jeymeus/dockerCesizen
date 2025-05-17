<template>
    <div class="edit-container">
        <div class="edit-card shadow-sm">
            <h2 class="rainbow-title mb-4">⚙️ Modifier mon profil</h2>

            <form @submit.prevent="saveChanges" class="text-start">
                <div class="mb-3">
                    <label for="firstname" class="form-label">Prénom</label>
                    <input v-model="form.firstname" type="text" id="firstname" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="lastname" class="form-label">Nom</label>
                    <input v-model="form.lastname" type="text" id="lastname" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input v-model="form.email" type="email" id="email" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Mot de passe (laisser vide pour ne pas changer)</label>
                    <input v-model="form.password" type="password" id="password" class="form-control" />
                </div>

                <div class="form-check form-switch mb-4">
                    <input class="form-check-input" type="checkbox" id="active" v-model="form.active" />
                    <label class="form-check-label" for="active">
                        Statut : {{ form.active ? 'Actif' : 'Inactif' }}
                    </label>
                </div>

                <div class="d-flex justify-content-between">
                    <router-link to="/profil" class="btn btn-outline-secondary">↩️ Retour</router-link>
                    <button type="submit" class="btn btn-outline-success">💾 Enregistrer</button>
                </div>

                <!-- ✅ Affichage unique de l'erreur -->
                <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>

            </form>
        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import api from '../../services/api'

const userStore = useUserStore()
const router = useRouter()
const user = userStore.user
const error = ref('')

const form = reactive({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    password: '',
    active: user.active ?? true,
})

const saveChanges = async () => {
    error.value = ''

    // Vérif mot de passe si présent
    if (form.password && form.password.length < 6) {
        error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
        return
    }

    try {
        const payload = {
            firstname: form.firstname,
            lastname: form.lastname,
            email: form.email,
            active: form.active,
        }

        if (form.password) {
            payload.password = form.password
        }

        const res = await api.put('/users/profile', payload)
        userStore.setUser(res.data)
        router.push('/profil')
    } catch (err) {
        console.error('Erreur modification profil :', err)
        error.value = "Une erreur est survenue lors de la modification."
    }
}

</script>

<style scoped>
.edit-container {
    max-width: 600px;
    margin: auto;
    margin-top: 3rem;
    padding: 2rem;
    background: #fffaf3;
    border-radius: 20px;
    font-family: 'Dancing Script', cursive;
}

.edit-card {
    background-color: #fff8e6;
    padding: 2rem;
    border-radius: 20px;
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
  
