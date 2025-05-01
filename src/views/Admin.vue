<template>
  <div class="d-flex min-vh-100">
    <!-- SIDEBAR -->
    <AdminSidebar :activeSection="section" @changeSection="switchSection" />

    <!-- CONTENU PRINCIPAL -->
    <div class="flex-grow-1 p-4 ms-sidebar">
      <h2 class="mb-4 text-center text-white">Dashboard Admin — {{ sectionLabels[section] }}</h2>

      <!-- TOOLS -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div class="d-flex gap-2 flex-wrap">
          <select class="form-select" v-model="sortKey" style="min-width: 120px;">
            <option value="">Trier par</option>
            <option v-for="col in activeDescriptor.sortable || []" :key="col" :value="col">
              {{ col }}
            </option>
          </select>

          <template v-if="activeDescriptor.filters">
            <select
              v-for="(options, filterKey) in activeDescriptor.filters"
              :key="filterKey"
              class="form-select"
              v-model="activeFilters[filterKey]"
              style="min-width: 120px;"
            >
              <option :value="''">Tous {{ filterKey }}</option>
              <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </template>
        </div>

        <input type="text" class="form-control" placeholder="Recherche..." v-model="search" style="max-width: 200px;" />

        <button v-if="activeDescriptor.canAdd" class="btn btn-success" @click="handleAdd">
          <font-awesome-icon icon="plus" /> Ajouter
        </button>
      </div>

      <!-- TABLEAU -->
      <div class="card shadow">
        <div class="card-body table-responsive p-0">
          <table class="table table-hover table-striped mb-0">
            <thead class="table-light">
              <tr>
                <th v-for="col in activeDescriptor.columns" :key="col.key">{{ col.label }}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td v-for="col in activeDescriptor.columns" :key="col.key">{{ item[col.key] }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-2" @click="editItem(item)">✏️</button>
                  <button class="btn btn-sm btn-danger" @click="deleteItem(item)">🗑</button>
                </td>
              </tr>
              <tr v-if="filteredItems.length === 0">
                <td :colspan="activeDescriptor.columns.length + 1" class="text-center text-muted">
                  Aucune donnée trouvée.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AdminSidebar from '../components/AdminSidebar.vue'
import * as AdminAPI from '../services/adminService'

const section = ref('users')
const items = ref([])
const loading = ref(false)
const sortKey = ref('')
const search = ref('')
const activeFilters = ref({})

const sectionLabels = {
  users: 'Utilisateurs',
  menus: 'Menus',
  pages: 'Pages',
  emojis: 'Émotions'
}

const descriptors = {
  users: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'firstname', label: 'Prénom' },
      { key: 'lastname', label: 'Nom' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rôle' },
      { key: 'active', label: 'Actif' }
    ],
    sortable: ['id', 'firstname', 'email', 'role'],
    filters: {
      role: ['user', 'admin']
    },
    canAdd: false
  },
  menus: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Titre' }
    ],
    sortable: ['id', 'title'],
    filters: null,
    canAdd: true
  },
  pages: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Titre' },
      { key: 'url', label: 'URL' },
      { key: 'visible', label: 'Visible' }
    ],
    sortable: ['id', 'title'],
    filters: {
      visible: [0, 1]
    },
    canAdd: true
  },
  emojis: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'label', label: 'Label' },
      { key: 'category', label: 'Catégorie' },
      { key: 'emoji', label: 'Emoji' }
    ],
    sortable: ['id', 'label'],
    filters: null,
    canAdd: true
  }
}

const activeDescriptor = computed(() => descriptors[section.value])

const switchSection = async (value) => {
  section.value = value
  await fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    if (section.value === 'users') items.value = (await AdminAPI.getUsers()).data
    else if (section.value === 'menus') items.value = (await AdminAPI.getMenus()).data
    else if (section.value === 'pages') items.value = (await AdminAPI.getPages()).data
    else if (section.value === 'emojis') items.value = (await AdminAPI.getEmotions()).data
  } catch (err) {
    console.error('Erreur chargement', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
watch(section, fetchData)

const filteredItems = computed(() => {
  let data = items.value

  if (search.value) {
    data = data.filter(item => JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase()))
  }

  for (const key in activeFilters.value) {
    if (activeFilters.value[key]) {
      data = data.filter(item => item[key] === activeFilters.value[key])
    }
  }

  if (sortKey.value) {
    data = [...data].sort((a, b) => {
      if (!a[sortKey.value]) return -1
      return String(a[sortKey.value]).localeCompare(String(b[sortKey.value]))
    })
  }

  return data
})

const editItem = (item) => alert(`Éditer ${section.value} ID ${item.id}`)
const deleteItem = (item) => confirm(`Supprimer ${section.value} ID ${item.id} ?`) && alert('Suppression fictive')
const handleAdd = () => alert(`Ajout d’un(e) ${section.value.slice(0, -1)}`)
</script>

<style scoped>
body {
  background-color: #212529;
}
</style>
