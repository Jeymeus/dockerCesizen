<template>
  <div class="calendar-container">
    <div class="title-container">
      <h1 class="rainbow-title">Mon Émotion du jour</h1>
    </div>

    <!-- CALENDRIER -->
    <v-calendar is-expanded :attributes="calendarAttributes" @dayclick="onDayClick" color="orange" />
    <div class="text-center mt-3 mb-4">
      <router-link to="/rapport" class="btn btn-warning shadow-sm">
        📊 Générer un rapport d’émotions
      </router-link>
    </div>

    <!-- TABLEAU DES ENTRÉES DU MOIS -->
    <div v-if="monthlyEntries.length" class="mt-5">
      <div class="d-flex justify-content-around align-items-center mb-3">
        <h2 class="mb-0">Émotions de {{ formatMonth(selectedDate) }}</h2>
        <button class="btn btn-outline-secondary btn-sm" @click="toggleEditMode">
          ✏️ {{ editMode ? 'Annuler' : 'Modifier' }}
        </button>
      </div>

      <table class="table table-hover table-bordered text-center">
        <thead class="table-light">
          <tr>
            <th>Date</th>
            <th>Émotion</th>
            <th>Catégorie</th>
            <th class="d-none d-md-table-cell">Note</th>
            <th v-if="editMode">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in monthlyEntries" :key="entry.id"
            :class="{ 'table-warning': isSelectedDay(entry.date_entry) }">
            <td>{{ formatDate(entry.date_entry) }}</td>
            <td style="font-size: 1.5rem;">{{ entry.emotion.emoji }}</td>
            <td>{{ entry.emotion.category }}</td>
            <td class="d-none d-md-table-cell">{{ entry.note || '—' }}</td>
            <td class="d-flex" v-if="editMode">
              <button class="btn btn-sm btn-outline-primary me-1" @click="onEdit(entry)">
                ✏️
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="onDelete(entry)">
                🗑
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- MODALE -->
  <div class="modal-backdrop-custom" v-if="isEditing" @click.self="cancelEdit">
    <div class="modal-content-custom">
      <h5 class="mb-3">Modifier l’entrée du {{ formatDate(entryToEdit?.date_entry) }}</h5>

      <div class="emoji-filter mb-3">
        <label for="category">Catégorie :</label>
        <select id="category" class="form-select" v-model="selectedCategory">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="emoji-buttons mb-3">
        <button v-for="emotion in filteredEmotions" :key="emotion.id" :title="emotion.label"
          @click="selectedEmojiId = emotion.id" :class="{ 'btn-selected': selectedEmojiId === emotion.id }">
          {{ emotion.emoji }}
        </button>
      </div>

      <div class="mb-3">
        <label for="note">Note :</label>
        <textarea id="note" class="form-control" rows="2" v-model="newNote" />
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-secondary" @click="cancelEdit">Annuler</button>
        <button class="btn btn-primary" @click="saveEdit">Enregistrer</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const entries = ref([])
const selectedDate = ref(null)

// Charger les entrées du journal
onMounted(async () => {
  try {
    const res = await api.get('/entries')
    entries.value = res.data
  } catch (err) {
    console.error('Erreur chargement entrées :', err)
  }
})

const editMode = ref(false)

function toggleEditMode() {
  editMode.value = !editMode.value
}


// Lorsqu'on clique une date dans le calendrier
function onDayClick(day) {
  selectedDate.value = new Date(day.date)
}

// Attributs emojis pour le calendrier
const calendarAttributes = computed(() =>
  entries.value.map(e => ({
    key: 'entry-' + e.id,
    dates: new Date(e.date_entry),
    content: e.emotion.emoji,
    class: 'has-emotion-day'
  }))
)

// Entrées du mois sélectionné
const monthlyEntries = computed(() => {
  if (!selectedDate.value) return []
  const month = selectedDate.value.getMonth()
  const year = selectedDate.value.getFullYear()

  return entries.value.filter(e => {
    const d = new Date(e.date_entry)
    return d.getMonth() === month && d.getFullYear() === year
  })
})

// Vérifie si une date est la date sélectionnée
function isSelectedDay(date) {
  if (!selectedDate.value) return false
  const d = new Date(date)
  return (
    d.getFullYear() === selectedDate.value.getFullYear() &&
    d.getMonth() === selectedDate.value.getMonth() &&
    d.getDate() === selectedDate.value.getDate()
  )
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR')
}
function formatMonth(date) {
  return date?.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) || ''
}

const isEditing = ref(false)
const entryToEdit = ref(null)
const selectedCategory = ref('')
const selectedEmojiId = ref(null)
const newNote = ref('')

const categories = ['Joie', 'Colère', 'Peur', 'Tristesse', 'Surprise', 'Dégoût']
const emotions = ref([])

onMounted(async () => {
  const res = await api.get('/emotions')
  emotions.value = res.data
})

const filteredEmotions = computed(() =>
  emotions.value.filter(e => e.category === selectedCategory.value)
)

function onEdit(entry) {
  entryToEdit.value = entry
  selectedCategory.value = entry.emotion.category
  selectedEmojiId.value = emotions.value.find(e => e.emoji === entry.emotion.emoji)?.id || null
  newNote.value = entry.note
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  entryToEdit.value = null
}

async function saveEdit() {
  if (!selectedEmojiId.value || !entryToEdit.value) return

  try {
    const payload = {
      emotion_id: selectedEmojiId.value,
      note: newNote.value,
      date_entry: entryToEdit.value.date_entry
    }

    await api.put(`/entries/${entryToEdit.value.id}`, payload)
    // Rechargement (simple)
    const res = await api.get('/entries')
    entries.value = res.data

    isEditing.value = false
  } catch (err) {
    console.error('Erreur modification :', err)
  }
}

async function onDelete(entry) {
  if (!entry?.id) return
  const confirmDelete = confirm(`Supprimer l'entrée du ${formatDate(entry.date_entry)} ?`)
  if (!confirmDelete) return

  try {
    await api.delete(`/entries/${entry.id}`)
    const res = await api.get('/entries')
    entries.value = res.data
  } catch (err) {
    console.error('Erreur suppression entrée :', err)
  }
}



</script>




<style scoped>
.calendar-container {
  text-align: center;
  max-width: 650px;
  margin: auto;
  margin-top: 2rem;
  padding: 2rem;
  background: #fffaf3;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Special Elite', monospace;
}

.daily-block {
  text-align: center;
  margin-top: 2rem;
  background: #fff2d8;
  border-radius: 16px;
  padding: 1.5rem;
}

.daily-block h2 {
  font-size: 1.3rem;
  color: #5a4234;
  margin-bottom: 1rem;
}

.current-emoji {
  margin-bottom: 1rem;
}

.emoji-large {
  font-size: 3rem;
}

.emoji-empty {
  font-size: 1.1rem;
  color: #999;
}

.emoji-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.emoji-buttons button {
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.emoji-buttons button:hover {
  transform: scale(1.3);
}

.has-emotion-day {
  font-size: 1.6rem;
  text-align: center;
  padding-top: 0.3rem;
  color: #e07a00;
}

.date-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-nav button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.date-nav button:hover {
  transform: scale(1.2);
}

.title-container {
  text-align: center;
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

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content-custom {
  background: #fffaf3;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-selected {
  background-color: #ffe8b2;
  border-radius: 50%;
  border: 2px solid #e7b14c;
}
</style>