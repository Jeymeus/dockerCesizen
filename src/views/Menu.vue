<template>
  <div class="calendar-container">
    <!-- Titre multicolore -->
    <div class="title-container">
      <h1 class="rainbow-title">{{ title }}</h1>
    </div>

    <!-- Cartes de pages -->
    <div v-if="pages.length" class="row justify-content-center g-4">
      <div v-for="page in paginatedPages" :key="page.id" class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
        <div class="card page-card text-center shadow-sm w-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">{{ page.title }}</h5>
            <div class="mt-3">
              <router-link class="btn btn-warning" :to="`/page/${page.id}`">
                Lire la suite
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pages.length > perPage" class="d-flex justify-content-center mt-4">
      <button class="btn btn-outline-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">
        ← Précédent
      </button>
      <button class="btn btn-outline-secondary" :disabled="currentPage * perPage >= pages.length"
        @click="currentPage++">
        Suivant →
      </button>
    </div>

    <!-- Aucun résultat -->
    <div v-else class="text-center text-muted mt-5">
      Aucune page disponible pour ce menu.
    </div>
  </div>
</template>



<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const pages = ref([])
const title = ref('Menu')

const currentPage = ref(1)
const perPage = 15 // 5 lignes de 3 cards

const paginatedPages = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return pages.value.slice(start, start + perPage)
})



const loadPages = async () => {
  try {
    const id = route.params.id
    const res = await api.get(`/pages/menu/${id}`)
    pages.value = res.data.pages || []
    title.value = res.data.menu?.title || 'Menu'
  } catch (err) {
    console.error('Erreur chargement des pages', err)
  }
}

onMounted(loadPages)
watch(() => route.params.id, loadPages)
</script>

<style>
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

.title-container {
  margin-bottom: 2rem;
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

.page-card {
  background-color: #fff;
  border-radius: 16px;
  transition: transform 0.2s ease;
}

.page-card:hover {
  transform: scale(1.02);
}
</style>