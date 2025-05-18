<template>
    <div class="report-container">
        <router-link class="btn btn-outline-secondary mb-3" to="/dashboard">← Retour</router-link>

        <h2 class="report-title">📅 Générer un rapport</h2>

        <div class="form-group-custom">
            <label for="period">Période :</label>
            <select id="period" class="form-select" v-model="selectedPeriod">
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Année</option>
                <option value="custom">Période personnalisée</option>
            </select>
        </div>

        <form @submit.prevent="generateReport">
            <div v-if="selectedPeriod === 'custom'" class="form-group-custom">
                <label>Dates personnalisées :</label>
                <div class="date-fields">
                    <input type="date" v-model="startDate" />
                    <span>→</span>
                    <input type="date" v-model="endDate" />
                </div>
            </div>

            <div class="btn-group-custom">
                <button type="submit" class="btn-generate"
                    :disabled="selectedPeriod === 'custom' && (!startDate || !endDate)">
                    Générer
                </button>
            </div>
        </form>

        <div v-if="showChart" class="mt-4 text-center">
            <canvas ref="chartRef" style="max-height: 300px;"></canvas>
            <p class="mt-3">
                Vous avez tendance à ressentir plus d’émotions de type
                <strong>{{ categoryMap[dominantCategory] }} {{ dominantCategory }}</strong>.
            </p>
            <p class="mt-2 text-muted small">
                Période analysée : <strong>{{ formatDateFr(start) }} → {{ formatDateFr(end) }}</strong>

            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/services/api'

const chartRef = ref(null)
const chartInstance = ref(null)

const selectedPeriod = ref('week')
const startDate = ref('')
const endDate = ref('')
const start = ref('')
const end = ref('')
const showChart = ref(false)

const categoryCount = ref({})
const dominantCategory = ref('')

const categoryMap = {
    Joie: '😊',
    Colère: '😡',
    Peur: '😱',
    Tristesse: '😢',
    Surprise: '😮',
    Dégoût: '🤢'
}

const generateReport = async () => {
    let startFinal = '', endFinal = ''
    const today = new Date()

    if (selectedPeriod.value === 'custom') {
        if (new Date(startDate.value) > new Date(endDate.value)) {
            alert("La date de début doit être antérieure à la date de fin.")
            return
        }
        startFinal = startDate.value
        endFinal = endDate.value
    } else {
        const startCalc = new Date()
        if (selectedPeriod.value === 'week') startCalc.setDate(startCalc.getDate() - 7)
        else if (selectedPeriod.value === 'month') startCalc.setMonth(startCalc.getMonth() - 1)
        else if (selectedPeriod.value === 'quarter') startCalc.setMonth(startCalc.getMonth() - 3)
        else if (selectedPeriod.value === 'year') startCalc.setFullYear(startCalc.getFullYear() - 1)

        startFinal = startCalc.toISOString().split('T')[0]
        endFinal = today.toISOString().split('T')[0]
    }

    start.value = startFinal
    end.value = endFinal

    try {
        const res = await api.get('/entries/report/user', {
            params: { start: startFinal, end: endFinal }
        })

        const count = {
            Joie: 0, Colère: 0, Peur: 0, Tristesse: 0, Surprise: 0, Dégoût: 0
        }

        for (const row of res.data) {
            const cat = row.category
            if (cat && count.hasOwnProperty(cat)) count[cat] += row.count
        }

        categoryCount.value = count
        const max = Object.entries(count).reduce((a, b) => (b[1] > a[1] ? b : a), ['Aucune', 0])
        dominantCategory.value = max[0]
        showChart.value = true
        await nextTick()
        renderChart(count)
    } catch (e) {
        console.error('Erreur chargement rapport :', e)
    }
}

const renderChart = (counts) => {
    if (chartInstance.value) chartInstance.value.destroy()

    const labels = Object.keys(counts).map(c => categoryMap[c])
    const data = Object.values(counts)

    chartInstance.value = new Chart(chartRef.value, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    '#f9d423', // Joie
                    '#ff6b6b', // Colère
                    '#c3aed6', // Peur
                    '#91c9f7', // Tristesse
                    '#ffa500', // Surprise (orange)
                    '#84dcc6'  // Dégoût
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    })
}

const formatDateFr = (dateStr) => {
    try {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

</script>

<style scoped>
.report-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #fffaf3;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Special Elite', monospace;
}

.report-title {
    font-size: 1.8rem;
    color: #e07a00;
    font-family: 'Dancing Script', cursive;
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-group-custom {
    margin-bottom: 1.5rem;
}

.date-fields {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
}

.date-fields input {
    border: 1px solid #f7c873;
    border-radius: 8px;
    padding: 0.4rem;
    background-color: #fffaf0;
    font-family: inherit;
}

.btn-group-custom {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn-generate {
    background-color: #ffc107;
    border: none;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
}

.btn-generate:hover {
    transform: scale(1.05);
}
</style>
  
