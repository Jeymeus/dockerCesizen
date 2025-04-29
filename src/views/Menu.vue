<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">{{ title }}</h2>

    <div v-if="pages.length" class="row g-3">
      <div v-for="page in pages" :key="page.id" class="col-12 col-md-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ page.title }}</h5>
            <p class="card-text">{{ page.content.slice(0, 120) }}...</p>
            <router-link class="btn btn-primary" :to="`/page/${page.id}`">Lire la suite</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-5">
      Aucune page disponible pour ce menu.
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const pages = ref([])
const title = ref('Menu')

onMounted(async () => {
  try {
    const slug = route.params.slug
    const url = slug ? `/pages/menu/${slug}` : '/pages/visible'
    const res = await api.get(url)
    pages.value = res.data.pages || []
    title.value = res.data.menu?.title || 'Général'
  } catch (err) {
    console.error('Erreur chargement des pages', err)
  }
})
</script>
