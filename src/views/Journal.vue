<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">Mon journal d'émotions</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else>
      <div v-if="entries.length === 0" class="text-center text-muted">
        Aucune émotion enregistrée pour l'instant.
      </div>

      <ul class="list-group">
        <li v-for="entry in entries" :key="entry.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ entry.label }}</strong> <span class="text-muted">({{ formatDate(entry.date_entry) }})</span>
            <br />
            <small class="text-secondary">Catégorie : {{ entry.category }}</small>
          </div>
          <span v-if="entry.emoji" class="fs-4">{{ entry.emoji }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Journal display logic
import { ref, onMounted } from 'vue'
import api from '../services/api'

const entries = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/journal')
    entries.value = res.data
  } catch (err) {
    console.error('Erreur lors du chargement du journal', err)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('fr-FR', options)
}
</script>

<style scoped>
.list-group-item {
  transition: background-color 0.2s;
}
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>