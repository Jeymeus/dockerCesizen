<template>
    <div class="modal-backdrop" @click.self="emitClose">
        <div class="modal-box">
            <!-- Header -->
            <div class="modal-header-custom">
                <h2 class="modal-title">📅 Générer un rapport</h2>
                <button class="close-btn" @click="emitClose">✖️</button>
            </div>

            <!-- Sélection de période -->
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
                    <button type="button" class="btn-cancel" @click="emitClose">Annuler</button>
                    <button type="submit" class="btn-generate"
                        :disabled="selectedPeriod === 'custom' && (!startDate || !endDate)">
                        Générer
                    </button>
                </div>
            </form>

            <!-- Zone graphique -->
            <div v-if="showChart" class="mt-4 text-center">
                <canvas ref="chartRef" style="max-height: 300px;"></canvas>
                <p class="mt-3">
                    Vous avez tendance à ressentir plus d’émotions de type
                    <strong>{{ categoryMap[dominantCategory] }} {{ dominantCategory }}</strong>.
                </p>
                <p class="mt-2 text-muted small">
                    Période analysée : <strong>{{ start }} → {{ end }}</strong>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
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

    const today = new Date()
    let startFinal = '', endFinal = ''

    if (selectedPeriod.value === 'custom') {
        if (new Date(startDate.value) > new Date(endDate.value)) {
            alert('La date de début doit être antérieure à la date de fin.')
            return
        }

        startFinal = startDate.value
        endFinal = endDate.value
    } else {
        const startCalc = new Date()
        if (selectedPeriod.value === 'week') {
            startCalc.setDate(startCalc.getDate() - 7)
        } else if (selectedPeriod.value === 'month') {
            startCalc.setMonth(startCalc.getMonth() - 1)
        } else if (selectedPeriod.value === 'quarter') {
            startCalc.setMonth(startCalc.getMonth() - 3)
        } else if (selectedPeriod.value === 'year') {
            startCalc.setFullYear(startCalc.getFullYear() - 1)
        }

        startFinal = startCalc.toISOString().split('T')[0]
        endFinal = today.toISOString().split('T')[0]
    }

    start.value = startFinal
    end.value = endFinal
    console.log('Dates:', startFinal, endFinal)

    try {
        const res = await api.get('/entries/report/user', {
            params: { start: startFinal, end: endFinal }
        })

        // Réinitialise
        const count = {
            Joie: 0, Colère: 0, Peur: 0,
            Tristesse: 0, Surprise: 0, Dégoût: 0
        }

        // ➕ Tu traites directement les résultats groupés
        for (const row of res.data) {
            const cat = row.category
            if (cat && count.hasOwnProperty(cat)) {
                count[cat] += row.count
            }
        }

        categoryCount.value = count

        const max = Object.entries(count).reduce(
            (a, b) => (b[1] > a[1] ? b : a), ['Aucune', 0]
        )

        dominantCategory.value = max[0]
        showChart.value = true
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
                    '#f9d423', // Joie (jaune soleil)
                    '#ff6b6b', // Colère (rouge)
                    '#c3aed6', // Peur (mauve)
                    '#91c9f7', // Tristesse (bleu)
                    '#ffa500', // Surprise (orange 🔶)
                    '#84dcc6'  // Dégoût (vert)
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

const emit = defineEmits(['close', 'report-generated'])
const emitClose = () => emit('close')
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(40, 30, 10, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal-box {
    background: #fffaf3;
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    font-family: 'Special Elite', monospace;
}

.modal-header-custom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.modal-title {
    font-size: 1.5rem;
    color: #e07a00;
    font-family: 'Dancing Script', cursive;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
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

.btn-cancel {
    background-color: transparent;
    border: 1px solid #ccc;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    transition: 0.2s;
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

.btn-cancel:hover,
.btn-generate:hover {
    transform: scale(1.05);
}
</style>
  
