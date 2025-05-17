<template>
  <div class="calendar-container">
    <div class="title-container d-flex align-items-center justify-content-center gap-3">
      <button v-if="route.params.id" @click="$router.push('/menu')" class="emoji-back-button" title="Retour aux menus">
        ⬅️
      </button>
      <h1 class="rainbow-title mb-0">{{ title }}</h1>
    </div>


    <div v-if="isMenuUndefined" class="row g-4 justify-content-center">
      <div v-for="menu in menus" :key="menu.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <router-link :to="`/menu/${menu.id}`"
          class="card menu-card text-center shadow-sm text-decoration-none text-dark h-100 p-4">
          <div class="fs-1 mb-2">
            {{ getIcon(menu.type) }}
          </div>
          <h5 class="fw-bold">{{ menu.title }}</h5>
          <p class="text-muted small fst-italic">{{ getSubtitle(menu.type) }}</p>
        </router-link>
      </div>
    </div>

    <!-- Composant affiché uniquement si menu défini -->
    <component v-else :is="componentToRender" :pages="paginatedPages" />

    <div v-if="pages.length > perPage" class="d-flex justify-content-center mt-4">
      <button class="btn btn-outline-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">←
        Précédent</button>
      <button class="btn btn-outline-secondary" :disabled="currentPage * perPage >= pages.length"
        @click="currentPage++">Suivant →</button>
    </div>

    <div v-if="route.params.id && !pages.length" class="text-center text-muted mt-5">
      Aucune page disponible pour ce menu.
    </div>

  </div>
</template>




<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../services/api'

import ArticleGrid from '../../components/menu/ArticleGrid.vue'
import VideoGrid from '../../components/menu/VideoGrid.vue'

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

const getIcon = (type) => {
  switch (type) {
    case 'videos': return '🎬'
    case 'articles': return '📄'
    case 'exercises': return '🏋️‍♂️'
    case 'podcasts': return '🎧'
    default: return '📚'
  }
}

const getSubtitle = (type) => {
  switch (type) {
    case 'videos': return 'Regarder et apprendre en images'
    case 'articles': return 'Lire, comprendre, évoluer'
    case 'exercises': return 'Pratiquer pour progresser'
    case 'podcasts': return 'Écouter pour ressentir'
    default: return 'Découvrir des contenus inspirants'
  }
}


const menus = ref([])

const isMenuUndefined = computed(() => !route.params.id)

const loadMenus = async () => {
  try {
    title.value = 'Menu' // 🆕 ici
    const res = await api.get('/menus')
    menus.value = res.data
  } catch (err) {
    console.error('Erreur chargement des menus', err)
  }
}


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

onMounted(() => {
  if (isMenuUndefined.value) {
    loadMenus()
  } else {
    loadPages()
  }
})

watch(() => route.params.id, (id) => {
  if (!id) {
    loadMenus()
  } else {
    loadPages()
  }
})
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
      /* #ff4e50, */
      /* #fc913a, */
      #f9d423,
      #e2f356,
      #7ed957,
      #00c9a7);
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

.card {
  background: #fff8e6;
  border-radius: 15px;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.03);
}

.emoji-back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;
}

.emoji-back-button:hover {
  transform: scale(1.2);
}
</style>