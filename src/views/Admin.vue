<template>
  <div class="d-flex min-vh-100">
    <!-- SIDEBAR -->
    <AdminSidebar :activeSection="section" @changeSection="switchSection" />

    <!-- CONTENU PRINCIPAL -->
    <div class="flex-grow-1 p-4 ms-sidebar">
      <h2 class="mb-4 text-center text-white">
        Dashboard Admin — {{ sectionLabels[section] }}
      </h2>

      <!-- OUTILS DE TRI/FILTRE -->
      <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div class="d-flex gap-2">
          <select class="form-select" v-model="sortKey" style="min-width: 120px;">
            <option value="">Trier par</option>
            <option v-for="key in activeDescriptor.sortable" :key="key" :value="key">
              {{ getColumnLabel(key) }}
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
            <thead class="table-light text-center">
              <tr>
                <th v-for="col in activeDescriptor.columns" :key="col.key">{{ col.label }}</th>
                <th style="width: 152px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td class="text-center" v-for="col in activeDescriptor.columns" :key="col.key">{{ item[col.key] }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-info me-2" @click="showItem">👁️</button>
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

      <!-- MODAL D'ÉDITION (menus uniquement ici) -->
      <EditMenuModal
        v-if="section === 'menus'"
        :visible="!!selectedItem"
        :menu="selectedItem"
        @close="selectedItem = null"
        @updated="fetchData"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import AdminSidebar from '../components/AdminSidebar.vue'
import EditMenuModal from '../components/EditMenuModal.vue'
import * as AdminAPI from '../services/adminService'

const section = ref('users')
const items = ref([])
const loading = ref(false)
const sortKey = ref('')
const search = ref('')
const activeFilters = ref({})
const selectedItem = ref(null)

const sectionLabels = {
  users: 'Utilisateurs',
  menus: 'Menus',
  pages: 'Pages',
  emotions: 'Émotions'
}

const descriptors = {
  users: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'fullname', label: 'Nom complet' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Rôle' },
      { key: 'active', label: 'Actif' }
    ],
    sortable: ['id', 'email', 'role'],
    filters: {
      role: ['user', 'admin']
    },
    canAdd: false
  },
  menus: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Titre' },
    ],
    sortable: ['id', 'title'],
    canAdd: true
  },
  pages: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Titre' },
      { key: 'visible', label: 'Visible' },
      { key: 'menu_title', label: 'Menu' }
    ],
    sortable: ['id', 'title', 'visible'],
    filters: {
      visible: [0, 1]
    },
    canAdd: true
  },
  emotions: {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'emoji', label: 'Emoji' },
      { key: 'label', label: 'Nom' },
      { key: 'category', label: 'Catégorie' },
    ],
    sortable: ['id', 'label', 'category'],
    canAdd: true
  }
}

const activeDescriptor = computed(() => descriptors[section.value])

const switchSection = (value) => {
  section.value = value
  fetchData()
}

const enrichItems = async (raw, currentSection) => {

  const section = typeof currentSection === 'string' ? currentSection : currentSection.value

  if (section === 'users') {
    return raw.map(u => ({ ...u, fullname: `${u.firstname} ${u.lastname}` }))
  }

  if (section === 'pages') {
    const menus = (await AdminAPI.getAll('menus')).data
    const menuMap = Object.fromEntries(menus.map(m => [m.id, m.title]))
    return raw.map(p => ({
      ...p,
      menu_title: menuMap[p.menu_id] || 'Non assigné'
    }))
  }
  return raw
}

const getColumnLabel = (key) => {
  const col = activeDescriptor.value.columns.find(c => c.key === key)
  return col ? col.label : key
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await AdminAPI.getAll(section.value)
    items.value = await enrichItems(res.data, section.value)
    activeFilters.value = {}
    if (activeDescriptor.value.filters) {
      for (const key in activeDescriptor.value.filters) {
        activeFilters.value[key] = '' // 🔁 valeur par défaut = "Tous"
      }
    }
  } catch (err) {
    console.error('Erreur chargement', err)
  } finally {
    loading.value = false
  }
}


const filteredItems = computed(() => {
  let data = items.value

  if (search.value) {
    data = data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(search.value.toLowerCase())
    )
  }

  for (const key in activeFilters.value) {
    if (activeFilters.value[key]) {
      data = data.filter(item => item[key] === activeFilters.value[key])
    }
  }

  if (sortKey.value) {
    const key = sortKey.value
    data = [...data].sort((a, b) => {
      const valA = a[key]
      const valB = b[key]

      const numA = parseFloat(valA)
      const numB = parseFloat(valB)

      const isNumeric = !isNaN(numA) && !isNaN(numB)

      return isNumeric
        ? numA - numB
        : String(valA).localeCompare(String(valB), 'fr', { sensitivity: 'base' })
    })
  }

  return data
})

const showItem = (item) => {
  alert(`Affichage de la ressource ${section.value} ID ${item.id}`)
  // ou router.push(`/detail/${section.value}/${item.id}`) si tu as une vue dédiée
}

const editItem = (item) => {
  if (section.value === 'menus') {
    selectedItem.value = item
  } else {
    alert(`Édition non implémentée pour ${section.value}`)
  }
}

const deleteItem = async (item) => {
  if (confirm(`Supprimer ${section.value} ID ${item.id} ?`)) {
    try {
      await AdminAPI.remove(section.value, item.id)
      fetchData()
    } catch (e) {
      console.error('Erreur suppression', e)
    }
  }
}

const handleAdd = () => {
  if (section.value === 'menus') {
    selectedItem.value = { title: '', position: 0, visible: 1 }
  } else {
    alert(`Ajout non implémenté pour ${section.value}`)
  }
}

onMounted(fetchData)
watch(section, fetchData)
</script>

<style scoped>
body {
  background-color: #212529;
}
</style>
