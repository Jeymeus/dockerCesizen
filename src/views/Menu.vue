<template>
  <div class="calendar-container">
    <div class="title-container">
      <h1 class="rainbow-title">{{ title }}</h1>
    </div>

    <component :is="componentToRender" :pages="paginatedPages" />

    <div v-if="pages.length > perPage" class="d-flex justify-content-center mt-4">
      <button class="btn btn-outline-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">←
        Précédent</button>
      <button class="btn btn-outline-secondary" :disabled="currentPage * perPage >= pages.length"
        @click="currentPage++">Suivant →</button>
    </div>

    <div v-if="!pages.length" class="text-center text-muted mt-5">
      Aucune page disponible pour ce menu.
    </div>
  </div>
</template>




<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

import ArticleGrid from '../components/ArticleGrid.vue'
import VideoGrid from '../components/VideoGrid.vue'

const route = useRoute()
const pages = ref([])
const title = ref('Menu')
const menuType = ref('articles') // fallback
const currentPage = ref(1)
const perPage = 15

const paginatedPages = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return pages.value.slice(start, start + perPage)
})

const componentToRender = computed(() => {
  return menuType.value === 'videos' ? VideoGrid : ArticleGrid
})

const loadPages = async () => {
  try {
    const id = route.params.id
    const res = await api.get(`/pages/menu/${id}`)
    pages.value = res.data.pages || []
    title.value = res.data.menu?.title || 'Menu'
    menuType.value = res.data.menu?.type || 'articles' // 'videos', 'articles', etc.
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