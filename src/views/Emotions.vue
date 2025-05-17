<template>
    <div class="calendar-container">
        <div class="title-container">
            <h1 class="rainbow-title">Mon Émotion du jour</h1>
        </div>

        <!-- CALENDRIER MOIS -->
        <v-calendar is-expanded :attributes="emotionAttributes" @dayclick="onDayClick" color="orange" />

        <!-- BLOC JOUR SÉLECTIONNÉ -->
        <div class="daily-block">
            <div class="date-nav">
                <button @click="goToPreviousDay">⬅️</button>
                <h2>{{ formatDate(selectedDate) }}</h2>
                <button @click="goToNextDay">➡️</button>
            </div>

            <div class="current-emoji">
                <span v-if="emotionOfTheDay" class="emoji-large">{{ emotionOfTheDay.emotion.emoji }}</span>
                <span v-else class="emoji-empty">Aucune émotion encore 🌫️</span>
            </div>

            <div class="emoji-filter">
                <label for="category">Catégorie :</label>
                <select class="form-select-sm mx-2 my-3" id="category" v-model="selectedCategory">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
            </div>

            <div class="emoji-buttons">
                <button v-for="emotion in filteredEmotions" :key="emotion.id" @click="addEmotion(emotion.id)"
                    :title="emotion.label">
                    {{ emotion.emoji }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import api from '../services/api'

const selectedDate = ref(new Date())
const entries = ref([])
const emotions = ref([])
const selectedCategory = ref('Joie')
const route = useRoute()
const router = useRouter()

const categories = ['Joie', 'Colère', 'Peur', 'Tristesse', 'Surprise', 'Dégoût']

function getLocalDateString(date) {
    return date.toLocaleDateString('fr-CA')
}

onMounted(async () => {
    const token = localStorage.getItem('token') // ou sessionStorage
    if (!token) {
        // Rediriger vers login si non connecté
        router.push('/login')
        return
    }

    try {
        const response = await fetch('http://localhost:3000/api/emotions', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des émotions')
        }

        const data = await response.json()
        emotions.value = data
    } catch (error) {
        console.error(error)
        errorMessage.value = 'Accès refusé. Connectez-vous pour voir les émotions.'
    }
})


const filteredEmotions = computed(() =>
    emotions.value.filter(e => e.category === selectedCategory.value)
)

function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function onDayClick(day) {
    selectedDate.value = new Date(day.date)
}

function goToPreviousDay() {
    const d = new Date(selectedDate.value)
    d.setDate(d.getDate() - 1)
    selectedDate.value = d
}

function goToNextDay() {
    const d = new Date(selectedDate.value)
    d.setDate(d.getDate() + 1)
    selectedDate.value = d
}

const dateKey = computed(() => getLocalDateString(selectedDate.value))

const emotionOfTheDay = computed(() => {
    return entries.value.find(e => e.date_entry === dateKey.value) || null
})

const emotionAttributes = computed(() =>
    entries.value.map(e => ({
        key: 'entry-' + e.id,
        dates: new Date(e.date_entry),
        content: e.emotion.emoji,
        class: 'has-emotion-day'
    }))
)

async function addEmotion(emotionId) {
    try {
        const existing = entries.value.find(e => e.date_entry === dateKey.value)
        const payload = {
            emotion_id: emotionId,
            date_entry: dateKey.value,
            note: ''
        }

        if (existing) {
            await api.put(`/entries/${existing.id}`, payload)
        } else {
            await api.post('/entries', payload)
        }

        const res = await api.get('/entries')
        entries.value = res.data
    } catch (error) {
        console.error('Erreur ajout émotion :', error)
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
    font-size: 2.5rem;
    line-height: 1.2;
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
</style>
