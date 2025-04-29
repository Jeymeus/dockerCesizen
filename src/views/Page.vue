<template>
  <div class="container py-4">
    <div v-if="page">
      <h2 class="mb-3 text-center">{{ page.title }}</h2>
      <div class="card">
        <div class="card-body">
          <p class="card-text" v-html="page.content"></p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">
      Page introuvable.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const page = ref(null)

onMounted(async () => {
  try {
    const res = await api.get(`/pages/${route.params.id}`)
    page.value = res.data
  } catch (error) {
    console.error('Erreur chargement page:', error)
  }
})
</script>
