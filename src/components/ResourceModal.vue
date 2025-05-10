<template>
    <div v-if="visible" class="custom-modal-backdrop" @click.self="onClose">
        <div class="custom-modal-container">
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <div class="d-flex gap-2">
                    <h4 class="mb-0">{{ title }}</h4>
                    <button class="btn btn-warning btn-sm" @click="emit('edit', item)">✏️</button>
                    <button class="btn btn-danger btn-sm" @click="emit('delete', item)">🗑</button>
                </div>
                <button class="btn btn-secondary btn-sm" @click="onClose">❌</button>
            </div>

            <!-- Body -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>
            <div v-else-if="item && descriptor?.columns" class="resource-details">
                <div v-for="col in descriptor?.columns || []" :key="col.key"
                    class="d-flex justify-content-between border-bottom py-2">
                    <strong>{{ col.label }}</strong>
                    <span class="text-end" style="max-width: 60%;">{{ formatValue(item[col.key], col.key) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['close', 'edit', 'delete'])

const props = defineProps({
    item: Object,
    descriptor: Object,
    visible: Boolean,
    section: String,
    loading: Boolean
})

const onClose = () => emit('close')

const sectionLabels = {
    users: 'Utilisateur',
    menus: 'Menu',
    pages: 'Page',
    emotions: 'Émotion',
    entries: 'Entrée'
}

const title = computed(() => `Détail de : ${sectionLabels[props.section] || props.section}`)

const formatValue = (val, key = '') => {
    // Affichage "Oui"/"Non" que pour certains champs explicitement booléens
    const booleanFields = ['visible', 'active']

    if (val === null || val === undefined) return '—'

    if (booleanFields.includes(key)) {
        return val === 1 || val === true ? 'Oui' : 'Non'
    }

    // Formatage nombre
    if (typeof val === 'number') {
        return val.toLocaleString('fr-FR')
    }

    // Date brute (à améliorer si besoin)
    if (key.includes('created_at') || key.includes('updated_at')) {
        try {
            return new Date(val).toLocaleString('fr-FR')
        } catch {
            return val
        }
    }

    return val
}

</script>

<style scoped>
.custom-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1050;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(6px);
    background-color: rgba(0, 0, 0, 0.5);
}

.custom-modal-container {
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    max-width: 700px;
    width: 90vw;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.resource-details {
    font-size: 0.95rem;
}
</style>