<template>
    <div>
        <h2>Ajout - Section : {{ section }}</h2>

        <form @submit.prevent="submitForm">
            <div v-for="col in descriptor.columns" :key="col.key" class="mb-3">
                <label :for="col.key">{{ col.label }}</label>

                <!-- Visible: boolean select -->
                <select v-if="col.key === 'visible'" :id="col.key" v-model.number="form[col.key]" class="form-select">
                    <option disabled value="">-- Choisir --</option>
                    <option :value="1">Oui</option>
                    <option :value="0">Non</option>
                </select>

                <!-- Menu: select from fetched menus -->
                <select v-else-if="col.key === 'menu_id'" :id="col.key" v-model.number="form[col.key]"
                    class="form-select">
                    <option disabled value="">-- Choisir un menu --</option>
                    <option v-for="menu in menuOptions" :key="menu.value" :value="menu.value">
                        {{ menu.label }}
                    </option>
                </select>

                <!-- Emotion category: fixed options -->
                <select v-else-if="col.key === 'category'" :id="col.key" v-model="form[col.key]" class="form-select">
                    <option disabled value="">-- Choisir une catégorie --</option>
                    <option value="Joie">Joie</option>
                    <option value="Colère">Colère</option>
                    <option value="Peur">Peur</option>
                    <option value="Tristesse">Tristesse</option>
                    <option value="Surprise">Surprise</option>
                    <option value="Dégoût">Dégoût</option>
                </select>

                <!-- Default input -->
                <input v-else :id="col.key" v-model="form[col.key]" type="text" class="form-control" />
            </div>

            <button type="submit">Créer</button>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as AdminAPI from '../services/adminService'

const route = useRoute()
const router = useRouter()
const section = ref('')
const form = ref({})
const menuOptions = ref([])

const validEmotionCategories = ['Joie', 'Colère', 'Peur', 'Tristesse', 'Surprise', 'Dégoût']

const fullDescriptors = {
    menus: {
        columns: [{ key: 'title', label: 'Titre' }]
    },
    pages: {
        columns: [
            { key: 'title', label: 'Titre' },
            { key: 'url', label: 'URL' },
            { key: 'content', label: 'Contenu' },
            { key: 'visible', label: 'Visible' },
            { key: 'menu_id', label: 'Menu' }
        ]
    },
    emotions: {
        columns: [
            { key: 'emoji', label: 'Emoji' },
            { key: 'label', label: 'Nom' },
            { key: 'category', label: 'Catégorie' }
        ]
    }
}

const descriptor = computed(() => {
    return fullDescriptors[section.value] ?? { columns: [] }
})

watch(descriptor, async (newVal) => {
    console.log('📦 Descriptor chargé pour', section.value, ':', newVal)
    const obj = {}
    newVal.columns.forEach(col => {
        obj[col.key] = ''
    })
    form.value = obj

    if (section.value === 'pages') {
        try {
            const menus = (await AdminAPI.getAll('menus')).data
            menuOptions.value = menus.map(m => ({ value: m.id, label: m.title }))
        } catch (e) {
            console.error('Erreur chargement menus:', e)
        }
    }
}, { immediate: true })

onMounted(() => {
    section.value = route.params.section || ''
    console.log('🧭 Section détectée depuis l\'URL :', section.value)
})

const submitForm = async () => {
    try {
        // Validation stricte catégorie émotion
        if (section.value === 'emotions' && !validEmotionCategories.includes(form.value.category)) {
            alert('❌ Catégorie invalide. Valeur interdite.')
            return
        }
        console.log('📤 Données soumises :', form.value)
        await AdminAPI.create(section.value, form.value)
        alert('✅ Donnée enregistrée avec succès !')
        router.push({ path: '/admin', query: { section: section.value } })
    } catch (e) {
        console.error('❌ Erreur lors de la soumission :', e)
        alert('Erreur lors de la soumission.')
    }
}
</script>

<style scoped>
form {
    max-width: 500px;
}

.mb-3 {
    margin-bottom: 1rem;
}
</style>
  
