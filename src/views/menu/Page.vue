<template>
  <div class="calendar-container">
    <div v-if="page">
      <!-- Bouton retour + Titre -->
      <div class="d-flex align-items-center justify-content-center mb-4 position-relative">
        <button class="back-button" @click="goBack">⬅️</button>
        <h1 class="rainbow-title m-0">{{ page.title }}</h1>
      </div>

      <!-- Contenu principal -->
      <div class="card page-card">
        <div class="card-body">
          <p class="card-text text-start" v-html="page.content"></p>

          <!-- Lien cliquable via icône -->
          <p v-if="page.url" class="mt-4 text-start">
            Le lien ici :
            <a :href="page.url" target="_blank" rel="noopener" class="page-icon-link">🔗</a>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-5">
      Page introuvable.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()
const page = ref(null)

onMounted(async () => {
  try {
    const res = await api.get(`/pages/${route.params.id}`)
    page.value = res.data
  } catch (error) {
    console.error('Erreur chargement page:', error)
  }
})

function goBack() {
  router.back()
}
</script>

<style scoped>
.calendar-container {
  text-align: center;
  max-width: 900px;
  margin: auto;
  margin-top: 2rem;
  padding: 2rem;
  background: #fffaf3;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Special Elite', monospace;
}

.page-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

/* .page-card:hover {
  transform: scale(1.01);
} */

.card-text {
  font-family: 'Special Elite', monospace;
  font-size: 1rem;
  color: #4b4b4b;
  line-height: 1.6;
}

.back-button {
  position: absolute;
  left: 0;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem 0.6rem;
  color: #444;
  transition: transform 0.2s ease;
}

.back-button:hover {
  transform: scale(1.2);
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
  font-family: 'Dancing Script', cursive;
}

.page-icon-link {
  font-size: 1.4rem;
  margin-left: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.page-icon-link:hover {
  transform: scale(1.3);
}
</style>
